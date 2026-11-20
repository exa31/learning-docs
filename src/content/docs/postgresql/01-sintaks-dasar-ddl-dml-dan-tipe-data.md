---
title: "01. Sintaks Dasar, DDL, DML & Tipe Data Canggih"
description: DDL tabel produksi, klausa RETURNING sakti, UPSERT ON CONFLICT, TIMESTAMPTZ, UUID v7, dan NUMERIC vs FLOAT di PostgreSQL.
---

# 🐘 PostgreSQL - Modul 01: Sintaks Dasar, DDL, DML & Tipe Data Canggih

PostgreSQL ("Postgres") adalah sistem manajemen basis data relasional objek (*ORDBMS*) paling canggih di dunia. Berbeda dengan database lain yang kaku, Postgres terkenal dengan kepatuhan standar SQL mutlak, ekstensibilitas tak tertandingi, dan integritas data ACID yang kokoh.

---

## 1. DDL Skema Produksi & Best Practices Tipe Data

```sql
-- Mengaktifkan ekstensi UUID bawaan
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    
    -- JANGAN gunakan FLOAT untuk uang! Gunakan NUMERIC / DECIMAL agar bebas floating point error:
    saldo NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (saldo >= 0),
    
    -- JANGAN gunakan TIMESTAMP tanpa zona waktu! Selalu gunakan TIMESTAMPTZ:
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Tabel Rekomendasi Tipe Data Wajib Postgres:
| Kebutuhan Data | ❌ Tipe Kurang Tepat | ✅ Tipe Wajib Postgres | Alasan Teknis |
|---|---|---|---|
| **Mata Uang & Finansial** | `FLOAT`, `DOUBLE` | `NUMERIC(p, s)` | Menghilangkan bug pembulatan biner ($0.1 + 0.2 = 0.30000000000000004$). |
| **Tanggal & Waktu** | `TIMESTAMP` | `TIMESTAMPTZ` | Menyimpan zona waktu UTC secara konsisten, mencegah kekacauan perbedaan jam antar server. |
| **Identifier Acak** | `INT AUTO_INCREMENT` | `UUID` (v4 / v7) | Mencegah enumerasi ID oleh penyerang, ramah arsitektur microservices terdistribusi. |
| **Teks Panjang** | `VARCHAR(255)` | `TEXT` | Di Postgres, performa `TEXT` dan `VARCHAR` **sama persis**. `TEXT` bebas batasan kaku. |

---

## 2. Fitur Sakti: Klausa `RETURNING` (Hemat 50% Round-Trip Jaringan)

Di database lain, setelah menjalankan `INSERT` atau `UPDATE`, aplikasi harus menjalankan query `SELECT` terpisah untuk mengambil data baru atau ID yang baru saja dibuat. Di Postgres, klausa **`RETURNING`** mengembalikan baris data hasil mutasi secara instan:

```sql
-- 1. Insert dan langsung ambil ID serta created_at yang digenerate database:
INSERT INTO accounts (username, email, saldo)
VALUES ('eka_dev', 'eka@dev.cloud', 500000.00)
RETURNING id, created_at, saldo;

-- 2. Update saldo dan langsung dapatkan saldo terbarunya dalam 1 perintah atomik:
UPDATE accounts
SET saldo = saldo + 100000.00
WHERE username = 'eka_dev'
RETURNING id, username, saldo AS saldo_baru;

-- 3. Delete dan ambil data yang baru saja terhapus untuk arsip audit:
DELETE FROM accounts
WHERE saldo = 0.00
RETURNING *;
```

---

## 3. UPSERT Modern: `ON CONFLICT DO UPDATE / DO NOTHING`

Menangani kondisi balapan (*race condition*) saat menambahkan data yang mungkin sudah ada tanpa melempar error:

```sql
INSERT INTO accounts (id, username, email, saldo)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'budi_santoso', 'budi@dev.cloud', 200000.00)
-- Jika email sudah terdaftar sebelumnya:
ON CONFLICT (email) 
DO UPDATE SET
    username = EXCLUDED.username,
    saldo = accounts.saldo + EXCLUDED.saldo,
    updated_at = CURRENT_TIMESTAMP
RETURNING id, saldo;
```
> [!NOTE]
> Kata kunci **`EXCLUDED`** mereferensikan nilai baris baru yang tadi coba dimasukkan oleh perintah `INSERT`.

---

## 4. Constraint Khusus Postgres: `CHECK` & `EXCLUDE`

Postgres mengizinkan validasi aturan bisnis langsung di tingkat mesin database:

```sql
-- Memvalidasi format email via regex langsung di DDL tabel:
ALTER TABLE accounts
ADD CONSTRAINT validasi_format_email 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
```
