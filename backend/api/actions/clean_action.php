<?php
// api/actions/clean_action.php
include_once '../config/database.php';
include_once '../models/Pet.php';
include_once '../models/Inventory.php';

$database = new Database();
$db = $database->getConnection();
$pet = new Pet($db);
$inventory = new Inventory($db);

$user_id = $_POST['user_id'] ?? $_GET['user_id'] ?? 1;

if($pet->getPetByUserId($user_id)) {
    $soap_quantity = $inventory->getItemQuantity($user_id, 2); // soap item_id = 2
    
    if($soap_quantity > 0) {
        $pet->cleanliness = min(100, floatval($pet->cleanliness) + 30);
        $pet->happiness = min(100, floatval($pet->happiness) + 5);
        $pet->exp += 8;
        
        $pet->updatePet();
        $inventory->updateItemQuantity($user_id, 2, -1);
        $pet->logAction('clean', array('cleanliness_gain' => 30, 'happiness_gain' => 5));
        
        echo json_encode(array("status" => "success", "message" => "Pet cleaned successfully"));
    } else {
        echo json_encode(array("status" => "error", "message" => "No soap available"));
    }
} else {
    echo json_encode(array("status" => "error", "message" => "Pet not found"));
}
?>