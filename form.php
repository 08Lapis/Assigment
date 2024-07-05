<?php
// Database configuration
$username = 'root';
$password = '';
$dbname = "testdb";

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
        Name VARCHAR(50) NOT NULL,
        NRC  VARCHAR(20),
        Phone VARCHAR(15),
        Fruit VARCHAR(20),
        Price VARCHAR(10)
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
    $username = $data['UserName'];
    $nrc = $data['NRC'];
    $phone = $data['Phone'];
    $fruit = $data['Fruit'];
    $fruitPrice = $data['FruitPrice'];

    // For duplicate
    $stm = $conn->prepare("SELECT * FROM customers WHERE Name=? OR NRC=? OR Phone=?"); // 1. to protect SQL injection, 2. Performance (efficiency with repeated execution), 3. Easy to maintain (code clear and error reduce)
    $stm->bind_param("sss", $username, $nrc, $phone);
    $stm->execute();
    $result = $stm->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(array("status" => "error", "message"=> "There is a duplicate"));
        $stm->close();
        die();
    }

    // For reset auto increment id when all the rows are deleted else the id will start from the end of the last highest used id
    if ($result->num_rows < 1) {
        $conn->query("ALTER TABLE customers AUTO_INCREMENT = 1");
    }

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