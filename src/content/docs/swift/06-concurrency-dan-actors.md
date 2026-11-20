---
title: "06. Concurrency & Actors"
description: Modern Structured Concurrency di Swift (async/await, Task, TaskGroup, actor thread-safety, MainActor, dan Sendable protocol).
---

# 🍏 Swift - Modul 06: Concurrency & Actors

Pemrograman konkuren modern di Swift berbasis **Structured Concurrency**. Swift meninggalkan pola lama (*callback completion handler* / GCD `DispatchQueue`) yang rawan *callback hell* dan *race condition*, menggantikannya dengan `async`/`await` dan `actor` yang dijamin aman di tingkat compiler.

---

## 1. `async` / `await` & `Task`

Fungsi asinkronus ditandai dengan keyword `async` dan dapat melempar error dengan `throws`:

```swift
import Foundation

struct User: Codable {
    let id: Int
    let name: String
}

// 1. Definisi fungsi asinkronus:
func ambilDataUser(id: Int) async throws -> User {
    let url = URL(string: "https://jsonplaceholder.typicode.com/users/\(id)")!
    
    // URLSession bawaan mendukung async/await secara native:
    let (data, response) = try await URLSession.shared.data(from: url)
    
    guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
        throw URLError(.badServerResponse)
    }
    
    return try JSONDecoder().decode(User.self, from: data)
}

// 2. Menjalankan di dalam konteks synchronous via Task:
Task {
    do {
        let user = try await ambilDataUser(id: 1)
        print("Nama User: \(user.name)")
    } catch {
        print("Gagal mengambil user: \(error.localizedDescription)")
    }
}
```

---

## 2. Eksekusi Paralel: `async let` & `withTaskGroup`

### A. `async let` (Paralel Sederhana)
Jika kamu butuh memanggil beberapa API sekaligus secara paralel:

```swift
func muatDashboard() async throws -> (User, [String]) {
    // Keduanya jalan bersamaan di background secara paralel:
    async let userTask = ambilDataUser(id: 1)
    async let notifTask = ambilDaftarNotifikasi()

    // Menunggu kedua hasil selesai dengan satu await:
    let (user, notif) = try await (userTask, notifTask)
    return (user, notif)
}
```

### B. `withTaskGroup` (Paralel Dinamis Jumlah Banyak)
```swift
func downloadSemuaGambar(urls: [URL]) async -> [Data] {
    await withTaskGroup(of: Data?.self) { group in
        for url in urls {
            group.addTask {
                return try? Data(contentsOf: url)
            }
        }

        var hasil: [Data] = []
        for await data in group {
            if let d = data { hasil.append(d) }
        }
        return hasil
    }
}
```

---

## 3. Thread Safety: `actor` (Bebas Data-Race)

`actor` mirip seperti `class` (reference type), tetapi menjamin **hanya satu task yang boleh mengakses properti mutabelnya dalam satu waktu**. Tidak butuh manual lock / mutex!

```swift
actor BankAccount {
    private var saldo: Double = 0.0

    func setor(jumlah: Double) {
        saldo += jumlah
    }

    func tarik(jumlah: Double) -> Bool {
        guard saldo >= jumlah else { return false }
        saldo -= jumlah
        return true
    }

    func cekSaldo() -> Double {
        return saldo
    }
}

// Mengakses data dari luar actor WAJIB menggunakan 'await':
Task {
    let akun = BankAccount()
    await akun.setor(jumlah: 1000000)
    let s = await akun.cekSaldo()
    print("Saldo akhir: Rp \(s)")
}
```

---

## 4. `@MainActor` (Menjamin Eksekusi di UI Thread)

Anotasi untuk memaksa fungsi, properti, atau class selalu berjalan di **Main Thread (UI Thread)**:

```swift
@MainActor
class FeedViewModel {
    var items: [String] = []

    func updateFeed(data: [String]) {
        // Dijamin 100% jalan di Main Thread tanpa freeze UI!
        self.items = data
    }
}
```

---

## 5. Protokol `Sendable` (Keamanan Transfer Antar-Thread)

`Sendable` adalah protokol penanda di Swift yang menyatakan bahwa suatu tipe data **aman dikirim antar-thread atau antar-task tanpa risiko data-race**:
- **Otomatis Sendable**: Semua tipe primitif (`Int`, `String`), enum, dan `struct` yang semua propertinya bertipe `Sendable` (Value types).
- **Actor**: Otomatis `Sendable` karena mengisolasi state-nya sendiri.
- **Class biasa**: Bukan `Sendable` (kecuali diberi anotasi `@unchecked Sendable` dengan sinkronisasi manual internal).
