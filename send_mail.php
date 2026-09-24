<?php

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

function respond($statusCode, $success)
{
    http_response_code($statusCode);
    echo json_encode(['success' => $success]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, false);
}

$name = trim((string) ($_POST['name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));
$consent = (string) ($_POST['consent'] ?? '');
$website = trim((string) ($_POST['website'] ?? ''));

if ($website !== '') {
    respond(200, true);
}

if (
    $name === '' ||
    $email === '' ||
    $message === '' ||
    strlen($name) > 100 ||
    strlen($email) > 254 ||
    strlen($message) > 5000 ||
    $consent !== 'on' ||
    filter_var($email, FILTER_VALIDATE_EMAIL) === false
) {
    respond(422, false);
}

$safeName = preg_replace('/[\r\n]+/', ' ', $name);
$recipient = 'ml-boehm@gmx.de';
$subject = 'Neue Nachricht ueber das Portfolio';
$mailBody = "Name: {$safeName}\n";
$mailBody .= "E-Mail: {$email}\n\n";
$mailBody .= "Nachricht:\n{$message}\n";
$headers = implode("\r\n", [
    'Content-Type: text/plain; charset=UTF-8',
    "Reply-To: {$email}",
]);

if (!mail($recipient, $subject, $mailBody, $headers)) {
    respond(500, false);
}

respond(200, true);
