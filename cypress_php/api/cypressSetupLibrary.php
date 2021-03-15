<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

include "db_connection.php";

$_POST = json_decode(file_get_contents("php://input"),true);
$number_content = count($_POST["courseSeeds"]["driveId"]);

for ($i = 0; $i < $number_content; $i++){
  $driveId = mysqli_real_escape_string($conn,$_POST["courseSeeds"]["driveId"][$i]);
  $label = mysqli_real_escape_string($conn,$_POST["courseSeeds"]["label"][$i]);
  $type = mysqli_real_escape_string($conn,$_POST["courseSeeds"]["type"][$i]);
  $courseId = mysqli_real_escape_string($conn,$_POST["courseSeeds"]["courseId"][$i]);
  $isShared = mysqli_real_escape_string($conn,$_POST["courseSeeds"]["isShared"][$i]);
  $isDeleted = mysqli_real_escape_string($conn,$_POST["courseSeeds"]["isDeleted"][$i]);
  $sql = "
  INSERT INTO drive
  (driveId,label,driveType,courseId,isShared,isDeleted)
  VALUES
  ('$driveId','$label','$type','$courseId','$isShared','$isDeleted')
  ";

  echo $sql;
  $result = $conn->query($sql); 
  if ($result === TRUE) {
    // set response code - 200 OK
    http_response_code(200);
  }else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  $sql = "
INSERT INTO drive_user
(userId,driveId,canViewDrive,canDeleteDrive,canShareDrive,canAddItemsAndFolders,
canDeleteItemsAndFolders,canMoveItemsAndFolders,canRenameItemsAndFolders,
canPublishItemsAndFolders,canViewUnpublishItemsAndFolders,canChangeAllDriveSettings)
VALUES
('','$driveId','1','1','1','1','1','1','1','1','1','1')
";
$result = $conn->query($sql); 
  if ($result === TRUE) {
    // set response code - 200 OK
    http_response_code(200);
  }else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

}
?>