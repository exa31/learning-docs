---
title: "03. Joins, CTE, & Window Functions"
description: Ragam Join visual, CTE (Common Table Expressions), Recursive CTE untuk data pohon berjenjang, dan Window Functions (ROW_NUMBER, RANK, LEAD, LAG).
---

# 🐘 PostgreSQL - Modul 03: Joins, CTE, & Window Functions

Menguasai kueri tingkat lanjut di Postgres: merangkai relasi tabel dengan rapi, membongkar struktur hierarki dengan Recursive CTE, dan melakukan komputasi analitik tanpa memecah baris data via Window Functions.

---

## 1. Kamus Visual Ragam `JOIN`

```sql
-- 1. INNER JOIN: Hanya mengambil baris yang COCOK di kedua tabel
SELECT u.username, o.total_bayar 
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- 2. LEFT JOIN: Ambil SEMUA baris tabel kiri (users), meskipun belum punya order (o.total akan NULL)
SELECT u.username, o.total_bayar 
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;

-- 3. FULL OUTER JOIN: Ambil semua data dari kiri dan kanan, cocokkan jika ada
SELECT u.username, o.total_bayar 
FROM users u
FULL OUTER JOIN orders o ON u.id = o.user_id;

-- 4. CROSS JOIN: Perkalian Kartesius (tiap baris kiri dipasangkan dengan tiap baris kanan)
SELECT s.ukuran, w.warna FROM ukuran s CROSS JOIN warna w;
```

---

## 2. CTE (Common Table Expressions) dengan `WITH`

CTE membuat kueri kompleks yang bertingkat-tingkat menjadi sangat bersih dan mudah dibaca (seperti membuat variabel sementara):

```sql
WITH PengeluaranUser AS (
    -- Langkah 1: Hitung total belanja tiap user
    SELECT user_id, SUM(total_bayar) AS total_belanja, COUNT(id) AS jumlah_order
    FROM orders
    WHERE status = 'PAID'
    GROUP BY user_id
),
UserSultan AS (
    -- Langkah 2: Saring hanya user dengan belanja di atas 10 juta
    SELECT user_id, total_belanja
    FROM PengeluaranUser
    WHERE total_belanja >= 10000000
)
-- Langkah 3: Gabungkan dengan tabel profil users
SELECT u.username, u.email, s.total_belanja
FROM users u
INNER JOIN UserSultan s ON u.id = s.user_id
ORDER BY s.total_belanja DESC;
```

---

## 3. Recursive CTE (Membedah Struktur Pohon / Hierarki)

Sangat berguna untuk data kategori bersarang (*nested categories*) atau bagan struktur organisasi (`parent_id`):

```sql
CREATE TABLE kategori (
    id SERIAL PRIMARY KEY,
    nama TEXT NOT NULL,
    parent_id INT REFERENCES kategori(id)
);

-- Mengambil seluruh anak turunan dari kategori ID = 1 secara rekursif:
WITH RECURSIVE KategoriTree AS (
    -- Base Case (Akar pohon):
    SELECT id, nama, parent_id, 1 AS level
    FROM kategori
    WHERE id = 1

    UNION ALL

    -- Recursive Case (Cari anak yang punya parent_id sama dengan id sebelumnya):
    SELECT k.id, k.nama, k.parent_id, kt.level + 1
    FROM kategori k
    INNER JOIN KategoriTree kt ON k.parent_id = kt.id
)
SELECT * FROM KategoriTree ORDER BY level, id;
```

---

## 4. Window Functions (`OVER (PARTITION BY ... ORDER BY ...)`)

Window functions melakukan perhitungan matematis pada sekumpulan baris **tanpa menyusutkan baris data seperti `GROUP BY` biasa**.

### A. `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`
Mencari peringkat, misalnya mencari 3 produk terlaris di tiap kategori:

```sql
WITH RankingProduk AS (
    SELECT 
        kategori,
        nama_produk,
        harga,
        -- Beri nomor urut per kategori berdasarkan harga tertinggi:
        ROW_NUMBER() OVER (
            PARTITION BY kategori 
            ORDER BY harga DESC
        ) AS ranking_ke
    FROM produk
)
SELECT * FROM RankingProduk WHERE ranking_ke <= 3;
```

### B. `LAG()` & `LEAD()` (Intip Baris Sebelum & Sesudah)
Mengambil nilai dari baris sebelumnya tanpa perlu melakukan self-join yang lambat:

```sql
SELECT 
    tanggal,
    omzet_harian,
    -- Ambil omzet hari sebelumnya:
    LAG(omzet_harian, 1) OVER (ORDER BY tanggal) AS omzet_kemarin,
    -- Hitung selisih pertumbuhan omzet:
    omzet_harian - LAG(omzet_harian, 1) OVER (ORDER BY tanggal) AS selisih_kenaikan
FROM penjualan_toko;
```

### C. Running Total (Akumulasi Berjalan)
```sql
SELECT 
    tanggal,
    total_bayar,
    -- Jumlah akumulatif bertambah terus dari awal bulan sampai akhir:
    SUM(total_bayar) OVER (ORDER BY tanggal) AS akumulasi_omzet
FROM orders;
```
