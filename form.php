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
    die("Connection failed: " . $conn->connect_error . " for Form.");
}

// Check if the table exists
$exist = $conn->query("SHOW TABLES LIKE 'customers'")->num_rows > 0;

if (!$exist) {
    // Create table if it doesn't exist
    $sql = "CREATE TABLE customers(
        ID INT(6) AUTO_INCREMENT PRIMARY KEY,
        Name VARCHAR(30) NOT NULL,
        NRC  VARCHAR(20) NOT NULL,
        Phone VARCHAR(11) NOT NULL,
        Fruit VARCHAR(20) NOT NULL,
        Price VARCHAR(10) NOT NULL
    )";

    if ($conn->query($sql) === TRUE) {
        echo "Table Customers created successfully";
    } else {
        echo "Error creating table: " . $conn->error;
    }
} 

// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the JSON data sent from the JavaScript
    $data = json_decode(file_get_contents("php://input"), true);

    // Set parameters
    $username = $data['name'];
    $nrc = $data['nrc'];
    $phone = $data['phone'];
    $fruit = $data['fruit'];
    $fruitPrice = $data['price'];

    $duplicateMessage = [];

    // For duplicate Name
    $stm1 = $conn->prepare("SELECT * FROM customers WHERE Name=?"); // 1. to protect SQL injection, 2. Performance (efficiency with repeated execution), 3. Easy to maintain (code clear and error reduce)
    $stm1->bind_param("s", $username);
    $stm1->execute();
    $result = $stm1->get_result();

    if ($result->num_rows > 0 ) { 
        $duplicateMessage[] = "This name already exists";
    }
    $stm1->close();

    // For duplicate NRC
    $stm2 = $conn->prepare("SELECT * FROM customers WHERE NRC=?"); // 1. to protect SQL injection, 2. Performance (efficiency with repeated execution), 3. Easy to maintain (code clear and error reduce)
    $stm2->bind_param("s", $nrc);
    $stm2->execute();
    $result = $stm2->get_result();

    if ($result->num_rows > 0 ) { 
        $duplicateMessage[] = "This NRC already exists";
    }
    $stm2->close();

    // For duplicate Phone
    $stm3 = $conn->prepare("SELECT * FROM customers WHERE Phone=?"); // 1. to protect SQL injection, 2. Performance (efficiency with repeated execution), 3. Easy to maintain (code clear and error reduce)
    $stm3->bind_param("s", $phone);
    $stm3->execute();
    $result = $stm3->get_result();

    if ($result->num_rows > 0 ) { 
        $duplicateMessage[] = "This phone number already exists";
    }
    $stm3->close();

    if (!empty($duplicateMessage)) {
        echo json_encode(array("status"=> "error","duplicateMessage"=> $duplicateMessage));
        die();
    }

    // For reset auto increment id when all the rows are deleted else the id will start from the end of the last highest used id
    // if ($result->num_rows < 1) {
    //     $conn->query("ALTER TABLE customers AUTO_INCREMENT = 1");
    // }

    // For create
    $stmt = $conn->prepare("INSERT INTO `customers`(`Name`, `NRC`, `Phone`, `Fruit`, `Price`) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $username, $nrc, $phone, $fruit, $fruitPrice);

        // Execute the statement
        if ($stmt->execute()) {
            echo json_encode(array("status" => "success", "message"=> "Data saved successfully"));  
        $stmt->close();
        } else {
            echo json_encode(array("status" => "error", "message" => $stmt->error));
        }
    }
// Close connection
$conn->close();


// For ID reset in database
// ALTER TABLE customers AUTO_INCREMENT = 1