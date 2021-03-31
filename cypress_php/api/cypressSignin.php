<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';

$sql="SELECT * FROM user_device WHERE email='devuser@example.com' ORDER BY id DESC LIMIT 1";


$result = $conn->query($sql);
$row = $result->fetch_assoc();
$signInCode = $row["signInCode"];
$deviceName = $row["deviceName"];


  $response_arr = array(
    "deviceName" => $deviceName,
    "signInCode"=>$signInCode,
    );
// http_response_code(200);
echo json_encode($response_arr);
 $conn->close();
?>