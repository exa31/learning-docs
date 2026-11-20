---
title: "01. Sintaks Dasar & Storage Engines"
description: DDL, DML, InnoDB vs MyISAM, AUTO_INCREMENT, character set utf8mb4_unicode_ci (emoji), serta DATETIME vs TIMESTAMP.
---

# 🐬 MySQL - Modul 01: Sintaks Dasar & Storage Engines

MySQL adalah RDBMS open-source paling populer di dunia yang mentenagai jutaan situs web (WordPress, Facebook, Twitter skala awal). Di MySQL 8.0+, InnoDB adalah storage engine default dengan dukungan transaksi ACID penuh.

---

## 1. Storage Engines: `InnoDB` vs `MyISAM`

| Fitur | `InnoDB` (Standar Emas Modern) | `MyISAM` (Tipe Warisan Kuno) |
|---|---|---|
| **Dukungan Transaksi (ACID)** |  Mendukung penuh (`COMMIT` & `ROLLBACK`) | ❌ Tidak mendukung |
| **Tingkat Penguncian (Locking)**| **Row-Level Locking** (Kunci per-baris, konkurensi tinggi) | **Table-Level Locking** (Kunci seluruh tabel saat write!) |
| **Foreign Keys** |  Mendukung integritas relasi | ❌ Tidak mendukung |
| **Crash Recovery** | Otomatis pulih via Redo/Undo log | Rawan korupsi file saat listrik mati |
| **Rekomendasi** | **Gunakan 100% untuk semua tabel!** | Jangan gunakan lagi di sistem modern |

---

## 2. Karakter Set Wajib: `utf8mb4` (Dukungan Karakter Emoji)

> ⚠️ **PERINGATAN KRUSIAL**: Di MySQL, tipe `utf8` jadul sebenarnya hanyalah 3-byte UTF-8! Jika pengguna mengetik emoji (seperti 🚀, 👍, atau karakter Mandarin), MySQL akan error (*Incorrect string value*).
> **Selalu gunakan `utf8mb4` dengan collation `utf8mb4_unicode_ci`**:

```sql
CREATE DATABASE toko_online
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
```

---

## 3. Membuat Tabel Standar MySQL 8.0

```sql
CREATE TABLE users (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(191) NOT NULL UNIQUE, -- 191 karakter aman untuk batas index 767 byte utf8mb4
    nama_lengkap VARCHAR(100) NOT NULL,
    saldo DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    is_active TINYINT(1) NOT NULL DEFAULT 1, -- Boolean di MySQL diwakili TINYINT(1)
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 4. `DATETIME` vs `TIMESTAMP`

| Perbedaan | `DATETIME` | `TIMESTAMP` |
|---|---|---|
| **Rentang Waktu** | `'1000-01-01'` s.d. `'9999-12-31'` | `'1970-01-01'` s.d. `'2038-01-19'` (Masalah Year 2038!) |
| **Konversi Zona Waktu** | Tidak dikonversi (disimpan apa adanya) | Otomatis dikonversi ke UTC saat simpan, dan dikonversi balik ke timezone server saat baca |
| **Ukuran Memori** | 5 Bytes | 4 Bytes |
| **Kapan Dipakai** | Tanggal lahir, kontrak di masa depan (tahun > 2038) | Waktu log audit, `created_at`, `updated_at` |

---

## 5. Sintaks DML Populer: `ON DUPLICATE KEY UPDATE`

Pola Upsert khas MySQL (jika duplikat pada Primary Key atau kolom Unique):

```sql
INSERT INTO users (id, username, email, saldo)
VALUES (1, 'eka31', 'eka@dev.cloud', 500000)
ON DUPLICATE KEY UPDATE
    email = VALUES(email),
    saldo = saldo + VALUES(saldo);
```
