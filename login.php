<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Database connection settings
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "music_recommendation";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Sanitize and retrieve user input
    $user = $conn->real_escape_string($_POST['username']);
    $pass = $_POST['password'];

    // Fetch user data from the database
    $sql = "SELECT * FROM users WHERE username = '$user'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // User exists
        $row = $result->fetch_assoc();
        if (password_verify($pass, $row['password'])) {
            // Password is correct
            echo "Login successful!";
        } else {
            // Password is incorrect
            echo "Invalid password.";
        }
    } else {
        // User does not exist
        echo "No user found with this username.";
    }

    $conn->close();
}
?>
