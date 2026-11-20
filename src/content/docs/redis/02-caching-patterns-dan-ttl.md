---
title: "02. Pola Caching & Kebijakan TTL"
description: Pola Cache-Aside, Write-Through, penanganan Cache Avalanche & Breakdown, perintah TTL, dan kebijakan eviksi memori LRU/LFU.
---

# 🔴 Redis - Modul 02: Pola Caching & Kebijakan TTL

Caching bukan sekadar menyimpan data di RAM; arsitektur caching yang salah bisa menyebabkan server database utama roboh seketika saat terjadi lonjakan traffic (*Cache Avalanche / Breakdown*).

---

## 1. Tiga Pola Caching Populer

### A. Cache-Aside (Lazy Loading) - Paling Sering Digunakan
Aplikasi bertanggung jawab membaca dan menulis ke cache dan database:
1. Aplikasi cek Redis: Apakah data ada?
2. **Cache Hit**: Data langsung dikembalikan ke pengguna (cepat!).
3. **Cache Miss**: Ambil data dari database (Postgres/MySQL), simpan ke Redis dengan TTL, lalu kembalikan ke pengguna.

### B. Write-Through
Aplikasi hanya menulis ke cache, dan cache yang bertugas langsung menulis ke database secara sinkronus sebelum mengonfirmasi sukses.

### C. Write-Behind (Write-Back)
Aplikasi menulis ke Redis seketika, dan worker background secara asinkronus mengumpulkan mutasi data (*batching*) lalu menyimpannya ke database beberapa detik kemudian.

---

## 2. Tiga Bencana Caching & Solusi Jitunya

### 1. Cache Avalanche (Longsoran Cache)
- **Gejala**: Ribuan key cache disetel expired di detik yang sama (misal pas tengah malam). Ketika expired bersamaan, jutaan request langsung menghujam database utama secara serentak hingga database crash.
- **Solusi**: Tambahkan **Jitter Acak** pada TTL. Jangan set statis 3600 detik; berikan nilai acak antara 3500 s.d. 3700 detik!

### 2. Cache Breakdown (Hotspot Invalidation)
- **Gejala**: Satu key yang sangat viral (misal produk flash sale iPhone) tiba-tiba expired. Ribuan request yang masuk di millisecond yang sama mencoba membaca DB secara bersamaan.
- **Solusi**: Gunakan **Distributed Lock (Mutex)**; hanya request pertama yang boleh membaca DB dan mengisi ulang cache, request lain menunggu.

### 3. Cache Penetration
- **Gejala**: Hacker sengaja meminta data dengan ID yang **tidak pernah ada di database** (`/user/-9999`). Cache miss terus terjadi dan DB dipaksa melakukan query.
- **Solusi**: Simpan nilai `null` di Redis dengan TTL pendek (misal 60 detik) atau gunakan **Bloom Filter**.

---

## 3. Manajemen Kedaluwarsa (TTL)

```bash
# 1. Pasang expired 300 detik pada key yang sudah ada:
EXPIRE produk:101 300

# 2. Cek sisa waktu hidup key (dalam detik):
TTL produk:101
# Output:
# 285   -> Sisa 285 detik
# -1    -> Key permanen (tidak ada masa kedaluwarsa)
# -2    -> Key sudah tidak ada / sudah expired terhapus

# 3. Batalkan expired (Ubah kembali jadi permanen):
PERSIST produk:101
```

---

## 4. Kebijakan Eviksi Memori (`maxmemory-policy`)

Ketika kuota RAM server Redis penuh (mencapai batas `maxmemory`), Redis harus memutuskan data mana yang harus dibuang untuk memberi ruang bagi data baru:

| Kebijakan | Cara Kerja Eviksi | Kapan Dipakai |
|---|---|---|
| **`allkeys-lru`** (Dianjurkan) | Menghapus key yang **paling lama tidak diakses** (*Least Recently Used*) dari seluruh key | Sangat ideal untuk web caching umum |
| **`volatile-lru`** | Menghapus key paling lama tidak diakses **HANYA dari key yang memiliki batas TTL** | Jika ada data permanen yang tidak boleh dihapus |
| **`allkeys-lfu`** | Menghapus key dengan **frekuensi akses terendah** (*Least Frequently Used*) | Jika ingin mempertahankan data yang paling sering dicari |
| **`noeviction`** (Default) | Menolak semua operasi write baru dengan melempar error `OOM command not allowed` | Jika Redis dipakai sebagai database utama murni |

Konfigurasi di `redis.conf`:
```text
maxmemory 2gb
maxmemory-policy allkeys-lru
```
