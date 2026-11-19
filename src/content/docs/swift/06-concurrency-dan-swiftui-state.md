---
title: "06. Concurrency & SwiftUI State"
description: Modern async/await, Task, Thread-safety Actor, MainActor, serta state management deklaratif SwiftUI (@State, @Binding, @Observable).
---

# 🍏 Swift - Modul 06: Concurrency & SwiftUI State

Pondasi membangun aplikasi modern di ekosistem Apple: arsitektur asinkronus bebas data-race (*Structured Concurrency*) dan state management deklaratif di SwiftUI.

---

## 1. Modern Concurrency: `async` / `await` & `Task`

Tinggalkan cara lama (*callback completion handler* / GCD `DispatchQueue`) yang rawan *callback hell* dan memory leak. Gunakan `async`/`await`:

```swift
import Foundation

struct User: Codable {
    let id: Int
    let name: String
}

// 1. Fungsi Asynchronous yang bisa melempar error:
func ambilDataUser(id: Int) async throws -> User {
    let url = URL(string: "https://jsonplaceholder.typicode.com/users/\(id)")!
    
    // URLSession bawaan sudah mendukung async/await:
    let (data, response) = try await URLSession.shared.data(from: url)
    
    guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
        throw URLError(.badServerResponse)
    }
    
    return try JSONDecoder().decode(User.self, from: data)
}

// 2. Menjalankan di dalam context synchronous via Task:
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

## 2. Thread Safety: `actor` & `@MainActor`

### A. `actor` (Bebas Data-Race secara Compile-Time)
`actor` mirip seperti `class` (reference type), tetapi menjamin hanya satu thread yang boleh mengakses properti mutabelnya dalam satu waktu:

```swift
actor BankAccount {
    private var saldo: Double = 0.0

    func setor(jumlah: Double) {
        saldo += jumlah
    }

    func cekSaldo() -> Double {
        return saldo
    }
}

// Mengakses data dari actor wajib menggunakan 'await':
Task {
    let akun = BankAccount()
    await akun.setor(jumlah: 500000)
    let s = await akun.cekSaldo()
    print("Saldo terkini: \(s)")
}
```

### B. `@MainActor`
Anotasi untuk memaksa fungsi atau class selalu dieksekusi di **Main Thread (UI Thread)**, wajib digunakan untuk operasi yang memperbarui UI:

```swift
@MainActor
class ViewModel {
    var judul: String = "Loading..."

    func updateUI(teks: String) {
        // Dijamin 100% jalan di Main Thread tanpa freeze!
        self.judul = teks
    }
}
```

---

## 3. SwiftUI: Arsitektur UI Deklaratif

Di SwiftUI, tampilan bukan objek yang kamu ubah-ubah secara imperatif (seperti UIKit `label.text = "X"`), melainkan **representasi deklaratif dari State** (`UI = f(State)`).

### Struktur Dasar View:
```swift
import SwiftUI

struct ProfilCardView: View {
    let nama: String
    let jabatan: String

    var body: some View {
        HStack(spacing: 16) {
            Image(systemName: "person.circle.fill")
                .resizable()
                .frame(width: 50, height: 50)
                .foregroundColor(.blue)

            VStack(alignment: .leading, spacing: 4) {
                Text(nama)
                    .font(.headline)
                Text(jabatan)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}
```

---

## 4. State Management SwiftUI

### A. `@State` (Private Local State)
Digunakan untuk nilai sederhana milik satu view. Ketika nilai `@State` berubah, SwiftUI otomatis merender ulang view yang bersangkutan:

```swift
struct CounterView: View {
    @State private var count: Int = 0

    var body: some View {
        VStack(spacing: 12) {
            Text("Hitungan: \(count)")
                .font(.largeTitle)

            Button("Tambah Nilai") {
                count += 1 // UI otomatis ter-update!
            }
            .buttonStyle(.borderedProminent)
        }
    }
}
```

### B. `@Binding` (Two-Way Data Flow ke Komponen Anak)
Gunakan `@Binding` jika child view ingin membaca dan memodifikasi `@State` milik parent view. Ditandai dengan tanda dollar `$` saat dioper:

```swift
// Child View:
struct SaklarLampu: View {
    @Binding var nyala: Bool // Referensi ke state parent

    var body: some View {
        Toggle("Status Lampu", isOn: $nyala)
            .padding()
    }
}

// Parent View:
struct RumahView: View {
    @State private var isLampuNyala: Bool = false

    var body: some View {
        VStack {
            Text(isLampuNyala ? "💡 Ruangan Terang" : "🌑 Ruangan Gelap")
            SaklarLampu(nyala: $isLampuNyala) // Kirim binding dengan '$'
        }
    }
}
```

### C. Modern Macro `@Observable` (Swift 5.9+)
Pola modern paling direkomendasikan Apple untuk ViewModel global atau domain logic:

```swift
import SwiftUI
import Observation

@Observable
class CartViewModel {
    var items: [String] = []

    func tambah(item: String) {
        items.append(item)
    }
}

struct CartScreen: View {
    // Cukup gunakan @State untuk instance Observable:
    @State private var viewModel = CartViewModel()

    var body: some View {
        VStack {
            List(viewModel.items, id: \.self) { item in
                Text(item)
            }

            Button("Beli Kopi") {
                viewModel.tambah(item: "Espresso")
            }
        }
    }
}
```
