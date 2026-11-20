---
title: "03. DML Lanjutan, Window Functions & CTE"
description: Teknik DML lanjutan di MySQL (Upsert ON DUPLICATE KEY, Bulk Load), Recursive Common Table Expressions (CTE), dan fungsi analitik Window Functions.
---

# 🐬 MySQL - Modul 03: DML Lanjutan, Window Functions & CTE

Mulai MySQL 8.0+, kemampuan komputasi analitik MySQL melonjak drastis berkat kehadiran **Window Functions** dan **Common Table Expressions (CTE)**, mengakhiri era di mana developer harus membuat query berbelit-belit dengan *temporary table* atau variabel `@row_number`.

---

## 1. DML Lanjutan: Upsert & Bulk Insert

### A. Pola Upsert: `INSERT ... ON DUPLICATE KEY UPDATE`
Ketika kita ingin menambahkan data baru, tetapi jika kunci unik (Primary Key atau Unique Index) sudah ada, kita hanya ingin meng-update kolom tertentu:

```sql
-- Sintaks Modern MySQL 8.0.19+ (Menggunakan Alias AS new_row):
INSERT INTO user_stats (user_id, login_count, last_login)
VALUES (101, 1, NOW())
AS new_data
ON DUPLICATE KEY UPDATE
  login_count = user_stats.login_count + new_data.login_count,
  last_login = new_data.last_login;
```

> [!CAUTION]
> **Bahaya `REPLACE INTO`!**
> Jangan tertukar antara `ON DUPLICATE KEY UPDATE` dengan `REPLACE INTO`. Perintah `REPLACE INTO` sebenarnya melakukan **DELETE baris lama terlebih dahulu**, baru kemudian me-run `INSERT` baru! Ini merusak relasi Foreign Key cascade, memicu trigger `DELETE`, dan membuat ID auto-increment melompat!

### B. `INSERT IGNORE`
Jika ada baris yang melanggar constraint unik, abaikan baris tersebut secara diam-diam tanpa membatalkan seluruh batch transaksi:
```sql
INSERT IGNORE INTO newsletter_subscribers (email) VALUES 
('eka@dev.local'),
('budi@dev.local'),
('eka@dev.local'); -- Duplikat ini dilewati, sisanya tetap masuk!
```

---

## 2. Common Table Expressions (CTE)

CTE membuat subquery yang rumit menjadi blok kode yang terstruktur, mudah dibaca, dan dapat dipanggil berulang kali menggunakan kata kunci `WITH`.

### A. Non-Recursive CTE (Sederhana)
```sql
WITH top_customers AS (
  SELECT customer_id, SUM(total) AS total_belanja
  FROM orders
  WHERE order_date >= '2026-01-01'
  GROUP BY customer_id
  HAVING total_belanja > 10000000
)
SELECT 
  c.nama, 
  c.email, 
  tc.total_belanja
FROM top_customers tc
JOIN customers c ON c.id = tc.customer_id
ORDER BY tc.total_belanja DESC;
```

### B. Recursive CTE (Menelusuri Struktur Hierarki / Pohon)
Sangat berguna untuk mencari struktur organisasi (Atasan - Bawahan) atau kategori produk bersarang (Parent - Child):

```sql
WITH RECURSIVE hierarki_kategori AS (
  -- 1. Anchor Member: Kategori paling atas (Root / parent_id IS NULL)
  SELECT id, nama, parent_id, 1 AS level, CAST(nama AS CHAR(255)) AS breadcrumb
  FROM categories
  WHERE parent_id IS NULL

  UNION ALL

  -- 2. Recursive Member: Cari anak-anak dari kategori di atasnya
  SELECT c.id, c.nama, c.parent_id, hk.level + 1, CONCAT(hk.breadcrumb, ' > ', c.nama)
  FROM categories c
  JOIN hierarki_kategori hk ON c.parent_id = hk.id
)
SELECT id, breadcrumb, level 
FROM hierarki_kategori 
ORDER BY breadcrumb;
```
Hasil output langsung menampilkan navigasi breadcrumb lengkap:
- `Elektronik` (Level 1)
- `Elektronik > Komputer` (Level 2)
- `Elektronik > Komputer > Laptop` (Level 3)

---

## 3. Window Functions Lengkap

Window function melakukan kalkulasi terhadap sekumpulan baris tanpa menggabungkannya (*collapsing*) seperti `GROUP BY`.

$$\text{FUNCTION}() \ \mathbf{OVER} \ (\mathbf{PARTITION\ BY}\ \text{kolom} \ \mathbf{ORDER\ BY}\ \text{kolom} \ [\mathbf{FRAME\_SPEC}])$$

### A. Fungsi Perankingan: ROW_NUMBER, RANK, DENSE_RANK
```sql
SELECT
  karyawan_id,
  departemen,
  gaji,
  -- 1. Nomor urut mutlak tanpa seri (1, 2, 3, 4)
  ROW_NUMBER() OVER(PARTITION BY departemen ORDER BY gaji DESC) AS row_num,
  -- 2. Ranking dengan gap jika ada nilai sama (1, 2, 2, 4)
  RANK() OVER(PARTITION BY departemen ORDER BY gaji DESC) AS rnk,
  -- 3. Ranking rapat tanpa lompatan (1, 2, 2, 3)
  DENSE_RANK() OVER(PARTITION BY departemen ORDER BY gaji DESC) AS dense_rnk
FROM gaji_karyawan;
```

### B. Mengambil Top 2 Gaji per Departemen (Subquery Window)
```sql
WITH ranked_salary AS (
  SELECT
    nama,
    departemen,
    gaji,
    DENSE_RANK() OVER(PARTITION BY departemen ORDER BY gaji DESC) as urutan
  FROM gaji_karyawan
)
SELECT * FROM ranked_salary WHERE urutan <= 2;
```

### C. Analisis Tren Waktu: LAG & LEAD
Mengakses nilai pada baris sebelum atau sesudah baris aktif:
```sql
SELECT
  tanggal,
  omzet,
  -- Ambil omzet tanggal sebelumnya:
  LAG(omzet, 1) OVER(ORDER BY tanggal ASC) AS omzet_kemarin,
  -- Hitung selisih pertumbuhan:
  omzet - LAG(omzet, 1) OVER(ORDER BY tanggal ASC) AS kenaikan
FROM penjualan_harian;
```

### D. Running Total (Total Kumulatif)
```sql
SELECT
  tanggal,
  nominal,
  -- Total kumulatif berjalan dari awal bulan hingga hari ini:
  SUM(nominal) OVER(
    ORDER BY tanggal ASC
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS saldo_kumulatif
FROM mutasi_bank;
```
