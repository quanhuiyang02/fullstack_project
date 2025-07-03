<?php
// api/shop/purchase.php
include_once '../config/database.php';
include_once '../models/Pet.php';
include_once '../models/Inventory.php';

$database = new Database();
$db = $database->getConnection();
$pet = new Pet($db);
$inventory = new Inventory($db);

$user_id = $_POST['user_id'] ?? $_GET['user_id'] ?? 1;
$item_id = $_POST['item_id'] ?? 0;
$quantity = $_POST['quantity'] ?? 1;

// 物品價格表
$item_prices = array(
    1 => 10, // 食物
    2 => 15, // 肥皂
    3 => 20  // 玩具
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
        
        // 記錄購買行為
        $pet->logAction('purchase', array(
            'item_id' => $item_id,
            'quantity' => $quantity,
            'cost' => $total_cost,
            'remaining_coins' => $pet->coins
        ));
        
        echo json_encode(array(
            "status" => "success", 
            "message" => "Purchase successful",
            "remaining_coins" => $pet->coins,
            "item_id" => $item_id,
            "quantity" => $quantity
        ));
    } else {
        echo json_encode(array("status" => "error", "message" => "Not enough coins"));
    }
} else {
    echo json_encode(array("status" => "error", "message" => "Pet not found"));
}
?>