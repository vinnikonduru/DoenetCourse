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

$assignmentId = mysqli_real_escape_string($conn,$_POST["assignmentId"]);
$title = mysqli_real_escape_string($conn,$_POST["title"]);
$dueDate = mysqli_real_escape_string($conn,$_POST["dueDate"]);
if ($dueDate == ''){ $dueDate = '1-1-1 01:01:01';}
$assignedDate = mysqli_real_escape_string($conn,$_POST["assignedDate"]);
if ($assignedDate == ''){ $assignedDate = '1-1-1 01:01:01';}
$timeLimit = mysqli_real_escape_string($conn,$_POST["timeLimit"]);
$numberOfAttemptsAllowed = mysqli_real_escape_string($conn,$_POST["numberOfAttemptsAllowed"]);
$attemptAggregation = mysqli_real_escape_string($conn,$_POST["attemptAggregation"]);
$totalPointsOrPercent = mysqli_real_escape_string($conn,$_POST["totalPointsOrPercent"]);
$gradeCategory = mysqli_real_escape_string($conn,$_POST["gradeCategory"]);
$individualize = mysqli_real_escape_string($conn,$_POST["individualize"]);
$multipleAttempts = mysqli_real_escape_string($conn,$_POST["multipleAttempts"]);
$showSolution = mysqli_real_escape_string($conn,$_POST["showSolution"]);
$showFeedback = mysqli_real_escape_string($conn,$_POST["showFeedback"]);
$showHints = mysqli_real_escape_string($conn,$_POST["showHints"]);
$showCorrectness = mysqli_real_escape_string($conn,$_POST["showCorrectness"]);
$proctorMakesAvailable = mysqli_real_escape_string($conn,$_POST["proctorMakesAvailable"]);

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
proctorMakesAvailable = '$proctorMakesAvailable'
WHERE assignmentId = '$assignmentId'
";

$result = $conn->query($sql);

// set response code - 200 OK
http_response_code(200);

// make it json format
// echo json_encode($response_arr);

$conn->close();
