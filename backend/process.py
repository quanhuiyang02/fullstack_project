#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import mysql.connector
import json
import time
import random
import schedule
import requests
from datetime import datetime, timedelta
from dataclasses import dataclass
from typing import List, Dict, Optional
import logging

# 配置日誌
logging.basicConfig(level=logging.INFO, 
                   format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class PetStatus:
    """寵物狀態數據類"""
    id: int
    user_id: int
    name: str
    level: int
    exp: int
    health: float
    hunger: float
    happiness: float
    energy: float
    cleanliness: float
    coins: int
    total_play_time: int
    last_updated: datetime

class DatabaseManager:
    """資料庫管理器"""
    
    def __init__(self, host='localhost', database='virtual_pet_game', 
                 user='root', password=''):
        self.config = {
            'host': host,
            'database': database,
            'user': user,
            'password': password,
            'charset': 'utf8mb4',
            'autocommit': True
        }
        self.connection = None
    
    def connect(self):
        """連接資料庫"""
        try:
            self.connection = mysql.connector.connect(**self.config)
            logger.info("資料庫連接成功")
            return True
        except mysql.connector.Error as e:
            logger.error(f"資料庫連接失敗: {e}")
            return False
    
    def disconnect(self):
        """斷開資料庫連接"""
        if self.connection and self.connection.is_connected():
            self.connection.close()
            logger.info("資料庫連接已關閉")
    
    def execute_query(self, query, params=None):
        """執行查詢"""
        try:
            cursor = self.connection.cursor(dictionary=True)
            cursor.execute(query, params)
            result = cursor.fetchall()
            cursor.close()
            return result
        except mysql.connector.Error as e:
            logger.error(f"查詢執行失敗: {e}")
            return None
    
    def execute_update(self, query, params=None):
        """執行更新操作"""
        try:
            cursor = self.connection.cursor()
            cursor.execute(query, params)
            affected_rows = cursor.rowcount
            cursor.close()
            return affected_rows
        except mysql.connector.Error as e:
            logger.error(f"更新執行失敗: {e}")
            return 0

class PetAI:
    """寵物AI系統"""
    
    def __init__(self, db_manager: DatabaseManager):
        self.db = db_manager
        self.personality_traits = {
            'cat': {'independence': 0.8, 'playfulness': 0.6, 'cleanliness': 0.9},
            'dog': {'independence': 0.4, 'playfulness': 0.9, 'cleanliness': 0.5},
            'rabbit': {'independence': 0.6, 'playfulness': 0.5, 'cleanliness': 0.7},
            'bird': {'independence': 0.7, 'playfulness': 0.8, 'cleanliness': 0.8}
        }
    
    def get_pet_mood(self, pet: PetStatus) -> str:
        """根據寵物狀態判斷心情"""
        avg_status = (pet.health + pet.hunger + pet.happiness + 
                     pet.energy + pet.cleanliness) / 5
        
        if avg_status >= 80:
            return "非常開心"
        elif avg_status >= 60:
            return "愉快"
        elif avg_status >= 40:
            return "普通"
        elif avg_status >= 20:
            return "不開心"
        else:
            return "非常難過"
    
    def suggest_action(self, pet: PetStatus) -> List[str]:
        """AI建議行動"""
        suggestions = []
        
        if pet.hunger < 30:
            suggestions.append("🍖 你的寵物很餓，快給它餵食吧！")
        if pet.happiness < 30:
            suggestions.append("🎾 寵物看起來不開心，陪它玩耍一下吧！")
        if pet.energy < 20:
            suggestions.append("😴 寵物很累了，讓它休息一下吧！")
        if pet.cleanliness < 30:
            suggestions.append("🧼 寵物需要清潔了！")
        if pet.health < 40:
            suggestions.append("💊 寵物健康狀況不佳，考慮使用藥品！")
        
        return suggestions
    
    def predict_status_decline(self, pet: PetStatus, hours: int = 24) -> Dict:
        """預測寵物狀態衰減"""
        traits = self.personality_traits.get(pet.type, 
                                           self.personality_traits['cat'])
        
        # 基於寵物類型調整衰減速率
        hunger_decline = 0.5 * hours * (2 - traits['independence'])
        happiness_decline = 0.3 * hours * (2 - traits['playfulness'])
        energy_decline = 0.2 * hours
        cleanliness_decline = 0.4 * hours * (2 - traits['cleanliness'])
        
        predicted = {
            'hunger': max(0, pet.hunger - hunger_decline),
            'happiness': max(0, pet.happiness - happiness_decline),
            'energy': max(0, pet.energy - energy_decline),
            'cleanliness': max(0, pet.cleanliness - cleanliness_decline)
        }
        
        # 計算預測健康值
        avg_predicted = sum(predicted.values()) / len(predicted)
        predicted['health'] = min(100, max(0, avg_predicted))
        
        return predicted

class GameEngine:
    """遊戲引擎核心"""
    
    def __init__(self, db_manager: DatabaseManager):
        self.db = db_manager
        self.ai = PetAI(db_manager)
    
    def get_all_pets(self) -> List[PetStatus]:
        """獲取所有寵物"""
        query = "SELECT * FROM pets WHERE last_updated < NOW() - INTERVAL 30 SECOND"
        results = self.db.execute_query(query)
        
        pets = []
        if results:
            for row in results:
                pet = PetStatus(
                    id=row['id'],
                    user_id=row['user_id'],
                    name=row['name'],
                    level=row['level'],
                    exp=row['exp'],
                    health=float(row['health']),
                    hunger=float(row['hunger']),
                    happiness=float(row['happiness']),
                    energy=float(row['energy']),
                    cleanliness=float(row['cleanliness']),
                    coins=row['coins'],
                    total_play_time=row['total_play_time'],
                    last_updated=row['last_updated']
                )
                pets.append(pet)
        
        return pets
    
    def update_pet_status(self, pet: PetStatus):
        """更新寵物狀態"""
        # 計算時間差（分鐘）
        now = datetime.now()
        time_diff = (now - pet.last_updated).total_seconds() / 60
        
        # 狀態自然衰減
        pet.hunger = max(0, pet.hunger - (0.5 * time_diff / 30))  # 每30分鐘衰減0.5
        pet.happiness = max(0, pet.happiness - (0.3 * time_diff / 30))
        pet.energy = max(0, pet.energy - (0.2 * time_diff / 30))
        pet.cleanliness = max(0, pet.cleanliness - (0.4 * time_diff / 30))
        
        # 計算健康值
        avg_status = (pet.hunger + pet.happiness + pet.energy + pet.cleanliness) / 4
        pet.health = min(100, max(0, avg_status))
        
        # 增加遊戲時間
        pet.total_play_time += int(time_diff)
        
        # 更新資料庫
        query = """
        UPDATE pets SET 
            health = %s, hunger = %s, happiness = %s, 
            energy = %s, cleanliness = %s, total_play_time = %s,
            last_updated = NOW()
        WHERE id = %s
        """
        params = (pet.health, pet.hunger, pet.happiness, 
                 pet.energy, pet.cleanliness, pet.total_play_time, pet.id)
        
        self.db.execute_update(query, params)
        logger.info(f"更新寵物 {pet.name} (ID: {pet.id}) 的狀態")
    
    def check_achievements(self, pet: PetStatus):
        """檢查成就解鎖"""
        # 獲取未解鎖的成就
        query = """
        SELECT a.* FROM achievements a
        LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = %s
        WHERE ua.id IS NULL
        """
        achievements = self.db.execute_query(query, (pet.user_id,))
        
        if not achievements:
            return
        
        for achievement in achievements:
            unlocked = False
            condition_type = achievement['condition_type']
            condition_value = achievement['condition_value']
            
            # 檢查不同類型的成就條件
            if condition_type == 'level' and pet.level >= condition_value:
                unlocked = True
            elif condition_type == 'coins' and pet.coins >= condition_value:
                unlocked = True
            elif condition_type == 'time_played' and pet.total_play_time >= condition_value:
                unlocked = True
            elif condition_type == 'feed_count':
                # 查詢餵食次數
                feed_query = "SELECT COUNT(*) as count FROM game_logs WHERE user_id = %s AND action_type = 'feed'"
                feed_result = self.db.execute_query(feed_query, (pet.user_id,))
                if feed_result and feed_result[0]['count'] >= condition_value:
                    unlocked = True
            elif condition_type == 'play_count':
                # 查詢遊戲次數
                play_query = "SELECT COUNT(*) as count FROM game_logs WHERE user_id = %s AND action_type = 'play'"
                play_result = self.db.execute_query(play_query, (pet.user_id,))
                if play_result and play_result[0]['count'] >= condition_value:
                    unlocked = True
            
            if unlocked:
                # 解鎖成就
                unlock_query = "INSERT INTO user_achievements (user_id, achievement_id) VALUES (%s, %s)"
                self.db.execute_update(unlock_query, (pet.user_id, achievement['id']))
                
                # 獎勵金幣
                if achievement['reward_coins'] > 0:
                    coin_query = "UPDATE pets SET coins = coins + %s WHERE user_id = %s"
                    self.db.execute_update(coin_query, (achievement['reward_coins'], pet.user_id))
                
                logger.info(f"用戶 {pet.user_id} 解鎖成就: {achievement['name']}")
    
    def generate_daily_report(self, user_id: int) -> Dict:
        """生成每日報告"""
        # 獲取今日統計數據
        today = datetime.now().strftime('%Y-%m-%d')
        
        stats_query = """
        SELECT 
            COUNT(CASE WHEN action_type = 'feed' THEN 1 END) as feed_count,
            COUNT(CASE WHEN action_type = 'play' THEN 1 END) as play_count,
            COUNT(CASE WHEN action_type = 'clean' THEN 1 END) as clean_count,
            COUNT(CASE WHEN action_type = 'rest' THEN 1 END) as rest_count
        FROM game_logs 
        WHERE user_id = %s AND DATE(created_at) = %s
        """
        
        stats = self.db.execute_query(stats_query, (user_id, today))
        
        # 獲取寵物當前狀態
        pet_query = "SELECT * FROM pets WHERE user_id = %s"
        pet_data = self.db.execute_query(pet_query, (user_id,))
        
        if not pet_data:
            return {"error": "Pet not found"}
        
        pet = pet_data[0]
        
        # 生成報告
        report = {
            "date": today,
            "pet_name": pet['name'],
            "current_level": pet['level'],
            "daily_stats": stats[0] if stats else {},
            "current_status": {
                "health": float(pet['health']),
                "hunger": float(pet['hunger']),
                "happiness": float(pet['happiness']),
                "energy": float(pet['energy']),
                "cleanliness": float(pet['cleanliness'])
            },
            "suggestions": []
        }
        
        # 添加AI建議
        pet_status = PetStatus(
            id=pet['id'], user_id=pet['user_id'], name=pet['name'],
            level=pet['level'], exp=pet['exp'], health=float(pet['health']),
            hunger=float(pet['hunger']), happiness=float(pet['happiness']),
            energy=float(pet['energy']), cleanliness=float(pet['cleanliness']),
            coins=pet['coins'], total_play_time=pet['total_play_time'],
            last_updated=pet['last_updated']
        )
        
        report["suggestions"] = self.ai.suggest_action(pet_status)
        report["mood"] = self.ai.get_pet_mood(pet_status)
        
        return report

class NotificationSystem:
    """通知系統"""
    
    def __init__(self, db_manager: DatabaseManager):
        self.db = db_manager
    
    def send_push_notification(self, user_id: int, title: str, message: str):
        """發送推送通知（模擬）"""
        notification_data = {
            "user_id": user_id,
            "title": title,
            "message": message,
            "timestamp": datetime.now().isoformat()
        }
        
        # 這裡可以整合真實的推送服務（如Firebase、Apple Push等）
        logger.info(f"推送通知給用戶 {user_id}: {title} - {message}")
        
        # 儲存到資料庫（可選）
        query = """
        INSERT INTO notifications (user_id, title, message, sent_at) 
        VALUES (%s, %s, %s, NOW())
        """
        try:
            self.db.execute_update(query, (user_id, title, message))
        except:
            pass  # 如果notifications表不存在就跳過
    
    def check_pet_alerts(self):
        """檢查寵物警報"""
        # 查詢需要關注的寵物
        query = """
        SELECT * FROM pets 
        WHERE health < 30 OR hunger < 30 OR happiness < 30 OR energy < 20 OR cleanliness < 30
        """
        
        pets = self.db.execute_query(query)
        
        if pets:
            for pet in pets:
                user_id = pet['user_id']
                pet_name = pet['name']
                
                alerts = []
                if pet['health'] < 30:
                    alerts.append("健康狀況不佳")
                if pet['hunger'] < 30:
                    alerts.append("非常飢餓")
                if pet['happiness'] < 30:
                    alerts.append("情緒低落")
                if pet['energy'] < 20:
                    alerts.append("精力不足")
                if pet['cleanliness'] < 30:
                    alerts.append("需要清潔")
                
                if alerts:
                    message = f"{pet_name} 需要你的關心：{', '.join(alerts)}"
                    self.send_push_notification(user_id, "寵物需要關心", message)

class GameScheduler:
    """遊戲調度器"""
    
    def __init__(self):
        self.db_manager = DatabaseManager()
        self.game_engine = GameEngine(self.db_manager)
        self.notification_system = NotificationSystem(self.db_manager)
    
    def run_status_update(self):
        """運行狀態更新"""
        if not self.db_manager.connect():
            return
        
        try:
            pets = self.game_engine.get_all_pets()
            logger.info(f"處理 {len(pets)} 隻寵物的狀態更新")
            
            for pet in pets:
                self.game_engine.update_pet_status(pet)
                self.game_engine.check_achievements(pet)
            
        except Exception as e:
            logger.error(f"狀態更新過程中發生錯誤: {e}")
        finally:
            self.db_manager.disconnect()
    
    def run_daily_notifications(self):
        """運行每日通知"""
        if not self.db_manager.connect():
            return
        
        try:
            self.notification_system.check_pet_alerts()
        except Exception as e:
            logger.error(f"通知檢查過程中發生錯誤: {e}")
        finally:
            self.db_manager.disconnect()
    
    def start_scheduler(self):
        """啟動調度器"""
        # 每30秒更新一次寵物狀態
        schedule.every(30).seconds.do(self.run_status_update)
        
        # 每小時檢查一次警報
        schedule.every().hour.do(self.run_daily_notifications)
        
        logger.info("遊戲調度器已啟動")
        
        while True:
            schedule.run_pending()
            time.sleep(1)

# API 整合類
class APIIntegration:
    """API整合類"""
    
    def __init__(self, php_api_url="http://localhost/virtual_pet/api/pet_actions.php"):
        self.api_url = php_api_url
        self.db_manager = DatabaseManager()
        self.game_engine = GameEngine(self.db_manager)
    
    def sync_with_php_api(self, user_id: int, action: str, data: Dict = None):
        """與PHP API同步"""
        try:
            params = {"action": action, "user_id": user_id}
            if data:
                response = requests.post(self.api_url, params=params, data=data)
            else:
                response = requests.get(self.api_url, params=params)
            
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"API請求失敗: {response.status_code}")
                return None
                
        except Exception as e:
            logger.error(f"API整合錯誤: {e}")
            return None
    
    def get_daily_report_api(self, user_id: int):
        """獲取每日報告API"""
        if not self.db_manager.connect():
            return {"error": "Database connection failed"}
        
        try:
            report = self.game_engine.generate_daily_report(user_id)
            return report
        except Exception as e:
            logger.error(f"生成報告錯誤: {e}")
            return {"error": str(e)}
        finally:
            self.db_manager.disconnect()

