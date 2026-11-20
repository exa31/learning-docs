---
title: "03. Struct, Enums & Exhaustive Pattern Matching"
description: Classic & tuple structs, method receivers (&self vs &mut self), enum data variants, match exhaustiveness, match guards, dan modern let-else guard di Rust.
---

# 🦀 Rust - Modul 03: Struct, Enums & Exhaustive Pattern Matching

Rust tidak memiliki konsep *class* dan *inheritance*. Sebagai gantinya, pemodelan domain dilakukan melalui kombinasi **Struct**, **Enums berdata (Algebraic Data Types)**, dan **Pattern Matching** yang komprehensif.

---

## 1. Tiga Bentuk Struct di Rust

```rust
// 1. Classic Named-Field Struct
struct User {
    username: String,
    email: String,
    sign_in_count: u64,
    is_active: bool,
}

// 2. Tuple Struct (Cocok untuk membuat type wrapper / NewType pattern)
struct Koordinat(f64, f64);
struct Color(u8, u8, u8);

// 3. Unit-Like Struct (Tanpa field, berguna untuk marker trait)
struct AlwaysEqual;
```

---

## 2. Implementasi Method & Associated Functions (`impl`)

Method didefinisikan di dalam blok `impl`. Hubungan kepemilikan ditentukan oleh receiver parameter pertamanya:

```rust
struct PersegiPanjang {
    panjang: u32,
    lebar: u32,
}

impl PersegiPanjang {
    // Associated Function (Tanpa self, seperti static constructor)
    fn new(panjang: u32, lebar: u32) -> Self {
        Self { panjang, lebar }
    }

    // Method Immutable: Hanya meminjam data untuk dibaca
    fn luas(&self) -> u32 {
        self.panjang * self.lebar
    }

    // Method Mutable: Meminjam data untuk dimodifikasi
    fn kalikan_dua(&mut self) {
        self.panjang *= 2;
        self.lebar *= 2;
    }

    // Method Consuming (self): Menelan kepemilikan objek (objek hancur setelah ini dipanggil)
    fn hancurkan(self) {
        println!("Persegi berukuran {}x{} dihancurkan", self.panjang, self.lebar);
    }
}
```

---

## 3. Enums sebagai Algebraic Data Types (Bisa Menampung Data!)

Di C atau Java klasik, Enum hanyalah daftar integer bernama. Di Rust, setiap varian enum bisa menampung tipe data yang sama sekali berbeda:

```rust
enum StatusTransaksi {
    Pending,                        // Varian kosong
    Sukses { reference_id: String }, // Varian struct
    Gagal(String),                  // Varian tuple (pesan error)
    Refund(u64, String),            // Varian tuple multi-field (nominal, alasan)
}

fn proses_status(trx: StatusTransaksi) {
    match trx {
        StatusTransaksi::Pending => println!("Menunggu pembayaran..."),
        StatusTransaksi::Sukses { reference_id } => {
            println!("Pembayaran terverifikasi: {}", reference_id);
        }
        StatusTransaksi::Gagal(alasan) => {
            println!("Transaksi ditolak: {}", alasan);
        }
        StatusTransaksi::Refund(nominal, alasan) => {
            println!("Refund Rp{} diproses dengan alasan: {}", nominal, alasan);
        }
    }
}
```

---

## 4. Kehebatan Pattern Matching (`match`)

Blok `match` di Rust memiliki jaminan **Exhaustive**: jika ada satu kemungkinan varian yang lupa ditangani, kode **tidak akan bisa dikompilasi**!

```rust
let angka = 15;

match angka {
    0 => println!("Nol"),
    1 | 2 | 3 => println!("Satu, dua, atau tiga"),
    4..=10 => println!("Antara empat hingga sepuluh"),
    // Match Guard: Tambahan filter kondisi logika dengan 'if'
    x if x % 2 == 0 => println!("Angka genap besar: {}", x),
    _ => println!("Angka ganjil lainnya"), // Wildcard penampung sisa
}
```

---

## 5. Alur Ringkas: `if let` & `let else` (Rust 1.65+)

### A. `if let`: Menangani 1 Pola Tertentu
Jika kita hanya peduli pada satu varian dan mengabaikan yang lain:
```rust
let config: Option<String> = Some(String::from("v2"));

if let Some(versi) = config {
    println!("Versi aktif: {}", versi);
}
```

### B. `let else`: Pola Golden Path Guard (Paling Bersih di Produksi)
`let else` memungkinkan *early return* langsung sambil mengekstrak nilai tanpa sarang kurung kurawal (*nesting hell*):

```rust
fn ambil_email_user(id: i32) -> Option<String> {
    // Simulasi query
    Some(String::from("eka@dev.cloud"))
}

fn proses_notifikasi(user_id: i32) {
    // Ekstrak nilai secara instan, atau paksa keluar jika None:
    let Some(email) = ambil_email_user(user_id) else {
        println!("User tidak punya email terdaftar, batalkan!");
        return; // Blok 'else' WAJIB diakhiri dengan return, break, continue, atau panic!
    };

    // 'email' langsung bisa dipakai di sisa fungsi tanpa indentasi bersarang!
    println!("Mengirim notifikasi ke: {}", email);
}
```
