// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { Heart, Utensils, Gamepad2, Bath, Coins, Star, Clock, Trophy, Home, User, Settings } from 'lucide-react';
import background from './assets/bg.gif';
import petGif from './assets/ch.gif';
import eat from './assets/eat.gif';
import shopbackground from './assets/shopbg.gif';
import statsbackground from './assets/statsbg.gif';
// 元件
import HomeView from './components/HomeView';
import ShopView from './components/ShopView';
import StatsView from './components/StatsView';
import { showNotificationMessage } from './utils/notificationUtils';
import { handleLevelUp } from './utils/expUtils';
import useSoundEffects from './hooks/useSoundEffect';

const VirtualPetGame = () => {
  // 遊戲狀態
  const [pet, setPet] = useState({
    name: "臭屁星人",
    type: "cat",
    level: 1,
    exp: 0,
    health: 80,
    hunger: 60,
    happiness: 70,
    energy: 85,
    cleanliness: 75,
    coins: 100,
    totalPlayTime: 0,
    achievements: [],
    lastFed: Date.now(),
    lastPlayed: Date.now(),
    lastCleaned: Date.now(),
    feedCount: 0,
    playCount: 0,
    cleanCount: 0
  });

  const [currentView, setCurrentView] = useState('home');
  const [showNotification, setShowNotification] = useState('');
  const [inventory, setInventory] = useState({
    food: 5,
    toys: 3,
    medicine: 2,
    soap: 4
  });

  const intervalRef = useRef();
  const { playClick, playMagic, playCoin } = useSoundEffects(currentView);

  // 啟用通知函數
  const notify = (message) => showNotificationMessage(message, setShowNotification);

  // 成就系統定義
  const allAchievements = [
    { 
      id: 1,
      name: '第一次餵食', 
      name_en: 'First Feed',
      description: '餵食寵物一次', 
      icon: '🍖',
      condition_type: 'feed_count',
      condition_value: 1,
      reward_coins: 10,
      unlocked: false
    },
    { 
      id: 2,
      name: '第一次遊戲', 
      name_en: 'First Play',
      description: '和寵物玩耍一次', 
      icon: '🎾',
      condition_type: 'play_count',
      condition_value: 1,
      reward_coins: 10,
      unlocked: false
    },
    { 
      id: 3,
      name: '第一次清潔', 
      name_en: 'First Clean',
      description: '清潔寵物一次', 
      icon: '🛁',
      condition_type: 'clean_count',
      condition_value: 1,
      reward_coins: 10,
      unlocked: false
    },
    { 
      id: 4,
      name: '成長達人', 
      name_en: 'Growth Expert',
      description: '達到等級5', 
      icon: '⭐',
      condition_type: 'level',
      condition_value: 5,
      reward_coins: 50,
      unlocked: false
    },
    { 
      id: 5,
      name: '小富翁', 
      name_en: 'Little Tycoon',
      description: '累積500金幣', 
      icon: '💰',
      condition_type: 'coins',
      condition_value: 500,
      reward_coins: 100,
      unlocked: false
    },
    { 
      id: 6,
      name: '遊戲愛好者', 
      name_en: 'Game Enthusiast',
      description: '遊戲10次', 
      icon: '🎮',
      condition_type: 'play_count',
      condition_value: 10,
      reward_coins: 30,
      unlocked: false
    },
    { 
      id: 7,
      name: '餵食專家', 
      name_en: 'Feed Expert',
      description: '餵食20次', 
      icon: '🥘',
      condition_type: 'feed_count',
      condition_value: 20,
      reward_coins: 50,
      unlocked: false
    },
    { 
      id: 8,
      name: '時間管理大師', 
      name_en: 'Time Management Master',
      description: '累積遊戲60分鐘', 
      icon: '⏰',
      condition_type: 'time_played',
      condition_value: 3600, // 60分鐘 = 3600秒
      reward_coins: 100,
      unlocked: false
    }
  ];

  // 檢查並解鎖成就（對應後端Python 版本）
  const checkAchievements = (newPetState) => {
    // 獲取未解鎖的成就
    const unlockedAchievements = allAchievements.filter(achievement => 
      !newPetState.achievements.includes(achievement.id)
    );
    
    if (!unlockedAchievements.length) {
      return newPetState;
    }
    
    const newlyUnlocked = [];
    let totalRewardCoins = 0;
    
    for (const achievement of unlockedAchievements) {
      let unlocked = false;
      const { condition_type, condition_value } = achievement;
      
      // 檢查不同類型的成就條件（對應後端邏輯）
      switch (condition_type) {
        case 'level':
          if (newPetState.level >= condition_value) {
            unlocked = true;
          }
          break;
          
        case 'coins':
          if (newPetState.coins >= condition_value) {
            unlocked = true;
          }
          break;
          
        case 'time_played':
          if (newPetState.totalPlayTime >= condition_value) {
            unlocked = true;
          }
          break;
          
        case 'feed_count':
          if (newPetState.feedCount >= condition_value) {
            unlocked = true;
          }
          break;
          
        case 'play_count':
          if (newPetState.playCount >= condition_value) {
            unlocked = true;
          }
          break;
          
        case 'clean_count':
          if (newPetState.cleanCount >= condition_value) {
            unlocked = true;
          }
          break;
      }
      
      if (unlocked) {
        newlyUnlocked.push(achievement.id);
        totalRewardCoins += achievement.reward_coins;
        
        // 顯示成就解鎖通知
        notify(`🎉 解鎖成就: ${achievement.name}！獲得 ${achievement.reward_coins} 金幣！`);
        console.log(`用戶解鎖成就: ${achievement.name}, 獎勵金幣: ${achievement.reward_coins}`);
      }
    }
    
    if (newlyUnlocked.length > 0) {
      return {
        ...newPetState,
        achievements: [...newPetState.achievements, ...newlyUnlocked],
        coins: newPetState.coins + totalRewardCoins
      };
    }
    
    return newPetState;
  };

  // 獲取已解鎖的成就列表（用於 StatsView 顯示）
  const getUnlockedAchievements = () => {
    return allAchievements.filter(achievement => 
      pet.achievements.includes(achievement.id)
    );
  };

  // 自動狀態衰減
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setPet((prev) => {
        const newPet = {
          ...prev,
          hunger: Math.max(0, prev.hunger - 0.5),
          happiness: Math.max(0, prev.happiness - 0.3),
          energy: Math.max(0, prev.energy - 0.2),
          cleanliness: Math.max(0, prev.cleanliness - 0.4),
          totalPlayTime: prev.totalPlayTime + 1,
        };

        // 健康值根據其他狀態計算
        const avgStatus =
          (newPet.hunger + newPet.happiness + newPet.energy + newPet.cleanliness) / 4;
        newPet.health = Math.min(100, Math.max(0, avgStatus));
        
        // 檢查成就（時間相關的成就）
        return checkAchievements(newPet);
      });
    }, 30000);// 每30秒更新一次

    return () => clearInterval(intervalRef.current);
  }, []);

  // 經驗值和等級系統
  const addExp = (amount) => {
    setPet(prev => {
      const leveledUpPet = handleLevelUp(prev, amount, notify);
      return checkAchievements(leveledUpPet);
    });
  };

  // 修正餵食函數
  const feedPet = () => {
    if (inventory.food > 0) {
      playMagic();
      setPet(prev => {
        const newPet = {
          ...prev,
          hunger: Math.min(100, prev.hunger + 25),
          happiness: Math.min(100, prev.happiness + 10),
          lastFed: Date.now(),
          feedCount: prev.feedCount + 1 // 增加餵食計數
        };
        return checkAchievements(newPet);
      });
      setInventory(prev => ({ ...prev, food: prev.food - 1 }));
      addExp(10);
      notify(`${pet.name}很開心地吃完了食物！`);
    } else {
      notify('沒有食物了！去商店購買吧！');
    }
  };

  // 遊戲函數
  const playWithPet = () => {
    if (pet.energy > 20) {
      playMagic();
      const earnedCoins = Math.floor(Math.random() * 10) + 5;
      setPet(prev => {
        const newPet = {
          ...prev,
          happiness: Math.min(100, prev.happiness + 20),
          energy: Math.max(0, prev.energy - 15),
          lastPlayed: Date.now(),
          coins: prev.coins + earnedCoins,
          playCount: prev.playCount + 1 // 增加遊戲計數
        };
        return checkAchievements(newPet);
      });
      addExp(15);
      notify(`和${pet.name}玩得很開心！獲得了${earnedCoins}金幣！`);
    } else {
      notify(`${pet.name}太累了，讓它休息一下吧！`);
    }
  };

  // 清潔函數
  const cleanPet = () => {
    if (inventory.soap > 0) {
      playMagic();
      setPet(prev => {
        const newPet = {
          ...prev,
          cleanliness: Math.min(100, prev.cleanliness + 30),
          happiness: Math.min(100, prev.happiness + 5),
          lastCleaned: Date.now(),
          cleanCount: prev.cleanCount + 1 // 增加清潔計數
        };
        return checkAchievements(newPet);
      });
      setInventory(prev => ({ ...prev, soap: prev.soap - 1 }));
      addExp(8);
      notify(`${pet.name}現在乾乾淨淨的！`);
    } else {
      notify('沒有肥皂了！去商店購買吧！');
    }
  };

  const restPet = () => {
    playMagic();
    setPet(prev => ({
      ...prev,
      energy: Math.min(100, prev.energy + 40),
      health: Math.min(100, prev.health + 10)
    }));
    notify(`${pet.name}睡了個好覺！`);
  };

  // 購買函數
  const buyItem = (item, cost) => {
    if (pet.coins >= cost) {
      setPet(prev => {
        const newPet = {
          ...prev,
          coins: prev.coins - cost
        };
        return checkAchievements(newPet);
      });
      setInventory(prev => ({ ...prev, [item]: prev[item] + 1 }));
      notify(`購買了${item === 'food' ? '食物' : item === 'soap' ? '肥皂' : '玩具'}！`);
    } else {
      notify('金幣不足！');
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-200 overflow-hidden">
      {/* 📱 手機框 */}
      <div
        className="w-[434px] h-[651px] rounded-[2rem] overflow-hidden shadow-xl ring-4 ring-indigo-300/60 bg-white/10 backdrop-blur-md flex flex-col"
        style={{
          backgroundImage: 
          currentView === 'home' ? `url(${background})` 
          : currentView === 'shop' ? `url(${shopbackground})` 
          : currentView === 'stats' ? `url(${statsbackground})` : 'none',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center'
        }}
      >
      {/* 通知 */}
      {showNotification && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
          {showNotification}
        </div>
      )}
       {/* 頂部欄 */}
      <div className="relative bg-white/80 p-4 shadow-sm flex justify-center">
        {/* 只有非 shop 頁面才顯示標題 */}
        {currentView !== 'shop' && (
          <h1 className="text-xl font-bold text-gray-800">心寵生活</h1>
        )}

        {/* 金幣顯示區 */}
        <div
          className="absolute top-8 flex items-center space-x-1"
          style={{ right: '5%' }}
        >
          <Coins style={{ color: '#eab308' }} size={32} className="text-yellow-600 mr-2" />
          <span
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#eab308',
            }}
          >
            金幣: {pet.coins}
          </span>
        </div>
      </div>
      {/* 主要內容區 */}
      <div className="flex-1 overflow-y-auto p-4">
        {currentView === 'home' && <HomeView pet={pet} inventory={inventory} feedPet={feedPet} playWithPet={playWithPet} cleanPet={cleanPet} restPet={restPet} />}
        {currentView === 'shop' && <ShopView pet={pet} buyItem={buyItem} playCoin={playCoin}/>}
        {currentView === 'stats' && <StatsView pet={pet} achievements={getUnlockedAchievements()} />}
      </div>
      {/*  底部導航 */}
      <div className="shadow-lg"style={{backgroundColor:"#FFEBAC", borderTop: '0px solid rgb(0, 0, 0)'}}>
        <div style={{ display: 'flex', width: '100%',gap: '0px' }}>
          <button
            onClick={() => { playClick(); setCurrentView('home')}}
            className="bg-white flex flex-col items-center py-2 px-4 rounded-lg transition-colors"
              style={{flex: 1,
                backgroundColor: currentView === 'home' ? '#FFEBAC' : '#FFEBAC',
                color: currentView === 'home' ? '#000000' : '#000000',            
                border: '1px solid #FFEBAC'
              }}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1">首頁</span>
          </button>

          <button
            onClick={() => { playClick(); setCurrentView('shop')}}
            className="bg-white flex flex-col items-center py-2 px-4 rounded-lg transition-colors"
              style={{flex: 1,
                backgroundColor: currentView === 'shop' ? '#FFEBAC' : '#FFEBAC',
                color: currentView === 'shop' ? '#000000' : '#0000000',           
                border: '1px solid #FFEBAC'
              }}
          >
            <Coins className="w-5 h-5" />
            <span className="text-xs mt-1">商店</span>
          </button>

          <button
            onClick={() => { playClick(); setCurrentView('stats')}}
            className="bg-white flex flex-col items-center py-2 px-4 rounded-lg transition-colors"
            style={{flex: 1,
              backgroundColor: currentView === 'stats' ? '#FFEBAC' : '#FFEBAC',
              color: currentView === 'stats' ? '#000000' : '#000000',          
              border: '1px solid #FFEBAC'
            }}
          >
            <Trophy className="w-5 h-5" />
            <span className="text-xs mt-1">統計</span>
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default VirtualPetGame;