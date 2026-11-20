---
title: "03. Pub/Sub Ephemeral vs Redis Streams Persisten (Kafka-Like)"
description: Perbedaan arsitektur Pub/Sub vs Streams, Consumer Groups, XADD, XREADGROUP, XACK, dan pemulihan pesan macet XAUTOCLAIM di Redis.
---

# 🔴 Redis - Modul 03: Pub/Sub Ephemeral vs Redis Streams Persisten (Kafka-Like)

Redis menyediakan dua model pengiriman pesan (*messaging*): **Pub/Sub konvensional** yang bersifat instan tanpa penyimpanan, dan **Redis Streams** yang mengimplementasikan arsitektur log persisten ala Apache Kafka dengan dukungan *Consumer Groups*.

---

## 1. Perbandingan Arsitektur: Pub/Sub vs Streams

| Fitur | Pub/Sub Klasik | Redis Streams (`XADD`) |
|---|---|---|
| **Penyimpanan Pesan** | ❌ **Ephemeral**: Pesan langsung hilang setelah dikirim (*Fire-and-Forget*). | ✅ **Persisten**: Pesan disimpan di RAM dan log disk secara permanen. |
| **Subscriber Offline** | Pesan **HILANG SELAMANYA** jika subscriber sedang down/restart. | Pesan **AMAN TERSIMPAN** dan bisa dibaca ulang saat worker menyala kembali. |
| **Beban Kerja Paralel** | Semua subscriber menerima salinan pesan yang sama (Broadcast). | **Consumer Group**: Pesan didistribusikan ke worker berbeda tanpa duplikasi kerja. |
| **Konfirmasi Penerimaan** | Tidak ada (*No Acknowledgement*). | ✅ **Message ACK (`XACK`)** menjamin pesan selesai diproses (*At-Least-Once Delivery*). |

---

## 2. Pub/Sub Klasik: Broadcast Instan

Sangat cocok untuk notifikasi realtime Webhook atau invalidasi cache antar server di mana hilangnya satu pesan bukan bencana fatal:

```bash
# Terminal 1: Berlangganan topik (Blocking listener)
SUBSCRIBE notifikasi:order

# Terminal 2: Memancarkan pesan ke topik
PUBLISH notifikasi:order "Order #8821 berhasil dibayar!"

# Berlangganan dengan pola wildcard (PSUBSCRIBE):
PSUBSCRIBE notifikasi:* # Mendengarkan notifikasi:order, notifikasi:user, dll.
```

---

## 3. Redis Streams: Antrean Pesan Tangguh (Like Kafka)

Setiap entri stream diberi ID otomatis berbasis timestamp milidetik sistem: `<millisecondsTime>-<sequenceNumber>` (Contoh: `1700000000000-0`).

```mermaid
flowchart LR
    Producer["Backend App"] -->|XADD| Stream["Redis Stream: antrean:transaksi"]
    Stream --> Group["Consumer Group: group_billing"]
    Group --> W1["Worker 1 (Memproses ID 1)"]
    Group --> W2["Worker 2 (Memproses ID 2)"]
    W1 -.->|XACK (Selesai)| Stream
```

### A. Menambahkan Pesan ke Stream (`XADD`)
```bash
# Menambahkan pesan (Tanda '*' berarti ID timestamp dibuat otomatis oleh Redis):
XADD stream:order * user_id 101 total 500000 status "NEW"
# Output ID: "1732078900123-0"

# Membatasi panjang antrean maksimal 100.000 entri (Trim hemat RAM):
XADD stream:order MAXLEN ~ 100000 * user_id 102 total 120000 status "NEW"
```

---

## 4. Consumer Groups & Alur Pemrosesan Produksi

Consumer Group membagi beban kerja secara adil di antara sekelompok worker:

```bash
# 1. Buat Consumer Group bernama 'group_pemroses':
# Simbol '$' artinya group hanya mendengarkan pesan BARU yang tiba setelah group dibuat.
XGROUP CREATE stream:order group_pemroses $ MKSTREAM

# 2. Worker 1 membaca pesan yang belum pernah diambil worker lain (Simbol '>'):
XREADGROUP GROUP group_pemroses worker_a COUNT 1 BLOCK 2000 STREAMS stream:order >
# Output: Pesan dengan ID "1732078900123-0"

# 3. Worker memproses bisnis logic di backend...

# 4. Worker mengirimkan konfirmasi selesai (ACK):
XACK stream:order group_pemroses 1732078900123-0
```

---

## 5. Menangani Worker Mati: Pelacakan Pesan Gantung (`XAUTOCLAIM`)

Bagaimana jika `worker_a` mengambil pesan, namun komputernya mendadak mati (crash) sebelum sempat mengirimkan perintah `XACK`? Pesan tersebut akan tersangkut di **Pending Entries List (PEL)**.

Worker lain bisa mendeteksi dan merebut pesan yang macet tersebut:

```bash
# 1. Periksa pesan yang macet di Pending Entries List:
XPENDING stream:order group_pemroses

# 2. Rebut pesan yang sudah menganggur lebih dari 60.000 milidetik (1 menit) 
# lalu alihkan kepemilikannya ke worker_b yang masih hidup:
XAUTOCLAIM stream:order group_pemroses worker_b 60000 0-0 COUNT 1
```
Dengan mekanisme ini, sistem antrean dijamin **tidak akan pernah kehilangan pesan (*Zero Message Loss*)** bahkan ketika server worker mengalami crash di tengah proses!
