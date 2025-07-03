<?php
// api/shop/get_items.php
include_once '../config/database.php';

$shop_items = array(
    array(
        "id" => 1,
        "name" => "Pet Food",
        "description" => "Increases hunger by 25 and happiness by 10",
        "price" => 10,
        "type" => "consumable",
        "effects" => array("hunger" => 25, "happiness" => 10)
    ),
    array(
        "id" => 2,
        "name" => "Soap",
        "description" => "Increases cleanliness by 30 and happiness by 5",
        "price" => 15,
        "type" => "consumable",
        "effects" => array("cleanliness" => 30, "happiness" => 5)
    ),
    array(
        "id" => 3,
        "name" => "Toy",
        "description" => "Increases happiness by 30",
        "price" => 20,
        "type" => "consumable",
        "effects" => array("happiness" => 30)
    )
);

echo json_encode(array("status" => "success", "data" => $shop_items));
?>