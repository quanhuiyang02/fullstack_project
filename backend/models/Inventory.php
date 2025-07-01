<?php
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