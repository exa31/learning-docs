---
title: "02. Operator & Logika Kondisi"
---

# 🟡 JavaScript - Modul 02: Operator & Logika Kondisi

Cheatsheet kilat operator perbandingan, operator modern, dan percabangan kondisi.

---

## 1. Perbandingan: Wajib `===` (Bukan `==`)

- `==` (*Loose Equality*): Membandingkan isi dengan melakukan konversi tipe data otomatis di balik layar (sering bikin bug aneh).
- `===` (*Strict Equality*): Membandingkan **isi DAN tipe datanya**. **Selalu gunakan ini!**

```javascript
5 == "5";  // true (⚠️ Bahaya! Dianggap sama padahal tipe beda)
5 === "5"; // false ( Aman! Number !== String)

null == undefined;  // true
null === undefined; // false
```

---

## 2. Operator Modern: `?.` dan `??`

### Optional Chaining (`?.`)
Mencegah error fatal runtime `TypeError: Cannot read properties of undefined`:
```javascript
const user = { profile: null };

// ❌ Crash: user.profile.bio
//  Aman (me-return undefined tanpa bikin aplikasi crash):
const bio = user.profile?.bio;
```

### Nullish Coalescing (`??`) vs Logical OR (`||`)
- `||` menganggap angka `0`, string kosong `""`, dan `false` sebagai nilai gagal (*falsy*).
- `??` **HANYA** aktif jika nilainya beneran `null` atau `undefined`!
```javascript
const jumlahTiket = 0;

const hasilOr = jumlahTiket || 10;      // 10 (SALAH! 0 tiket malah diganti 10)
const hasilNullish = jumlahTiket ?? 10; // 0  (BENAR! 0 adalah angka valid)
```

---

## 3. Percabangan: `if...else` & Ternary Operator

### Ternary Operator (`kondisi ? jikaTrue : jikaFalse`)
Bagus untuk mempersingkat `if-else` sederhana menjadi 1 baris:
```javascript
const umur = 20;

// Versi panjang:
// let status; if (umur >= 18) { status = "Dewasa"; } else { status = "Anak"; }

// Versi Ternary:
const status = umur >= 18 ? "Dewasa" : "Anak";
```

### `switch...case` (Wajib Ada `break`)
Cocok jika ada 1 variabel yang dicek terhadap banyak kemungkinan nilai yang pasti:
```javascript
const role = "admin";

switch (role) {
  case "admin":
    console.log("Akses penuh");
    break; // Wajib break agar tidak lolos ke case berikutnya!
  case "editor":
    console.log("Akses edit artikel");
    break;
  default:
    console.log("Akses tamu");
}
```
