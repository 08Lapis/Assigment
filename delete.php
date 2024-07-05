<?php
// Database configuration
$username = 'root';
$password = '';
$dbname = "testdb";

// Create connection
$conn = new mysqli("localhost", $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error . " for Delete.");
}

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['selectedId'])) {
    $id = $_POST['selectedId'];

    // Prepare and bind parameters
    $stmt = $conn->prepare("DELETE From customers WHERE ID = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(array("status" => "success"));
    } else {
        echo json_encode(array("status"=> "error","message"=> "Delete failed"));
    }
}

// Close connection
$conn->close(); // Reasons -> Resource management, Performance, Security