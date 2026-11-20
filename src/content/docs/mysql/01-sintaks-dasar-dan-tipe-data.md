---
title: "01. Sintaks Dasar, DDL, DML & Tipe Data"
description: Panduan mendalam sintaks MySQL, DDL, DML, perbandingan tipe data lengkap (DECIMAL vs FLOAT, DATETIME vs TIMESTAMP), kolom JSON, dan Generated Columns.
---

# 🐬 MySQL - Modul 01: Sintaks Dasar, DDL, DML & Tipe Data

MySQL adalah sistem manajemen database relasional (RDBMS) open-source paling populer di dunia. Meskipun menggunakan dialek standar SQL, MySQL memiliki fitur unik, perilaku tipe data khusus, dan strict mode yang wajib dipahami developer backend.

---

## 1. Data Definition Language (DDL)

DDL digunakan untuk mendefinisikan, mengubah, atau menghapus struktur database dan tabel.

```sql
-- 1. Membuat Database dengan Charset UTF-8 Modern (Mendukung Emoji!)
CREATE DATABASE IF NOT EXISTS toko_online
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE toko_online;

-- 2. Membuat Tabel dengan Constraint Lengkap
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(191) NOT NULL,
  nama VARCHAR(100) NOT NULL,
  saldo DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  role ENUM('USER', 'ADMIN', 'VENDOR') NOT NULL DEFAULT 'USER',
  metadata JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Operasi ALTER TABLE di Lingkungan Produksi
Operasi `ALTER TABLE` pada tabel jutaan baris bisa mengunci tabel jika salah langkah. MySQL 8.0+ mendukung **Online DDL** dengan algoritma `INSTANT`, `INPLACE`, dan `COPY`:

```sql
-- Menambah kolom baru secara instan tanpa mengunci tabel (MySQL 8.0+):
ALTER TABLE users 
  ADD COLUMN no_hp VARCHAR(20) NULL AFTER nama,
  ALGORITHM=INSTANT;

-- Mengubah tipe data atau drop kolom (membutuhkan INPLACE atau COPY):
ALTER TABLE users 
  MODIFY COLUMN nama VARCHAR(150) NOT NULL,
  ALGORITHM=INPLACE, 
  LOCK=NONE;
