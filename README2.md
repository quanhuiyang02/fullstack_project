Fullstack Pet Game Project
這是一個虛擬寵物遊戲的全端專案，包含前端和後端。
專案結構
fullstack_project/
├── frontend/          # 前端代碼
├── backend/           # 後端代碼
│   ├── api/          # API 接口
│   ├── config/       # 配置文件
│   └── models/       # 數據模型
└── README.md         # 本文件
環境需求
前端

Node.js (建議 16.x 以上)
npm 或 yarn

後端

PHP 8.1+
MySQL/MariaDB
XAMPP (推薦) 或其他 PHP 環境

開發環境啟動
🚀 啟動前端 (Frontend)

進入前端目錄
bashcd frontend

安裝依賴
bashnpm install

啟動開發服務器
bashnpm run dev

訪問地址
http://localhost:3000
或根據終端顯示的實際端口

🔧 啟動後端 (Backend)
方法1：使用 PHP 內建服務器 (推薦開發時使用)

進入後端目錄
bashcd backend

啟動 PHP 服務器
bash# 如果 PHP 已加入環境變數
php -S localhost:8000

# 如果使用 XAMPP (Windows)
C:\xampp\php\php.exe -S localhost:8000

API 訪問地址
http://localhost:8000/api/pet_actions.php?action=get_pet


方法2：使用 XAMPP + Virtual Host

配置 Virtual Host
編輯 C:\xampp\apache\conf\extra\httpd-vhosts.conf，添加：
apache<VirtualHost *:80>
    DocumentRoot "C:/path/to/your/fullstack_project/backend"
    ServerName petgame.local
</VirtualHost>

<VirtualHost *:80>
    DocumentRoot "C:/xampp/htdocs"
    ServerName localhost
</VirtualHost>

配置 hosts 文件
編輯 C:\Windows\System32\drivers\etc\hosts，添加：
127.0.0.1	petgame.local

重啟 XAMPP Apache
API 訪問地址
http://petgame.local/api/pet_actions.php?action=get_pet


API 端點
獲取寵物資訊
GET /api/pet_actions.php?action=get_pet&user_id=1
餵食寵物
POST /api/pet_actions.php?action=feed
Body: user_id=1
和寵物玩耍
POST /api/pet_actions.php?action=play
Body: user_id=1
清潔寵物
POST /api/pet_actions.php?action=clean
Body: user_id=1
寵物休息
POST /api/pet_actions.php?action=rest
Body: user_id=1
獲取庫存
GET /api/pet_actions.php?action=get_inventory&user_id=1
資料庫設置
建立資料庫
sqlCREATE DATABASE pet_game;
USE pet_game;
建立資料表
sql-- 寵物表
CREATE TABLE pets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    name VARCHAR(50),
    type VARCHAR(20),
    level INT DEFAULT 1,
    exp INT DEFAULT 0,
    health DECIMAL(5,2) DEFAULT 100,
    hunger DECIMAL(5,2) DEFAULT 100,
    happiness DECIMAL(5,2) DEFAULT 100,
    energy DECIMAL(5,2) DEFAULT 100,
    cleanliness DECIMAL(5,2) DEFAULT 100,
    coins INT DEFAULT 0,
    total_play_time INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 道具庫存表
CREATE TABLE inventory (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    item_id INT,
    quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 行動記錄表
CREATE TABLE pet_actions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pet_id INT,
    action VARCHAR(20),
    action_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
配置資料庫連線
編輯 backend/config/database.php，修改資料庫連線資訊：
phpprivate $host = "localhost";
private $db_name = "pet_game";
private $username = "root";        // 你的資料庫用戶名
private $password = "";            // 你的資料庫密碼
開發注意事項

前端修改會自動熱重載
後端修改需要重新整理瀏覽器
確保資料庫服務正在運行
API 預設使用 user_id=1 進行測試

常見問題
Q: 無法找到 PHP 命令
A: 確保 PHP 已安裝並加入系統環境變數，或使用完整路徑如 C:\xampp\php\php.exe
Q: 資料庫連線失敗
A: 檢查 MySQL 服務是否啟動，以及 config/database.php 中的連線資訊是否正確
Q: CORS 錯誤
A: 後端已配置 CORS 頭部，如果仍有問題請檢查前端請求的 URL 是否正確
部署
前端部署
bashcd frontend
npm run build
後端部署
將 backend 資料夾上傳至支援 PHP 的主機，並配置資料庫連線。
授權
本專案僅供學習使用。