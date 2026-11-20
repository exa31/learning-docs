---
title: "03. Pub/Sub vs Redis Streams"
description: Perbedaan Pub/Sub fire-and-forget vs Redis Streams persisten (XADD, XREAD, Consumer Groups, XACK, dan Pending Entries List).
---

# 🔴 Redis - Modul 03: Pub/Sub vs Redis Streams

Redis memiliki dua mekanisme olah pesan (*messaging*): **Pub/Sub klasik** untuk siaran instan tanpa jejak, dan **Redis Streams** untuk antrean pesan persisten dengan Consumer Group mirip Apache Kafka versi ringan.

---

## 1. Pub/Sub Klasik (Fire-and-Forget)

Pola siaran pesan real-time: penerbit (*publisher*) mengirim pesan ke saluran (*channel*), dan semua pelanggan (*subscriber*) yang sedang mendengarkan akan menerima pesan tersebut.

```bash
# Sesi 1: Subscriber mendengarkan channel 'notif:transaksi'
SUBSCRIBE notif:transaksi

# Sesi 2: Publisher mengirim pesan
PUBLISH notif:transaksi "Order #101 berhasil dibayar!"
```

### Kelemahan Fatal Pub/Sub Klasik:
> ⚠️ **TIDAK ADA PERSISTENSI**: Jika server worker subscriber sedang mati, restart, atau mengalami lonjakan network lag selama 2 detik saja, **pesan yang dipublikasikan saat itu HILANG SELAMANYA** tanpa bisa diputar ulang!

---

## 2. Redis Streams (Arsitektur Pesan Modern & Persisten)

Redis Streams (tersedia sejak Redis 5.0) adalah log pesan yang **disimpan secara persisten ke memori/disk**, mendukung riwayat pesan, penomoran urut otomatis berdasarkan waktu (*millisecond timestamp*), dan Consumer Groups.

### A. Memasukkan Pesan ke Stream (`XADD`)
Gunakan tanda bintang `*` agar Redis membuat Message ID unik berbasis waktu otomatis:

```bash
# XADD <stream-key> <ID> <field> <value> ...
XADD pesanan:masuk * user_id "101" total "500000" barang "MacBook"
# Output ID: "1732098765432-0" (timestamp-sequence)
```

### B. Membaca Pesan Sendiri (`XREAD`)
```bash
# Baca 2 pesan pertama dari awal stream (ID 0-0):
XREAD COUNT 2 STREAMS pesanan:masuk 0-0

# Polling blocking (tunggu sampai ada pesan baru, timeout 5000ms):
XREAD BLOCK 5000 STREAMS pesanan:masuk $
```

---

## 3. Consumer Groups (Pola Multi-Worker Anti Dobel Proses)

Dengan Consumer Group, banyak worker dapat bekerja sama membagi beban membaca stream tanpa khawatir memproses pesan yang sama (*Load Balanced Consumption*):

```text
                  ┌──────────────────────┐
                  │ Stream: pesanan:masuk│
                  └──────────┬───────────┘
                             │
                      Consumer Group
                   ┌─────────┴─────────┐
                   ▼                   ▼
            Worker 1 (Pesan 1)  Worker 2 (Pesan 2)
```

### Langkah 1: Buat Consumer Group
```bash
# Buat group 'group-order' yang mulai membaca dari pesan paling awal ('0'):
XGROUP CREATE pesanan:masuk group-order 0 MKSTREAM
```

### Langkah 2: Worker Membaca Pesan Baru (`>`)
Tanda `>` artinya: "Berikan saya pesan yang BELUM PERNAH diberikan ke worker manapun di group ini":
```bash
# XREADGROUP GROUP <group> <consumer-name> STREAMS <stream> >
XREADGROUP GROUP group-order worker-alpha COUNT 1 STREAMS pesanan:masuk >
```

### Langkah 3: Konfirmasi Pesan Sukses (`XACK`)
Setelah worker selesai memproses pesanan dan menyimpannya ke database, kirim konfirmasi agar pesan dikeluarkan dari antrean tertunda (*Pending Entries List*):
```bash
XACK pesanan:masuk group-order "1732098765432-0"
```

---

## 4. Menangani Worker yang Crash: `XPENDING` & `XCLAIM`

Jika Worker Alpha mengambil pesan lalu tiba-tiba servernya mati sebelum mengirim `XACK`:
1. Pesan akan tetap berada di **Pending Entries List (PEL)**.
2. Worker Bravo yang masih hidup bisa mendeteksi pesan macet dengan `XPENDING`.
3. Worker Bravo mengambil alih kepemilikan pesan tersebut dengan **`XCLAIM`** dan memprosesnya hingga tuntas.
