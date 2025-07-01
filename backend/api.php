<?php
// config/database.php
class Database {
    private $host = "localhost";
    private $db_name = "virtual_pet_game";
    private $username = "root";
    private $password = "";
    private $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, 
                                $this->username, $this->password);
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
        return $this->conn;
    }
}

// models/Pet.php
class Pet {
    private $conn;
    private $table_name = "pets";

    public $id;
    public $user_id;
    public $name;
    public $type;
    public $level;
    public $exp;
    public $health;
    public $hunger;
    public $happiness;
    public $energy;
    public $cleanliness;
    public $coins;
    public $total_play_time;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getPetByUserId($user_id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE user_id = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $user_id);
        $stmt->execute();
        
        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->id = $row['id'];
            $this->user_id = $row['user_id'];
            $this->name = $row['name'];
            $this->type = $row['type'];
            $this->level = $row['level'];
            $this->exp = $row['exp'];
            $this->health = $row['health'];
            $this->hunger = $row['hunger'];
            $this->happiness = $row['happiness'];
            $this->energy = $row['energy'];
            $this->cleanliness = $row['cleanliness'];
            $this->coins = $row['coins'];
            $this->total_play_time = $row['total_play_time'];
            return true;
        }
        return false;
    }

    public function updatePet() {
        $query = "UPDATE " . $this->table_name . " 
                 SET level = ?, exp = ?, health = ?, hunger = ?, happiness = ?, 
                     energy = ?, cleanliness = ?, coins = ?, total_play_time = ?,
                     last_updated = CURRENT_TIMESTAMP
                 WHERE id = ?";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(1, $this->level);
        $stmt->bindParam(2, $this->exp);
        $stmt->bindParam(3, $this->health);
        $stmt->bindParam(4, $this->hunger);
        $stmt->bindParam(5, $this->happiness);
        $stmt->bindParam(6, $this->energy);
        $stmt->bindParam(7, $this->cleanliness);
        $stmt->bindParam(8, $this->coins);
        $stmt->bindParam(9, $this->total_play_time);
        $stmt->bindParam(10, $this->id);
        
        return $stmt->execute();
    }

    public function createPet() {
        $query = "INSERT INTO " . $this->table_name . " 
                 (user_id, name, type, level, exp, health, hunger, happiness, energy, cleanliness, coins)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(1, $this->user_id);
        $stmt->bindParam(2, $this->name);
        $stmt->bindParam(3, $this->type);
        $stmt->bindParam(4, $this->level);
        $stmt->bindParam(5, $this->exp);
        $stmt->bindParam(6, $this->health);
        $stmt->bindParam(7, $this->hunger);
        $stmt->bindParam(8, $this->happiness);
        $stmt->bindParam(9, $this->energy);
        $stmt->bindParam(10, $this->cleanliness);
        $stmt->bindParam(11, $this->coins);
        
        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    public function logAction($action_type, $details = null) {
        $query = "INSERT INTO game_logs (user_id, pet_id, action_type, details) VALUES (?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        
        $details_json = $details ? json_encode($details) : null;
        
        $stmt->bindParam(1, $this->user_id);
        $stmt->bindParam(2, $this->id);
        $stmt->bindParam(3, $action_type);
        $stmt->bindParam(4, $details_json);
        
        return $stmt->execute();
    }
}

// models/Inventory.php
class Inventory {
    private $conn;
    private $table_name = "user_inventory";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getUserInventory($user_id) {
        $query = "SELECT ui.*, i.name, i.type, i.icon 
                 FROM " . $this->table_name . " ui
                 JOIN items i ON ui.item_id = i.id
                 WHERE ui.user_id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $user_id);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updateItemQuantity($user_id, $item_id, $quantity_change) {
        $query = "INSERT INTO " . $this->table_name . " (user_id, item_id, quantity)
                 VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE quantity = quantity + ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $user_id);
        $stmt->bindParam(2, $item_id);
        $stmt->bindParam(3, $quantity_change);
        $stmt->bindParam(4, $quantity_change);
        
        return $stmt->execute();
    }

    public function getItemQuantity($user_id, $item_id) {
        $query = "SELECT quantity FROM " . $this->table_name . " 
                 WHERE user_id = ? AND item_id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $user_id);
        $stmt->bindParam(2, $item_id);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? $row['quantity'] : 0;
    }
}

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