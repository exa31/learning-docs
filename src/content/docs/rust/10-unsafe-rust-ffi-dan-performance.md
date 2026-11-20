---
title: "10. Unsafe Rust, FFI C Interop & Performance Tuning"
description: Lima kekuatan Unsafe Rust, manipulasi raw pointers, interop C via FFI extern, abstraksi zero-cost, dan konfigurasi LTO compiler di Rust.
---

# 🦀 Rust - Modul 10: Unsafe Rust, FFI C Interop & Performance Tuning

Rust memiliki alter-ego: **Unsafe Rust**. Jika Safe Rust adalah benteng antipeluru yang diawasi Borrow Checker, maka Unsafe Rust adalah jalan tembus untuk berinteraksi langsung dengan hardware, menulis kernel driver, atau memanggil pustaka C legendaris.

---

## 1. Lima Kekuatan Super Unsafe Rust

Menulis blok `unsafe` tidak mematikan type checker dan tidak mematikan borrow checker untuk kode aman lainnya. `unsafe` hanya memberikan **5 kemampuan spesifik** yang tidak diizinkan di Safe Rust:

1. **Dereferensi Raw Pointer** (`*const T` dan `*mut T`).
2. **Memanggil fungsi atau method unsafe** (termasuk fungsi C extern).
3. **Mengimplementasikan unsafe trait** (misal: `unsafe impl Send`).
4. **Mengubah (*mutate*) variabel mutable static global**.
5. **Mengakses field dari tipe `union`**.

```rust
fn main() {
    let mut angka = 42;

    // Membuat raw pointer diizinkan di Safe Rust:
    let r1 = &angka as *const i32;
    let r2 = &mut angka as *mut i32;

    // Namun MENDEREFERENSI raw pointer HANYA BISA di dalam blok unsafe:
    unsafe {
        *r2 = 100;
        println!("r1 membaca: {}", *r1); // 100
    }
}
```

---

## 2. Raw Pointer vs Referensi Rust

| Parameter | Referensi Aman (`&T` / `&mut T`) | Raw Pointer (`*const T` / `*mut T`) |
|---|---|---|
| **Jaminan Alamat** | Dijamin menunjuk ke memori valid | **Bisa bernilai NULL** atau menunjuk ke memori acak |
| **Aturan Borrowing**| Dibatasi secara ketat oleh compiler | **Bebas**: Boleh ada 10 pointer mutable ke memori yang sama! |
| **Pembersihan Memori**| Mengikuti masa hidup (Lifetimes) | Tidak ada pelacakan lifetime otomatis |

---

## 3. Foreign Function Interface (FFI): Memanggil Fungsi C dari Rust

Rust memiliki kompatibilitas tingkat ABI biner (*Application Binary Interface*) yang mulus dengan bahasa C:

```rust
use std::os::raw::c_int;

// Deklarasi fungsi eksternal dari pustaka C libc standar
extern "C" {
    fn abs(input: c_int) -> c_int;
}

fn main() {
    let minus = -25;
    
    // Pemanggilan fungsi C wajib dibungkus unsafe
    let positif = unsafe { abs(minus) };
    
    println!("Nilai absolut dari C: {}", positif); // 25
}
```

### Mengekspor Fungsi Rust agar Bisa Dipanggil oleh C/C++:
```rust
// #[no_mangle] mencegah compiler mengubah nama simbol fungsi saat kompilasi
#[no_mangle]
pub extern "C" fn kali_dua(n: i32) -> i32 {
    n * 2
}
```

---

## 4. Filosofi "Zero-Cost Abstractions"

Bjarne Stroustrup mendefinisikan *Zero-Overhead Principle*: *"Apa yang tidak kamu gunakan, tidak kamu bayar. Apa yang kamu gunakan, tidak bisa kamu tulis dengan tangan secara lebih baik."*

Di Rust, rantai iterator functional dioptimalkan (*inlined & vectorized*) oleh LLVM menjadi kode assembly mesin yang **sama cepatnya atau bahkan lebih cepat** dibanding loop C manual:

```rust
// Kode functional tingkat tinggi ini...
let total: i32 = data.iter()
    .filter(|&&x| x > 0)
    .map(|&x| x * 2)
    .sum();

// ...dikompilasi oleh LLVM optimizer menjadi instruksi SIMD vektor CPU tunggal!
```

---

## 5. Performance Tuning & Konfigurasi Release di `Cargo.toml`

Untuk mendapatkan performa binary tertinggi pada aplikasi produksi, optimalkan konfigurasi compiler di `Cargo.toml`:

```toml
[profile.release]
# Tingkat optimasi CPU tertinggi (0 - 3)
opt-level = 3

# Link-Time Optimization: Memungkinkan compiler meng-inline fungsi lintas crate/library
lto = true

# Satukan semua unit kompilasi menjadi 1 agar analisa optimizer lebih mendalam
codegen-units = 1

# Panic mematikan program langsung tanpa unwinding stack (memperkecil ukuran binary)
panic = "abort"

# Buang simbol debug untuk memperkecil ukuran file executable
strip = true
```

Jalankan build produksi dengan:
```bash
cargo build --release
```
Binary hasil kompilasi akan berada di folder `target/release/` dengan kecepatan eksekusi maksimum dan ukuran memori paling ramping!
