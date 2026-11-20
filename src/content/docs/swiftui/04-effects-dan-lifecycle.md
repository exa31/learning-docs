---
title: "04. Lifecycle & Modal Effects"
description: Lifecycle view (.task, .onAppear, .onDisappear), .onChange reaktif, pop-up Sheet modal, dan Alert dialog di SwiftUI.
---

# 🍎 SwiftUI - Modul 04: Lifecycle & Modal Effects

Bagaimana mengontrol siklus hidup tampilan di SwiftUI: memicu asynchronous fetch data saat layar muncul, mendeteksi perubahan nilai variabel, dan memunculkan pop-up modal Sheet atau Alert dialog.

---

## 1. Async Lifecycle: `.task` (Sangat Dianjurkan)

Gunakan modifier `.task` jika kamu ingin menjalankan fungsi `async`/`await` saat tampilan pertama kali muncul di layar:

```swift
struct FeedScreen: View {
    @State private var items: [String] = []

    var body: some View {
        List(items, id: \.self) { item in
            Text(item)
        }
        // Dijalankan otomatis saat View muncul:
        .task {
            // Jika user pindah halaman sebelum task selesai,
            // SwiftUI OTOMATIS MEMBATALKAN network call ini (anti memory leak)!
            await muatFeedDariServer()
        }
    }

    func muatFeedDariServer() async {
        try? await Task.sleep(nanoseconds: 1_000_000_000) // delay 1 detik
        items = ["Postingan 1", "Postingan 2", "Postingan 3"]
    }
}
```

---

## 2. `.onAppear` vs `.onDisappear`

Untuk operasi sinkronus biasa (non-async):

```swift
Text("Layar Detail")
    .onAppear {
        print("Layar detail terlihat oleh pengguna")
    }
    .onDisappear {
        print("Layar detail telah ditutup")
    }
```

---

## 3. Mendeteksi Perubahan Nilai: `.onChange`

Modifier untuk memicu aksi setiap kali ada nilai `@State` atau binding yang berubah:

```swift
struct FilterScreen: View {
    @State private var kategoriTerpilih = "Semua"

    var body: some View {
        Picker("Kategori", selection: $kategoriTerpilih) {
            Text("Semua").tag("Semua")
            Text("Elektronik").tag("Elektronik")
            Text("Pakaian").tag("Pakaian")
        }
        // Sintaks modern iOS 17+:
        .onChange(of: kategoriTerpilih) { nilaiLama, nilaiBaru in
            print("Kategori berganti dari \(nilaiLama) menjadi \(nilaiBaru)")
            // Lakukan reload filter data...
        }
    }
}
```

---

## 4. Modal Sheet Pop-up (`.sheet`)

Memunculkan layar modal melayang dari bawah:

### A. Menggunakan Boolean State:
```swift
struct HomeScreen: View {
    @State private var tampilkanTambahBarang = false

    var body: some View {
        Button("Tambah Barang") {
            tampilkanTambahBarang = true
        }
        // Sheet modal:
        .sheet(isPresented: $tampilkanTambahBarang) {
            FormTambahScreen()
                .presentationDetents([.medium, .large]) // Sheet bisa ditarik setengah atau penuh (iOS 16+)
        }
    }
}
```

### B. Menggunakan Item Optional (`Identifiable`):
```swift
struct ItemDetail: Identifiable {
    let id = UUID()
    let pesan: String
}

struct DaftarNotifView: View {
    @State private var itemDipilih: ItemDetail?

    var body: some View {
        Button("Lihat Pesan") {
            itemDipilih = ItemDetail(pesan: "Transaksi kamu berhasil!")
        }
        // Otomatis buka sheet jika itemDipilih TIDAK nil:
        .sheet(item: $itemDipilih) { detail in
            Text(detail.pesan)
        }
    }
}
```

---

## 5. Alert Dialog (`.alert`)

```swift
struct HapusAkunView: View {
    @State private var showAlert = false

    var body: some View {
        Button("Hapus Akun", role: .destructive) {
            showAlert = true
        }
        .alert("Konfirmasi Hapus", isPresented: $showAlert) {
            Button("Batal", role: .cancel) { }
            Button("Ya, Hapus!", role: .destructive) {
                print("Akun dihapus!")
            }
        } message: {
            Text("Apakah kamu yakin? Tindakan ini tidak dapat dibatalkan.")
        }
    }
}
```
