<?php
declare(strict_types=1);
// Fixed recipient and sender: this endpoint cannot act as an email relay.
ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
session_set_cookie_params(['secure' => true, 'httponly' => true, 'samesite' => 'Lax']);
session_start();

function respond(int $status, array $body): void {
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
function field(string $key, int $limit = 1000): string {
    $value = $_POST[$key] ?? '';
    if (!is_string($value) || strlen($value) > $limit || strpos($value, "\0") !== false) {
        respond(422, ['ok' => false, 'message' => 'Please check the length and format of your enquiry.']);
    }
    return trim($value);
}
$method = $_SERVER['REQUEST_METHOD'] ?? '';
if ($method === 'GET') {
    if (empty($_SESSION['enquiry_token'])) {
        $_SESSION['enquiry_token'] = bin2hex(random_bytes(32));
    }
    respond(200, ['token' => $_SESSION['enquiry_token']]);
}
if ($method !== 'POST') {
    header('Allow: GET, POST');
    respond(405, ['ok' => false, 'message' => 'Please use the enquiry form.']);
}
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && !in_array($origin, ['https://www.aurumbullion.co.uk', 'https://aurumbullion.co.uk'], true)) {
    respond(403, ['ok' => false, 'message' => 'Please submit the form from the Aurum website.']);
}
if (empty($_SESSION['enquiry_token']) || !hash_equals($_SESSION['enquiry_token'], field('token', 128))) {
    respond(403, ['ok' => false, 'message' => 'Your form session expired. Please try again.']);
}
if (field('website') !== '') {
    respond(422, ['ok' => false, 'message' => 'Your enquiry could not be sent. Please contact Aurum directly.']);
}
$kind = field('kind', 20);
if (!in_array($kind, ['contact', 'sell'], true)) {
    respond(422, ['ok' => false, 'message' => 'Please use a valid Aurum enquiry form.']);
}
$sell = $kind === 'sell';
$name = field($sell ? 'Name' : 'name', 150);
$email = field($sell ? 'Email' : 'email', 254);
$telephone = field($sell ? 'Telephone' : 'telephone', 80);
if ($name === '' || preg_match('/[\r\n]/', $name) || !filter_var($email, FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n]/', $email) || $telephone === '' || preg_match('/[\r\n]/', $telephone)) {
    respond(422, ['ok' => false, 'message' => 'Please enter your name, a valid email address and telephone number.']);
}
$details = ["Name: $name", "Email: $email", "Telephone: $telephone"];
if ($sell) {
    $coin = field('Coin_or_collection', 500);
    if ($coin === '' || field('consent', 10) !== 'yes') {
        respond(422, ['ok' => false, 'message' => 'Please describe your coin or collection and agree that Aurum may contact you about this enquiry.']);
    }
    $details[] = "Coin or collection: $coin";
    $details[] = 'Grade and certification: ' . field('Grade_and_certification', 500);
    $details[] = 'Quantity: ' . field('Quantity', 100);
    $details[] = 'Details: ' . field('Details', 6000);
} else {
    $details[] = 'Interest: ' . field('interest', 150);
    $details[] = 'Selected coins: ' . field('selection', 12000);
    $details[] = 'Message: ' . field('message', 6000);
}
// A private temporary file provides a shared limit across browser sessions.
$key = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . __DIR__);
$rate = @fopen(sys_get_temp_dir() . '/aurum-enquiry-' . $key, 'c+');
if (!$rate || !flock($rate, LOCK_EX)) {
    respond(503, ['ok' => false, 'message' => 'The enquiry service is temporarily unavailable. Please contact info@aurumbullion.co.uk.']);
}
$recent = json_decode(stream_get_contents($rate), true);
$recent = is_array($recent) ? array_values(array_filter($recent, function ($time) { return is_int($time) && $time > time() - 600; })) : [];
if (count($recent) >= 5) {
    flock($rate, LOCK_UN); fclose($rate);
    respond(429, ['ok' => false, 'message' => 'Please wait ten minutes before sending another enquiry, or contact info@aurumbullion.co.uk.']);
}
$recent[] = time();
rewind($rate); ftruncate($rate, 0); fwrite($rate, json_encode($recent));
flock($rate, LOCK_UN); fclose($rate);
$reference = strtoupper(bin2hex(random_bytes(5)));
$subject = ($sell ? 'Sell to Aurum enquiry' : 'Aurum website enquiry') . ' - ' . $reference;
$message = "Aurum website enquiry\nReference: $reference\nSubmitted: " . gmdate('Y-m-d H:i:s') . " UTC\n\n" . implode("\n\n", $details);
$headers = 'From: Aurum Website <info@aurumbullion.co.uk>' . "\r\n" .
    "Reply-To: $email\r\n" . 'MIME-Version: 1.0' . "\r\n" . 'Content-Type: text/plain; charset=UTF-8';
$sent = @mail('info@aurumbullion.co.uk', $subject, $message, $headers, '-finfo@aurumbullion.co.uk');
error_log('Aurum enquiry ' . $reference . ($sent ? ' accepted by mail service' : ' mail service rejected'));
if (!$sent) {
    respond(503, ['ok' => false, 'message' => 'Your enquiry could not be sent. Your details remain in the form. Please try again or email info@aurumbullion.co.uk.']);
}
respond(200, ['ok' => true, 'reference' => $reference]);
