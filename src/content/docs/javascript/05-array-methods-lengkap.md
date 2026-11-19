---
title: "05. Array Methods Lengkap"
---

# 🟡 JavaScript - Modul 05: Array Methods Lengkap (Immutable vs Mutating)

Cheatsheet lengkap seluruh method array di JavaScript. Perhatikan tanda **Immutable** (aman, bikin array baru) vs **Mutating** (mengubah array asli).

---

## 1. Transformasi & Bikin Array Baru (Immutable)

| Method | Fungsi Ringkas | Return | Mutate Asli? | Contoh |
|---|---|---|---|---|
| **`map()`** | Mengubah setiap item jadi bentuk baru satu-per-satu. | Array baru | ❌ Tidak | `[1, 2].map(x => x * 2)` $\to$ `[2, 4]` |
| **`filter()`** | Saring item yang me-return `true`. | Array baru | ❌ Tidak | `[1, 2, 3].filter(x => x > 1)` $\to$ `[2, 3]` |
| **`flatMap()`** | Map lalu otomatis ratakan 1 tingkat. | Array baru | ❌ Tidak | `["a b"].flatMap(s => s.split(" "))` $\to$ `["a", "b"]` |
| **`flat()`** | Meratakan array bersarang (nested). | Array baru | ❌ Tidak | `[1, [2, 3]].flat()` $\to$ `[1, 2, 3]` |
| **`slice(start, end)`**| Potong sebagian isi array tanpa merusak aslinya. | Array baru | ❌ Tidak | `["a", "b", "c"].slice(1, 3)` $\to$ `["b", "c"]` |
| **`concat()`** | Gabung dua array jadi satu. | Array baru | ❌ Tidak | `[1].concat([2])` $\to$ `[1, 2]` |
| **`at(index)`** | Ambil item (support index negatif dari belakang). | Elemen / `undefined` | ❌ Tidak | `["a", "b", "c"].at(-1)` $\to$ `"c"` |

---

## 2. Pencarian Data

| Method | Fungsi Ringkas | Return | Mutate Asli? | Contoh |
|---|---|---|---|---|
| **`find()`** | Cari **1 item pertama** yang cocok. | 1 elemen / `undefined` | ❌ Tidak | `users.find(u => u.id === 2)` |
| **`findIndex()`** | Cari **nomor index** item pertama yang cocok. | Number / `-1` | ❌ Tidak | `[10, 20].findIndex(x => x === 20)` $\to$ `1` |
| **`includes()`** | Cek apakah nilai ada di dalam array. | `true` / `false` | ❌ Tidak | `["admin", "user"].includes("admin")` $\to$ `true` |
| **`some()`** | Cek apakah **minimal ada 1** yang cocok. | `true` / `false` | ❌ Tidak | `[12, 18].some(x => x >= 18)` $\to$ `true` |
| **`every()`** | Cek apakah **semua tanpa terkecuali** cocok. | `true` / `false` | ❌ Tidak | `[18, 20].every(x => x >= 18)` $\to$ `true` |

---

## 3. Akumulasi & Perhitungan

### `reduce(callback, initialValue)`
Melipat seluruh isi array jadi **1 nilai tunggal** (total angka, frekuensi kata, dsb).
- **Mutate Asli?**: ❌ Tidak.

```javascript
// Hitung total belanja:
const total = [10000, 20000, 5000].reduce((acc, curr) => acc + curr, 0); // 35000

// Hitung frekuensi kemunculan:
const buah = ["apel", "jeruk", "apel"];
const hitung = buah.reduce((acc, b) => {
  acc[b] = (acc[b] || 0) + 1;
  return acc;
}, {}); // { apel: 2, jeruk: 1 }
```

---

## 4. Mutating Methods (AWAS: Mengubah Array Asli!)

> ⚠️ Jangan dipakai langsung pada state React/Vue!

| Method | Aksi yang Dilakukan | Return | Mutate Asli? |
|---|---|---|---|
| **`push(...items)`** | Tambah item di **paling belakang**. | Panjang array baru | ⚠️ **YA** |
| **`pop()`** | Ambil & hapus item **paling belakang**. | Item yang dihapus | ⚠️ **YA** |
| **`unshift(...items)`**| Tambah item di **paling depan**. | Panjang array baru | ⚠️ **YA** |
| **`shift()`** | Ambil & hapus item **paling depan**. | Item yang dihapus | ⚠️ **YA** |
| **`splice(start, delCount, ...items)`** | Potong, hapus, atau sisip di tengah. | Array item terhapus | ⚠️ **YA** |
| **`sort()`** | Urutkan di tempat (awas: default-nya string!). | Array yang sama | ⚠️ **YA** |
| **`reverse()`** | Balik urutan elemen di tempat. | Array yang sama | ⚠️ **YA** |

```javascript
// ⚠️ Urutkan angka wajib pakai compare function (a - b):
const angka = [10, 2, 5];
angka.sort((a, b) => a - b); // [2, 5, 10]
```

---

## 5. Iterasi & Bantuan

- **`forEach()`**: Looping biasa untuk efek samping. **Tidak me-return apapun** (`undefined`). Tidak bisa di-`break`!
- **`join(separator)`**: Gabung array jadi string. `["a", "b"].join("-")` $\to$ `"a-b"`.
- **`Array.isArray(x)`**: Cek apakah variabel beneran array.
- **`Array.from(x)`**: Ubah objek iterable (seperti `Set` atau `NodeList`) jadi array.

---

## 6. Method Modern ES2023 (Versi Aman dari Mutating)

| Versi Mutating (Bahaya) | Versi Baru Aman (Immutable) | Hasil |
|---|---|---|
| `arr.sort()` | `arr.toSorted()` | Array baru yang terurut, `arr` asli tetap utuh |
| `arr.reverse()` | `arr.toReversed()` | Array baru yang terbalik, `arr` asli tetap utuh |
| `arr.splice()` | `arr.toSpliced()` | Array baru hasil potong/sisip |
| `arr[i] = val` | `arr.with(i, val)` | Array baru dengan 1 elemen diganti |
