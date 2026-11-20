---
title: "04. Replikasi & Backup Produksi"
description: Binlog (Row-based), arsitektur Master-Replica, Read/Write Splitting, menangani Replication Lag, dan mysqldump single-transaction.
---

# 🐬 MySQL - Modul 04: Replikasi & Backup Produksi

Membangun arsitektur database MySQL berskala tinggi dengan memisahkan beban baca dan tulis melalui replikasi *Master-Replica*, serta strategi pencadangan (*backup*) tanpa memblokir server.

---

## 1. Jantung Replikasi: Binary Log (`binlog`)

Replikasi MySQL bekerja dengan mencatat seluruh mutasi data (INSERT, UPDATE, DELETE) ke dalam berkas **Binary Log (binlog)**:

```text
[Primary / Master] ──(Tulis ke Binlog)──> Binlog Dump Thread
                                                │ (Kirim via Jaringan)
                                                ▼
[Replica / Slave]  <──(SQL Thread)── Relay Log <── I/O Thread
```

### Format Binlog:
- **`ROW` (Best Practice Modern)**: Mencatat perubahan riil baris data byte per byte. Aman 100% dan tidak terpengaruh fungsi non-deterministik seperti `NOW()` atau `UUID()`.
- **`STATEMENT`**: Hanya mencatat teks kueri SQL. Berisiko beda data antara Master dan Replica jika ada fungsi acak.
- **`MIXED`**: Gabungan otomatis antara STATEMENT dan ROW.

---

## 2. Arsitektur Read / Write Splitting

Pola paling umum untuk menangani jutaan pengunjung:

```text
               ┌───────────────────────┐
               │    Aplikasi Backend   │
               └───────────┬───────────┘
                    Write  │    ▲ Read Only
                    (10%)  │    │ (90%)
                           ▼    │
              ┌─────────────────┴────────┐
              │                          │
              ▼                          │
       ┌──────────────┐                  │
       │   PRIMARY    │                  │
       │   (Master)   │                  │
       └──────┬───────┘                  │
              │ Binlog Async             │
              ▼                          │
       ┌──────────────┐                  │
       │   REPLICA    ├──────────────────┘
       │ (Read-Only)  │
       └──────────────┘
```

1. Operasi **Tulis** (`INSERT`, `UPDATE`, `DELETE`) diarahkan 100% ke **Primary Node**.
2. Operasi **Baca** (`SELECT`) disebar secara merata ke satu atau lebih **Replica Nodes**.

---

## 3. Masalah "Replication Lag" & Solusinya

Karena replikasi bawaan MySQL bersifat **Asynchronous**, ada selisih waktu beberapa milidetik atau detik sebelum data dari Primary masuk ke Replica.

> 💥 **Kasus Nyata**: User update profil di Primary, layar langsung reload membaca dari Replica. Data belum sampai di Replica, sehingga user melihat profil lamanya kembali (*Replication Lag*).

### Solusi Praktis di Backend:
- **Read-Your-Own-Writes**: Simpan timestamp mutasi di session user. Jika user baru saja update data dalam 5 detik terakhir, paksa query baca berikutnya diarahkan langsung ke **Primary**.
- **Semi-Synchronous Replication**: Primary baru menganggap transaksi sukses jika minimal 1 Replica sudah mengonfirmasi menerima binlog ke Relay Log.

---

## 4. Backup Panas Tanpa Lock: `mysqldump`

Jangan pernah menjalankan `mysqldump` mentah di server produksi karena bisa mengunci seluruh tabel! Selalu gunakan opsi **`--single-transaction`**:

```bash
# 1. Backup aman online tanpa mengunci InnoDB (Consistent Snapshot):
mysqldump -u root -p \
  --single-transaction \
  --quick \
  --default-character-set=utf8mb4 \
  --routines --triggers \
  nama_database > backup_db.sql

# 2. Restore database:
mysql -u root -p nama_database_baru < backup_db.sql
```

> 💡 **Arti Opsi**:
> - `--single-transaction`: Membuat snapshot isolasi `REPEATABLE READ` sebelum dump dimulai, sehingga aplikasi tetap bisa melakukan write tanpa terblokir.
> - `--quick`: Membaca baris demi baris dari server tanpa memuat seluruh tabel ke memori RAM sekaligus.
