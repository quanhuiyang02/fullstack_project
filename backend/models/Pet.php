<?php
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