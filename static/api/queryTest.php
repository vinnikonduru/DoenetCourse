<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

// $driveId = mysqli_real_escape_string($conn,$_REQUEST["driveId"]);
// $parentId = mysqli_real_escape_string($conn,$_REQUEST["parentId"]);
// $itemId = mysqli_real_escape_string($conn,$_REQUEST["itemId"]);
$userInput = json_decode($_REQUEST["userInput"],true);

$label = $userInput["label"];
$id = $userInput["id"];
$success = TRUE;
$results_arr = array();
$item_info_arr= array();
$item_arr =array();

if($id){
  $sql="
  INSERT INTO query_test
  (id,driveId, parentId, itemId,label,creationDate, isDeleted)
  VALUES
  ('$id',NULL, NULL, NULL , '$label',NOW(), '0')";
  // $sql="SELECT id,driveId, parentId, itemId,label,creationDate, isDeleted
  // FROM query_test";
  $result = $conn->query($sql); 
  $response_arr = array();

  echo $sql;

}

else {
  $sql="SELECT id,driveId, parentId, itemId,label,creationDate, isDeleted
  FROM query_test";

  $result = $conn->query($sql); 
  $response_arr = array();
}


if($result->num_rows ){
  while($row = $result->fetch_assoc()){ 
    $item = array(
      "id"=>$row['id'],
      "label"=>$row['label'],
      "driveId"=>$row['driveId'],
      "parentId"=>$row['parentId'],
      "itemId"=>$row['itemId'],
      "creationDate"=>$row['creationDate'],
    );

    array_push($item_arr,$item);
  }
}

$response_arr = array(
  "success"=>$success,
  "records"=> $item_arr,
  "item_info" => $item_info_arr
  );

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>