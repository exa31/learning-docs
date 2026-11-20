---
title: "02. Indexing & Optimasi Query"
description: Clustered Index vs Secondary Index, aturan Leftmost Prefix, membaca EXPLAIN (type ALL vs ref), Covering Index, dan Slow Query Log.
---

# 🐬 MySQL - Modul 02: Indexing & Optimasi Query

Di MySQL (khususnya InnoDB), pemahaman arsitektur index adalah penentu utama apakah query kamu berjalan dalam hitungan 2 millisecond atau 10 detik penuh dan membuat CPU server 100%.

---

## 1. Clustered Index vs Secondary Index

Di InnoDB, seluruh tabel adalah sebuah **B+ Tree Index**:

```text
[Clustered Index (Primary Key)]
└── Root -> Branch -> Leaf Nodes berisi [Primary Key + SELURUH KOLOM BARIS]

[Secondary Index (misal: INDEX(email))]
└── Root -> Branch -> Leaf Nodes berisi [Nilai Email + NILAI PRIMARY KEY]
```

1. **Clustered Index (Primary Key)**: Data baris fisik tersimpan langsung di dalam daun pohon B+ Tree Primary Key.
2. **Secondary Index**: Hanya menyimpan kolom yang diindeks ditambah nilai Primary Key-nya.
3. **Double Lookup**: Saat kamu query `WHERE email = '...'`, MySQL mencari di Secondary Index dulu untuk dapat ID-nya, lalu melompat ke Clustered Index untuk mengambil data baris lengkapnya.
4. **Covering Index**: Jika semua kolom yang kamu `SELECT` sudah ada di dalam Secondary Index, MySQL **tidak perlu melompat ke Clustered Index sama sekali (`Extra: Using index`)**. Sangat kencang!

---

## 2. Aturan Emas: "Leftmost Prefix" pada Composite Index

Misalkan kamu membuat composite index pada 3 kolom:
```sql
CREATE INDEX idx_user_pencarian ON orders (user_id, status, created_at);
```

Index ini bertindak seperti kamus yang diurutkan dari kiri ke kanan:
-  BISA dipakai jika query mem-filter: `(user_id)`
-  BISA dipakai jika query mem-filter: `(user_id, status)`
-  BISA dipakai jika query mem-filter: `(user_id, status, created_at)`
- ❌ **TIDAK BISA** dipakai jika query hanya mem-filter: `(status)` atau `(created_at)` tanpa menyertakan `user_id` di awal!

---

## 3. Membaca `EXPLAIN` (Analisis Rencana Eksekusi)

```sql
EXPLAIN SELECT * FROM orders WHERE user_id = 10 AND status = 'PAID';
```

### Kolom Paling Kritis di Output `EXPLAIN`:

#### A. Nilai Kolom `type` (Dari Paling Cepat ke Paling Lambat):
1. **`const`**: Mengambil tepat 1 baris berdasarkan Primary Key atau Unique (`WHERE id = 1`).
2. **`eq_ref`**: 1 baris cocok saat JOIN menggunakan Primary Key.
3. **`ref`**: Mengambil baris menggunakan Secondary Index biasa.
4. **`range`**: Pencarian rentang dengan index (`>`, `<`, `BETWEEN`, `IN`).
5. **`index`**: Membaca seluruh pohon index dari awal sampai akhir.
6. **`ALL` (Full Table Scan)**: ❌ **BAHAYA!** MySQL membaca seluruh tabel dari harddisk tanpa index sama sekali.

#### B. Kolom `Extra`:
- **`Using index`**:  Covering index aktif, tidak menyentuh tabel fisik.
- **`Using filesort`**: ⚠️ MySQL harus menyortir data di RAM/disk sementara karena urutan index tidak cocok dengan klausa `ORDER BY`.
- **`Using temporary`**: ⚠️ MySQL membuat tabel sementara di RAM untuk menghitung `GROUP BY` atau `DISTINCT`.

---

## 4. Memaksa Index: `FORCE INDEX`

Jika MySQL Optimizer salah memilih index yang kurang optimal:

```sql
SELECT * FROM orders FORCE INDEX (idx_user_pencarian)
WHERE user_id = 100 AND status = 'PAID';
```

---

## 5. Mengaktifkan Slow Query Log

Untuk menemukan kueri-kueri lambat yang berjalan lebih dari X detik di server produksi:

```sql
-- Aktifkan log kueri lambat:
SET GLOBAL slow_query_log = 'ON';

-- Catat semua query yang berjalan lebih dari 2 detik:
SET GLOBAL long_query_time = 2.0;

-- Catat query yang tidak menggunakan index:
SET GLOBAL log_queries_not_using_indexes = 'ON';
```
Log akan tersimpan di file sistem (misal `/var/log/mysql/mysql-slow.log`) dan dapat dianalisis menggunakan utility `mysqldumpslow`.
