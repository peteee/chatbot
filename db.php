<?php
    //This will show errors in the browser if there are some
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    //Connection Information
    $host = "localhost";  // always this value
    $user = "user";    // your student id
    $pass = "passw";      // your password
    $db = "chat_bot_db";    // your database

    // Connect to the database
    $conn = mysqli_connect($host, $user, $pass, $db);
    
    //printf("Initial character set: %s\n", $conn->character_set_name());
    /* change character set to utf8mb4 */
    $conn->set_charset("utf8mb4");

    if ($conn->connect_error) {
        die('Connect Error (' . $conn->connect_errno . ') ' . $conn->connect_error);
    }
    
?>
