---
title: "03. Transaksi & InnoDB Locking"
description: Transaksi ACID, jenis kunci InnoDB (Record Lock, Gap Lock, Next-Key Lock), SELECT FOR UPDATE, dan debugging SHOW ENGINE INNODB STATUS.
---

# 🐬 MySQL - Modul 03: Transaksi & InnoDB Locking

Memahami mekanisme penguncian (*locking*) internal InnoDB untuk mencegah kerusakan data pada transaksi e-commerce, flash sale, dan transfer perbankan.

---

## 1. Transaksi Dasar di MySQL

```sql
START TRANSACTION;

-- 1. Kurangi saldo pembeli:
UPDATE dompet SET saldo = saldo - 250000 WHERE id = 10;

-- 2. Tambah saldo toko:
UPDATE dompet SET saldo = saldo + 250000 WHERE id = 99;

-- Jika sukses:
COMMIT;

-- Jika terjadi kegagalan:
-- ROLLBACK;
```

---

## 2. Pessimistic Locking: `SELECT ... FOR UPDATE`

Mencegah dua user membeli tiket/stok barang terakhir di detik yang sama:

```sql
START TRANSACTION;

-- Mengunci baris tiket ID 100 secara eksklusif:
SELECT stok 
FROM produk_tiket 
WHERE id = 100 
FOR UPDATE;

-- Update stok barang setelah divalidasi di backend:
UPDATE produk_tiket 
SET stok = stok - 1 
WHERE id = 100;

COMMIT; -- Kunci otomatis dilepaskan
```

---

## 3. Rahasia InnoDB: Record Lock, Gap Lock, & Next-Key Lock

Kenapa MySQL bisa mencegah masalah *Phantom Read* pada tingkat isolasi default `REPEATABLE READ`? Karena InnoDB menggunakan algoritma **Next-Key Lock**:

### A. Record Lock (Kunci Baris Index)
Mengunci tepat pada satu indeks baris yang ada:
```sql
SELECT * FROM users WHERE id = 5 FOR UPDATE; -- Mengunci hanya baris dengan id = 5
```

### B. Gap Lock (Kunci Celah Kosong)
Mengunci **jarak celah kosong** di antara indeks agar transaksi lain tidak bisa menyisipkan (*INSERT*) data baru di tengah-tengah rentang tersebut:
Misalkan tabel punya ID `[1, 5, 10]`.
```sql
SELECT * FROM users WHERE id BETWEEN 3 AND 8 FOR UPDATE;
-- Gap Lock akan mengunci celah (1, 5) dan (5, 10).
-- Transaksi lain DILARANG INSERT data dengan id = 6 atau id = 7!
```

### C. Next-Key Lock (Record Lock + Gap Lock)
Kombinasi mengunci baris index sekaligus celah kosong sebelum baris tersebut. Inilah senjata pamungkas InnoDB melawan Phantom Read.

---

## 4. Debugging Deadlock: `SHOW ENGINE INNODB STATUS`

Jika aplikasi kamu melempar error `Deadlock found when trying to get lock; try restarting transaction`, jalankan query ini untuk melihat transaksi mana yang bertabrakan:

```sql
SHOW ENGINE INNODB STATUS;
```

Cari bagian **`LATEST DETECTED DEADLOCK`** di output:
- Terlihat Transaksi 1 memegang lock apa dan menunggu lock apa.
- Terlihat Transaksi 2 memegang lock apa dan menunggu lock apa.
- Terlihat query SQL mana yang dibatalkan paksa (*rolled back*) oleh MySQL.

---

## 5. Optimistic Locking (Alternatif Bebas Kunci Database)

Jika sistem memiliki frekuensi baca yang jauh lebih banyak daripada tulis, gunakan pola **Optimistic Locking** dengan kolom versi di tabel tanpa mengunci database:

```sql
-- Tambahkan kolom versi:
ALTER TABLE produk ADD COLUMN version INT NOT NULL DEFAULT 1;

-- Saat update, periksa apakah versinya masih sama:
UPDATE produk 
SET stok = stok - 1, version = version + 1 
WHERE id = 100 AND version = 1;

-- Di backend: Cek jumlah baris yang terpengaruh (affected rows).
-- Jika affected rows == 0, berarti ada user lain yang sudah mendahului! Batalkan transaksi.
```
