---
title: "03. List & Navigation"
description: Menampilkan koleksi data dengan List & ForEach, Identifiable, NavigationStack modern iOS 16+, navigationDestination type-safe, dan searchable.
---

# 🍎 SwiftUI - Modul 03: List & Navigation

Menyusun daftar data yang dapat di-scroll (*scrolling list*) dan alur navigasi antar-halaman menggunakan komponen modern `NavigationStack`.

---

## 1. `List` & Protokol `Identifiable`

`List` di SwiftUI adalah padanan `UITableView` di UIKit atau `LazyColumn` di Jetpack Compose. Untuk performa optimal, item data sebaiknya mengadopsi protokol `Identifiable`:

```swift
import SwiftUI

// Model data wajib punya properti 'id' unik:
struct Produk: Identifiable {
    let id = UUID()
    let nama: String
    let harga: Int
}

struct DaftarProdukView: View {
    let daftar: [Produk] = [
        Produk(nama: "iPhone 16 Pro", harga: 20000000),
        Produk(nama: "MacBook Air M3", harga: 18500000),
        Produk(nama: "iPad Pro", harga: 15000000)
    ]

    var body: some View {
        List(daftar) { item in
            HStack {
                Text(item.nama)
                Spacer()
                Text("Rp \(item.harga)")
                    .foregroundColor(.secondary)
            }
        }
    }
}
```

---

## 2. Modern Navigation: `NavigationStack` (iOS 16+)

Hindari penggunaan `NavigationView` lama yang sudah deprecated. Gunakan `NavigationStack`:

```swift
struct AppNavView: View {
    var body: some View {
        NavigationStack {
            List {
                // Navigasi sederhana ke halaman tujuan:
                NavigationLink("Buka Pengaturan Akun") {
                    Text("Layar Pengaturan Akun")
                        .navigationTitle("Pengaturan")
                }

                NavigationLink("Buka Notifikasi") {
                    Text("Layar Notifikasi")
                        .navigationTitle("Notifikasi")
                }
            }
            .navigationTitle("Menu Utama")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button(action: { print("Tambah baru") }) {
                        Image(systemName: "plus")
                    }
                }
            }
        }
    }
}
```

---

## 3. Type-Safe Navigation: `.navigationDestination(for:)`

Pola navigasi paling direkomendasikan Apple untuk aplikasi kompleks: pisahkan data tujuan dari tampilan:

```swift
struct Kursus: Hashable, Identifiable {
    let id: Int
    let judul: String
}

struct KursusListView: View {
    let semuaKursus = [
        Kursus(id: 1, judul: "Belajar Swift Dasar"),
        Kursus(id: 2, judul: "Mastering SwiftUI"),
        Kursus(id: 3, judul: "iOS Clean Architecture")
    ]

    var body: some View {
        NavigationStack {
            List(semuaKursus) { k in
                // Kirim value data objek Kursus:
                NavigationLink(k.judul, value: k)
            }
            .navigationTitle("Katalog Kursus")
            // Tangani kemana objek Kursus harus diarahkan:
            .navigationDestination(for: Kursus.self) { kursus in
                DetailKursusScreen(kursus: kursus)
            }
        }
    }
}

struct DetailKursusScreen: View {
    let kursus: Kursus

    var body: some View {
        VStack(spacing: 12) {
            Text("Detail Kursus ID: \(kursus.id)")
            Text(kursus.judul)
                .font(.title)
                .bold()
        }
        .navigationTitle("Detail")
    }
}
```

---

## 4. Pencarian Cepat dengan `.searchable()`

Hanya butuh 1 modifier untuk menambahkan kotak search bar interaktif ala iOS:

```swift
struct KontakScreen: View {
    @State private var searchText = ""
    let kontak = ["Ali", "Budi", "Cindy", "Dewi", "Eka"]

    var filteredKontak: [String] {
        if searchText.isEmpty { return kontak }
        return kontak.filter { $0.localizedCaseInsensitiveContains(searchText) }
    }

    var body: some View {
        NavigationStack {
            List(filteredKontak, id: \.self) { nama in
                Text(nama)
            }
            .navigationTitle("Daftar Kontak")
            // Search bar otomatis muncul di atas List:
            .searchable(text: $searchText, prompt: "Cari nama teman...")
        }
    }
}
```
