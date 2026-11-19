---
title: "03. Looping & Label"
---

# 🟡 JavaScript - Modul 03: Looping (Perulangan) & Label

Cheatsheet kilat struktur perulangan di JavaScript dan cara mengontrol alurnya.

---

## 1. Jenis-Jenis Loop

### A. `for...of` (Paling Sering Dipakai untuk Array & Iterable)
Langsung mengambil **nilainya (*value*)**, bukan index. Mendukung kata kunci `break` dan `continue`.
```javascript
const buah = ["Apel", "Jeruk", "Mangga"];

for (const b of buah) {
  if (b === "Jeruk") continue; // Lewati jeruk
  console.log(b); // "Apel", "Mangga"
}
```

### B. `for` Biasa (Indeks Klasik)
Dipakai jika kamu butuh akses ke nomor index-nya secara manual atau ingin melompat dengan step tertentu:
```javascript
for (let i = 0; i < 5; i += 2) {
  console.log(i); // 0, 2, 4
}
```

### C. `for...in` (Khusus Object Keys)
Mengambil **nama properti (*key*)** dari sebuah object:
```javascript
const mobil = { merk: "Honda", tahun: 2021 };

for (const prop in mobil) {
  console.log(`${prop}: ${mobil[prop]}`);
}
```
> ⚠️ **Catatan:** Jangan gunakan `for...in` pada Array, karena tidak menjamin urutan index!

### D. `while` vs `do...while`
- `while`: Cek kondisi di awal. Jika kondisi `false`, blok kode **tidak akan pernah jalan sama sekali**.
- `do...while`: Jalankan kode dulu **minimal 1 kali**, baru setelah itu cek kondisi.
```javascript
let count = 10;

// While: tidak mencetak apapun
while (count < 5) {
  console.log("While:", count);
}

// Do-While: pasti jalan 1 kali!
do {
  console.log("Jalan minimal 1x!");
  count++;
} while (count < 5);
```

---

## 2. Loop Label (`labelName:`)

Jika kamu punya perulangan bertingkat (*nested loop*), kamu bisa memberi label pada loop terluar agar bisa di-`break` atau di-`continue` langsung dari dalam:

```javascript
loopBaris: for (let i = 0; i < 3; i++) {
  loopKolom: for (let j = 0; j < 3; j++) {
    if (i === 1 && j === 1) {
      console.log("Stop seluruh loop luar!");
      break loopBaris; // Menghentikan loop terluar langsung!
    }
    console.log(`i: ${i}, j: ${j}`);
  }
}
```