# 主程序入口
if __name__ == "__main__":
    # 創建調度器並啟動
    scheduler = GameScheduler()
    
    # 也可以單獨測試功能
    # api_integration = APIIntegration()
    # report = api_integration.get_daily_report_api(1)
    # print(json.dumps(report, indent=2, ensure_ascii=False))
    
    # 啟動調度器（這會持續運行）
    try:
        scheduler.start_scheduler()
    except KeyboardInterrupt:
        logger.info("遊戲引擎已停止")
    except Exception as e:
        logger.error(f"運行錯誤: {e}")

# 用於Web API的Flask應用
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/daily_report/<int:user_id>')
def get_daily_report(user_id):
    """獲取每日報告端點"""
    api_integration = APIIntegration()
    report = api_integration.get_daily_report_api(user_id)
    return jsonify(report)

@app.route('/api/pet_prediction/<int:user_id>')
def get_pet_prediction(user_id):
    """獲取寵物狀態預測"""
    db_manager = DatabaseManager()
    if not db_manager.connect():
        return jsonify({"error": "Database connection failed"})
    
    try:
        game_engine = GameEngine(db_manager)
        
        # 獲取寵物數據
        pet_query = "SELECT * FROM pets WHERE user_id = %s"
        pet_data = db_manager.execute_query(pet_query, (user_id,))
        
        if not pet_data:
            return jsonify({"error": "Pet not found"})
        
        pet = pet_data[0]
        pet_status = PetStatus(
            id=pet['id'], user_id=pet['user_id'], name=pet['name'],
            level=pet['level'], exp=pet['exp'], health=float(pet['health']),
            hunger=float(pet['hunger']), happiness=float(pet['happiness']),
            energy=float(pet['energy']), cleanliness=float(pet['cleanliness']),
            coins=pet['coins'], total_play_time=pet['total_play_time'],
            last_updated=pet['last_updated']
        )
        
        # 獲取預測
        hours = request.args.get('hours', 24, type=int)
        prediction = game_engine.ai.predict_status_decline(pet_status, hours)
        suggestions = game_engine.ai.suggest_action(pet_status)
        
        return jsonify({
            "current_status": {
                "health": pet_status.health,
                "hunger": pet_status.hunger,
                "happiness": pet_status.happiness,
                "energy": pet_status.energy,
                "cleanliness": pet_status.cleanliness
            },
            "predicted_status": prediction,
            "suggestions": suggestions,
            "prediction_hours": hours
        })
        
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        db_manager.disconnect()

if __name__ == "__main__":
    # 運行Flask API服務器
    app.run(debug=True, port=5000)