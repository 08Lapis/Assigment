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
    die("Connection failed: " . $conn->connect_error . " for Table.");
}

// Check if the request method is GET
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    // Query to fetch all customers
    $sql = "SELECT * FROM customers";
    $result = $conn->query($sql);

    $customers = array(); 

    if ($result->num_rows > 0) {
        // Fetch data and store in an array
        while ($row = $result->fetch_assoc()) { // to store only one associative array
            $customers[] = $row; // to store multiple associative array
        }
    } 

    echo json_encode($customers);

}

// Close connection
$conn->close();
