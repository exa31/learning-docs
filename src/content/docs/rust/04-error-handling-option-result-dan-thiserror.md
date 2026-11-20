---
title: "04. Error Handling: Option, Result, Operator ? & thiserror"
description: Filosofi no-exceptions di Rust, Option<T>, Result<T, E>, operator propagasi tanda tanya (?), custom domain error dengan thiserror, dan anyhow.
---

# 🦀 Rust - Modul 04: Error Handling: Option, Result, Operator ? & thiserror

Rust **tidak memiliki sistem Exception** (`try-catch`) dan **tidak memiliki nilai `null`**. Tony Hoare (penemu pointer null) menyebut null sebagai *"Billion Dollar Mistake"* karena jutaan crash software di dunia disebabkan oleh `NullPointerException`. Di Rust, ketiadaan nilai dan potensi error **diwajibkan masuk ke sistem tipe data secara eksplisit**.

---

## 1. Menghindari Null dengan `Option<T>`

Ketika sebuah nilai bisa ada atau tidak ada, Rust menggunakan enum `Option<T>` bawaan:

```rust
enum Option<T> {
    Some(T),
    None,
}
```

### Operasi & Combinators pada `Option`:
```rust
fn cari_user_by_id(id: i32) -> Option<String> {
    if id == 1 {
        Some(String::from("Eka"))
    } else {
        None
    }
}

fn main() {
    let user = cari_user_by_id(2);

    // 1. unwrap_or: Nilai default jika None
    let nama1 = user.clone().unwrap_or(String::from("Guest"));

    // 2. map: Transformasi nilai di dalam Some tanpa merusak None
    let panjang_nama = user.map(|n| n.len()); // Option<usize>

    // 3. ok_or: Mengubah Option menjadi Result
    let res: Result<String, &str> = cari_user_by_id(1).ok_or("User tidak ditemukan");
}
```

---

## 2. Recoverable Errors: Enum `Result<T, E>`

Operasi yang bisa gagal mengembalikan `Result<T, E>`:

```rust
enum Result<T, E> {
    Ok(T),  // Sukses membawa data T
    Err(E), // Gagal membawa error E
}
```

### Membaca File Tanpa Operator `?`:
```rust
use std::fs::File;
use std::io::ErrorKind;

let file_result = File::open("config.json");

let file = match file_result {
    Ok(f) => f,
    Err(error) => match error.kind() {
        ErrorKind::NotFound => match File::create("config.json") {
            Ok(fc) => fc,
            Err(e) => panic!("Gagal membuat file baru: {:?}", e),
        },
        other_error => panic!("Gagal membuka file: {:?}", other_error),
    },
};
```

---

## 3. Operator Sakti Propagasi Error: Tanda Tanya (`?`)

Menulis `match` berulang-ulang sangat melelahkan. Operator `?` adalah jalan pintas kompilator untuk:
1. Mengekstrak nilai `Ok(v)` jika sukses.
2. Jika terjadi `Err(e)`, fungsi akan **segera return lebih awal (*early return*)** mengalirkan error tersebut ke pemanggilnya, sekaligus otomatis mengonversi tipe error via trait `From`.

```rust
use std::fs::File;
use std::io::{self, Read};

fn baca_isi_file(path: &str) -> Result<String, io::Error> {
    // Satu baris elegan menggantikan 15 baris match boilerplate!
    let mut file = File::open(path)?; 
    let mut konten = String::new();
    file.read_to_string(&mut konten)?;
    Ok(konten)
}
```

---

## 4. Pola Standar Industri: Custom Error dengan `thiserror`

Dalam pembuatan library atau modul backend domain, jangan kembalikan string error mentah. Gunakan crate standar industri `thiserror` untuk membuat hierarki error terstruktur:

```rust
// Cargo.toml: thiserror = "1.0"
use thiserror::Error;

#[derive(Error, Debug)]
pub enum DatabaseError {
    #[error("koneksi ke host '{host}:{port}' terputus")]
    ConnectionFailed { host: String, port: u16 },

    #[error("record dengan ID '{0}' tidak ditemukan di tabel")]
    RecordNotFound(i64),

    #[error("gagal membaca data I/O: {0}")]
    IoError(#[from] std::io::Error), // Otomatis mengonversi io::Error dengan operator ?
}

fn query_pengguna(id: i64) -> Result<String, DatabaseError> {
    if id == 404 {
        return Err(DatabaseError::RecordNotFound(id));
    }
    Ok(String::from("Eka Developer"))
}
```

---

## 5. Menangani Error di Level Aplikasi: `anyhow`

Untuk binary aplikasi akhir (CLI tool, Web Server entrypoint), gunakan crate `anyhow` yang fleksibel untuk membungkus berbagai jenis error dengan pesan konteks tambahan:

```rust
// Cargo.toml: anyhow = "1.0"
use anyhow::{Context, Result};

fn load_app_config() -> Result<String> {
    let path = "app_settings.toml";
    
    // .context() menambahkan catatan riwayat penyebab error (stack context)
    let content = std::fs::read_to_string(path)
        .with_context(|| format!("Gagal memuat file konfigurasi aplikasi dari '{}'", path))?;
        
    Ok(content)
}

fn main() -> Result<()> {
    let cfg = load_app_config()?;
    println!("Config aktif: {}", cfg);
    Ok(())
}
```

> [!CAUTION]
> **Aturan `.unwrap()` & `.expect()`**: Jangan gunakan `.unwrap()` di kode produksi backend! Gunakan hanya di unit-test, prototyping cepat, atau ketika kamu memiliki bukti matematis mutlak bahwa nilainya mustahil `None`/`Err`.
