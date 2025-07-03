<?php
// api/actions/feed_action.php
include_once '../config/database.php';
include_once '../models/Pet.php';
include_once '../models/Inventory.php';

$database = new Database();
$db = $database->getConnection();
$pet = new Pet($db);
$inventory = new Inventory($db);

$user_id = $_POST['user_id'] ?? $_GET['user_id'] ?? 1;

if($pet->getPetByUserId($user_id)) {
    $food_quantity = $inventory->getItemQuantity($user_id, 1); // food item_id = 1
    
    if($food_quantity > 0) {
        $pet->hunger = min(100, floatval($pet->hunger) + 25);
        $pet->happiness = min(100, floatval($pet->happiness) + 10);
        $pet->exp += 10;
        
        if($pet->exp >= ($pet->level * 100)) {
            $pet->level++;
            $pet->coins += 50;
        }
        
        $pet->updatePet();
        $inventory->updateItemQuantity($user_id, 1, -1);
        $pet->logAction('feed', array('hunger_gain' => 25, 'happiness_gain' => 10));
        
        echo json_encode(array("status" => "success", "message" => "Pet fed successfully"));
    } else {
        echo json_encode(array("status" => "error", "message" => "No food available"));
    }
} else {
    echo json_encode(array("status" => "error", "message" => "Pet not found"));
}
