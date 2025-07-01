<?php
// index.php - RESTful style API 路由（使用 URL 重寫以支援 PATH_INFO）

// 1. 設定 CORS 與 JSON 回應
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// 2. 處理預檢請求
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 3. 載入資料庫設定與 Model
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/models/Pet.php';
require_once __DIR__ . '/models/Inventory.php';

// 4. 取得 PATH_INFO 中的路由資訊
$pathInfo = isset($_SERVER['PATH_INFO']) ? trim($_SERVER['PATH_INFO'], '/') : '';
$parts    = explode('/', $pathInfo);

if (count($parts) < 2) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Invalid endpoint']);
    exit;
}

$resource = $parts[0];    // e.g. 'pet' or 'inventory'
$action   = $parts[1];    // e.g. 'get_pet' or 'feed'

// 5. 模擬 GET['action']，供原有 api 檔案使用
$_GET['action'] = $action;

// 6. 對應到某個 api 檔案
$apiFile = __DIR__ . "/api/{$resource}_actions.php";
if (!file_exists($apiFile)) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => "API file for resource '{$resource}' not found"]);
    exit;
}

// 7. 呼叫對應 api 檔案
require $apiFile;
?>