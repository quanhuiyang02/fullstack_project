
<?php
// api/actions/play_action.php
include_once '../config/database.php';
include_once '../models/Pet.php';

$database = new Database();
$db = $database->getConnection();
$pet = new Pet($db);

$user_id = $_POST['user_id'] ?? $_GET['user_id'] ?? 1;

if($pet->getPetByUserId($user_id)) {
    if(floatval($pet->energy) >= 20) {
        $pet->happiness = min(100, floatval($pet->happiness) + 20);
        $pet->energy = max(0, floatval($pet->energy) - 15);
        $pet->exp += 15;
        $earned_coins = rand(5, 15);
        $pet->coins += $earned_coins;
        
        if($pet->exp >= ($pet->level * 100)) {
            $pet->level++;
            $pet->coins += 50;
        }
        
        $pet->updatePet();
        $pet->logAction('play', array('happiness_gain' => 20, 'energy_cost' => 15, 'coins_earned' => $earned_coins));
        
        echo json_encode(array("status" => "success", "message" => "Played with pet", "coins_earned" => $earned_coins));
    } else {
        echo json_encode(array("status" => "error", "message" => "Pet is too tired"));
    }
} else {
    echo json_encode(array("status" => "error", "message" => "Pet not found"));
}
?>