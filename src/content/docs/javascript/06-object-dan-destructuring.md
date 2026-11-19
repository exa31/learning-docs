---
title: "06. Objek & Destructuring"
---

# 🟡 JavaScript - Modul 06: Objek & Destructuring

Cheatsheet kilat manipulasi objek, pembongkaran data (*destructuring*), dan penyalinan data (*spread*).

---

## 1. Membongkar Data: Destructuring

### A. Destructuring Objek
Mengambil nilai dari dalam objek ke dalam variabel langsung:
```javascript
const user = { id: 1, username: "eko_k", umur: 27 };

// Ambil username tapi ganti nama variabel jadi 'nama', dan kasih default value untuk 'role':
const { username: nama, umur, role = "user" } = user;

console.log(nama); // "eko_k"
console.log(role); // "user"
```

### B. Destructuring Array
Mengambil data berdasarkan posisi urutannya. Gunakan koma kosong untuk melompati item yang tidak diperlukan:
```javascript
const warna = ["Merah", "Hijau", "Biru"];

// Ambil item ke-1 dan ke-3:
const [pertama, , ketiga] = warna;
console.log(pertama, ketiga); // "Merah", "Biru"
```

---

## 2. Spread Operator (`...`) pada Objek & Array

Digunakan untuk menyalin (*clone*) dan menimpa (*merge/override*) data tanpa merusak objek aslinya (mirip fungsi `.copy()` pada data class Kotlin):

```javascript
const profilLama = { nama: "Ali", role: "member", status: "aktif" };

// Salin profil dan perbarui role-nya:
const profilBaru = { ...profilLama, role: "admin" };
// Hasil: { nama: "Ali", role: "admin", status: "aktif" }

// Gabung dua array:
const list1 = [1, 2];
const list2 = [3, 4];
const gabungan = [...list1, ...list2]; // [1, 2, 3, 4]
```

---

## 3. Manipulasi Objek Bawaan (`Object`)

```javascript
const motor = { merk: "Yamaha", cc: 155 };

// 1. Ambil daftar key:
Object.keys(motor);    // ["merk", "cc"]

// 2. Ambil daftar value:
Object.values(motor);  // ["Yamaha", 155]

// 3. Ambil pasangan [key, value] (bagus untuk di-loop):
Object.entries(motor); // [ ["merk", "Yamaha"], ["cc", 155] ]

for (const [kunci, nilai] of Object.entries(motor)) {
  console.log(`${kunci} bernilai ${nilai}`);
}
```
