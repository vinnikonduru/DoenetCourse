<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];


// $assignmentId =  mysqli_real_escape_string($conn,$_REQUEST["assignmentId"]);
$branchId =  mysqli_real_escape_string($conn,$_REQUEST["branchId"]);
$contentId =  mysqli_real_escape_string($conn,$_REQUEST["contentId"]);

$sqlA = "SELECT
a.title AS assignment_title,
a.assignedDate AS assignedDate,
a.dueDate AS dueDate,
a.timeLimit AS timeLimit,
a.numberOfAttemptsAllowed AS numberOfAttemptsAllowed,
a.attemptAggregation AS attemptAggregation,
a.totalPointsOrPercent AS totalPointsOrPercent,
a.gradeCategory AS gradeCategory,
a.individualize AS individualize,
a.multipleAttempts AS multipleAttempts,
a.showSolution AS showSolution,
a.showFeedback AS showFeedback,
a.showHints AS showHints,
a.showCorrectness AS showCorrectness,
a.proctorMakesAvailable AS proctorMakesAvailable,
FROM assignment AS a
ON a.branchId = dc.branchId
WHERE a.branchId ='$branchId'
";
$result = $conn->query($sqlA);
$assignment_arr = array();

if ($result->num_rows > 0){

  $sql = "SELECT
  a.title AS assignment_title,
  a.assignedDate AS assignedDate,
  a.dueDate AS dueDate,
  a.timeLimit AS timeLimit,
  a.numberOfAttemptsAllowed AS numberOfAttemptsAllowed,
  a.attemptAggregation AS attemptAggregation,
  a.totalPointsOrPercent AS totalPointsOrPercent,
  a.gradeCategory AS gradeCategory,
  a.individualize AS individualize,
  a.multipleAttempts AS multipleAttempts,
  a.showSolution AS showSolution,
  a.showFeedback AS showFeedback,
  a.showHints AS showHints,
  a.showCorrectness AS showCorrectness,
  a.proctorMakesAvailable AS proctorMakesAvailable,
  a.contentId AS contentId,
  dc.isReleased AS isReleased,
  dc.isAssigned As isAssignment,
  dc.itemId AS itemId
  dc.branchId AS branchId
  FROM assignment AS a
  JOIN drive_content AS dc
  ON a.branchId = dc.branchId 
  WHERE a.driveId ='$driveId'
  ";
  
  // echo $sql;
  $result = $conn->query($sql);
  $assignment_arr = array();
  
  if ($result->num_rows > 0){
    while($row = $result->fetch_assoc()){
      $assignment = array(
          "assignment_title" => $row['assignment_title'],
          "assignedDate" => $row['assignedDate'],
          "dueDate" => $row['dueDate'],
          "timeLimit" => $row['timeLimit'],
          "numberOfAttemptsAllowed" => $row['numberOfAttemptsAllowed'],
          "attemptAggregation" => $row['attemptAggregation'],
          "totalPointsOrPercent" => $row['totalPointsOrPercent'],
          "gradeCategory" => $row['gradeCategory'],
          "individualize" => $row['individualize'] == '1' ? true : false,
          "multipleAttempts" => $row['multipleAttempts']  == '1' ? true : false,
          "showSolution" => $row['showSolution'] == '1' ? true : false,
          "showFeedback" => $row['showFeedback'] == '1' ? true : false,
          "showHints" => $row['showHints'] == '1' ? true : false,
          "showCorrectness" => $row['showCorrectness'] == '1' ? true : false,
          "proctorMakesAvailable" => $row['proctorMakesAvailable'] == '1' ? true : false,
          "isReleased" => $row['isReleased'],
          "isAssignment" => $row['isAssigned'],  
          "itemId" => $row['itemId'],
          "branchId"=>$row['branchId'],
          "contentId" => $row['contentId'],
  
  );
      array_push($assignment_arr,$assignment);
    } 
    $response_arr = array(
        "assignments" => $assignment_arr
    );  
  }
  
}
else{
  $sql = "SELECT
  a.title AS assignment_title,
  a.assignedDate AS assignedDate,
  a.dueDate AS dueDate,
  a.timeLimit AS timeLimit,
  a.numberOfAttemptsAllowed AS numberOfAttemptsAllowed,
  a.attemptAggregation AS attemptAggregation,
  a.totalPointsOrPercent AS totalPointsOrPercent,
  a.gradeCategory AS gradeCategory,
  a.individualize AS individualize,
  a.multipleAttempts AS multipleAttempts,
  a.showSolution AS showSolution,
  a.showFeedback AS showFeedback,
  a.showHints AS showHints,
  a.showCorrectness AS showCorrectness,
  a.proctorMakesAvailable AS proctorMakesAvailable,
  a.contentId AS contentId,
  a.branchId AS branchId,
  dc.isReleased AS isReleased,
  dc.branchId AS branchId,
  dc.isAssigned As isAssignment,
  dc.itemId AS itemId
  FROM assignment AS a
  JOIN drive_content AS dc
  ON a.branchId = dc.branchId
  WHERE a.branchId ='$branchId'
  ";
  
  // echo $sql;
  $result = $conn->query($sql);
  $assignment_arr = array();
  
  if ($result->num_rows > 0){
    while($row = $result->fetch_assoc()){
      $assignment = array(
          "assignment_title" => $row['assignment_title'],
          "assignedDate" => $row['assignedDate'],
          "dueDate" => $row['dueDate'],
          "timeLimit" => $row['timeLimit'],
          "numberOfAttemptsAllowed" => $row['numberOfAttemptsAllowed'],
          "attemptAggregation" => $row['attemptAggregation'],
          "totalPointsOrPercent" => $row['totalPointsOrPercent'],
          "gradeCategory" => $row['gradeCategory'],
          "individualize" => $row['individualize'] == '1' ? true : false,
          "multipleAttempts" => $row['multipleAttempts']  == '1' ? true : false,
          "showSolution" => $row['showSolution'] == '1' ? true : false,
          "showFeedback" => $row['showFeedback'] == '1' ? true : false,
          "showHints" => $row['showHints'] == '1' ? true : false,
          "showCorrectness" => $row['showCorrectness'] == '1' ? true : false,
          "proctorMakesAvailable" => $row['proctorMakesAvailable'] == '1' ? true : false,
          "isReleased" => $row['isReleased'],
          "isAssignment" => $row['isAssigned'],  
          "itemId" => $row['itemId'],
          "branchId" => $row['branchId'],
          "contentId" => $row['contentId'],
  
  );
      array_push($assignment_arr,$assignment);
    } 
    $response_arr = array(
        "assignments" => $assignment_arr
    );  
  }
  

}


// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();
?>