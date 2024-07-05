<?php
// Database configuration
$username = 'root';
$password = '';
$dbname = "testdb";

// Create connection
$conn = new mysqli("localhost", $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error . " for Edit.");
}

// Check if the request method is GET to fetch customer data
if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET['id'])) {
    $id = intval($_GET['id']);

    $sql = "SELECT * FROM customers WHERE ID = $id";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $customer = $result->fetch_assoc();
        echo json_encode($customer);
    } else {
        echo json_encode(["error" => "No customer found"]);
    }
}

// Check if the request method is POST to update customer data
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the JSON data sent from the JavaScript
    $data = json_decode(file_get_contents("php://input"), true); // If true, JSON object is decoded into associative array else into PHP object.

    // Set parameters
    $id = $data['ID'];
    $username = $data['UserName'];
    $nrc = $data['NRC'];
    $phone = $data['Phone'];
    $fruit = $data['Fruit'];
    $fruitPrice = $data['FruitPrice'];

    // For duplicate
    $stm = $conn->prepare("SELECT * FROM customers WHERE Name=? OR NRC=? OR Phone=?"); // 1. to protect SQL injection, 2. Performance (efficiency with repeated execution), 3. Easy to maintain (code clear and error reduce)
    $stm->bind_param("sss", $username, $nrc, $phone);
    $stm->execute();
    $result = $stm->get_result(); // get_result() returns executed result sets, and 'mysqli_result' object which can provides several methods and properties
    $row = $result->fetch_assoc(); // fetch_assoc() method fetches 'a result row' as an associative array

    if ($result->num_rows > 0 && $id != $row["ID"]) {
        echo json_encode(array("status" => "error", "message"=> "There is a duplicate"));
        $stm->close();
        die();
    }

    // Prepare and bind parameters
    $stmt = $conn->prepare("UPDATE customers SET Name=?, NRC=?, Phone=?, Fruit=?, Price=? WHERE ID=?");
    $stmt->bind_param("sssssi", $username, $nrc, $phone, $fruit, $fruitPrice, $id);
    // Execute the statement
    if ($stmt->execute()) {
        echo json_encode(array("status" => "success", "message"=> "Data edited successfully"));
    } else {
        echo json_encode(array("status"=> "error","message"=> $stmt->error));
    }
}

// Close connection
$conn->close();
