---
title: "07. Fearless Concurrency: Mutex, Channels & Scoped Threads"
description: thread::spawn dengan move closure, trait marker Send & Sync, Arc<Mutex<T>>, channel std::sync::mpsc, dan scoped threads via crossbeam di Rust.
---

# 🦀 Rust - Modul 07: Fearless Concurrency: Mutex, Channels & Scoped Threads

Slogan Rust untuk konkurensi adalah **"Fearless Concurrency"** (Konkurensi Tanpa Rasa Takut). Kompilator Rust memeriksa potensi *data race* dan akses memori simultan secara kaku di masa kompilasi: jika kodemu berhasil di-compile, **dijamin 100% bebas dari data race**!

---

## 1. Thread Dasar & Closure `move`

Membuat thread sistem operasi di Rust menggunakan `thread::spawn`:

```rust
use std::thread;
use std::time::Duration;

fn main() {
    let kata = String::from("Rustacean");

    // Kata kunci 'move' memaksa closure mengambil alih KEPEMILIKAN variabel dari thread luar:
    let handle = thread::spawn(move || {
        println!("Halo dari thread baru: {}", kata);
        thread::sleep(Duration::from_millis(50));
    });

    // Menunggu thread selesai dieksekusi:
    handle.join().unwrap();
}
```

---

## 2. Dua Trait Marker Keramat: `Send` & `Sync`

Hampir seluruh jaminan keamanan konkurensi Rust dikontrol oleh dua *marker trait* otomatis:

1. **`Send`**: Menandai bahwa kepemilikan tipe data ini **aman dipindahkan (*moved*) ke thread lain**.
2. **`Sync`**: Menandai bahwa referensi ke tipe data ini (`&T`) **aman diakses oleh banyak thread sekaligus**.
   $$\text{Tipe } T \text{ bersifat } Sync \iff \&T \text{ bersifat } Send$$

| Tipe Data | Send? | Sync? | Alasan |
|---|:---:|:---:|---|
| Tipe Primitif (`i32`, `bool`, dll.) | ✅ Ya | ✅ Ya | Aman disalin dan dibaca bersamaan. |
| `Arc<T>` | ✅ Ya | ✅ Ya | Reference counter menggunakan operasi CPU atomic. |
| `Rc<T>` | ❌ **TIDAK** | ❌ **TIDAK** | Reference counter non-atomic, rawan race condition fatal. |
| `RefCell<T>` | ✅ Ya | ❌ **TIDAK** | Peminjaman mutable tidak dilindungi lock antar thread. |
| `Mutex<T>` | ✅ Ya | ✅ Ya | Interior mutability diamankan oleh OS Mutex lock. |

---

## 3. Sinkronisasi Data Bersama: `Arc<Mutex<T>>`

Untuk berbagi dan mengubah data bersama antar thread di runtime standar, gunakan kombo **`Arc<Mutex<T>>`**:

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    // Bungkus counter dengan Mutex, lalu bungkus dengan Arc untuk multi-owner:
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter_clone = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            // lock() mengembalikan MutexGuard (RAII pattern)
            let mut num = counter_clone.lock().unwrap();
            *num += 1;
            // Lock OTOMATIS DILEPAS saat num keluar dari scope blok ini!
        });
        handles.push(handle);
    }

    for h in handles {
        h.join().unwrap();
    }

    println!("Hasil akhir counter: {}", *counter.lock().unwrap()); // 10
}
```

> [!NOTE]
> **Lock Poisoning**: Jika sebuah thread mengalami `panic!` saat sedang memegang `MutexGuard`, mutex tersebut akan ditandai sebagai *poisoned*. Panggilan `.lock()` berikutnya oleh thread lain akan mengembalikan `Err(PoisonError)` agar aplikasi sadar bahwa data mungkin dalam keadaan rusak (*inconsistent state*).

---

## 4. Message Passing: Channel `std::sync::mpsc`

Rust mengadopsi pola komunikasi channel **MPSC (Multi-Producer, Single-Consumer)**:

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    // tx = transmitter (pengirim), rx = receiver (penerima)
    let (tx, rx) = mpsc::channel();

    // Kloning transmitter untuk produsen kedua:
    let tx1 = tx.clone();

    thread::spawn(move || {
        tx1.send(String::from("Pesan dari Produsen 1")).unwrap();
    });

    thread::spawn(move || {
        tx.send(String::from("Pesan dari Produsen 2")).unwrap();
    });

    // Menerima pesan (Loop otomatis berhenti saat semua transmitter mati):
    for pesan in rx {
        println!("Diterima: {}", pesan);
    }
}
```

---

## 5. Scoped Threads: Meminjam Stack Tanpa `Arc`

Secara default, `thread::spawn` mewajibkan data memiliki masa hidup `'static` karena kompilator tidak tahu berapa lama thread baru akan hidup.

Sejak **Rust 1.63+**, Rust menyediakan **Scoped Threads** bawaan (`std::thread::scope`) yang menjamin semua thread anak selesai sebelum scope berakhir, sehingga kita **bisa meminjam data stack langsung tanpa `Arc`**:

```rust
use std::thread;

fn main() {
    let mut angka = vec![1, 2, 3];

    // Buat scope thread:
    thread::scope(|s| {
        // Spawn thread yang bisa MEMINJAM variabel lokal stack 'angka'!
        s.spawn(|| {
            println!("Thread meminjam baca: {:?}", &angka);
        });

        s.spawn(|| {
            println!("Thread kedua membaca panjang: {}", angka.len());
        });
    }); // DIJAMIN: Semua thread selesai sebelum baris ini terlewati!

    // Aman memodifikasi kembali setelah scope selesai:
    angka.push(4);
    println!("Final: {:?}", angka);
}
```
