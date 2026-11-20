---
title: "01. Sintaks Dasar, Mutability & Variable Shadowing"
description: Aturan ekspresi vs statement, let immutable vs let mut, variable shadowing, tipe skalar, integer overflow handling, dan array di Rust.
---

# 🦀 Rust - Modul 01: Sintaks Dasar, Mutability & Variable Shadowing

Rust adalah bahasa pemrograman sistem yang menawarkan performa setara C/C++ dengan **keamanan memori mutlak tanpa Garbage Collector**. Filosofi dasar Rust adalah: *Zero-Cost Abstractions* dan *Compile-Time Safety*.

---

## 1. Struktur Minimal & Perbedaan Kritis: Expression vs Statement

Di Rust, hampir segala hal adalah **Ekspresi (Expression)** yang mengevaluasi dan menghasilkan suatu nilai:

```rust
fn main() {
    println!("Halo dari Rust!");
}
```

### Hukum Semicolon (Titik Koma `;`):
- **Statement (Berakhiran `;`)**: Menjalankan instruksi tetapi **tidak mengembalikan nilai** (mengembalikan unit type `()`).
- **Expression (TANPA `;`)**: Mengembalikan nilai dari blok kode ke pemanggilnya!

```rust
fn tambah(a: i32, b: i32) -> i32 {
    a + b // PERHATIKAN: TANPA TITIK KOMA! Ini adalah return otomatis
}

// Bandingkan dengan blok ekspresi:
let hasil = {
    let x = 10;
    let y = 20;
    x * y // Nilai 200 dievaluasi dan dimasukkan ke variabel 'hasil'
};
```

---

## 2. Mutability: `let` vs `let mut`

Secara default, **semua variabel di Rust bersifat IMMUTABLE (tidak bisa diubah)**:

```rust
fn main() {
    let x = 5;
    // x = 6; // COMPILE ERROR: cannot assign twice to immutable variable `x`

    let mut y = 10; // Gunakan 'mut' jika variabel sengaja ingin diubah
    y += 5;         // Valid!
}
```

---

## 3. Variable Shadowing vs Mutability

Rust memiliki fitur unik bernama **Shadowing**: mendeklarasikan ulang variabel dengan nama yang sama menggunakan keyword `let`:

```rust
fn main() {
    let spasi = "   "; // Tipe data: &str
    
    // 1. Shadowing mengizinkan kita MENGUBAH TIPE DATA variabel:
    let spasi = spasi.len(); // Tipe data baru: usize (nilai 3)

    println!("Panjang spasi: {}", spasi);

    // 2. Bandingkan jika memakai 'mut':
    // let mut teks = "halo";
    // teks = teks.len(); // COMPILE ERROR: mismatched types (expected &str, found usize)
}
```

> [!TIP]
> **Manfaat Shadowing**: Sangat berguna saat melakukan transformasi data (misal: dari string input mentah di-parse menjadi integer valid) tanpa perlu membuat nama variabel sampah seperti `input_str` dan `input_int`.

---

## 4. Tipe Data Skalar & Penanganan Integer Overflow

Rust menyediakan kontrol presisi terhadap representasi bit di memori:

| Kategori | Tipe Data | Keterangan |
|---|---|---|
| **Signed Integers** | `i8`, `i16`, `i32`, `i64`, `i128`, `isize` | Angka bertanda (bisa negatif) |
| **Unsigned Integers**| `u8`, `u16`, `u32`, `u64`, `u128`, `usize` | Angka positif murni |
| **Floating Point** | `f32`, `f64` (default IEEE-754) | Desimal presisi tinggi |
| **Boolean** | `bool` (`true`, `false`) | 1 byte |
| **Karakter** | `char` (Contoh: `'A'`, `'🦀'`) | **4 Byte Unicode Scalar** (bukan 1 byte ASCII!) |

### ⚠️ Bahaya Integer Overflow:
Di C/C++, integer overflow memicu *Undefined Behavior*. Di Rust:
- **Mode Debug (`cargo run`)**: Program langsung **Panic** dan crash seketika demi keamanan.
- **Mode Release (`cargo run --release`)**: Rust melakukan *two's complement wrapping*.

Jika kamu sengaja membutuhkan perilaku aritmatika tertentu, gunakan method eksplisit:
```rust
let x: u8 = 255;

// 1. Wrapping: Kembali ke 0 jika melebihi batas
let w = x.wrapping_add(1); // 0

// 2. Checked: Mengembalikan Option::None jika overflow
let c = x.checked_add(1);  // None

// 3. Saturating: Mengunci pada batas maksimum
let s = x.saturating_add(10); // 255
```

---

## 5. Tipe Data Majemuk: Tuple & Fixed-Size Array

```rust
// 1. TUPLE: Menampung tipe data heterogen (Fixed length)
let user: (&str, i32, bool) = ("Eka", 28, true);
let nama = user.0; // Akses via index dot
let (n, u, a) = user; // Destructuring pola

// 2. ARRAY: Elemen dengan tipe homogen, dialokasikan di STACK (Bukan heap!)
let buffer: [u8; 4] = [0, 1, 2, 3];
let inisialisasi_nol: [i32; 100] = [0; 100]; // 100 elemen bernilai 0

// Akses index array diverifikasi saat runtime (bounds checking):
// let out = buffer[10]; // Panic: index out of bounds!
```