```

> [!WARNING]
> Jika `LOCK=NONE` ditolak oleh engine MySQL, itu menandakan alter tersebut membutuhkan `LOCK=SHARED` atau `LOCK=EXCLUSIVE` (tabel akan terkunci penuh dan memblokir request aplikasi). Untuk tabel puluhan Gigabyte, gunakan tool migrasi online seperti **gh-ost** (*GitHub Online Schema Transmogrifier*) atau **pt-online-schema-change**.

---

## 2. Bedah Lengkap Tipe Data MySQL

Salah memilih tipe data adalah penyebab utama pemborosan RAM (Buffer Pool) dan perlambatan query.

### A. Tipe Data Numerik
| Tipe Data | Bytes | Rentang Signed | Rentang Unsigned | Kasus Penggunaan Ideal |
|---|---|---|---|---|
| **`TINYINT`** | 1 Byte | -128 s/d 127 | 0 s/d 255 | Boolean (`TINYINT(1)`), status enum, usia |
| **`SMALLINT`** | 2 Bytes | -32.768 s/d 32.767 | 0 s/d 65.535 | Tahun, nomor kode pos |
| **`MEDIUMINT`** | 3 Bytes | -8.388.608 s/d 8.388.607 | 0 s/d 16.777.215 | ID kategori, data menengah |
| **`INT`** | 4 Bytes | -2 Miliar s/d 2 Miliar | 0 s/d 4.294.967.295 | Primary key standar |
| **`BIGINT`** | 8 Bytes | $\approx -9 \times 10^{18}$ | $\approx 18 \times 10^{18}$ | Primary key tabel transaksi, counter analitik |

> [!TIP]
> Selalu tambahkan `UNSIGNED` pada kolom ID Primary Key auto-increment jika nilainya tidak akan pernah negatif. Ini melipatgandakan kapasitas ID dari 2 miliar menjadi **4,29 miliar** pada tipe `INT` tanpa memakan RAM ekstra!

### B. Angka Pecahan: DECIMAL vs FLOAT/DOUBLE
- **`FLOAT` / `DOUBLE`**: Angka pecahan *approximate* (hampiran berbasis IEEE 754). Mengalami masalah pembulatan (`0.1 + 0.2 = 0.30000000000000004`). **DILARANG untuk data keuangan!**
- **`DECIMAL(M, D)`**: Angka pecahan eksak (*Fixed-point*). `M` adalah total digit (maks 65), `D` adalah jumlah digit di belakang koma.
  - Contoh: `DECIMAL(15, 2)` dapat menampung hingga `9,999,999,999,999.99` rupiah secara 100% presisi.

### C. String: CHAR vs VARCHAR vs TEXT
| Tipe | Panjang Maksimal | Karakteristik Penyimpanan | Kapan Digunakan? |
|---|---|---|---|
| **`CHAR(N)`** | 255 karakter | Panjang tetap (*Fixed length*), ruang kosong diisi spasi | String yang panjangnya selalu sama (Kode negara `ID`, `US`, UUID, hash SHA256) |
| **`VARCHAR(N)`**| 65.535 bytes | Panjang dinamis (*Variable length*), ada prefix 1-2 byte panjang | Nama, email, judul, alamat |
| **`TEXT`** | 64 KB (MEDIUM=16MB, LONG=4GB) | Disimpan di *Off-page* luar baris utama jika panjang | Artikel, log panjang, payload webhook |

> [!NOTE]
> Mengapa kolom email sering dibuat `VARCHAR(191)`?
> Pada MySQL 5.6/5.7 dengan InnoDB compact row format, panjang index key maksimal adalah 767 bytes. Dengan charset `utf8mb4` (1 karakter = 4 bytes), $767 / 4 = 191.75$ karakter!

### D. Waktu: DATETIME vs TIMESTAMP
| Aspek | `DATETIME` | `TIMESTAMP` |
|---|---|---|
| **Penyimpanan** | 5 bytes | 4 bytes |
| **Rentang Waktu**| `1000-01-01` s/d `9999-12-31` | `1970-01-01` s/d **`2038-01-19`** (Bahaya Y2038!) |
| **Konversi Timezone**| **TIDAK**. Menyimpan waktu apa adanya sesuai teks input. | **YA**. Diubah otomatis ke UTC saat disimpan, dan dikonversi balik ke timezone sesi koneksi saat dibaca. |
| **Rekomendasi** | Jadwal kalender, tanggal lahir, arsip masa depan > 2038. | Audit logging (`created_at`, `updated_at`) yang butuh konsistensi multi-region. |

---

## 3. Kolom JSON & Generated Columns

Mulai MySQL 5.7+ dan disempurnakan di MySQL 8.0+, MySQL mendukung tipe data biner **`JSON`** yang memvalidasi sintaks dokumen secara otomatis dan mendukung indexing virtual.

```sql
-- Tambah data JSON:
INSERT INTO users (email, nama, metadata) VALUES 
('eka@dev.local', 'Eka', '{
  "theme": "dark",
  "notifications": {"email": true, "sms": false},
  "ip_login": ["192.168.1.1", "10.0.0.1"]
}');

-- Mengambil properti JSON:
-- 1. Operator -> (Mengembalikan string berkuotasi JSON)
SELECT metadata->"$.theme" FROM users; -- Menghasilkan '"dark"'

-- 2. Operator ->> (Unquote: Menghasilkan nilai teks murni!)
SELECT metadata->>"$.theme" FROM users; -- Menghasilkan 'dark'
```

### Mengindeks Kolom JSON dengan Virtual Generated Column
Anda tidak bisa mengindeks kolom `JSON` secara langsung. Solusinya adalah membuat **Generated Column** yang mengekstrak nilai JSON, lalu membuat indeks pada kolom tersebut:

```sql
-- 1. Tambah Virtual Column (Tidak memakan storage fisik disk!)
ALTER TABLE users 
  ADD COLUMN theme_preference VARCHAR(20) 
  GENERATED ALWAYS AS (metadata->>"$.theme") VIRTUAL;

-- 2. Buat B-Tree Index pada Virtual Column:
CREATE INDEX idx_users_theme ON users (theme_preference);

-- 3. Query sekarang memanfaatkan INDEX SCAN super cepat!
SELECT * FROM users WHERE theme_preference = 'dark';
```

---

## 4. Data Manipulation Language (DML)

```sql
-- A. Insert Tunggal
INSERT INTO users (email, nama, saldo) 
VALUES ('user1@dev.local', 'Budi Santoso', 150000.00);

-- B. Bulk Insert (Jauh lebih cepat daripada looping ratusan INSERT)
INSERT INTO users (email, nama, saldo) VALUES 
('user2@dev.local', 'Siti Aminah', 250000.00),
('user3@dev.local', 'Rian Hidayat', 500000.00),
('user4@dev.local', 'Dewi Lestari', 75000.00);

-- C. Update Bersyarat dengan LIMIT (Safety Practice)
UPDATE users 
SET saldo = saldo - 50000.00 
WHERE id = 1 AND saldo >= 50000.00
LIMIT 1;

-- D. Delete Aman
DELETE FROM users 
WHERE status = 'BANNED' 
LIMIT 100;
```
