---
title: "01. Sintaks Dasar & Tipe Data"
description: DDL, DML, tipe data unggulan Postgres (UUID, TIMESTAMPTZ, TEXT, Identity), Constraints CHECK, klausa RETURNING, dan UPSERT ON CONFLICT.
---

# 🐘 PostgreSQL - Modul 01: Sintaks Dasar & Tipe Data

PostgreSQL (sering disingkat Postgres) adalah sistem database relasional (*RDBMS*) open-source paling canggih di dunia. Berbeda dengan RDBMS tradisional yang kaku, Postgres sangat kaya fitur: mendukung tipe data modern (`UUID`, `JSONB`, `ARRAY`), integritas data tinggi, dan performa konkurensi tingkat enterprise.

---

## 1. Tipe Data Khas & Modern PostgreSQL

Hafalkan 4 tipe data standar emas di Postgres:

| Tipe Data | Keterangan & Rekomendasi | Contoh Nilai |
|---|---|---|
| **`UUID`** | Identifier unik global 128-bit. Gunakan fungsi `gen_random_uuid()` (bawaan v13+) | `'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'` |
| **`TIMESTAMPTZ`** | Timestamp yang **sadar zona waktu (*with time zone*)**. Selalu gunakan ini dibanding `TIMESTAMP` biasa! | `'2026-11-20 10:30:00+07'` |
| **`TEXT`** | String panjang tanpa batas kaku. Di Postgres, **`TEXT` dan `VARCHAR` memiliki performa yang sama persis** di storage engine. Gunakan `TEXT` sebagai default kecuali ada aturan bisnis khusus | `'Catatan panjang artikel...'` |
| **`IDENTITY`** | Standar SQL modern pengganti tipe lama `SERIAL` untuk auto-increment ID | `GENERATED ALWAYS AS IDENTITY` |

---

## 2. Membuat Tabel dengan Constraint Kuat

Gunakan constraint `CHECK` untuk memvalidasi data langsung di level database engine:

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    saldo NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (saldo >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_bayar NUMERIC(15, 2) NOT NULL CHECK (total_bayar > 0),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'CANCELLED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. Fitur Sakti: Klausa `RETURNING`

Di database lain (seperti MySQL), setelah melakukan `INSERT` kamu harus memanggil query kedua untuk mengambil ID yang baru dibuat. Di Postgres, cukup tambahkan `RETURNING`:

```sql
-- 1. Insert dan langsung ambil ID serta created_at yang digenerate database:
INSERT INTO users (username, email, saldo)
VALUES ('eka31', 'eka@dev.cloud', 500000)
RETURNING id, username, created_at;

-- 2. Update status dan langsung return saldo baru:
UPDATE users
SET saldo = saldo - 150000, updated_at = CURRENT_TIMESTAMP
WHERE username = 'eka31'
RETURNING id, saldo;

-- 3. Delete dan return data yang baru saja terhapus:
DELETE FROM orders
WHERE status = 'CANCELLED'
RETURNING id, total_bayar;
```

---

## 4. `UPSERT` (`INSERT ... ON CONFLICT`)

Pola memasukkan data baru, dan jika terjadi duplikasi (*duplicate key* pada kolom `UNIQUE` atau `PRIMARY KEY`), lakukan pembaruan (*UPDATE*) atau abaikan (*DO NOTHING*):

```sql
-- A. Jika username sudah ada, lakukan UPDATE field email dan saldo:
INSERT INTO users (id, username, email, saldo)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'eka31', 'baru@dev.cloud', 750000)
ON CONFLICT (username) 
DO UPDATE SET 
    email = EXCLUDED.email,
    saldo = EXCLUDED.saldo,
    updated_at = CURRENT_TIMESTAMP;

-- B. Jika sudah ada, abaikan tanpa error (DO NOTHING):
INSERT INTO users (username, email)
VALUES ('eka31', 'eka@dev.cloud')
ON CONFLICT (username) DO NOTHING;
```

---

## 5. Tipe Data `ARRAY` (Menyimpan List di Kolom)

Postgres mendukung tipe data array native tanpa perlu membuat tabel relasi perantara untuk data sederhana:

```sql
CREATE TABLE artikel (
    id SERIAL PRIMARY KEY,
    judul TEXT NOT NULL,
    tags TEXT[] -- Kolom bertipe Array of Text
);

INSERT INTO artikel (judul, tags)
VALUES ('Belajar PostgreSQL', ARRAY['database', 'sql', 'backend']);

-- Cari artikel yang memiliki tag 'database':
SELECT * FROM artikel WHERE 'database' = ANY(tags);
```
