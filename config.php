<?php
// Pengaturan koneksi database (sesuaikan nama database dengan isi file ferrari.sql Anda)
$host = 'localhost';
$dbname = 'nama_database_anda'; 
$username = 'root';
$password = '';

function db() {
    global $host, $dbname, $username, $password;
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    return new PDO($dsn, $username, $password, $options);
}

function kirim_json(mixed $data, int $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data);
    exit;
}
