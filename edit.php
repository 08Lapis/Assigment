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
    die("Connection failed: " . $conn->connect_error . " for Edit.");
}

// Check if the request method is GET to fetch customer data
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $id = intval($_GET['id']);

    $sql = "SELECT * FROM customers WHERE ID = $id";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $customer = $result->fetch_assoc();
        echo json_encode($customer);
    } else {
        echo json_encode(["error" => "There is no such ID in the record"]);
    }
}

// Check if the request method is POST to update customer data
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Get the JSON data sent from the JavaScript
    $data = json_decode(file_get_contents("php://input"), true); // If true, JSON object is decoded into associative array else into PHP object.

    // Set parameters
    $id = $data['id'];
    $username = $data['name'];
    $nrc = $data['nrc'];
    $phone = $data['phone'];
    $fruit = $data['fruit'];
    $fruitPrice = $data['price'];

    $duplicateMessage = [];

    // For Prevent Edit of the same data
    $stmI = $conn->prepare("SELECT * FROM customers WHERE Name=? AND NRC=? AND Phone=? AND ID = ?");
    $stmI->bind_param("sssi", $username, $nrc, $phone, $id);
    $stmI->execute();
    $result = $stmI->get_result(); 

    if ($result->num_rows > 0) { 
        echo json_encode(array("status"=> "errorPSE","message"=> "You haven't updated any data yet under ID:$id"));
        die();
    }
    $stmI->close();
    
    // For duplicate Name
    $stm1 = $conn->prepare("SELECT * FROM customers WHERE Name=? AND ID != ?"); // 1. to protect SQL injection, 2. Performance (efficiency with repeated execution), 3. Easy to maintain (code clear and error reduce)
    $stm1->bind_param("si", $username, $id);
    $stm1->execute();
    $result = $stm1->get_result(); // get_result() returns executed result sets, and 'mysqli_result' object which can provides several methods and properties
    // $row = $result->fetch_assoc(); // fetch_assoc() method fetches 'a result row' as an associative array
    
    if ($result->num_rows > 0 ) { 
        $duplicateMessage[] = "This name already exists";
    }
    $stm1->close();

    // For duplicate NRC
    $stm2 = $conn->prepare("SELECT * FROM customers WHERE NRC=? AND ID != ?"); 
    $stm2->bind_param("si", $nrc, $id);
    $stm2->execute();
    $result = $stm2->get_result(); 

    if ($result->num_rows > 0 ) { 
        $duplicateMessage[] = "This NRC already exists";
    }
    $stm2->close();

    // For duplicate Phone
    $stm3 = $conn->prepare("SELECT * FROM customers WHERE Phone=? AND ID != ?");
    $stm3->bind_param("si", $phone, $id);
    $stm3->execute();
    $result = $stm3->get_result(); 

    if ($result->num_rows > 0) { 
        $duplicateMessage[] = "This phone number already exists";
    }
    $stm3->close();

    if (!empty($duplicateMessage)) {
        echo json_encode(array("status"=> "error","duplicateMessage"=> $duplicateMessage));
        die();
    }

    // Update
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

// echo json_encode(array("status" => "error", "message"=> "SELECT * FROM customers WHERE (Name='$username' OR NRC='$nrc' OR Phone='$phone') AND ID != $id" , "num" => $result->num_rows));
    // die();


    