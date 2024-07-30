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
    $stmt = $conn->prepare('TRUNCATE TABLE customers');

    if ($stmt->execute()) {
        echo json_encode(array("status" => "success", "message"=> "All the data deleted successfully"));
        die();
    }
    echo json_encode(array("status"=> "error", "message"=> "All delete failed"));
}

$conn->close();


