---
title: "08. Change Streams Reaktif, Backup & Security RBAC"
description: "Event-driven Change Streams berbasis Oplog, resume tokens, fullDocumentBeforeChange, PITR mongodump/restore, RBAC, dan Database Profiler."
---

# 🍃 MongoDB - Modul 08: Change Streams Reaktif, Backup & Security RBAC

Di modul penutup MongoDB ini, kita membahas arsitektur aplikasi reaktif *event-driven* modern menggunakan **Change Streams**, strategi pencadangan bencana titik waktu (*Point-in-Time Recovery*), administrasi keamanan **Role-Based Access Control (RBAC)**, dan alat diagnostik performa produksi.

---

## 1. Arsitektur Change Streams (Oplog-Backed Event Bus)

**Change Streams** memungkinkan aplikasi berlangganan (*subscribe*) pada setiap mutasi data (`insert`, `update`, `replace`, `delete`) yang terjadi di database secara *real-time* tanpa perlu melakukan *polling* berulang yang membebani database:

```mermaid
flowchart LR
    Mutasi["Aplikasi Menulis Transaksi"] --> Primary["Primary Replica Set"]
    Primary --> Oplog["local.oplog.rs"]
    Oplog --> Stream["Change Stream Listener Engine"]
    Stream --> ServiceA["Notification Service (WebSocket Push)"]
    Stream --> ServiceB["Search Service (Sink ke Elasticsearch)"]
    Stream --> ServiceC["Analytics Worker (Kafka Producer)"]
```

### Tiga Tingkatan Ruang Lingkup (Scope):
1. **Collection Watch**: `db.collection.watch()` — Memantau satu koleksi spesifik.
2. **Database Watch**: `db.watch()` — Memantau seluruh koleksi di dalam satu database.
3. **Deployment/Cluster Watch**: `mongoClient.watch()` — Memantau seluruh database di dalam kluster (kecuali `admin`, `local`, dan `config`).

---

## 2. Implementasi Produksi Change Streams & Resume Tokens

Secara bawaan, mutasi `update` hanya mengembalikan field yang berubah (*diff delta*). Untuk mendapatkan dokumen utuh atau snapshot sebelum dokumen berubah, konfigurasikan opsi `fullDocument`:

```javascript
const { MongoClient } = require("mongodb");

async function startReactiveEventBus() {
    const client = new MongoClient("mongodb://mongo-rs:27017/?replicaSet=rs0");
    await client.connect();

    const db = client.db("marketplace");
    const pesananCol = db.collection("pesanan");

    // Simpan token terakhir di Redis / Database lokal untuk recovery saat restart:
    let savedResumeToken = await getSavedResumeTokenFromRedis();

    const changeStream = pesananCol.watch(
        [
            // Filter hanya transaksi lunas yang bernilai besar:
            {
                $match: {
                    operationType: { $in: ["insert", "update"] },
                    "fullDocument.status": "PAID",
                    "fullDocument.total": { $gte: 1000000 }
                }
            }
        ],
        {
            // Ambil seluruh dokumen terbaru saat event terjadi:
            fullDocument: "updateLookup",
            // MongoDB 6.0+: Ambil juga dokumen SEBELUM berubah untuk audit delta:
            fullDocumentBeforeChange: "whenAvailable",
            // Jika koneksi putus, lanjutkan tepat dari token terakhir:
            resumeAfter: savedResumeToken 
        }
    );

    console.log("👀 Mendengarkan mutasi transaksi secara reaktif...");

    for await (const change of changeStream) {
        console.log(`🔔 Tipe Event: ${change.operationType}`);
        console.log(`📦 Data Baru:`, change.fullDocument);
        
        if (change.fullDocumentBeforeChange) {
            console.log(`⏪ Data Sebelum Update:`, change.fullDocumentBeforeChange);
        }

        // Simpan token resume token:
        const resumeToken = change._id;
        await saveResumeTokenToRedis(resumeToken);
    }
}
```

> [!TIP]
> **Jaminan Zero Missed Events**: Properti `change._id` adalah **Resume Token** BSON yang mencatat stempel waktu presisi dan posisi cluster optime di Oplog. Jika worker aplikasi kamu crash atau jaringan putus selama 3 jam, kamu cukup menyalakan kembali worker dengan menyertakan `resumeAfter: token`. MongoDB akan memutar ulang seluruh event yang terlewat selama 3 jam tersebut secara sempurna!

---

## 3. Keamanan Produksi: Role-Based Access Control (RBAC)

Secara default, MongoDB tidak mengaktifkan otentikasi. Siapa pun yang mengakses port 27017 memiliki akses root tanpa password!

### Langkah 1: Buat KeyFile & Aktifkan Otorisasi di `mongod.conf`
```bash
# 1. Generate keyfile acak untuk enkripsi komunikasi internal antar-node kluster:
openssl rand -base64 756 > /etc/mongodb-keyfile
chmod 400 /etc/mongodb-keyfile
chown mongodb:mongodb /etc/mongodb-keyfile
```

