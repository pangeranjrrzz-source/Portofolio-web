CREATE DATABASE IF NOT EXISTS ferrari_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ferrari_db;

-- Tabel utama: satu baris = satu model mobil
CREATE TABLE model_mobil (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  slug         VARCHAR(20)  NOT NULL UNIQUE,   -- sama dengan ?id= di link: 488, sf90, roma
  nama         VARCHAR(100) NOT NULL,
  tagline      VARCHAR(150),
  tahun        YEAR         NOT NULL,
  mesin        VARCHAR(150) NOT NULL,
  tenaga_hp    SMALLINT UNSIGNED NOT NULL,
  akselerasi   DECIMAL(3,1) NULL,              -- 0-100 km/jam, dalam detik
  kecepatan    SMALLINT UNSIGNED NULL,         -- km/jam
  gambar       VARCHAR(255) NULL
);

-- Paragraf penjelasan, terpisah agar jumlahnya bebas per model
CREATE TABLE paragraf_model (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  model_id  INT NOT NULL,
  urutan    TINYINT UNSIGNED NOT NULL,
  isi       TEXT NOT NULL,
  FOREIGN KEY (model_id) REFERENCES model_mobil(id) ON DELETE CASCADE,
  UNIQUE (model_id, urutan)
);

-- Data dari dataMobil di ferrari.js
INSERT INTO model_mobil
  (slug, nama, tahun, mesin, tenaga_hp, akselerasi, kecepatan)
VALUES
  ('488',  'Ferrari 488 GTB', 2015, 'V8 3,9 L twin-turbo', 661, 3.0, 330),
  ('sf90', 'SF90 Stradale',   2019, 'V8 4,0 L twin-turbo + 3 motor listrik', 986, 2.5, 340),
  ('roma', 'Ferrari Roma',    2019, 'V8 3,9 L twin-turbo', 612, NULL, NULL);

INSERT INTO paragraf_model (model_id, urutan, isi) VALUES
  ((SELECT id FROM model_mobil WHERE slug='488'), 1,
   '488 GTB diperkenalkan pada 2015 sebagai pengganti 458 Italia. Perubahan besarnya ada di mesin V8 3,9 liter twin-turbo.'),
  ((SELECT id FROM model_mobil WHERE slug='488'), 2,
   'Dengan girboks dual-clutch 7 percepatan, mobil ini berakselerasi 0-100 km/jam dalam sekitar 3 detik.'),
  ((SELECT id FROM model_mobil WHERE slug='488'), 3,
   '488 GTB diproduksi sampai 2019 dan digantikan oleh F8 Tributo.'),

  ((SELECT id FROM model_mobil WHERE slug='sf90'), 1,
   'SF90 Stradale diperkenalkan pada 2019 dan menjadi Ferrari produksi seri pertama yang memakai teknologi plug-in hybrid.'),
  ((SELECT id FROM model_mobil WHERE slug='sf90'), 2,
   'Mobil ini memadukan mesin V8 4,0 liter twin-turbo dengan tiga motor listrik.'),
  ((SELECT id FROM model_mobil WHERE slug='sf90'), 3,
   'Dalam mode listrik penuh, SF90 Stradale bisa menempuh sekitar 25 km.'),

  ((SELECT id FROM model_mobil WHERE slug='roma'), 1,
   'Grand tourer bergaya La Dolce Vita dengan desain elegan dan performa modern.');