---
title: "05. Performa & Administrasi"
description: Table Partitioning (RANGE/LIST), Connection Pooling PgBouncer, VACUUM dead tuples, monitoring pg_stat_activity, dan pg_dump backup.
---

# 🐘 PostgreSQL - Modul 05: Performa & Administrasi

Operasional produksi database PostgreSQL skala besar: mengelola pemeliharaan tabel, partisi data untuk tabel raksasa, connection pooling, dan prosedur darurat kill query.

---

## 1. Table Partitioning (Partisi Deklaratif)

Jika tabel log atau transaksi memiliki puluhan/ratusan juta baris, partisi tabel menjadi potongan-potongan kecil berdasarkan rentang tanggal (*RANGE Partitioning*):

```sql
-- 1. Buat Tabel Utama (Master Partition):
CREATE TABLE log_audit (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    pesan TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
) PARTITION BY RANGE (created_at);

-- 2. Buat Anak Partisi per Tahun/Bulan:
CREATE TABLE log_audit_2026_11 PARTITION OF log_audit
    FOR VALUES FROM ('2026-11-01 00:00:00+00') TO ('2026-12-01 00:00:00+00');

CREATE TABLE log_audit_2026_12 PARTITION OF log_audit
    FOR VALUES FROM ('2026-12-01 00:00:00+00') TO ('2027-01-01 00:00:00+00');

--  KEUNTUNGAN (Partition Pruning):
-- Query ini HANYA akan membaca partisi bulan 11, partisi bulan lain langsung di-skip!
SELECT * FROM log_audit 
WHERE created_at >= '2026-11-15' AND created_at < '2026-11-20';
```

---

## 2. Mengapa PostgreSQL Butuh Connection Pooler (PgBouncer)?

Berbeda dengan MySQL yang menggunakan *thread* ringan per koneksi, **Postgres membuat satu *Linux Process* terpisah untuk setiap koneksi klien**.
- 1 koneksi Postgres memakan alokasi RAM sekitar **10MB**.
- Jika 1.000 request masuk bersamaan, server Postgres bisa kehabisan RAM (*OOM Crash*).
- **Solusi Industri**: Pasang **PgBouncer** di depan Postgres. Aplikasi kamu membuka ratusan koneksi ke PgBouncer, namun PgBouncer hanya membuka ~20-50 koneksi riil ke Postgres (*Transaction Pooling*).

---

## 3. `VACUUM` & Pembersihan Dead Tuples (MVCC)

PostgreSQL menggunakan mekanisme **MVCC (Multi-Version Concurrency Control)**. 
- Saat kamu menjalankan `DELETE` atau `UPDATE`, baris lama **tidak langsung dihapus dari disk fisik**, melainkan hanya ditandai sebagai *Dead Tuple*.
- Jika dibiarkan bertahun-tahun, ukuran tabel akan membengkak (*Table Bloat*) dan query melambat.

```sql
-- 1. Cek jumlah dead tuples di tabel:
SELECT relname, n_live_tup, n_dead_tup 
FROM pg_stat_user_tables 
ORDER BY n_dead_tup DESC;

-- 2. Bersihkan dead tuples secara manual:
VACUUM users;

-- 3. VACUUM sekaligus memperbarui statistik optimizer (Dianjurkan):
VACUUM ANALYZE users;

-- ⚠️ HATI-HATI: 'VACUUM FULL' mengunci seluruh tabel (Exclusive Lock)! 
-- Hindari di jam kerja sibuk kecuali saat maintenance terjadwal.
```

---

## 4. Monitoring Query & Kill Connection Macet

Melihat siapa yang sedang membebani server dan mengunci database:

```sql
-- 1. Lihat seluruh query yang sedang aktif berjalan:
SELECT pid, usename, client_addr, state, now() - query_start AS durasi, query
FROM pg_stat_activity
WHERE state = 'active'
ORDER BY durasi DESC;

-- 2. Membatalkan query lambat tanpa mematikan koneksi user:
SELECT pg_cancel_backend(12345); -- Ganti dengan PID target

-- 3. Memutus koneksi paksa (Kill Process darurat):
SELECT pg_terminate_backend(12345);
```

---

## 5. Backup & Restore Cepat via CLI

```bash
# 1. Backup satu database ke file kompresi custom:
pg_dump -U postgres -d nama_db -F c -b -v -f backup_db.dump

# 2. Restore dari file dump:
pg_restore -U postgres -d nama_db_baru -v backup_db.dump

# 3. Backup plain text SQL:
pg_dump -U postgres nama_db > backup.sql
psql -U postgres -d nama_db_baru < backup.sql
```
