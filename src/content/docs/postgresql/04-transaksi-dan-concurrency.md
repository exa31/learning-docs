---
title: "04. Transaksi & Row Locking"
description: Transaksi ACID, isolation levels, row locking SELECT FOR UPDATE, arsitektur task queue dengan SKIP LOCKED, dan pencegahan deadlock.
---

# 🐘 PostgreSQL - Modul 04: Transaksi & Row Locking

Dalam sistem backend dengan ribuan pengguna bersamaan (*concurrent users*), menjaga integritas saldo e-wallet, stok inventaris tiket, atau antrean tugas (*task queue*) membutuhkan pemahaman transaksi dan teknik penguncian baris (*locking*) yang presisi.

---

## 1. Transaksi ACID Dasar & `SAVEPOINT`

Transaksi memastikan sekumpulan operasi dieksekusi secara **All-or-Nothing** (seluruhnya berhasil atau seluruhnya dibatalkan tanpa jejak):

```sql
BEGIN; -- Mulai blok transaksi

-- Kurangi saldo Pengirim:
UPDATE dompet SET saldo = saldo - 100000 WHERE user_id = 'user-a';

-- Buat savepoint jika ingin rollback parsial:
SAVEPOINT transfer_tahap_satu;

-- Tambah saldo Penerima:
UPDATE dompet SET saldo = saldo + 100000 WHERE user_id = 'user-b';

-- Jika terjadi kesalahan di tengah jalan:
-- ROLLBACK TO transfer_tahap_satu; -- Batalkan hanya setelah savepoint

COMMIT; -- Simpan perubahan permanen ke disk
```

---

## 2. Empat Tingkat Isolasi (*Transaction Isolation Levels*)

| Isolation Level | Dirty Read | Non-Repeatable Read | Phantom Read | Serialization Anomaly |
|---|---|---|---|---|
| **Read Committed** (Default Postgres) | ❌ Mustahil | ⚠️ Bisa terjadi | ⚠️ Bisa terjadi | ⚠️ Bisa terjadi |
| **Repeatable Read** | ❌ Mustahil | ❌ Mustahil | ❌ Mustahil | ⚠️ Bisa terjadi |
| **Serializable** | ❌ Mustahil | ❌ Mustahil | ❌ Mustahil | ❌ Mustahil (Super Ketat) |

Untuk mengubah tingkat isolasi pada satu transaksi tertentu:
```sql
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
```

---

## 3. Row Locking: `SELECT ... FOR UPDATE` (Pencegah Race Condition Saldo)

> 💥 **Masalah Klasik Race Condition**:
> Dua request datang di millisecond yang sama, keduanya membaca saldo `100.000`, keduanya mengurangi `100.000`, saldo menjadi `-100.000` (Double spending!).

### Solusi: Kunci Baris dengan `FOR UPDATE`:
```sql
BEGIN;

-- Mengunci baris dompet user-a sampai transaksi ini COMMIT/ROLLBACK.
-- Transaksi lain yang mencoba mengakses baris yang sama akan dipaksa MENUNGGU:
SELECT saldo 
FROM dompet 
WHERE user_id = 'user-a' 
FOR UPDATE;

-- Lakukan pengecekan saldo di kode backend, jika cukup lanjutkan update:
UPDATE dompet 
SET saldo = saldo - 50000 
WHERE user_id = 'user-a';

COMMIT; -- Gembok kunci dilepas otomatis
```

---

## 4. Pola Task Queue Super Kencang: `FOR UPDATE SKIP LOCKED`

Jika kamu ingin membuat sistem antrean tugas (*job queue* / worker background) langsung di Postgres tanpa perlu RabbitMQ atau Redis:

```sql
CREATE TABLE task_queue (
    id SERIAL PRIMARY KEY,
    payload JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING'
);

-- Worker akan mengambil 1 tugas tertua yang belum dikerjakan worker lain:
BEGIN;

SELECT id, payload
FROM task_queue
WHERE status = 'PENDING'
ORDER BY id ASC
LIMIT 1
FOR UPDATE SKIP LOCKED; -- ⚠️ Lompat baris yang sedang dikunci worker lain tanpa menunggu!

-- Ubah status menjadi 'PROCESSING':
UPDATE task_queue SET status = 'PROCESSING' WHERE id = 12;

COMMIT;
```

---

## 5. Deadlock & Cara Menghindarinya

**Deadlock** terjadi jika Transaksi A mengunci Baris 1 lalu butuh Baris 2, sementara Transaksi B mengunci Baris 2 lalu butuh Baris 1. Keduanya saling menunggu selamanya.

### Aturan Emas Anti-Deadlock:
1. **Urutan Penguncian Konsisten**: Jika memperbarui banyak baris dalam transaksi, **selalu urutkan ID-nya** (`ORDER BY id ASC` sebelum lock).
2. **Set Deadlock Timeout**: Secara default Postgres akan membatalkan salah satu transaksi jika terdeteksi deadlock (`deadlock_timeout = 1s`).
3. **Pertahankan Transaksi Singkat**: Jangan pernah menaruh HTTP call eksternal yang lambat di tengah-tengah transaksi database!
