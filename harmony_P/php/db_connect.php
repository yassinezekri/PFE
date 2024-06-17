<?php
$servername = "localhost";
$dbusername = "harmony_user";
$password = "enissay2003";
$dbname = "harmony";

// Create connection
$conn = new mysqli($servername, $dbusername, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

?>
