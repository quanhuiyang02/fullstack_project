<?php
// api/pet_actions.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

include_once '../config/database.php';
include_once '../models/Pet.php';
include_once '../models/Inventory.php';

$database = new Database();
$db = $database->getConnection();

$pet = new Pet($db);
$inventory = new Inventory($db);

$action = $_GET['action'] ?? '';
$user_id = $_POST['user_id'] ?? $_GET['user_id'] ?? 1; // 模擬用戶ID

switch($action) {
    case 'get_pet':
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
        break;

    case 'feed':
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
        }
        break;

    case 'play':
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
        }
        break;

    case 'clean':
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
        }
        break;

    case 'rest':
        if($pet->getPetByUserId($user_id)) {
            $pet->energy = min(100, floatval($pet->energy) + 40);
            $pet->health = min(100, floatval($pet->health) + 10);
            
            $pet->updatePet();
            $pet->logAction('rest', array('energy_gain' => 40, 'health_gain' => 10));
            
            echo json_encode(array("status" => "success", "message" => "Pet rested successfully"));
        }
        break;

    case 'get_inventory':
        $user_inventory = $inventory->getUserInventory($user_id);
        echo json_encode(array("status" => "success", "data" => $user_inventory));
        break;

    default:
        echo json_encode(array("status" => "error", "message" => "Invalid action"));
        break;
}
?>