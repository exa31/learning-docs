---
title: "01. Dokumen, BSON & CRUD Dasar"
description: Anatomi BSON dan ObjectId, manipulasi dokumen dengan operasi Create, Read, Update, Delete, dan ragam operator query terlengkap di MongoDB.
---

# 🍃 MongoDB - Modul 01: Dokumen, BSON & CRUD Dasar

MongoDB adalah database NoSQL berbasis dokumen (*Document Store*) terpopuler di dunia. Alih-alih menyimpan data dalam baris dan kolom yang kaku seperti SQL relational, MongoDB menyimpan data dalam dokumen fleksibel berformat **BSON** (*Binary JSON*).

---

## 1. BSON vs JSON & Anatomi ObjectId

JSON adalah format teks biasa yang hanya mendukung tipe data terbatas (string, number, boolean, array, object, null). MongoDB menggunakan **BSON** untuk memperkaya tipe data dan efisiensi traversal biner.

| Tipe BSON Tambahan | Deskripsi | Contoh |
|---|---|---|
| **ObjectId** | Identifier unik 12-byte default untuk `_id` | `ObjectId("655f1a2b8e3c4a1234567890")` |
| **Date** | Timestamp milidetik UTC 64-bit | `ISODate("2026-11-20T10:00:00Z")` |
| **Decimal128** | Angka presisi tinggi untuk perhitungan finansial | `NumberDecimal("199.99")` |
| **Int32 / Int64** | Tipe integer signed spesifik | `NumberInt(42)`, `NumberLong(9007199254740991)` |
| **Binary data** | Penyimpanan byte mentah / file kecil | `BinData(0, "...")` |

### Struktur 12-Byte ObjectId
Setiap dokumen MongoDB memiliki primary key `_id`. Jika tidak disediakan, driver/server membuat ObjectId secara otomatis yang tersusun dari:
```
 4 bytes (Timestamp detik) + 5 bytes (Random value per proses) + 3 bytes (Counter increment)
|-------------------------|--------------------------------|-------------------------|
```
> [!TIP]
> Karena 4 byte pertama adalah timestamp UNIX, Anda bisa mengekstrak waktu pembuatan dokumen kapan saja dengan `doc._id.getTimestamp()` tanpa perlu menyimpan kolom `created_at` terpisah!

---

## 2. Operasi Create (Insert)

```javascript
// A. Insert 1 dokumen
db.users.insertOne({
  nama: "Eka Dev",
  email: "eka@dev.local",
  usia: 28,
  hobi: ["coding", "gaming"],
  alamat: {
    kota: "Jakarta",
    kodepos: 12340
  },
  status: "ACTIVE",
  terdaftar_pada: new Date()
});

// B. Insert banyak dokumen sekaligus (Batch)
db.products.insertMany([
  { sku: "KB-01", nama: "Mechanical Keyboard", harga: 750000, stok: 15 },
  { sku: "MS-02", nama: "Wireless Mouse", harga: 350000, stok: 40 },
  { sku: "MN-03", nama: "Monitor 27 Inch 4K", harga: 4200000, stok: 8 }
], { ordered: false }); // ordered: false agar jika 1 item error, item lain tetap lanjut di-insert!
```

---

## 3. Operasi Read (Query & Filter Operators)

### A. Operator Perbandingan & Logika
```javascript
// Operator perbandingan ($gt, $gte, $lt, $lte, $in, $ne)
db.products.find({
  harga: { $gte: 500000, $lte: 5000000 },
  stok: { $gt: 0 }
});

// Operator Logika ($or, $and, $not, $nor)
db.users.find({
  $or: [
    { status: "ACTIVE" },
    { usia: { $gte: 30 } }
  ]
});

// Pencarian dalam objek bersarang (Dot Notation)
db.users.find({
  "alamat.kota": "Jakarta"
});
```

### B. Operator Array Canggih
```javascript
// 1. $in: Mencocokkan elemen yang ada di daftar
db.users.find({ hobi: { $in: ["gaming", "reading"] } });

// 2. $all: Array HARUS memiliki kedua elemen tersebut
db.users.find({ hobi: { $all: ["coding", "gaming"] } });

// 3. $elemMatch: Mencari objek dalam array yang memenuhi BANYAK kondisi sekaligus
db.orders.find({
  items: {
    $elemMatch: {
      kategori: "Elektronik",
      subtotal: { $gt: 1000000 }
    }
  }
});
```

### C. Proyeksi (Memilih Field Tertentu)
```javascript
// Hanya ambil kolom nama dan email (sembunyikan _id)
db.users.find(
  { status: "ACTIVE" },
  { nama: 1, email: 1, _id: 0 }
).sort({ nama: 1 }).limit(10).skip(20);
```

---

## 4. Operasi Update (Atomic Field & Array Modifiers)

Hindari menimpa seluruh dokumen! Selalu gunakan operator modifikasi agar operasi berlangsung aman dan atomik:

```javascript
// A. Field Operators ($set, $unset, $inc)
db.products.updateOne(
  { sku: "KB-01" },
  {
    $set: { status: "PROMO" },      // Update atau tambah field baru
    $inc: { stok: -1, terjual: 1 },  // Tambah/kurang angka secara atomik
    $currentDate: { updated_at: true } // Isi dengan waktu sekarang
  }
);

// B. Array Modifiers ($push, $addToSet, $pull)
// Menambah item ke array (tanpa duplikat):
db.users.updateOne(
  { email: "eka@dev.local" },
  { $addToSet: { hobi: "traveling" } }
);

// Menghapus item dari array:
db.users.updateOne(
  { email: "eka@dev.local" },
  { $pull: { hobi: "reading" } }
);

// C. Upsert (Update jika ketemu, buat baru jika tidak ada)
db.settings.updateOne(
  { key: "maintenance_mode" },
  { $set: { value: false, updated_by: "system" } },
  { upsert: true }
);
```

---

## 5. Operasi Delete

```javascript
// Hapus 1 dokumen:
db.users.deleteOne({ email: "spammer@bad.com" });

// Hapus banyak dokumen:
db.logs.deleteMany({
  created_at: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Hapus log > 30 hari
});
```
