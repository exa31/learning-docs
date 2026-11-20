---
title: "02. State Management"
description: Pengelolaan reaktivitas data di SwiftUI (@State, @Binding dua arah dengan $, macro modern @Observable, dan @Environment).
---

# 🍎 SwiftUI - Modul 02: State Management

Di SwiftUI, data adalah sumber kebenaran tunggal (*Single Source of Truth*). Kita tidak memodifikasi tampilan secara imperatif; ketika data state berubah, SwiftUI otomatis menghitung perbedaan (*diffing*) dan merender ulang view yang bersangkutan.

---

## 1. `@State` (Private Local State)

Digunakan untuk nilai mutabel lokal sederhana (seperti `Int`, `String`, `Bool`) yang hanya menjadi milik satu tampilan:

```swift
struct CounterView: View {
    // Selalu tandai @State sebagai private:
    @State private var count: Int = 0

    var body: some View {
        VStack(spacing: 16) {
            Text("Total Klik: \(count)")
                .font(.title)

            Button("Tambah Nilai") {
                count += 1 // SwiftUI otomatis mendeteksi perubahan dan merender ulang Text!
            }
            .buttonStyle(.borderedProminent)
        }
    }
}
```

---

## 2. `@Binding` (Two-Way Binding ke Komponen Anak)

Gunakan `@Binding` jika sub-view (child view) butuh membaca dan mengubah nilai `@State` milik parent view tanpa menduplikasi data:

```swift
// Child View (Stateless & Reusable):
struct SaklarTemaView: View {
    @Binding var isDarkMode: Bool // Referensi ke state parent

    var body: some View {
        Toggle("Mode Gelap", isOn: $isDarkMode)
            .padding()
    }
}

// Parent View:
struct PengaturanScreen: View {
    @State private var darkModeAktif: Bool = false

    var body: some View {
        VStack {
            Text(darkModeAktif ? "🌙 Tema Gelap" : "☀️ Tema Terang")
            // Oper binding menggunakan tanda dollar '$':
            SaklarTemaView(isDarkMode: $darkModeAktif)
        }
    }
}
```

---

## 3. Modern Macro `@Observable` (Swift 5.9+ / iOS 17+)

Tinggalkan cara lama yang bertele-tele (`ObservableObject`, `@Published`, `@StateObject`). Sejak Swift 5.9, Apple merilis macro modern **`@Observable`** dari framework `Observation`:

```swift
import SwiftUI
import Observation

// 1. Definisikan ViewModel dengan @Observable:
@Observable
class KeranjangViewModel {
    var items: [String] = []

    func tambah(barang: String) {
        items.append(barang)
    }

    var totalItem: Int {
        items.count
    }
}

// 2. Konsumsi di SwiftUI cukup dengan @State:
struct KeranjangScreen: View {
    @State private var viewModel = KeranjangViewModel()

    var body: some View {
        VStack {
            Text("Total Barang: \(viewModel.totalItem)")

            List(viewModel.items, id: \.self) { item in
                Text(item)
            }

            Button("Beli AirPods") {
                viewModel.tambah(barang: "AirPods Pro")
            }
        }
    }
}
```

> ⚡ **Kelebihan `@Observable` Modern**: SwiftUI hanya akan merender ulang view jika properti spesifik yang dibaca view tersebut berubah. Jauh lebih hemat daya dan cepat dibanding `@Published` lama!

---

## 4. `@Environment` (Akses Konteks Global Sistem)

Membaca nilai bawaan sistem Apple atau state global yang disuntikkan dari atas hierarki:

```swift
struct ModalDetailView: View {
    // 1. Action bawaan untuk menutup sheet / modal:
    @Environment(\.dismiss) private var dismiss

    // 2. Mendeteksi apakah sistem sedang Light atau Dark Mode:
    @Environment(\.colorScheme) private var colorScheme

    var body: some View {
        VStack {
            Text("Skema warna aktif: \(colorScheme == .dark ? "Gelap" : "Terang")")

            Button("Tutup Layar") {
                dismiss() // Menutup modal sheet
            }
        }
    }
}
```
