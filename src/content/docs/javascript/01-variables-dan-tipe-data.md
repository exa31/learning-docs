---
title: "01. Variabel & Tipe Data"
---

# 🟡 JavaScript - Modul 01: Variabel & Tipe Data

Cheatsheet kilat deklarasi variabel dan tipe data di JavaScript.

---

## 1. Deklarasi: `const` vs `let` vs `var`

| Keyword | Bisa Diubah Nilainya (*Reassign*)? | Scope | Catatan |
|---|---|---|---|
| **`const`** | ❌ Tidak bisa | Block `{ }` | **Gunakan ini sebagai default!** Nilai aman tidak bisa ditimpa sembarangan. |
| **`let`** |  Bisa | Block `{ }` | Pakai ini hanya jika nilainya memang bakal berubah (misal: counter loop). |
| **`var`** |  Bisa | Function | ⚠️ **JANGAN DIPAKAI LAGI!** Bersifat global/function scope dan kena *hoisting* aneh. |

### Contoh:
```javascript
const pi = 3.14;
// pi = 3.15; // ❌ Error: Assignment to constant variable!

let skor = 10;
skor = 20; //  Aman

// ⚠️ Perhatian const pada Array & Object:
// const mengunci referensi memorinya, BUKAN isinya!
const user = { name: "Ali" };
user.name = "Budi"; //  Bisa! Isinya boleh diubah.
// user = { name: "Budi" }; // ❌ Error! Tidak boleh ganti objek baru.
```

---

## 2. Tipe Data Primitif vs Reference

### Primitif (Disimpan berdasarkan nilai / *Value*)
- `string`: Teks (`"halo"` atau `'halo'`)
- `number`: Angka desimal maupun bulat (`10`, `3.14`, `NaN`, `Infinity`)
- `boolean`: `true` atau `false`
- `null`: Sengaja dikosongkan nilainya
- `undefined`: Variabel sudah dibuat tapi belum dikasih nilai
- `bigint`: Angka sangat besar (`100n`)
- `symbol`: Identifier unik (`Symbol("id")`)

### Reference (Disimpan berdasarkan alamat memori / *Reference*)
- `Object`: `{ nama: "Eka", umur: 25 }`
- `Array`: `[1, 2, 3]`
- `Function`: `function() {}`

```javascript
// Bukti beda Primitif vs Reference:
let a = 10;
let b = a;
b = 20;
console.log(a); // Tetap 10 (Primitif tidak terpengaruh)

let arr1 = [1, 2];
let arr2 = arr1; // Mengarah ke alamat memori yang SAMA
arr2.push(3);
console.log(arr1); // Ikut berubah jadi [1, 2, 3]!
```

---

## 3. Template Literals (String Modern)
Gunakan tanda backtick (`` ` ``) untuk menyisipkan variabel dengan `${}` dan membuat teks multi-baris tanpa repot:

```javascript
const nama = "Eka";
const umur = 24;

// Cara modern:
const kalimat = `Halo nama saya ${nama}, tahun depan umur saya ${umur + 1}`;

// Multi-line langsung enter tanpa \n:
const pesan = `
  Baris 1
  Baris 2
`;
```

---

## 4. Konversi Tipe Data Cepat (*Type Casting*)

```javascript
// Ke String:
String(123);      // "123"
(123).toString(); // "123"
123 + "";         // "123" (trik cepat)

// Ke Number:
Number("42");     // 42
+"42";            // 42 (trik cepat unary plus)
parseInt("10px"); // 10 (mengambil angka di awal)
Number("abc");    // NaN (Not a Number)

// Ke Boolean:
Boolean(1);       // true
Boolean(0);       // false
Boolean("");      // false (string kosong)
Boolean("ada");   // true
Boolean(null);    // false
Boolean(undefined)// false
!!("teks");       // true (trik cepat double not)
```
