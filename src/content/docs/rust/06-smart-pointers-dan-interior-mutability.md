---
title: "06. Smart Pointers: Box, Rc, Arc & Interior Mutability (RefCell)"
description: Heap allocation Box<T>, reference counting Rc vs multi-threaded Arc, dan pola interior mutability RefCell<T> di Rust.
---

# 🦀 Rust - Modul 06: Smart Pointers: Box, Rc, Arc & Interior Mutability (RefCell)

Smart Pointer adalah struktur data yang bertindak seperti pointer namun memiliki metadata dan kemampuan tambahan. Di Rust, smart pointer mengimplementasikan trait **`Deref`** (agar bisa diperlakukan seperti referensi biasa) dan **`Drop`** (agar otomatis membersihkan memori heap saat keluar dari scope).

---

## 1. `Box<T>`: Alokasi Heap Sederhana & Tipe Rekursif

`Box<T>` adalah smart pointer paling mendasar untuk memindahkan data dari Stack ke Heap:

```rust
let angka_heap = Box::new(5); // Angka 5 dialokasikan di Heap!
println!("Nilai: {}", *angka_heap); // Dereference dengan *
```

### Kasus Wajib: Mengatasi Tipe Data Rekursif
Compiler Rust wajib mengetahui ukuran memori setiap tipe data saat kompilasi. Struktur rekursif (seperti linked list atau tree) memiliki ukuran tak hingga jika tidak menggunakan `Box`:

```rust
// COMPILE ERROR: recursive type `List` has infinite size
// enum List { Cons(i32, List), Nil }

// SOLUSI: Bungkus dengan Box<T> karena Box selalu memiliki ukuran tetap (1 pointer word)!
enum List {
    Cons(i32, Box<List>),
    Nil,
}

use List::{Cons, Nil};

fn main() {
    let list = Cons(1, Box::new(Cons(2, Box::new(Nil))));
}
```

---

## 2. `Rc<T>`: Kepemilikan Bersama (Reference Counted - Single Thread)

Dalam kasus tertentu seperti struktur data Graph, satu node bisa dimiliki oleh banyak node lainnya. `Rc<T>` memungkinkan **Multiple Ownership** dalam lingkungan single-threaded:

```mermaid
flowchart TD
    NodeA["Data Shared (Heap)"]
    Owner1["Rc Owner 1"] -->|Rc::clone (Ref count = 2)| NodeA
    Owner2["Rc Owner 2"] -->|Rc::clone| NodeA
```

```rust
use std::rc::Rc;

fn main() {
    // Dialokasikan di heap dengan reference counter = 1
    let data_bersama = Rc::new(String::from("Konfigurasi Global"));

    // Rc::clone TIDAK menyalin string di heap! Hanya menambah counter menjadi 2
    let pemilik1 = Rc::clone(&data_bersama);
    println!("Strong count: {}", Rc::strong_count(&data_bersama)); // 2

    {
        let pemilik2 = Rc::clone(&data_bersama);
        println!("Strong count di dalam block: {}", Rc::strong_count(&data_bersama)); // 3
    } // pemilik2 keluar scope, counter turun otomatis menjadi 2!

    println!("Strong count akhir: {}", Rc::strong_count(&data_bersama)); // 2
}
```

> [!CAUTION]
> `Rc<T>` **TIDAK THREAD-SAFE**. `Rc` tidak menggunakan operasi atomic untuk menghitung reference count. Mengirim `Rc` antar thread akan ditolak oleh kompilator karena `Rc` tidak mengimplementasikan trait `Send`.

---

## 3. `Arc<T>`: Atomic Reference Counting untuk Multi-Thread

Untuk berbagi kepemilikan antar thread di lingkungan concurrent, gunakan **`Arc<T>` (Atomically Reference Counted)**:

```rust
use std::sync::Arc;
use std::thread;

fn main() {
    let data = Arc::new(vec![10, 20, 30]);

    let data_clone = Arc::clone(&data);
    let handle = thread::spawn(move || {
        println!("Thread membaca data: {:?}", data_clone);
    });

    handle.join().unwrap();
    println!("Main thread: {:?}", data);
}
```

---

## 4. Interior Mutability: `RefCell<T>` & `Cell<T>`

Pola **Interior Mutability** memungkinkan kita **memodifikasi data bahkan ketika kita hanya memegang referensi immutable (`&T`)** ke pembungkusnya!

### Mengapa butuh `RefCell<T>`?
Borrow Checker Rust biasanya memeriksa aturan peminjaman saat *compile-time*. `RefCell<T>` menunda pemeriksaan aturan peminjaman ke **masa runtime**:

| Karakteristik | Referensi Biasa (`&T` / `&mut T`) | `RefCell<T>` |
|---|---|---|
| **Verifikasi Aturan Borrowing** | **Compile Time** (Gagal kompilasi jika salah) | **Runtime** (Program **Panic** jika aturan dilanggar saat jalan!) |
| **Pemeriksaan Mutasi** | Statis oleh compiler | Dinamis via method `.borrow()` & `.borrow_mut()` |

```rust
use std::cell::RefCell;

fn main() {
    let data = RefCell::new(42);

    {
        // Pinjam mutable saat runtime:
        let mut ref_mut = data.borrow_mut();
        *ref_mut += 8;
    } // ref_mut keluar scope, borrow mutable berakhir

    // Pinjam immutable saat runtime:
    let ref_baca = data.borrow();
    println!("Nilai baru: {}", *ref_baca); // 50
}
```

---

## 5. Kombo Sakti Produksi: `Rc<RefCell<T>>`

Menggabungkan `Rc<T>` (Multiple Ownership) dengan `RefCell<T>` (Interior Mutability) menghasilkan struktur data yang **bisa dimiliki oleh banyak entitas sekaligus dimodifikasi oleh masing-masing entitas tersebut**:

```rust
use std::rc::Rc;
use std::cell::RefCell;

fn main() {
    // Nilai bersama yang bisa dimutasi oleh banyak pemilik:
    let saldo_bersama = Rc::new(RefCell::new(1000));

    let pemilik_a = Rc::clone(&saldo_bersama);
    let pemilik_b = Rc::clone(&saldo_bersama);

    *pemilik_a.borrow_mut() += 500;
    *pemilik_b.borrow_mut() -= 200;

    println!("Saldo akhir bersama: Rp{}", *saldo_bersama.borrow()); // Rp1300!
}
```
