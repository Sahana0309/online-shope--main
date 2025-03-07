<?php
$servername = "localhost";
$username = "root"; 
$password = "";
$database = "your_database"; 

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST["email"];
    $password = $_POST["password"];

    $sql = "SELECT * FROM users WHERE email='$email'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if (password_verify($password, $row["password"])) {
            echo "<script>alert('Login Successful!'); window.location.href='welcome.html';</script>";
        } else {
            echo "<script>alert('Incorrect Password'); window.location.href='index.html';</script>";
        }
    } else {
        echo "<script>alert('Email not found'); window.location.href='index.html';</script>";
    }
}

$conn->close();
?>
