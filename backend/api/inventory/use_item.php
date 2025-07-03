<?php
// api/inventory/use_item.php
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

if($inventory->getItemQuantity($user_id, $item_id) >= $quantity) {
    // 根據物品類型執行不同效果
    switch($item_id) {
        case 1: // 食物
            if($pet->getPetByUserId($user_id)) {
                $pet->hunger = min(100, floatval($pet->hunger) + (25 * $quantity));
                $pet->happiness = min(100, floatval($pet->happiness) + (10 * $quantity));
                $pet->updatePet();
            }
            break;
        case 2: // 肥皂
            if($pet->getPetByUserId($user_id)) {
                $pet->cleanliness = min(100, floatval($pet->cleanliness) + (30 * $quantity));
                $pet->happiness = min(100, floatval($pet->happiness) + (5 * $quantity));
                $pet->updatePet();
            }
            break;
        default:
            echo json_encode(array("status" => "error", "message" => "Invalid item"));
            exit;
    }
    
    $inventory->updateItemQuantity($user_id, $item_id, -$quantity);
    echo json_encode(array("status" => "success", "message" => "Item used successfully"));
} else {
    echo json_encode(array("status" => "error", "message" => "Not enough items"));
}
?>