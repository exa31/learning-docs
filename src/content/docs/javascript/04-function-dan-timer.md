---
title: "04. Fungsi & Timers"
---

# 🟡 JavaScript - Modul 04: Fungsi & Timers

Cheatsheet kilat pembuatan fungsi, parameter default, rest parameter (vararg), dan pengaturan timer.

---

## 1. Jenis Deklarasi Fungsi

### A. Arrow Function (Single Expression)
Sangat ringkas. Jika isinya cuma 1 baris, tidak butuh tanda kurung `{ }` dan nilai baris itu **otomatis di-return**:
```javascript
// Single expression (auto-return):
const kaliDua = (num) => num * 2;

// Multi-line (butuh kurung kurawal & kata kunci return):
const hitungLuas = (p, l) => {
  const hasil = p * l;
  return hasil;
};
```

### B. Function Declaration biasa
```javascript
function sapa(nama) {
  return `Halo, ${nama}!`;
}
```

---

## 2. Parameter Fleksibel: Default Param & Rest Param

### Default Parameter
Memberikan nilai cadangan jika parameter tidak diisi saat fungsi dipanggil:
```javascript
function connectDb(host = "localhost", port = 5432) {
  return `Connecting to ${host}:${port}`;
}
connectDb(); // "Connecting to localhost:5432"
```

### Rest Parameter (`...args`) $\to$ Padanan `vararg` Kotlin
Menampung sisa parameter berapapun jumlahnya menjadi satu array utuh:
```javascript
function hitungTotal(...angka) {
  // 'angka' otomatis berbentuk array: [10, 20, 30]
  return angka.reduce((total, n) => total + n, 0);
}

hitungTotal(10, 20, 30); // 60
```

---

## 3. Timers (`setTimeout` & `setInterval`)

### `setTimeout(fn, ms)` & `clearTimeout(id)`
Menjalankan fungsi **satu kali** setelah jeda waktu tertentu (1000ms = 1 detik):
```javascript
const timerId = setTimeout(() => {
  console.log("Dijalankan setelah 2 detik");
}, 2000);

// Batalkan sebelum sempat jalan:
clearTimeout(timerId);
```

### `setInterval(fn, ms)` & `clearInterval(id)`
Menjalankan fungsi **berulang-ulang** setiap rentang waktu tertentu:
```javascript
let detik = 0;

const intervalId = setInterval(() => {
  detik++;
  console.log(`Detik ke-${detik}`);

  if (detik === 5) {
    clearInterval(intervalId); // Stop interval setelah 5 detik
  }
}, 1000);
```

> 🧠 **Catatan Singkat Event Loop:**
> `setTimeout(fn, 0)` tidak berjalan instan detik itu juga, karena callback timer ditaruh di antrean **MacroTask**. Thread utama harus menyelesaikan seluruh instruksi yang ada di Call Stack terlebih dahulu.
