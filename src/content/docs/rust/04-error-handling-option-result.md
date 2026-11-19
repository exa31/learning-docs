---
title: "04. Error Handling: Option & Result"
description: Tidak ada null di Rust (Option<T>), penanganan error dengan Result<T, E>, dan operator sakti tanda tanya (?).
---

# 🦀 Rust - Modul 04: Error Handling (Option & Result)

Rust **tidak memiliki konsep nilai `null`**. Sebagai gantinya, Rust menggunakan dua enum sakti bawaan: `Option<T>` dan `Result<T, E>`.

---

## 1. Pengganti Null: `Option<T>`

Ketika sebuah data bisa saja ada atau kosong:

```rust
// Definisi internal Option bawaan Rust:
// enum Option<T> {
//     Some(T), // Jika ada datanya
//     None,    // Jika kosong (pengganti null)
// }

fn cari_user(id: u32) -> Option<String> {
    if id == 1 {
        Some(String::from("Eka"))
    } else {
        None
    }
}

fn main() {
    match cari_user(1) {
        Some(nama) => println!("User ditemukan: {}", nama),
        None => println!("User tidak ada!"),
    }
}
```

---

## 2. Penanganan Error Terstruktur: `Result<T, E>`

Ketika sebuah fungsi bisa sukses atau gagal:

```rust
// enum Result<T, E> {
//     Ok(T),  // Sukses, membawa data tipe T
//     Err(E), // Gagal, membawa error tipe E
// }

fn bagi(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err(String::from("Pembagi tidak boleh nol!"))
    } else {
        Ok(a / b)
    }
}
```

---

## 3. Operator Sakti Tanda Tanya (`?`) untuk Early Return

Daripada menulis `match` berulang-ulang untuk mengecek apakah `Result` adalah `Err`, pasang tanda tanya `?`. Jika sukses, ia otomatis membuka nilai `Ok`; jika gagal, ia **otomatis langsung me-return `Err` ke luar fungsi**:

```rust
use std::fs::File;
use std::io::{self, Read};

fn baca_isi_file(path: &str) -> Result<String, io::Error> {
    // Tanda ? otomatis me-return error jika File::open gagal:
    let mut file = File::open(path)?;

    let mut isi = String::new();
    // Tanda ? otomatis me-return error jika read_to_string gagal:
    file.read_to_string(&mut isi)?;

    Ok(isi) // Sukses
}
```

---

## 4. Helper Buka Nilai: `.unwrap()`, `.expect()`, dan `.unwrap_or()`

- **`.unwrap()`**: Ambil nilai di dalam `Some`/`Ok`. Jika ternyata `None`/`Err`, program akan **langsung crash (panic!)**. Hanya gunakan untuk testing/prototipe cepat.
- **`.expect("pesan")`**: Sama seperti `unwrap`, tetapi memberi pesan error yang jelas saat crash.
- **`.unwrap_or(default_value)`**:  **Sangat disarankan!** Memberi nilai cadangan jika kosong:
```rust
let input_user: Option<i32> = None;
let nilai = input_user.unwrap_or(0); // Bernilai 0 tanpa bikin crash!
```
