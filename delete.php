<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

// Database configuration
$username = 'root';
$password = '';
$dbname = "asn";

// Create connection
$conn = new mysqli("localhost", $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error . " for Delete.");
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['dId'];

    $preparedId = array_map('intval', $id);
    $idList = implode(',' , $preparedId);

    $sql = "DELETE FROM customers WHERE ID IN ($idList)";
    

    if ($conn->query($sql) === TRUE) {
        echo json_encode(array("status" => "success", "message"=> "Data deleted successfully"));
    } else {
        echo json_encode(array("status"=> "error", "message"=> "Delete failed"));
    }
}

// Close connection
$conn->close(); // Reasons -> Resource management, Performance, Security

