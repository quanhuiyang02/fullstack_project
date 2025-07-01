-- 虛擬寵物遊戲資料庫結構

-- 用戶表
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- 寵物表
CREATE TABLE pets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    type ENUM('cat', 'dog', 'rabbit', 'bird') DEFAULT 'cat',
    level INT DEFAULT 1,
    exp INT DEFAULT 0,
    health DECIMAL(5,2) DEFAULT 80.00,
    hunger DECIMAL(5,2) DEFAULT 60.00,
    happiness DECIMAL(5,2) DEFAULT 70.00,
    energy DECIMAL(5,2) DEFAULT 85.00,
    cleanliness DECIMAL(5,2) DEFAULT 75.00,
    coins INT DEFAULT 100,
    total_play_time INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_fed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_played TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_cleaned TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 物品表
CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    type ENUM('food', 'toy', 'medicine', 'soap') NOT NULL,
    effect_type ENUM('hunger', 'happiness', 'health', 'energy', 'cleanliness') NOT NULL,
    effect_value INT NOT NULL,
    price INT NOT NULL,
    description TEXT,
    icon VARCHAR(10) DEFAULT '📦'
);

-- 用戶物品庫存表
CREATE TABLE user_inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(item_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_item (user_id, item_id)
);

-- 成就表
CREATE TABLE achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(10) DEFAULT '🏆',
    condition_type ENUM('feed_count', 'play_count', 'level', 'coins', 'time_played') NOT NULL,
    condition_value INT NOT NULL,
    reward_coins INT DEFAULT 0
);

-- 用戶成就表
CREATE TABLE user_achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    achievement_id INT NOT NULL,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_achievement (user_id, achievement_id)
);

-- 遊戲日誌表
CREATE TABLE game_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    pet_id INT NOT NULL,
    action_type ENUM('feed', 'play', 'clean', 'rest', 'buy_item', 'level_up') NOT NULL,
    details JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
);

-- 商店交易記錄表
CREATE TABLE shop_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL,
    total_cost INT NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

-- 插入基本物品數據
INSERT INTO items (name, type, effect_type, effect_value, price, description, icon) VALUES
('寵物食物', 'food', 'hunger', 25, 20, '美味的寵物食物，可以恢復25點飢餓值', '🍖'),
('清潔用品', 'soap', 'cleanliness', 30, 15, '專業清潔用品，讓寵物乾淨整潔', '🧼'),
('玩具球', 'toy', 'happiness', 20, 25, '有趣的玩具球，增加寵物快樂度', '🎾'),
('營養藥品', 'medicine', 'health', 35, 40, '高級營養藥品，快速恢復健康', '💊'),
('能量飲品', 'food', 'energy', 30, 30, '特製能量飲品，恢復精力', '🥤');

-- 插入基本成就數據
INSERT INTO achievements (name, description, icon, condition_type, condition_value, reward_coins) VALUES
('第一次餵食', '餵食寵物一次', '🍖', 'feed_count', 1, 10),
('第一次遊戲', '和寵物玩耍一次', '🎾', 'play_count', 1, 10),
('成長達人', '達到等級5', '⭐', 'level', 5, 100),
('小富翁', '累積500金幣', '💰', 'coins', 500, 50),
('馬拉松玩家', '遊戲時間達到60分鐘', '⏰', 'time_played', 3600, 200);

-- 創建索引以優化查詢性能
CREATE INDEX idx_pets_user_id ON pets(user_id);
CREATE INDEX idx_user_inventory_user_id ON user_inventory(user_id);
CREATE INDEX idx_game_logs_user_pet ON game_logs(user_id, pet_id);
CREATE INDEX idx_pets_last_updated ON pets(last_updated);