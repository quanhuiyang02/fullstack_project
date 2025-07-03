<?php
// api/pet/get_status.php
include_once '../config/database.php';
include_once '../models/Pet.php';

$database = new Database();
$db = $database->getConnection();
$pet = new Pet($db);

$user_id = $_POST['user_id'] ?? $_GET['user_id'] ?? 1;

if($pet->getPetByUserId($user_id)) {
    $status = array(
        "health_status" => $pet->health >= 70 ? "healthy" : ($pet->health >= 30 ? "okay" : "sick"),
        "hunger_status" => $pet->hunger >= 70 ? "full" : ($pet->hunger >= 30 ? "okay" : "hungry"),
        "happiness_status" => $pet->happiness >= 70 ? "happy" : ($pet->happiness >= 30 ? "okay" : "sad"),
        "energy_status" => $pet->energy >= 70 ? "energetic" : ($pet->energy >= 30 ? "okay" : "tired"),
        "cleanliness_status" => $pet->cleanliness >= 70 ? "clean" : ($pet->cleanliness >= 30 ? "okay" : "dirty"),
        "overall_status" => "good" // 可以根據所有狀態計算
    );
    
    echo json_encode(array("status" => "success", "data" => $status));
} else {
    echo json_encode(array("status" => "error", "message" => "Pet not found"));
}
?>
