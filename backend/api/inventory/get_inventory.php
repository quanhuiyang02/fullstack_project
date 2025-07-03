<?php
// api/inventory/get_inventory.php
include_once '../config/database.php';
include_once '../models/Inventory.php';

$database = new Database();
$db = $database->getConnection();
$inventory = new Inventory($db);

$user_id = $_POST['user_id'] ?? $_GET['user_id'] ?? 1;

$user_inventory = $inventory->getUserInventory($user_id);
echo json_encode(array("status" => "success", "data" => $user_inventory));
?>