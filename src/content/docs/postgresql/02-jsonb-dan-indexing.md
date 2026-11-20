---
title: "02. JSONB & Strategi Indexing"
description: JSON vs JSONB, operator query jsonb (->>, @>, ?), jenis index (B-Tree, GIN, Partial, Expression), dan analisis query EXPLAIN ANALYZE.
---

# 🐘 PostgreSQL - Modul 02: JSONB & Strategi Indexing

Salah satu keunggulan terbesar Postgres yang membuatnya bisa menggantikan MongoDB untuk banyak use-case adalah tipe data dokumen **`JSONB`** dan kemampuan indexing-nya yang luar biasa canggih.

---

## 1. `JSON` vs `JSONB`

| Fitur | `JSON` | `JSONB` (Binary JSON) |
|---|---|---|
| **Format Penyimpanan** | Disimpan sebagai teks mentah (*exact copy*) | Dikonversi ke format biner terdekomposisi |
| **Kecepatan Insert** | Sedikit lebih cepat (tidak perlu parsing) | Butuh waktu sedikit untuk parsing biner |
| **Kecepatan Query / Read** | Lambat (harus re-parse teks setiap query) | **Sangat cepat (sub-millisecond)** |
| **Dukungan Indexing** | Terbatas | **Mendukung GIN Index penuh** |
| **Aturan Emas** | Jarang digunakan | **99% Gunakan `JSONB`!** |

---

## 2. Operator Query `JSONB` Wajib Hafal

Misalkan kita punya tabel `produk` dengan kolom `metadata JSONB`:

```sql
CREATE TABLE produk (
    id SERIAL PRIMARY KEY,
    nama TEXT NOT NULL,
    metadata JSONB NOT NULL
);

INSERT INTO produk (nama, metadata) VALUES 
('Laptop Gaming', '{"brand": "Asus", "ram_gb": 16, "tags": ["gaming", "portable"], "spesifikasi": {"gpu": "RTX 4060"}}');
```

### Kamus Operator JSONB:
```sql
-- 1. Operator '->>' : Ambil nilai sebagai tipe TEXT biasa:
SELECT nama, metadata->>'brand' AS brand FROM produk;
-- Output: "Asus" (tipe text)

-- 2. Operator '->' : Ambil nilai sebagai objek/array JSON:
SELECT nama, metadata->'tags' AS tags_json FROM produk;
-- Output: ["gaming", "portable"] (tipe jsonb)

-- 3. Mengakses Nested Object (Path):
SELECT metadata->'spesifikasi'->>'gpu' AS gpu FROM produk;
-- Output: "RTX 4060"

-- 4. Operator '@>' (Containment / Apakah Berisi Subset JSON):
-- Cari produk yang punya brand Asus dan RAM 16GB:
SELECT * FROM produk 
WHERE metadata @> '{"brand": "Asus", "ram_gb": 16}';

-- 5. Operator '?' : Cek apakah sebuah Key ada di dalam JSON:
SELECT * FROM produk WHERE metadata ? 'spesifikasi';
```

---

## 3. Strategi Indexing di PostgreSQL

Index adalah struktur data di memori yang mempercepat pencarian data dari $O(N)$ (Sequential Scan) menjadi $O(\log N)$ (Index Scan).

### A. B-Tree Index (Default & Paling Umum)
Cocok untuk operator perbandingan `=`, `<`, `>`, `<=`, `>=`, `BETWEEN`, dan `IN`:
```sql
CREATE INDEX idx_users_email ON users(email);
```

### B. GIN Index (Generalized Inverted Index) untuk `JSONB`
Membuat pencarian isi JSONB dengan operator `@>` menjadi super kencang meskipun tabel berisi jutaan baris:
```sql
-- GIN Index pada seluruh payload JSONB:
CREATE INDEX idx_produk_metadata ON produk USING GIN (metadata);
```

### C. Partial Index (Hanya Mengindeks Sebagian Baris)
Sangat menghemat ruang disk dan RAM jika kamu hanya sering mem-filter data dengan status tertentu (misal hanya user yang aktif):
```sql
-- Hanya mengindeks baris yang is_active = true:
CREATE INDEX idx_users_active_login 
ON users(username) 
WHERE is_active = true;
```

### D. Expression Index (Function-Based Index)
Membuat pencarian case-insensitive menjadi instan tanpa terhambat table scan:
```sql
-- Index pada hasil fungsi LOWER():
CREATE INDEX idx_users_lower_email ON users(LOWER(email));

-- Query ini otomatis menggunakan index di atas:
SELECT * FROM users WHERE LOWER(email) = 'eka@dev.cloud';
```

---

## 4. Membaca `EXPLAIN ANALYZE` (Bedah Kinerja Query)

Gunakan `EXPLAIN ANALYZE` sebelum query untuk melihat rencana eksekusi dan waktu riil yang dihabiskan engine:

```sql
EXPLAIN ANALYZE 
SELECT * FROM users WHERE email = 'eka@dev.cloud';
```

### Cara Membaca Output:
- **`Seq Scan` (Sequential Scan)**: ❌ Postgres membaca seluruh tabel dari awal sampai akhir baris demi baris (Tanda kamu butuh menambahkan index!).
- **`Index Scan`**:  Postgres langsung melompat ke halaman data yang tepat menggunakan B-Tree index.
- **`Bitmap Index Scan`**:  Digunakan jika hasil query mengambil banyak baris; Postgres membuat peta bit di memori sebelum mengambil baris dari disk.
- **`Execution Time`**: Waktu riil eksekusi query (satuan millisecond `ms`).
