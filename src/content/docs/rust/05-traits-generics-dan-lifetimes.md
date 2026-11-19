---
title: "05. Traits, Generics & Lifetimes"
description: Generics <T>, Trait (interface ala Rust), Trait Bounds, dan anotasi Lifetime 'a tanpa pusing.
---

# 🦀 Rust - Modul 05: Traits, Generics & Lifetimes

Cheatsheet kilat polimorfisme di Rust melalui Generics, Traits, dan konsep umur referensi (*Lifetimes*).

---

## 1. Generics (`<T>`)

Membuat fungsi atau struct yang bisa bekerja dengan banyak tipe data:

```rust
struct Titik<T> {
    x: T,
    y: T,
}

fn main() {
    let t1 = Titik { x: 5, y: 10 };       // Titik<i32>
    let t2 = Titik { x: 1.5, y: 3.8 };    // Titik<f64>
}
```

---

## 2. Traits (Padanan Interface / Kontrak Bersama)

Trait mendefinisikan kemampuan yang harus dimiliki oleh sebuah tipe data:

```rust
// 1. Deklarasi Trait:
pub trait Ringkasan {
    fn buat_ringkasan(&self) -> String;
}

// 2. Implementasikan Trait ke Struct tertentu:
struct Artikel {
    judul: String,
    penulis: String,
}

impl Ringkasan for Artikel {
    fn buat_ringkasan(&self) -> String {
        format!("{} oleh {}", self.judul, self.penulis)
    }
}
```

---

## 3. Trait Bounds (`impl Trait` & `where` clause)

Membatasi generic hanya untuk tipe data yang memiliki kemampuan tertentu:

```rust
// Hanya menerima tipe yang mengimplementasikan Trait 'Ringkasan':
fn cetak_info(item: &impl Ringkasan) {
    println!("Info: {}", item.buat_ringkasan());
}

// Sintaks 'where' jika ada banyak generic dan batasan:
fn bandingkan<T, U>(a: T, b: U) -> bool
where
    T: std::fmt::Display + Clone,
    U: std::fmt::Debug,
{
    println!("a: {}, b: {:?}", a, b);
    true
}
```

---

## 4. Konsep Lifetimes (`'a`) Tanpa Pusing

Anotasi lifetime (diawali kutip satu `'`) **hanya memberi tahu compiler hubungan durasi hidup antara referensi yang masuk dan referensi yang keluar dari suatu fungsi**, agar tidak terjadi pointer menggantung (*dangling reference*):

```rust
// Artinya: Referensi yang di-return dijamin hidup selama referensi x dan y masih hidup!
fn teks_terpanjang<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```
> 💡 *Tips:* Sebagian besar fungsi di Rust sudah memiliki aturan *Lifetime Elision* (compiler menebak lifetime secara otomatis), jadi kamu hanya perlu menulis `'a` jika fungsi mengembalikan referensi dari salah satu dari beberapa parameter input.
