<?php
// api/actions/rest_action.php
include_once '../config/database.php';
include_once '../models/Pet.php';

$database = new Database();
$db = $database->getConnection();
$pet = new Pet($db);

$user_id = $_POST['user_id'] ?? $_GET['user_id'] ?? 1;

if($pet->getPetByUserId($user_id)) {
    $pet->energy = min(100, floatval($pet->energy) + 40);
    $pet->health = min(100, floatval($pet->health) + 10);
    
    $pet->updatePet();
    $pet->logAction('rest', array('energy_gain' => 40, 'health_gain' => 10));
    
    echo json_encode(array("status" => "success", "message" => "Pet rested successfully"));
} else {
    echo json_encode(array("status" => "error", "message" => "Pet not found"));
}
?>
