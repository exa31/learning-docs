---
title: "04. Pipelining, Transaksi MULTI/EXEC & Scripting Lua Atomik"
description: Eliminasi latency RTT via Pipelining, transaksi optimis WATCH/MULTI/EXEC, scripting Lua atomik via EVALSHA, dan algoritma Distributed Lock di Redis.
---

# 🔴 Redis - Modul 04: Pipelining, Transaksi MULTI/EXEC & Scripting Lua Atomik

Di lingkungan performa tinggi dengan puluhan ribu request per detik, **latensi jaringan bolak-balik (Round-Trip Time / RTT)** adalah musuh terbesar. Modul ini membahas cara mengelompokkan operasi via **Pipelining**, transaksi optimis, dan **Scripting Lua atomik**.

---

## 1. Pipelining: Menghancurkan Bottleneck Latensi Jaringan (RTT)

Tanpa Pipelining, mengeksekusi 1.000 perintah membutuhkan 1.000 kali pengiriman paket TCP bolak-balik (*Ping-Pong latency*):
$$1000 \times 1\text{ ms (RTT)} = 1000\text{ ms} = 1\text{ detik}$$

**Pipelining** mengemas 1.000 perintah ke dalam **1 paket TCP tunggal**, dieksekusi beruntun di memori Redis, dan hasilnya dikembalikan dalam 1 respon bersama:
$$1 \times 1\text{ ms (RTT)} = 1\text{ ms} \quad (\mathbf{1000\times \text{ Lebih Cepat!}})$$

```python
# Contoh Pipelining di Python (redis-py):
import redis

r = redis.Redis(host="localhost", port=6379)

# 1. Buka pipeline buffer:
pipe = r.pipeline(transaction=False)

for i in range(10_000):
    pipe.set(f"user:{i}:score", i * 10) # Hanya disimpan di buffer lokal memory

# 2. Kirim seluruh 10.000 perintah dalam 1 transmisi TCP socket:
hasil = pipe.execute()
print("10.000 perintah selesai dieksekusi dalam hitungan milidetik!")
```

---

## 2. Transaksi Redis: `MULTI`, `EXEC` & `WATCH` (Optimistic Locking)

Transaksi di Redis memastikan sekumpulan perintah dieksekusi secara berurutan tanpa disela oleh client lain:

```bash
# 1. Pantau key yang ingin dilindungi (Optimistic Concurrency Control):
WATCH akun:a:saldo

# 2. Mulai antrean transaksi:
MULTI

# 3. Masukkan perintah-perintah ke antrean (Queue):
DECRBY akun:a:saldo 50000
INCRBY akun:b:saldo 50000

# 4. Eksekusi semua perintah:
EXEC
```

> [!NOTE]
> **Jika Client Lain Mengubah `akun:a:saldo` Sebelum `EXEC` Dijalankan**:
> Redis akan membatalkan seluruh transaksi dan `EXEC` mengembalikan `(nil)`. Aplikasi kita cukup menangkap nilai nil ini dan mengulang operasi (*retry*).

> [!CAUTION]
> **Tidak Ada Rollback Runtime di Redis!** Jika salah satu perintah di dalam `MULTI` gagal karena kesalahan tipe data (misal: memanggil `INCR` pada string alfabet), **perintah lain di dalam transaksi tersebut TETAP AKAN DI-COMMIT!** Redis tidak menyediakan rollback otomatis seperti PostgreSQL.

---

## 3. Lua Scripting: Eksekusi Logika Kompleks Secara Atomik Mutlak

Untuk operasi yang membutuhkan logika percabangan kondisional (`if-else`) tanpa risiko *race condition*, **Lua Scripting** adalah solusi terbaik.

Selama script Lua berjalan, **Redis mengunci eksekusi**: tidak ada perintah lain dari client lain yang bisa menyela!

### Contoh Kasus Produksi: Rate Limiter Token Bucket (Maksimal 5 Request per Menit)
```lua
-- script_rate_limiter.lua
local key = KEYS[1]
local limit = tonumber(ARGV[1])
local current = tonumber(redis.call('get', key) or "0")

if current + 1 > limit then
    return 0 -- Ditolak: Melebihi kuota limit!
else
    redis.call("INCRBY", key, 1)
    if current == 0 then
        redis.call("EXPIRE", key, 60) -- Pasang TTL 60 detik pada request pertama
    end
    return 1 -- Sukses: Request diizinkan
end
```

### Mengeksekusi Script Lua dengan `EVAL` & `EVALSHA`:
```bash
# 1. Daftarkan script ke memori Redis untuk mendapatkan hash SHA-1:
SCRIPT LOAD "local key = KEYS[1] local limit = tonumber(ARGV[1]) ... return 1"
# Output SHA-1: "6b139972b4492c300d1e982d6228b7a0f7e91244"

# 2. Eksekusi script via SHA-1 tanpa mengirim ulang teks script (Super Cepat!):
EVALSHA 6b139972b4492c300d1e982d6228b7a0f7e91244 1 rate:user:101 5
```

---

## 4. Distributed Lock yang Aman: Algoritma Redlock

Untuk mengunci resource bersama di lingkungan microservices multi-container:

### Cara Mengambil Lock:
```bash
# NX: Hanya set jika key belum ada (Not Exists)
# PX 30000: Otomatis kadaluarsa dalam 30.000ms jika pod tiba-tiba mati terbakar
SET lock:pesanan:101 "random_token_uuid_8821" NX PX 30000
```
Jika return `OK`, pod berhasil mendapatkan kunci eksklusif!

### Cara Melepas Lock yang Aman (Wajib Menggunakan Lua!):
Jangan pernah melepas lock dengan perintah `DEL lock:...` biasa, karena jika pekerjaan memakan waktu lebih dari 30 detik, lock lama sudah kedaluwarsa dan mungkin sudah diambil oleh worker lain!

```lua
-- Hanya hapus lock JIKA token UUID di dalamnya cocok dengan milik kita:
if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
else
    return 0 -- Lock sudah berpindah pemilik, jangan hapus!
end
```
```bash
EVAL "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end" 1 lock:pesanan:101 "random_token_uuid_8821"
```
