<?php
// api/pet/get_pet.php
include_once '../config/database.php';
include_once '../models/Pet.php';

$database = new Database();
$db = $database->getConnection();
$pet = new Pet($db);

$user_id = $_POST['user_id'] ?? $_GET['user_id'] ?? 1;

if($pet->getPetByUserId($user_id)) {
    $pet_array = array(
        "id" => $pet->id,
        "name" => $pet->name,
        "type" => $pet->type,
        "level" => $pet->level,
        "exp" => $pet->exp,
        "health" => floatval($pet->health),
        "hunger" => floatval($pet->hunger),
        "happiness" => floatval($pet->happiness),
        "energy" => floatval($pet->energy),
        "cleanliness" => floatval($pet->cleanliness),
        "coins" => $pet->coins,
        "total_play_time" => $pet->total_play_time
    );
    
    echo json_encode(array("status" => "success", "data" => $pet_array));
} else {
    echo json_encode(array("status" => "error", "message" => "Pet not found"));
}
?>