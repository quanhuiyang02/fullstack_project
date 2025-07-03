<?php
// api/inventory/buy_item.php
include_once '../config/database.php';
include_once '../models/Inventory.php';
include_once '../models/Pet.php';

$database = new Database();
$db = $database->getConnection();
$inventory = new Inventory($db);
$pet = new Pet($db);

$user_id = $_POST['user_id'] ?? $_GET['user_id'] ?? 1;
$item_id = $_POST['item_id'] ?? 0;
$quantity = $_POST['quantity'] ?? 1;

// 物品價格表
$item_prices = array(
    1 => 10, // 食物
    2 => 15, // 肥皂
    3 => 20  // 其他物品
);

if(!isset($item_prices[$item_id])) {
    echo json_encode(array("status" => "error", "message" => "Invalid item"));
    exit;
}

$total_cost = $item_prices[$item_id] * $quantity;

if($pet->getPetByUserId($user_id)) {
    if($pet->coins >= $total_cost) {
        $pet->coins -= $total_cost;
        $pet->updatePet();
        $inventory->updateItemQuantity($user_id, $item_id, $quantity);
        
        echo json_encode(array("status" => "success", "message" => "Item purchased successfully", "remaining_coins" => $pet->coins));
    } else {
        echo json_encode(array("status" => "error", "message" => "Not enough coins"));
    }
} else {
    echo json_encode(array("status" => "error", "message" => "Pet not found"));
}
?>