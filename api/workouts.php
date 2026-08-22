<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$VALID_USERS = ['antonio', 'mara'];

function dataFileFor($userId) {
    return __DIR__ . '/data/workouts_' . $userId . '.json';
}

if (!is_dir(__DIR__ . '/data')) {
    mkdir(__DIR__ . '/data', 0755, true);
}

// Older single-user installs kept everything in data/workouts.json.
// Migrate that file into Antonio's per-user file on first run so history isn't lost.
$legacyFile = __DIR__ . '/data/workouts.json';
if (file_exists($legacyFile) && !file_exists(dataFileFor('antonio'))) {
    rename($legacyFile, dataFileFor('antonio'));
}

function loadWorkouts($file) {
    if (!file_exists($file)) return [];
    $data = file_get_contents($file);
    return json_decode($data, true) ?? [];
}

function saveWorkouts($file, $workouts) {
    file_put_contents($file, json_encode($workouts, JSON_PRETTY_PRINT));
}

$method = $_SERVER['REQUEST_METHOD'];

function resolveUser($input, $VALID_USERS) {
    $userId = $input ?? 'antonio';
    if (!in_array($userId, $VALID_USERS, true)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid user']);
        exit;
    }
    return $userId;
}

if ($method === 'GET') {
    $userId = resolveUser($_GET['user'] ?? null, $VALID_USERS);
    $dataFile = dataFileFor($userId);
    $workouts = loadWorkouts($dataFile);
    usort($workouts, fn($a, $b) => strcmp($b['datetime'], $a['datetime']));
    echo json_encode($workouts);

} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid input']);
        exit;
    }
    $userId = resolveUser($input['user'] ?? null, $VALID_USERS);
    $dataFile = dataFileFor($userId);
    $workouts = loadWorkouts($dataFile);
    $rawDatetime = $input['datetime'] ?? null;
    $parsedDatetime = $rawDatetime ?: date('Y-m-d\TH:i');
    $workout = [
        'id' => uniqid('w_', true),
        'datetime' => $parsedDatetime,
        'type' => $input['type'],
        'details' => $input['details'] ?? [],
    ];
    $workouts[] = $workout;
    saveWorkouts($dataFile, $workouts);
    echo json_encode($workout);

} elseif ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing id']);
        exit;
    }
    $userId = resolveUser($_GET['user'] ?? null, $VALID_USERS);
    $dataFile = dataFileFor($userId);
    $workouts = loadWorkouts($dataFile);
    $workouts = array_values(array_filter($workouts, fn($w) => $w['id'] !== $id));
    saveWorkouts($dataFile, $workouts);
    echo json_encode(['ok' => true]);

} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
