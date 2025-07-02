<?php
require_once 'config/database.php';

$database = new Database();
$db = $database->getConnection();

if($db) {
    echo "✅ 資料庫連線成功！<br>";
    
    // 測試查詢資料庫列表
    $query = "SHOW DATABASES";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $databases = $stmt->fetchAll();
    
    echo "可用的資料庫：<br>";
    foreach($databases as $db_info) {
        echo "- " . $db_info['Database'] . "<br>";
    }
} else {
    echo "❌ 資料庫連線失敗！";
}
?>