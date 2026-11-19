---
title: "02. Ownership, Borrowing & Slices"
description: Tiga aturan kepemilikan memori (Ownership), Move vs Copy semantics, peminjaman (& dan &mut), serta string slices.
---

# 🦀 Rust - Modul 02: Ownership, Borrowing & Slices

Ini adalah **konsep paling penting di Rust**. Jika kamu paham modul ini, kamu sudah menguasai 80% keunikan Rust.

---

## 1. Tiga Aturan Sakral Ownership (Kepemilikan Memori)

1. Setiap nilai di Rust memiliki **satu variabel pemilik (*owner*)**.
2. Hanya boleh ada **satu pemilik dalam satu waktu**.
3. Ketika pemilik keluar dari scope kurung kurawal `{ }`, **nilainya otomatis dibuang dari memori RAM** (dieksekusi fungsi `drop`).

---

## 2. Pindah Kepemilikan (*Move*) vs Salin (*Copy*)

- Tipe data sederhana yang disimpan di Stack (`i32`, `bool`, `f64`) mengimplementasikan trait `Copy` (nilainya otomatis diduplikasi).
- Tipe data dinamis yang disimpan di Heap (seperti `String`, `Vec`) akan **berpindah hak milik (*Move*)**:

```rust
fn main() {
    let s1 = String::from("halo");
    let s2 = s1; // ⚠️ Hak milik 'halo' PINDAH ke s2!

    // println!("{}", s1); // ❌ Error: value borrowed here after move!
    println!("{}", s2); //  Bisa! s2 adalah pemilik sekarang.
}
```

---

## 3. Peminjaman (*Borrowing*): Referensi `&` vs `&mut`

Daripada memindahkan kepemilikan, fungsi bisa **meminjam** data menggunakan tanda ampersand `&`:

### A. Immutable Reference (`&T`)
Hanya boleh membaca data, tidak boleh mengubah isinya:
```rust
fn hitung_panjang(teks: &String) -> usize {
    teks.len() // Meminjam tanpa mengambil hak milik
}

fn main() {
    let s = String::from("belajar");
    let p = hitung_panjang(&s); // Oper referensi &s
    println!("String '{}' punya panjang {}", s, p); // s masih valid!
}
```

### B. Mutable Reference (`&mut T`)
Boleh mengubah data yang dipinjam:
```rust
fn tambah_kata(teks: &mut String) {
    teks.push_str(" dunia!");
}

fn main() {
    let mut s = String::from("halo");
    tambah_kata(&mut s);
    println!("{}", s); // "halo dunia!"
}
```

### ⚠️ Aturan Pencegahan Data Race di Rust:
Dalam satu scope, kamu boleh memiliki:
- **Banyak peminjam baca (`&T`)**, **ATAU**
- **Tepat SATU peminjam ubah (`&mut T`)**,
- **TETAPI TIDAK BISA KEDUANYA BERSAMAAN!**

---

## 4. `String` (Owned) vs `&str` (String Slice)

- **`String`**: Dialokasikan di Heap, ukurannya bisa bertambah atau menyusut.
- **`&str`**: Potongan referensi ke data string (bisa berupa string literal statis di binary program atau potongan dari `String`).

```rust
let kata_penuh = String::from("Halo Dunia");

// Mengambil potongan slice [start..end]:
let halo: &str = &kata_penuh[0..4];  // "Halo"
let dunia: &str = &kata_penuh[5..10]; // "Dunia"
```
