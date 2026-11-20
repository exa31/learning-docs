---
title: "02. Layouts & Constraints"
description: Container layout inti (Column, Row, Stack), Expanded vs Flexible, MainAxis vs CrossAxis, serta solusi error RenderFlex overflowed.
---

# 🎨 Flutter - Modul 02: Layouts & Constraints

Prinsip layout di Flutter sangat unik: **"Constraints go down, Sizes go up, Parents set positions"** (Batasan ukuran turun dari atas, ukuran dihitung widget anak ke atas, posisi ditentukan oleh parent).

---

## 1. Tiga Wadah Layout Fundamental

### A. `Column` (Vertikal: Atas ke Bawah)
```dart
Column(
  mainAxisAlignment: MainAxisAlignment.center,   // Sumbu utama (vertikal)
  crossAxisAlignment: CrossAxisAlignment.start, // Sumbu silang (horizontal)
  children: const [
    Text('Item 1'),
    Text('Item 2'),
  ],
)
```

### B. `Row` (Horizontal: Kiri ke Kanan)
```dart
Row(
  mainAxisAlignment: MainAxisAlignment.spaceBetween, // Jarak rata kiri-kanan
  crossAxisAlignment: CrossAxisAlignment.center,
  children: const [
    Text('Saldo Anda'),
    Text('Rp 2.500.000', style: TextStyle(fontWeight: FontWeight.bold)),
  ],
)
```

### C. `Stack` (Tumpukan Sumbu Z / Berlapis)
Menumpuk widget di atas widget lainnya (seperti overlay gambar atau badge):

```dart
Stack(
  children: [
    // Lapisan 1: Gambar Background
    Image.network('https://picsum.photos/300/200'),
    // Lapisan 2: Badge di pojok kanan atas
    Positioned(
      top: 10,
      right: 10,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: Colors.red,
          borderRadius: BorderRadius.circular(12),
        ),
        child: const Text('PROMO', style: TextStyle(color: Colors.white)),
      ),
    ),
  ],
)
```

---

## 2. Mengatur Ukuran: `Container` vs `SizedBox`

- **`SizedBox`**: Widget sangat ringan yang hanya memiliki properti `width` dan `height`. **Paling bagus untuk memberi jarak kosong antar-widget!**
- **`Container`**: Widget serba guna dengan dekorasi lengkap (`color`, `padding`, `margin`, `border`, `borderRadius`, `gradient`, `boxShadow`).

```dart
// 1. Memberi jarak kosong (Best Practice: SizedBox):
const SizedBox(height: 16);

// 2. Kotak bergaya dengan Container:
Container(
  width: double.infinity, // Lebar penuh
  padding: const EdgeInsets.all(16),
  margin: const EdgeInsets.symmetric(horizontal: 12),
  decoration: BoxDecoration(
    color: Colors.white,
    borderRadius: BorderRadius.circular(16),
    boxShadow: [
      BoxShadow(
        color: Colors.black.withOpacity(0.05),
        blurRadius: 10,
        offset: const Offset(0, 4),
      ),
    ],
  ),
  child: const Text('Isi Kartu Cantik'),
)
```

---

## 3. Fleksibilitas Ruang: `Expanded` vs `Flexible`

Saat berada di dalam `Row` atau `Column`:

- **`Expanded`**: Memaksa widget anak untuk **mengambil seluruh sisa ruang kosong yang tersedia** (wajib memanjang).
- **`Flexible`**: Mengizinkan widget anak untuk membesar hingga batas ruang, namun **boleh berukuran lebih kecil** jika kontennya pendek (`fit: FlexFit.loose`).

```dart
Row(
  children: [
    // Kolom kiri mengambil 1 porsi (25% sisa ruang):
    Expanded(
      flex: 1,
      child: ElevatedButton(onPressed: () {}, child: const Text('Batal')),
    ),
    const SizedBox(width: 8),
    // Kolom kanan mengambil 3 porsi (75% sisa ruang):
    Expanded(
      flex: 3,
      child: ElevatedButton(onPressed: () {}, child: const Text('Bayar Sekarang')),
    ),
  ],
)
```

---

## 4. Mengatasi Error "A RenderFlex overflowed by X pixels" (Garis Belang Kuning-Hitam)

Error paling terkenal bagi pemula Flutter: konten melebihi batas layar perangkat (overflow).

### Solusi 1: Bungkus dengan `SingleChildScrollView` (Bisa di-scroll)
```dart
Scaffold(
  body: SingleChildScrollView(
    padding: const EdgeInsets.all(16),
    child: Column(
      children: [
        // Daftar input panjang yang aman dari overflow saat keyboard muncul!
      ],
    ),
  ),
)
```

### Solusi 2: Bungkus Teks Panjang di dalam `Row` dengan `Expanded`
```dart
Row(
  children: [
    const Icon(Icons.info),
    const SizedBox(width: 8),
    // Wajib bungkus teks panjang dengan Expanded agar otomatis ganti baris (wrap):
    const Expanded(
      child: Text('Ini adalah kalimat peringatan yang sangat panjang sekali...'),
    ),
  ],
)
```
