<?php
require_once 'config/database.php';

$database = new Database();
$db = $database->getConnection();

if($db) {
    echo "✅ 資料庫連線成功！<br><br>";
    
    // 切換到 pet_game 資料庫
    $db->exec("USE pet_game");
    
    echo "🔍 <strong>虛擬寵物遊戲資料庫完整性檢查</strong><br><br>";
    
    // 定義應該存在的資料表
    $expected_tables = [
        'users' => '用戶管理',
        'pets' => '寵物資料', 
        'items' => '遊戲物品',
        'user_inventory' => '用戶物品庫存',
        'achievements' => '成就系統',
        'user_achievements' => '用戶成就記錄',
        'game_logs' => '遊戲日誌',
        'shop_transactions' => '商店交易記錄'
    ];
    
    // 檢查資料表是否存在
    $query = "SHOW TABLES";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $existing_tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    echo "📋 <strong>資料表檢查結果：</strong><br>";
    $missing_tables = [];
    foreach($expected_tables as $table => $description) {
        if(in_array($table, $existing_tables)) {
            echo "✅ {$table} ({$description}) - 存在<br>";
        } else {
            echo "❌ {$table} ({$description}) - <span style='color:red'>缺少</span><br>";
            $missing_tables[] = $table;
        }
    }
    echo "<br>";
    
    if(empty($missing_tables)) {
        echo "🎉 <strong>所有核心資料表都已存在！</strong><br><br>";
        
        // 檢查基本資料是否已初始化
        echo "📊 <strong>資料初始化檢查：</strong><br>";
        
        // 檢查物品資料
        $items_query = "SELECT COUNT(*) as count FROM items";
        $items_stmt = $db->prepare($items_query);
        $items_stmt->execute();
        $items_count = $items_stmt->fetch()['count'];
        
        if($items_count > 0) {
            echo "✅ 物品資料：{$items_count} 項物品已載入<br>";
            
            // 顯示物品列表
            $items_list_query = "SELECT name, type, price, icon FROM items LIMIT 10";
            $items_list_stmt = $db->prepare($items_list_query);
            $items_list_stmt->execute();
            $items_list = $items_list_stmt->fetchAll();
            
            echo "   可用物品：<br>";
            foreach($items_list as $item) {
                echo "   • {$item['icon']} {$item['name']} ({$item['type']}) - {$item['price']}金幣<br>";
            }
        } else {
            echo "⚠️ 物品資料：尚未載入基本物品<br>";
        }
        
        // 檢查成就資料
        $achievements_query = "SELECT COUNT(*) as count FROM achievements";
        $achievements_stmt = $db->prepare($achievements_query);
        $achievements_stmt->execute();
        $achievements_count = $achievements_stmt->fetch()['count'];
        
        if($achievements_count > 0) {
            echo "✅ 成就資料：{$achievements_count} 個成就已設定<br>";
            
            // 顯示成就列表
            $achievements_list_query = "SELECT name, description, icon, reward_coins FROM achievements LIMIT 5";
            $achievements_list_stmt = $db->prepare($achievements_list_query);
            $achievements_list_stmt->execute();
            $achievements_list = $achievements_list_stmt->fetchAll();
            
            echo "   可用成就：<br>";
            foreach($achievements_list as $achievement) {
                echo "   • {$achievement['icon']} {$achievement['name']} - 獎勵{$achievement['reward_coins']}金幣<br>";
            }
        } else {
            echo "⚠️ 成就資料：尚未載入基本成就<br>";
        }
        
        // 檢查用戶和寵物資料
        $users_query = "SELECT COUNT(*) as count FROM users";
        $users_stmt = $db->prepare($users_query);
        $users_stmt->execute();
        $users_count = $users_stmt->fetch()['count'];
        
        $pets_query = "SELECT COUNT(*) as count FROM pets";
        $pets_stmt = $db->prepare($pets_query);
        $pets_stmt->execute();
        $pets_count = $pets_stmt->fetch()['count'];
        
        echo "📈 用戶資料：{$users_count} 個用戶<br>";
        echo "🐾 寵物資料：{$pets_count} 隻寵物<br><br>";
        
        // 檢查索引
        echo "🔍 <strong>索引檢查：</strong><br>";
        $indexes_query = "SELECT TABLE_NAME, INDEX_NAME, COLUMN_NAME 
                         FROM information_schema.STATISTICS 
                         WHERE TABLE_SCHEMA = 'pet_game' 
                         AND INDEX_NAME != 'PRIMARY'
                         ORDER BY TABLE_NAME, INDEX_NAME";
        $indexes_stmt = $db->prepare($indexes_query);
        $indexes_stmt->execute();
        $indexes = $indexes_stmt->fetchAll();
        
        if(count($indexes) > 0) {
            echo "✅ 已建立效能優化索引：<br>";
            $current_index = '';
            foreach($indexes as $index) {
                if($index['INDEX_NAME'] != $current_index) {
                    echo "   • {$index['TABLE_NAME']}.{$index['INDEX_NAME']}<br>";
                    $current_index = $index['INDEX_NAME'];
                }
            }
        } else {
            echo "⚠️ 尚未建立效能優化索引<br>";
        }
        
        echo "<br>🎮 <strong>總結：資料庫已準備就緒，可以開始遊戲開發！</strong><br>";
        
    } else {
        echo "⚠️ <strong>缺少以下資料表，需要執行建表SQL：</strong><br>";
        foreach($missing_tables as $table) {
            echo "- {$table}<br>";
        }
    }
    
} else {
    echo "❌ 資料庫連線失敗！";
}
?>