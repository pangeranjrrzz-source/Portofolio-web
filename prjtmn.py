import sqlite3
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
DB_NAME = "studykit.db"

# Fungsi pembantu untuk koneksi ke database SQLite
def get_db():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

# Otomatis membuat tabel papan_peringkat saat aplikasi pertama kali jalan
def init_db():
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS papan_peringkat (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nama TEXT NOT NULL,
                skor INTEGER NOT NULL,
                waktu TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()

# Daftar soal disimpan aman di server (tidak bisa diintip lewat Inspect Element)
SOAL_KUIS = [
    {
        "id": 1,
        "pertanyaan": "Apa kepanjangan dari HTML?",
        "pilihan": ["Hyper Text Markup Language", "High Tech Modern Language", "Hyperlink Text Management"],
        "jawaban": "Hyper Text Markup Language"
    },
    {
        "id": 2,
        "pertanyaan": "Perintah Python untuk menampilkan teks ke layar adalah...",
        "pilihan": ["echo()", "console.log()", "print()"],
        "jawaban": "print()"
    },
    {
        "id": 3,
        "pertanyaan": "Manakah yang termasuk database berbasis satu file tanpa server?",
        "pilihan": ["MySQL", "SQLite", "PostgreSQL"],
        "jawaban": "SQLite"
    }
]

# --- RUTE HALAMAN WEB ---

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/kuis")
def halaman_kuis():
    return render_template("kuis.html")

# --- JALUR KOMUNIKASI DATA (API) ---

# 1. Mengirim daftar soal ke JavaScript (tanpa menyertakan kunci jawaban)
@app.route("/api/soal", methods=["GET"])
def api_soal():
    soal_aman = []
    for s in SOAL_KUIS:
        soal_aman.append({
            "id": s["id"],
            "pertanyaan": s["pertanyaan"],
            "pilihan": s["pilihan"]
        })
    return jsonify(soal_aman)

# 2. Menerima jawaban siswa, menghitung skor, dan menyimpan ke database
@app.route("/api/skor", methods=["POST"])
def api_simpan_skor():
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "Data tidak valid"}), 400

    nama = str(data.get("nama", "")).strip()
    jawaban_siswa = data.get("jawaban", {})  # Contoh format: {"1": "print()", "2": "..."}

    if not nama or len(nama) > 50:
        return jsonify({"error": "Nama wajib diisi (maksimal 50 karakter)"}), 422

    # Hitung skor di server berdasarkan kunci jawaban
    skor_akhir = 0
    poin_per_soal = 100 // len(SOAL_KUIS)

    for soal in SOAL_KUIS:
        id_str = str(soal["id"])
        if jawaban_siswa.get(id_str) == soal["jawaban"]:
            skor_akhir += poin_per_soal

    # Simpan nama dan skor ke database SQLite
    with get_db() as conn:
        conn.execute(
            "INSERT INTO papan_peringkat (nama, skor) VALUES (?, ?)",
            (nama, skor_akhir)
        )
        conn.commit()

    return jsonify({
        "ok": True,
        "nama": nama,
        "skor": skor_akhir,
        "pesan": "Skor berhasil disimpan!"
    }), 201

# 3. Mengambil 10 peringkat teratas dari database
@app.route("/api/peringkat", methods=["GET"])
def api_peringkat():
    with get_db() as conn:
        baris = conn.execute(
            "SELECT nama, skor, waktu FROM papan_peringkat ORDER BY skor DESC, waktu ASC LIMIT 10"
        ).fetchall()

    daftar_peringkat = [dict(row) for row in baris]
    return jsonify(daftar_peringkat)

if __name__ == "__main__":
    init_db()
    app.run(debug=True)
