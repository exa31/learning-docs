---
title: "03. Struct, Enum & Pattern Matching"
description: Structs, method impl, enum dengan data terikat, dan exhaustive pattern matching dengan match dan if-let.
---

# 🦀 Rust - Modul 03: Struct, Enum & Pattern Matching

Cheatsheet kilat pembuatan struktur data dan pencocokan pola (*pattern matching*) super aman di Rust.

---

## 1. Struct & Method (`impl`)

Method di Rust ditempelkan di blok terpisah menggunakan kata kunci `impl`:

```rust
struct PersegiPanjang {
    panjang: u32,
    lebar: u32,
}

impl PersegiPanjang {
    // Constructor (Associated function - dipanggil dengan PersegiPanjang::baru):
    fn baru(p: u32, l: u32) -> Self {
        Self { panjang: p, lebar: l }
    }

    // Method (Menerima &self untuk meminjam data struct):
    fn hitung_luas(&self) -> u32 {
        self.panjang * self.lebar
    }
}

fn main() {
    let kotak = PersegiPanjang::baru(10, 5);
    println!("Luas: {}", kotak.hitung_luas()); // 50
}
```

---

## 2. Enum dengan Nilai Terikat (Sangat Kuat di Rust)

Berbeda dengan bahasa lain di mana enum hanyalah angka integer, Enum di Rust bisa **membawa data dengan tipe berbeda-beda** di setiap variasinya:

```rust
enum PesanWebsocket {
    Keluar,                          // Tanpa data
    KirimTeks(String),               // Membawa String
    PindahPosisi { x: i32, y: i32 }, // Membawa anonymous struct
    UbahWarna(u8, u8, u8),           // Membawa tuple RGB
}
```

---

## 3. Pattern Matching: `match` (Wajib Menghabiskan Semua Kasus)

`match` di Rust bersifat **exhaustive** (compiler akan error jika kamu lupa menangani salah satu varian enum):

```rust
fn proses_pesan(pesan: PesanWebsocket) {
    match pesan {
        PesanWebsocket::Keluar => {
            println!("User disconnect.");
        }
        PesanWebsocket::KirimTeks(teks) => {
            println!("Pesan masuk: {}", teks);
        }
        PesanWebsocket::PindahPosisi { x, y } => {
            println!("Pindah ke koordinat x={}, y={}", x, y);
        }
        PesanWebsocket::UbahWarna(r, g, b) => {
            println!("RGB({}, {}, {})", r, g, b);
        }
    }
}
```

---

## 4. `if let` (Sintaks Ringkas untuk 1 Kasus Saja)

Jika kamu hanya peduli pada **satu varian tertentu** dan ingin mengabaikan sisanya tanpa menulis seluruh blok `match`:

```rust
let pesan = PesanWebsocket::KirimTeks(String::from("Halo!"));

// Hanya jalankan jika variannya adalah KirimTeks:
if let PesanWebsocket::KirimTeks(isi) = pesan {
    println!("Dapat pesan teks: {}", isi);
}
```
