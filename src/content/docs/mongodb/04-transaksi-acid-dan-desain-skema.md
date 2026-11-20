---
title: "04. Desain Skema (Embedding vs Referencing) & Transaksi ACID"
description: Aturan emas pemodelan dokumen, bahaya 16MB limit unbounded arrays, Subset Pattern, dan transaksi multi-dokumen ACID di MongoDB.
---

# 🍃 MongoDB - Modul 04: Desain Skema (Embedding vs Referencing) & Transaksi ACID

Kekuatan terbesar sekaligus jebakan paling mematikan di MongoDB adalah kebebasan skema (*Schemaless*). Merancang struktur dokumen tanpa memahami pola akses data akan memicu dokumen membengkak, kehabisan RAM, dan performa query anjlok.

---

## 1. Aturan Emas Pemodelan Dokumen MongoDB

Prinsip fundamental NoSQL MongoDB:
> *"Data yang selalu diakses bersamaan, harus disimpan bersamaan di dalam satu dokumen yang sama!"*

| Pola Relasi | Strategi Terbaik | Contoh Kasus | Alasan Teknis |
|---|:---:|---|---|
| **Satu ke Sedikit (1:Few)** | **Embedding** (Bersarang) | User dengan 2 alamat rumah | 1 kali read query langsung mendapatkan seluruh profil tanpa JOIN. |
| **Satu ke Banyak (1:Many)** | **Referencing** (ID Referensi) | Toko dengan 50.000 produk | Mencegah dokumen toko membengkak melebihi batas fisik. |
| **Banyak ke Banyak (N:M)** | **Referencing 2 Arah** | Siswa & Mata Pelajaran | Menjaga independensi entitas dan kemudahan agregasi. |

---

## 2. ⚠️ Bahaya Fatal: Batas 16MB & Anti-Pattern "Unbounded Array"

MongoDB memiliki **batas ukuran dokumen mutlak maksimal sebesar 16 Megabyte**.

```javascript
// CONTOH ANTI-PATTERN SANGAT BERBAHAYA:
// Menyimpan riwayat sensor IoT ke dalam array dokumen yang sama selamanya
db.sensor.updateOne(
    { _id: 101 },
    { $push: { riwayat_baca: { suhu: 28.5, waktu: new Date() } } } // SETIAP DETIK DI-PUSH!
);
```

### Mengapa Ini Berbahaya?
Setelah beberapa bulan, array `riwayat_baca` akan mencapai 16MB. MongoDB akan **melempar error penulisan dan dokumen akan rusak selamanya**. Selain itu, memindahkan dokumen yang membesar di disk memicu fragmentasi parah (*document relocation overhead*).

### Pola Solusi Produksi: The Subset Pattern & Bucket Pattern
Pecah data menjadi dokumen per jam atau dokumen per 100 entri:
```javascript
// BUCKET PATTERN (1 Dokumen Menampung 1 Jam):
{
    sensor_id: 101,
    jam_ke: "2026-11-20 11:00",
    total_sampel: 60,
    suhu_rata_rata: 28.4,
    bacaan: [ /* Maksimal 60 elemen data per bucket */ ]
}
```

---

## 3. Transaksi Multi-Dokumen ACID (MongoDB 4.0+)

Meskipun operasi pada 1 dokumen selalu bersifat atomik, transfer saldo antar rekening melibatkan **2 dokumen berbeda** yang wajib dilindungi transaksi ACID:

```javascript
const { MongoClient } = require("mongodb");
const client = new MongoClient("mongodb://replica-set-host:27017");

async function transferSaldo(dariUserId, keUserId, nominal) {
    // 1. Mulai session klien
    const session = client.startSession();

    try {
        // 2. withTransaction otomatis menangani retry jika terjadi Transient Transaction Error:
        await session.withTransaction(async () => {
            const db = client.db("bank");

            // Kurangi saldo pengirim:
            const debit = await db.collection("rekening").updateOne(
                { _id: dariUserId, saldo: { $gte: nominal } },
                { $inc: { saldo: -nominal } },
                { session } // WAJIB lampirkan session!
            );

            if (debit.matchedCount === 0) {
                throw new Error("Saldo tidak mencukupi atau user tidak ditemukan!");
            }

            // Tambah saldo penerima:
            await db.collection("rekening").updateOne(
                { _id: keUserId },
                { $inc: { saldo: nominal } },
                { session }
            );

            // Catat log mutasi:
            await db.collection("mutasi").insertOne(
                { dari: dariUserId, ke: keUserId, nominal, tanggal: new Date() },
                { session }
            );
        });

        console.log("Transaksi transfer ACID sukses dan permanen di-commit!");
    } catch (error) {
        console.error("Transaksi dibatalkan otomatis (ROLLBACK):", error.message);
    } finally {
        await session.endSession();
    }
}
```
> [!NOTE]
> Transaksi multi-dokumen di MongoDB **wajib berjalan di atas kluster Replica Set atau Sharded Cluster**, tidak bisa berjalan di instance standalone single-node!
