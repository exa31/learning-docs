---
title: "08. Performance Tuning & Konfigurasi my.cnf"
description: Panduan optimasi performa MySQL produksi, kalkulasi InnoDB Buffer Pool, tuning I/O ACID (flush log), serta analisis Slow Query Log dengan mysqldumpslow & pt-query-digest.
---

# 🐬 MySQL - Modul 08: Performance Tuning & Konfigurasi my.cnf

Secara default, MySQL dikonfigurasi dengan pengaturan ramah mesin laptop dengan alokasi RAM yang sangat kecil. Di server produksi, membiarkan nilai default sama saja dengan membuang $80\%$ potensi performa hardware server Anda.

---

## 1. 5 Parameter Paling Krusial di `my.cnf`

```ini
[mysqld]
# 1. Alokasi RAM Utama (70% - 80% Total RAM Mesin)
innodb_buffer_pool_size = 12G
innodb_buffer_pool_instances = 8

# 2. Durabilitas Transaksi vs Kecepatan Disk I/O
innodb_flush_log_at_trx_commit = 1
innodb_flush_method = O_DIRECT

# 3. Optimasi Disk SSD / NVMe
innodb_io_capacity = 2000
innodb_io_capacity_max = 4000

# 4. Manajemen Koneksi & Thread
max_connections = 500
thread_cache_size = 64
wait_timeout = 600

# 5. Slow Query Log
slow_query_log = 1
slow_query_log_file = /var/log/mysql/mysql-slow.log
long_query_time = 0.5
log_queries_not_using_indexes = 1
```

---

## 2. Bedah Parameter Memori & Disk

### A. `innodb_buffer_pool_size` (Jantung Performa MySQL)
Buffer Pool bertugas menampung data dan indeks di RAM agar query tidak perlu membaca hard disk fisik.

- **Aturan Emas**: Pasang **$70\% - 80\%$ dari total RAM fisik** jika server hanya menjalankan MySQL murni (*Dedicated Database Server*).
  - Server RAM 16GB $\to$ `innodb_buffer_pool_size = 12G`
  - Server RAM 64GB $\to$ `innodb_buffer_pool_size = 48G`
- **`innodb_buffer_pool_instances`**: Jika Buffer Pool $\ge 1\text{GB}$, pecah menjadi beberapa instance (misal 8 instance) untuk mengurangi persaingan kunci (*mutex contention*) antar thread CPU.

### Rumus Menghitung Hit Ratio Buffer Pool:
Targetkan rasio di atas **$99\%$**!
```sql
SHOW STATUS LIKE 'Innodb_buffer_pool_read%';
-- Hit Ratio = (1 - (Innodb_buffer_pool_reads / Innodb_buffer_pool_read_requests)) * 100
```
Jika hit ratio $< 95\%$, berarti Buffer Pool Anda kekecilan dan query sering terpaksa membaca disk fisik yang lambat.

---

### B. `innodb_flush_log_at_trx_commit` (Trade-off ACID vs Throughput)

Parameter ini menentukan kapan Redo Log disinkronkan (*fsync*) ke hard disk:

| Nilai | Perilaku Saat `COMMIT` | Risiko Kehilangan Data Saat Crash | Kecepatan Write |
|---|---|---|---|
| **`1`** (Default) | Redo Log langsung di-fsync ke disk secara fisik. | **0 detik (100% ACID Aman).** | Paling lambat (terikat IOPS disk). |
| **`2`** | Redo Log ditulis ke cache OS, baru di-fsync ke disk setiap 1 detik. | Aman jika MySQL crash. Jika mesin fisik mati listrik mendadak, kehilangan maksimal **1 detik transaksi**. | **Jauh lebih cepat** (Hingga 5x lipat). |
| **`0`** | Redo Log tetap di memori RAM, di-fsync ke disk setiap 1 detik. | Jika MySQL crash atau listrik mati, kehilangan **1 detik transaksi**. | Paling cepat. |

> [!TIP]
> Untuk database finansial/transaksi uang, **wajib gunakan nilai `1`**. Untuk database analitik, logging event, atau replica read-only, nilai `2` memberikan lonjakan throughput penulisan yang luar biasa tanpa membebani disk!

---

### C. `innodb_flush_method = O_DIRECT`
Secara default di Linux, data melewati dua kali buffering: Buffer Pool MySQL dan Page Cache kernel Linux (*Double Buffering*). Mengaktifkan `O_DIRECT` memberitahu InnoDB untuk melewati buffer kernel dan langsung membaca/menulis ke blok storage disk, membebaskan memori RAM sistem operasi.

---

## 3. Investigasi Query Lambat dengan Slow Query Log

Ketika pengguna mengeluh aplikasi lemot, jangan menebak-nebak! Periksa **Slow Query Log**:

```ini
slow_query_log = 1
slow_query_log_file = /var/log/mysql/mysql-slow.log
long_query_time = 0.5                  # Tangkap query yang memakan waktu > 0.5 detik
log_queries_not_using_indexes = 1      # Catat query yang tidak memakai indeks
```

### A. Analisis dengan `mysqldumpslow`
Tool bawaan MySQL untuk mengagregasi ribuan baris log menjadi daftar query teratas:
```bash
# Tampilkan 10 query yang paling banyak memakan waktu total (Sort by Total Time):
mysqldumpslow -s t -t 10 /var/log/mysql/mysql-slow.log

# Tampilkan 10 query yang paling sering dieksekusi (Sort by Count):
mysqldumpslow -s c -t 10 /var/log/mysql/mysql-slow.log
```

### B. Analisis Mendalam dengan `pt-query-digest` (Percona Toolkit)
Tool standar industri yang menghasilkan laporan visual profil query terlengkap:
```bash
pt-query-digest /var/log/mysql/mysql-slow.log
```
Output menampilkan:
- Distribusi waktu respon query (95th percentile).
- Query mana yang menyumbang $80\%$ beban server (*Rank 1 Query*).
- Jumlah baris yang diperiksa (*Rows Examined*) vs baris yang dikirim (*Rows Sent*).
