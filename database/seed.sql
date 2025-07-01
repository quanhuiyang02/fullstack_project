-- 插入一個測試用戶
INSERT INTO users (username, email, password_hash) VALUES 
('dev', 'dev@example.com', 'hashed_dummy');

-- 插入寵物
INSERT INTO pets (user_id, name, type) VALUES
(1, 'Pixel', 'cat');

-- 插入測試庫存（3份食物、1個玩具）
INSERT INTO user_inventory (user_id, item_id, quantity) VALUES
(1, 1, 3),
(1, 3, 1);

-- 插入初始成就（已解鎖第一個餵食成就）
INSERT INTO user_achievements (user_id, achievement_id) VALUES
(1, 1);