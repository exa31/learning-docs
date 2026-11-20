---
title: "01. Struktur Data Lengkap & Perintah"
description: 8 Struktur data Redis (Strings, Hashes, Lists, Sets, Sorted Sets, Bitmaps, HyperLogLog, Streams) dan perintah intinya.
---

# 🔴 Redis - Modul 01: Struktur Data Lengkap & Perintah

Redis (Remote Dictionary Server) adalah in-memory data store tercepat di dunia yang memproses ratusan ribu operasi per detik dengan latensi sub-millisecond. Kekuatan utama Redis terletak pada ragam **struktur data canggih** di luar key-value biasa.

---

## 1. Tabel 8 Struktur Data Redis & Use-Case

| Struktur Data | Deskripsi Singkat | Kasus Penggunaan Nyata |
|---|---|---|
| **Strings** | Nilai teks, angka integer, atau biner (maks 512MB) | Caching token JWT, session user, atomic counter |
| **Hashes** | Kumpulan field-value (mirip objek JSON) | Profil pengguna, keranjang belanja |
| **Lists** | Daftar berurutan (Doubly Linked List) | Antrean tugas (FIFO), feed riwayat aktivitas |
| **Sets** | Himpunan nilai unik tanpa duplikat | Daftar follower/following, filtering tag unik |
| **Sorted Sets (ZSET)**| Set dengan skor angka yang terurut otomatis | Leaderboard game, antrean berprioritas (*Priority Queue*) |
| **Bitmaps** | Operasi tingkat bit (0 dan 1) super hemat memori | Pelacak presensi user harian (365 hari = ~45 bytes!) |
| **HyperLogLog** | Estimasi himpunan unik kardinalitas raksasa | Menghitung visitor unik bulanan dengan RAM hanya 12KB |
| **Streams** | Log penambahan data persisten mirip Kafka | Event-driven architecture, chat message queue |

---

## 2. Perintah Inti per Struktur Data

### A. Strings (Teks & Counter)
```bash
# Simpan data dengan masa kedaluwarsa 60 detik (EX):
SET session:user:123 "eyJhbGciOi..." EX 60

# Ambil data:
GET session:user:123

# Counter atomic (Aman dari race condition):
INCR hit_counter           # Tambah 1
INCRBY hit_counter 10      # Tambah 10
DECR hit_counter           # Kurang 1
```

### B. Hashes (Objek Profil)
```bash
# Simpan banyak properti objek:
HSET user:101 nama "Eka" role "Admin" poin 150

# Ambil 1 properti:
HGET user:101 nama         # "Eka"

# Ambil seluruh isi objek:
HGETALL user:101           # {"nama": "Eka", "role": "Admin", "poin": "150"}

# Tambah angka di dalam hash secara atomic:
HINCRBY user:101 poin 50   # 200
```

### C. Lists (Antrean FIFO / Stack LIFO)
```bash
# Masukkan item ke ujung kiri (antrean masuk):
LPUSH queue:email "email_1@test.com" "email_2@test.com"

# Ambil dan hapus dari ujung kanan (FIFO Consumer):
RPOP queue:email           # "email_1@test.com"

# Intip item dari index 0 sampai 10 tanpa menghapus:
LRANGE queue:email 0 10
```

### D. Sets (Himpunan Unik & Operasi Matematika)
```bash
# Masukkan data ke set (otomatis menolak duplikat):
SADD tags:buku "pemrograman" "database" "backend" "database"

# Cek apakah member ada:
SISMEMBER tags:buku "backend" # 1 (True)

# Irisan / Intersection (Cari teman bersama / mutual friends):
SADD teman:ali "budi" "cindy" "dewi"
SADD teman:eka "budi" "dewi" "fajar"
SINTER teman:ali teman:eka    # {"budi", "dewi"}
```

### E. Sorted Sets / ZSET (Leaderboard Terurut)
```bash
# Tambahkan pemain dengan skor:
ZADD leaderboard:game 1500 "PlayerA"
ZADD leaderboard:game 2400 "PlayerB"
ZADD leaderboard:game 1800 "PlayerC"

# Ambil Top 3 skor tertinggi (Urut dari besar ke kecil):
ZREVRANGE leaderboard:game 0 2 WITHSCORES
# 1) "PlayerB", 2400
# 2) "PlayerC", 1800
# 3) "PlayerA", 1500

# Cari peringkat user:
ZREVRANK leaderboard:game "PlayerA" # Peringkat ke-2 (0-based)
```