```yaml
# /etc/mongod.conf:
security:
  authorization: "enabled"
  keyFile: /etc/mongodb-keyfile
net:
  port: 27017
  bindIp: 127.0.0.1,192.168.1.10 # Jangan bind ke 0.0.0.0 publik tanpa firewall!
```

### Langkah 2: Buat Akun Berdasarkan Prinsip Hak Akses Terkecil (Least Privilege)
```javascript
use admin;

// 1. Akun Root Super Administrator:
db.createUser({
    user: "cluster_superadmin",
    pwd: "UltraSecretPassword123!",
    roles: [{ role: "root", db: "admin" }]
});

// 2. Akun Khusus Backup Agent (Hanya hak baca seluruh DB dan Oplog):
db.createUser({
    user: "backup_agent",
    pwd: "BackupServicePassword456!",
    roles: [
        { role: "backup", db: "admin" },
        { role: "clusterMonitor", db: "admin" }
    ]
});

// 3. Akun Microservice Aplikasi (Hanya RW di database aplikasi sendiri):
use ecommerce;
db.createUser({
    user: "orders_microservice",
    pwd: "AppPassword789!",
    roles: [
        { role: "readWrite", db: "ecommerce" } // DILARANG memberi role root!
    ]
});
```

### Pembuatan Custom Role Granular:
Jika butuh hak akses khusus (misal analis data yang hanya boleh baca tapi dilarang mengekspor koleksi kredensial):
```javascript
use admin;
db.createRole({
    role: "financialAnalyst",
    privileges: [
        {
            resource: { db: "ecommerce", collection: "laporan_keuangan" },
            actions: ["find"]
        }
    ],
    roles: []
});
```

---

## 4. Pencadangan Bencana & Point-in-Time Recovery (PITR)

Pencadangan standar produksi **WAJIB** menyertakan flag `--oplog` agar snapshot data konsisten pada satu titik waktu tanpa inkonsistensi saat dump sedang berjalan.

```mermaid
flowchart LR
    Dump["mongodump --oplog\n(Snapshot Koleksi + Oplog Berjalan)"] --> Archive["File backup.archive.gz"]
    Archive --> Restore["mongorestore --oplogReplay\n(Replay Oplog ke Status Konsisten)"]
```

### A. Logical Backup dengan `mongodump` & `mongorestore`:
```bash
# 1. EKSEKUSI PENCADANGAN KONSISTEN (MONGODUMP):
mongodump \
  --uri="mongodb://backup_agent:Secret@mongo-primary:27017/?replicaSet=rs0" \
  --gzip \
  --archive="/backups/mongo_backup_$(date +%F_%H-%M).gz" \
  --oplog

# 2. RESTORE BENCANA KE SERVER BARU (MONGORESTORE):
mongorestore \
  --uri="mongodb://cluster_superadmin:Secret@new-mongo-host:27017/?replicaSet=rs0" \
  --gzip \
  --archive="/backups/mongo_backup_2026-11-20_11-00.gz" \
  --oplogReplay
```

### B. Point-in-Time Recovery (PITR):
Jika seorang developer tidak sengaja menghapus tabel pada pukul **11:15:30**, kamu bisa memutar kembali database tepat ke detik **11:15:29** menggunakan flag `--oplogLimit`:
```bash
mongorestore \
  --gzip \
  --archive="/backups/mongo_backup_2026-11-20_11-00.gz" \
  --oplogReplay \
  --oplogLimit="1763612129:1" # Format UnixTimestamp:Ordinal (Tepat 1 detik sebelum drop!)
```

---

## 5. Pemantauan & Database Profiler

MongoDB memiliki profiler bawaan untuk mencatat seluruh query yang melebihi batas waktu eksekusi tertentu (*Slow Queries*):

```javascript
// 1. Aktifkan Profiler untuk query yang berjalan > 100 milidetik:
// Tingkat 0 = Off, Tingkat 1 = Slow Ops Only, Tingkat 2 = Semua Query
db.setProfilingLevel(1, { slowms: 100 });

// 2. Analisis Query Paling Lambat dari koleksi internal 'system.profile':
db.system.profile.find({ millis: { $gt: 100 } })
    .sort({ ts: -1 })
    .limit(5)
    .pretty();
```

### Menemukan & Mematikan Operasi yang Macet (Killed Stalled Ops):
```javascript
// 1. Temukan query yang sudah berjalan lebih dari 30 detik:
db.currentOp({ "secs_running": { $gte: 30 } });

// 2. Bunuh operasi tersebut secara paksa menggunakan opid-nya:
db.killOp(1948201);
```

### Utilitas Diagnostik Terminal:
- **`mongostat`**: Menampilkan metrik real-time per detik (jumlah `insert`, `query`, `update`, `delete`, persentase `dirty` cache, dan penggunaan bandwidth).
- **`mongotop`**: Menampilkan koleksi mana yang paling banyak menghabiskan waktu CPU baca/tulis.
