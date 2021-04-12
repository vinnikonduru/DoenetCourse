<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

//TODO: Make sure of instructor
$_POST = json_decode(file_get_contents("php://input"),true);
$branchId = mysqli_real_escape_string($conn,$_POST["branchId"]);

$assignmentId = mysqli_real_escape_string($conn,$_POST["assignmentId"]);
$title = mysqli_real_escape_string($conn,$_POST["title"]);
if($title == ''){$title = 'Untitled Assignment';}
$dueDate = mysqli_real_escape_string($conn,$_POST["dueDate"]);
if ($dueDate == ''){ $dueDate = '1-1-1 01:01:01';}
$assignedDate = mysqli_real_escape_string($conn,$_POST["assignedDate"]);
if ($assignedDate == ''){ $assignedDate = '1-1-1 01:01:01';}
$timeLimit = mysqli_real_escape_string($conn,$_POST["timeLimit"]);
if ($timeLimit == ''){ $timeLimit = '01:01:01';}
$numberOfAttemptsAllowed = mysqli_real_escape_string($conn,$_POST["numberOfAttemptsAllowed"]);
if ($numberOfAttemptsAllowed == ''){ $numberOfAttemptsAllowed = '0';}
$attemptAggregation = mysqli_real_escape_string($conn,$_POST["attemptAggregation"]);
if ($attemptAggregation == ''){ $attemptAggregation = '0';}
$totalPointsOrPercent = mysqli_real_escape_string($conn,$_POST["totalPointsOrPercent"]);
if ($totalPointsOrPercent == ''){ $totalPointsOrPercent = '0';}
$gradeCategory = mysqli_real_escape_string($conn,$_POST["gradeCategory"]);
if ($gradeCategory == ''){ $gradeCategory = '0';}
$individualize = mysqli_real_escape_string($conn,$_POST["individualize"]);
if ($individualize == ''){ $individualize = '0';}
$multipleAttempts = mysqli_real_escape_string($conn,$_POST["multipleAttempts"]);
if ($multipleAttempts == ''){ $multipleAttempts = '0';}
$showSolution = mysqli_real_escape_string($conn,$_POST["showSolution"]);
if ($showSolution == ''){ $showSolution = '1';}
$showFeedback = mysqli_real_escape_string($conn,$_POST["showFeedback"]);
if ($showFeedback == ''){ $showFeedback = '1';}
$showHints = mysqli_real_escape_string($conn,$_POST["showHints"]);
if ($showHints == ''){ $showHints = '1';}
$showCorrectness = mysqli_real_escape_string($conn,$_POST["showCorrectness"]);
if ($showCorrectness == ''){ $showCorrectness = '1';}
$proctorMakesAvailable = mysqli_real_escape_string($conn,$_POST["proctorMakesAvailable"]);
if ($proctorMakesAvailable == ''){ $proctorMakesAvailable = '0';}
$makeContent =  mysqli_real_escape_string($conn,$_POST["makeContent"]);
$itemId =  mysqli_real_escape_string($conn,$_POST["itemId"]);
$isPublished =  mysqli_real_escape_string($conn,$_POST["assignment_isPublished"]);
$courseId =  mysqli_real_escape_string($conn,$_POST["courseId"]);
$role =  mysqli_real_escape_string($conn,$_POST["role"]);
$sqlAssigmentCheck = "SELECT * FROM assignment where assignmentId='$assignmentId';";
$resultCheck = $conn->query($sqlAssigmentCheck); 
$responseAssignment = 0;

if ($resultCheck->num_rows > 0){
  $responseAssignment = 1;
    
}
// if assignment is published already update row
if($responseAssignment === 1)
{
  $sql = "UPDATE assignment SET
title = '$title',
assignedDate = '$assignedDate',
dueDate = '$dueDate',
timeLimit = '$timeLimit',
numberOfAttemptsAllowed = '$numberOfAttemptsAllowed',
attemptAggregation = '$attemptAggregation',
totalPointsOrPercent = '$totalPointsOrPercent',
gradeCategory = '$gradeCategory',
individualize = '$individualize',
multipleAttempts = '$multipleAttempts',
showSolution = '$showSolution',
showFeedback = '$showFeedback',
showHints = '$showHints',
showCorrectness = '$showCorrectness',
proctorMakesAvailable = '$proctorMakesAvailable',
courseId='$courseId',
isPublished = '$isPublished'
WHERE assignmentId = '$assignmentId'
";

$result = $conn->query($sql);
}
else
{
  $sql="
  INSERT INTO assignment
  (assignmentId,
  courseId,
  title,
  dueDate,
  assignedDate,
  timeLimit,
  numberOfAttemptsAllowed,
  attemptAggregation,
  totalPointsOrPercent,
  gradeCategory,
  individualize,
  multipleAttempts,
  showSolution,
  showFeedback,
  showHints,
  showCorrectness,
  proctorMakesAvailable,
  isPublished,
  sourceBranchId)
  VALUES
  ('$assignmentId',
  '$courseId',
  '$title',
  '$dueDate',
  '$assignedDate',
  '$timeLimit',
  '$numberOfAttemptsAllowed',
  '$attemptAggregation',
  '$totalPointsOrPercent',
  '$gradeCategory',
  '$individualize',
  '$multipleAttempts',
  '$showSolution',
  '$showFeedback',
  '$showHints',
  '$showCorrectness',
  '$proctorMakesAvailable',
  '$isPublished',
  '$branchId')
  ";
  
  $result = $conn->query($sql); 
}
// echo $sql;
// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();
