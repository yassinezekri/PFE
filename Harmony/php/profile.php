<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION['user_id'])) {
    header('Location: ../html/login.html');
    exit;
}

// Database connection
require 'db_connect.php';

// Get user information
$user_id = $_SESSION['user_id'];
$sql = "SELECT * FROM Users WHERE UserID = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

// Close the connection
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Profile</title>
    <link rel="stylesheet" href="../css/profile.css">
</head>
<body>
    <div class="container">
        <h1>Profile Page</h1>
        <div class="profile-info">
            <p><strong>Username:</strong> <?php echo htmlspecialchars($user['Username']); ?></p>
            <p><strong>Email:</strong> <?php echo htmlspecialchars($user['Email']); ?></p>
            <p><strong>Preferences:</strong></p>
            <ul>
                <?php
                $preferences = json_decode($user['Preferences'], true);
                if (is_array($preferences)) {
                    foreach ($preferences as $preference) {
                        echo '<li>' . htmlspecialchars($preference) . '</li>';
                    }
                } else {
                    echo '<li>No preferences set.</li>';
                }
                ?>
            </ul>
        </div>
        <div class="profile-actions">
            <a class="btn" href="edit_profile.php">Edit Profile</a>
            <a class="btn" href="logout.php">Logout</a>
        </div>
    </div>
</body>
</html>
