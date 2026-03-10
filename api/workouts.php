<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$dataFile = __DIR__ . '/data/workouts.json';

if (!is_dir(__DIR__ . '/data')) {
    mkdir(__DIR__ . '/data', 0755, true);
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

if ($method === 'GET') {
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
    $workouts = loadWorkouts($dataFile);
    $workout = [
        'id' => uniqid('w_', true),
        'datetime' => date('c'),
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
    $workouts = loadWorkouts($dataFile);
    $workouts = array_values(array_filter($workouts, fn($w) => $w['id'] !== $id));
    saveWorkouts($dataFile, $workouts);
    echo json_encode(['ok' => true]);

} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
