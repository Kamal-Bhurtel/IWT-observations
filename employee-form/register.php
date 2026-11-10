<?php
require_once "config.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $full_name   = trim($_POST["full_name"]);
    $email       = trim($_POST["email"]);
    $password    = $_POST["password"];
    $employee_id = trim($_POST["employee_id"]);
    $department  = trim($_POST["department"] ?? "");
    $phone       = trim($_POST["phone"] ?? "");

    if (empty($full_name) || empty($email) || empty($password) || empty($employee_id)) {
        die("Please fill all required fields.");
    }

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    try {
        $stmt = $pdo->prepare("INSERT INTO employees (full_name, email, password, employee_id, department, phone) 
                               VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$full_name, $email, $hashed_password, $employee_id, $department, $phone]);

        echo "<script>
                alert('Registration successful! You can now sign in.');
                window.location.href = 'index.html';
              </script>";
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            echo "<script>alert('Email or Employee ID already exists!'); window.history.back();</script>";
        } else {
            echo "Error: " . $e->getMessage();
        }
    }
}
?>