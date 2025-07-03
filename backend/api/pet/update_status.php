<?php
// api/pet/update_stats.php
include_once '../config/database.php';
include_once '../models/Pet.php';

$database = new Database();
$db = $database->getConnection();
$pet = new Pet($db);

$user_id = $_POST['user_id'] ?? $_GET['user_id'] ?? 1;
$stats = $_POST['stats'] ?? array();

if($pet->getPetByUserId($user_id)) {
    // 更新統計數據
    foreach($stats as $stat => $value) {
        if(property_exists($pet, $stat)) {
            $pet->$stat = $value;
        }
    }
    
    if($pet->updatePet()) {
        echo json_encode(array("status" => "success", "message" => "Stats updated successfully"));
    } else {
        echo json_encode(array("status" => "error", "message" => "Failed to update stats"));
    }
} else {
    echo json_encode(array("status" => "error", "message" => "Pet not found"));
}
?>