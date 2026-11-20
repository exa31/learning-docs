---
title: "08. Change Streams Reaktif, Backup & Security RBAC"
description: Event-driven Change Streams berbasis Oplog dengan resume tokens, strategi backup mongodump/mongorestore, dan Role-Based Access Control di MongoDB.
---

# 🍃 MongoDB - Modul 08: Change Streams Reaktif, Backup & Security RBAC

Di modul penutup MongoDB ini, kita akan membahas integrasi arsitektur reaktif modern menggunakan **Change Streams**, manajemen pencadangan bencana (*Disaster Recovery*), dan konfigurasi keamanan produksi **Role-Based Access Control (RBAC)**.

---

## 1. Change Streams: Aliran Event Real-Time Berbasis Oplog

**Change Streams** memungkinkan aplikasi mendengarkan (*listen*) setiap mutasi data (`insert`, `update`, `delete`) yang terjadi di database secara *real-time* tanpa perlu melakukan *polling* berulang yang boros CPU:

```mermaid
flowchart LR
    Mutasi["User Melakukan INSERT"] --> Oplog["Oplog.rs (Replica Set)"]
    Oplog --> Stream["Change Stream Listener"]
    Stream --> Push["Kirim WebSocket Notifikasi ke Mobile App"]
    Stream --> Elastic["Update Index Elasticsearch"]
```

### Mengimplementasikan Change Streams di Node.js:
```javascript
const { MongoClient } = require("mongodb");

async function monitorPesananBaru() {
    const client = new MongoClient("mongodb://replica-set-host:27017");
    await client.connect();

    const collection = client.db("toko").collection("pesanan");

    // Buka Change Stream dengan filter pipeline agresif:
    const changeStream = collection.watch([
        {
            $match: {
                operationType: "insert",                // Hanya dengarkan INSERT baru
                "fullDocument.total": { $gte: 1000000 }  // Transaksi bernilai >= 1 Juta
            }
        }
    ]);

    console.log("👀 Mendengarkan order baru di atas Rp1.000.000...");

    // Event Loop Reaktif:
    for await (const change of changeStream) {
        console.log("🔔 Pesanan Besar Masuk:", change.fullDocument.customer_nama);
        // change._id adalah RESUME TOKEN: Jika koneksi putus, stream bisa
        // dilanjutkan tepat dari titik token ini tanpa kehilangan 1 pun event!
    }
}
```

---

## 2. Strategi Backup & Disaster Recovery: `mongodump` & `mongorestore`

Pencadangan standar produksi harus menyertakan **`--oplog`** agar data hasil dump konsisten pada satu titik waktu:

```bash
# 1. PENCADANGAN LOGIS (MONGODUMP):
# - Host: primary replica set
# - Format: BSON terkompresi gzip
# - --oplog: Wajib! Menangkap perubahan data yang terjadi saat proses dump sedang berjalan
mongodump \
  --uri="mongodb://admin:secret@primary.db.internal:27017/?replicaSet=rs0" \
  --gzip \
  --archive=/backup/backup_mongo_$(date +%F).archive.gz \
  --oplog

# 2. RESTORE DATA BENCANA (MONGORESTORE):
# --oplogReplay: Memutar kembali transaksi oplog agar hasil restore 100% konsisten
mongorestore \
  --uri="mongodb://admin:secret@new-host:27017/?replicaSet=rs0" \
  --gzip \
  --archive=/backup/backup_mongo_2026-11-20.archive.gz \
  --oplogReplay
```

---

## 3. Keamanan Produksi: Role-Based Access Control (RBAC)

Secara default, MongoDB tidak mengaktifkan otentikasi (siapa pun yang bisa mengakses port 27017 memiliki akses root!).

### Langkah 1: Aktifkan Otorisasi di `mongod.conf`
```yaml
security:
  authorization: "enabled"
  keyFile: /etc/mongodb-keyfile # Kunci enkripsi rahasia komunikasi antar node cluster
```

### Langkah 2: Buat Akun User dengan Prinsip Least Privilege
```javascript
// Pindah ke database admin:
use admin;

// 1. Buat Akun Super Admin:
db.createUser({
    user: "super_admin",
    pwd: "SuperSecureAdminPassword123!",
    roles: [{ role: "root", db: "admin" }]
});

// 2. Buat Akun Khusus untuk Microservice Aplikasi:
use toko_online;
db.createUser({
    user: "backend_app_user",
    pwd: "AppPassword456!",
    roles: [
        // Hanya boleh membaca dan menulis di database 'toko_online':
        { role: "readWrite", db: "toko_online" }
    ]
});
```
Dengan RBAC, jika akun `backend_app_user` disusupi penyerang, mereka tidak bisa menyentuh database lain atau mematikan server database!
