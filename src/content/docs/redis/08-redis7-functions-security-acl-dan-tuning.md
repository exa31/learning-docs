---
title: "08. Redis 7 Functions, Security ACL & Linux Kernel Tuning"
description: Redis 7 Functions vs EVAL Lua, Access Control Lists (ACL) per-user, dan tuning kernel Linux produksi (vm.overcommit_memory & THP) di Redis.
---

# 🔴 Redis - Modul 08: Redis 7 Functions, Security ACL & Linux Kernel Tuning

Di modul penutup Redis ini, kita akan membahas evolusi arsitektur terbaru di **Redis 7.0+**: fitur **Redis Functions**, sistem keamanan modern berbasis **Access Control Lists (ACL)**, dan pengaturan *Kernel Linux host* yang wajib disetel agar server tidak mengalami crash di bawah beban tinggi.

---

## 1. Redis 7.0+ Functions: Pengganti `EVAL` Lua Legacy

Sebelum Redis 7, script Lua yang dikirim via `EVAL` atau `SCRIPT LOAD` bersifat *ephemeral*: tersimpan di memori sementara dan tidak menjadi bagian dari struktur data database. Klien aplikasi harus memastikan script sudah ter-load di setiap node.

**Redis Functions** menjadikan kode logika bisnis sebagai **warga negara kelas satu (*first-class citizen*)**:
- Fungsi disimpan di dalam file RDB snapshot dan direplikasi secara otomatis ke seluruh Replica.
- Dikelompokkan ke dalam pustaka bernama (*Library*) dengan deklarasi *Shebang* `#!lua`.

```lua
#!lua name=MathLib
redis.register_function('tambah_dan_expire', function(keys, args)
    local key = keys[1]
    local val = tonumber(args[1])
    local ttl = tonumber(args[2])

    local baru = redis.call('INCRBY', key, val)
    redis.call('EXPIRE', key, ttl)
    return baru
end)
```

### Memuat dan Memanggil Fungsi:
```bash
# 1. Daftarkan Library ke Redis Server:
FUNCTION LOAD "#!lua name=MathLib\nredis.register_function('tambah_dan_expire', function(keys, args) ... end)"

# 2. Panggil fungsi dengan FCALL (Sangat bersih dan type-safe!):
FCALL tambah_dan_expire 1 counter:user:101 10 3600
```

---

## 2. Keamanan Modern: Access Control Lists (ACL) di Redis 6+

Sebelum Redis 6, Redis hanya memiliki satu password global kotor (`requirepass`). Siapa pun yang memiliki password tersebut bisa menjalankan perintah berbahaya seperti `FLUSHALL` (menghapus seluruh database) atau `SHUTDOWN`.

**ACL memungkinkan pembuatan akun user terisolasi dengan hak akses spesifik per key dan per perintah**:

```bash
# 1. Buat User Khusus untuk Microservice Order:
# - User aktif (on)
# - Password: SuperSecretOrderPass123!
# - HANYA boleh membaca & menulis key dengan prefix 'order:*' (~order:*)
# - HANYA boleh menjalankan kategori perintah baca & tulis (+@read +@write)
# - DILARANG menjalankan perintah admin (-@admin -FLUSHALL -KEYS)
ACL SETUSER order_service on >SuperSecretOrderPass123! ~order:* +@read +@write -@admin -FLUSHALL

# 2. Pengujian Login:
AUTH order_service SuperSecretOrderPass123!

SET order:101 "Data Order" # SUKSES!
SET user:101 "Data User"   # DITOLAK: (error) NOPERM this user has no permissions to access 'user:101'
FLUSHALL                   # DITOLAK: (error) NOPERM this user has no permissions for this command!
```

---

## 3. Konfigurasi Wajib Kernel Linux Host (Anti Crash)

Menjalankan Redis di server Linux tanpa menyetel 3 parameter kernel berikut adalah penyebab #1 server database mengalami *Out-Of-Memory (OOM)* atau latensi melonjak ribuan milidetik:

### 1. `vm.overcommit_memory = 1` (Paling Krusial!)
Saat Redis menjalankan `BGSAVE` snapshot RDB atau AOF rewrite, Redis memanggil `fork()`. Jika parameter ini bernilai default `0`, kernel Linux akan menolak pemanggilan fork jika RAM terpakai $>50\%$ karena khawatir memori tidak cukup!

```bash
# Jalankan di terminal Linux:
sudo sysctl vm.overcommit_memory=1

# Jadikan permanen di /etc/sysctl.conf:
echo "vm.overcommit_memory = 1" | sudo tee -a /etc/sysctl.conf
```

### 2. Matikan Transparent Huge Pages (THP)
Fitur *Transparent Huge Pages* di Linux mengalokasikan memori dalam blok raksasa 2MB alih-alih 4KB biasa. Saat Redis melakukan Copy-On-Write (COW), modifikasi 1 byte data akan memaksa OS menyalin seluruh blok 2MB ke memori baru, memicu **lonjakan konsumsi RAM drastis dan latensi spike parah**!

```bash
# Matikan THP seketika:
echo never | sudo tee /sys/kernel/mm/transparent_hugepage/enabled

# Tambahkan ke /etc/rc.local agar tetap mati saat server reboot!
```

### 3. Tingkatkan Batas Antrean Socket: `somaxconn`
```bash
# Naikkan batas antrean backlog TCP dari default 128 menjadi 65535:
sudo sysctl -w net.core.somaxconn=65535
```
Dengan ketiga konfigurasi kernel di atas, Redis siap melayani jutaan transaksi per detik di lingkungan Kubernetes produksi tanpa kendala!
