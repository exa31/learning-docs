---
title: "06. Concurrency & Threads"
description: Multi-threading dengan thread::spawn, message passing mpsc channels, dan shared state Arc<Mutex<T>>.
---

# 🦀 Rust - Modul 06: Concurrency & Threads

Rust menjamin **Fearless Concurrency**: kesalahan race condition antar-thread dicegah langsung saat kompilasi!

---

## 1. Menjalankan Thread (`thread::spawn`)

Gunakan kata kunci `move` pada closure agar kepemilikan data berpindah (*moved*) ke dalam thread baru secara aman:

```rust
use std::thread;
use std::time::Duration;

fn main() {
    let nama = String::from("Worker");

    // 'move' memindahkan kepemilikan 'nama' ke dalam thread:
    let handle = thread::spawn(move || {
        for i in 1..=3 {
            println!("{}: proses ke-{}", nama, i);
            thread::sleep(Duration::from_millis(500));
        }
    });

    // Tunggu sampai thread selesai berjalan:
    handle.join().unwrap();
}
```

---

## 2. Channels (`mpsc`: Multi-Producer, Single-Consumer)

Mengirim data antar-thread melalui pipa komunikasi yang aman:

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    // tx = transmitter (pengirim), rx = receiver (penerima):
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let pesan = String::from("Data dari thread!");
        tx.send(pesan).unwrap(); // Kirim data
    });

    // Menunggu dan menerima data di thread utama:
    let diterima = rx.recv().unwrap();
    println!("Diterima: {}", diterima);
}
```

---

## 3. Shared State: `Arc<Mutex<T>>`

Jika kamu ingin banyak thread membaca dan mengubah data yang sama:
- **`Mutex<T>`**: Mengunci data (*Mutual Exclusion*) agar hanya 1 thread yang bisa mengedit dalam satu waktu.
- **`Arc<T>`**: *Atomic Reference Counting* agar pointer data bisa dishare ke banyak thread dengan aman.

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    // Bungkus angka counter dengan Mutex lalu Arc:
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..5 {
        let counter_clone = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            // Kunci mutex sebelum mengubah nilai:
            let mut data = counter_clone.lock().unwrap();
            *data += 1; // Kunci otomatis dilepas saat keluar dari scope!
        });
        handles.push(handle);
    }

    for h in handles {
        h.join().unwrap();
    }

    println!("Total Counter: {}", *counter.lock().unwrap()); // 5
}
```
