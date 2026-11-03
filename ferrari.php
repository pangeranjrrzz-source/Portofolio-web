    <?php
// POST: menyimpan pesanan. Total dihitung di SERVER, tidak percaya angka dari browser.
require __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    kirim_json(['error' => 'Gunakan metode POST'], 405);
}

// Baca isi JSON yang dikirim JavaScript
$in = json_decode(file_get_contents('php://input'), true);
if (!is_array($in)) {
    kirim_json(['error' => 'Data tidak valid'], 400);
}

// Validasi input
$nama     = trim((string)($in['nama'] ?? ''));
$mobilId  = filter_var($in['mobil_id'] ?? null, FILTER_VALIDATE_INT);
$warnaId  = filter_var($in['warna_id'] ?? null, FILTER_VALIDATE_INT);
$velgId   = filter_var($in['velg_id']  ?? null, FILTER_VALIDATE_INT);

if ($nama === '' || mb_strlen($nama) > 60) {
    kirim_json(['error' => 'Nama wajib diisi (maksimal 60 karakter)'], 422);
}
if (!$mobilId || !$warnaId || !$velgId) { 
    kirim_json(['error' => 'Pilihan mobil, warna, dan velg tidak lengkap'], 422);
}

try {
    $pdo = db();

    // Ambil harga asli dari database (prepared statement mencegah SQL injection)
    $q = $pdo->prepare('SELECT harga FROM mobil WHERE id = ?');
    $q->execute([$mobilId]);
    $harga = $q->fetchColumn();

    $q = $pdo->prepare('SELECT tambahan FROM warna WHERE id = ?');
    $q->execute([$warnaId]);
    $tWarna = $q->fetchColumn();

    $q = $pdo->prepare('SELECT tambahan FROM velg WHERE id = ?');
    $q->execute([$velgId]);
    $tVelg = $q->fetchColumn();

    if ($harga === false || $tWarna === false || $tVelg === false) {
        kirim_json(['error' => 'Pilihan tidak ditemukan'], 404);
    }

    $total = (int)$harga + (int)$tWarna + (int)$tVelg;

    $ins = $pdo->prepare(
        'INSERT INTO pesanan (nama_pemesan, mobil_id, warna_id, velg_id, total) VALUES (?, ?, ?, ?, ?)'
    );
    $ins->execute([$nama, $mobilId, $warnaId, $velgId, $total]);

    kirim_json(['ok' => true, 'id' => (int)$pdo->lastInsertId(), 'total' => $total], 201);
} catch (PDOException $e) {
    kirim_json(['error' => 'Gagal menyimpan pesanan'], 500);
}
header('Content-Type: application/json; charset=utf-8');