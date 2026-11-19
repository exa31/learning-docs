---
title: "01. Sintaks Dasar & Mutability"
description: Entrypoint fn main, let immutable by default vs let mut, shadowing, scalar types, dan compound types di Rust.
---

# 🦀 Rust - Modul 01: Sintaks Dasar & Mutability

Cheatsheet kilat bahasa Rust: bahasa sistem dengan jaminan keamanan memori (*memory safety*) dan kecepatan setara C/C++ tanpa Garbage Collector.

---

## 1. Titik Masuk & Print Makro

Setiap program Rust diawali dari fungsi `fn main()`. Tanda seru `!` pada `println!` menandakan pemanggilan **makro** (bukan fungsi biasa):

```rust
fn main() {
    println!("Halo dari Rust!");
    // Print variabel dengan format kurung kurawal {}:
    let nama = "Eka";
    println!("Halo, {}!", nama);
}
```

---

## 2. Aturan Emas: Variabel Immutable Secara Default

Di Rust, semua variabel **tidak bisa diubah nilainya secara default**:

```rust
fn main() {
    let x = 5;
    // x = 6; // ❌ Error Compiler: cannot assign twice to immutable variable!

    //  Gunakan 'mut' jika nilainya memang ingin diubah:
    let mut y = 5;
    y = 10; // Aman!
}
```

---

## 3. Variable Shadowing (Deklarasi Ulang)

Kamu bisa mendeklarasikan ulang variabel dengan nama yang sama menggunakan kata kunci `let`. Ini sangat berguna untuk mengubah tipe data tanpa harus membuat nama variabel baru:

```rust
fn main() {
    let spasi = "   ";           // Tipe: &str (string slice)
    let spasi = spasi.len();     // Tipe: usize (angka jumlah karakter)
    println!("Panjang: {}", spasi); // 3
}
```

---

## 4. Tipe Data Skalar & Komposit

```rust
fn main() {
    // 1. Integer (i32 default, u8-u128, isize/usize):
    let angka_positif: u32 = 100;
    let angka_desimal: f64 = 3.14;
    let aktif: bool = true;
    let emoji: char = '🦀'; // Tipe char Rust berukuran 4-byte (Unicode native)

    // 2. Tuple (Ukuran tetap, tipe elemen boleh campur):
    let info: (&str, i32) = ("Ali", 25);
    println!("Nama: {}, Umur: {}", info.0, info.1);

    // 3. Array (Ukuran tetap di stack memory):
    let list_angka: [i32; 3] = [10, 20, 30];
    println!("Item pertama: {}", list_angka[0]);
}
```
