---
title: "07. SwiftData & Persistensi Lokal Modern"
description: Panduan persistensi data iOS modern dengan SwiftData (iOS 17+), macro @Model, kueri reaktif @Query, ModelContext CRUD, dan relasi tabel.
---

# 🍎 SwiftUI - Modul 07: SwiftData & Persistensi Lokal Modern

Sebelum iOS 17, menyimpan data offline di iOS mengharuskan kita menggunakan Core Data yang terkenal rumit dengan file visual XML `.xcdatamodeld` dan kode `NSManagedObject` yang rapuh. 

Apple memperkenalkan **SwiftData**: framework persistensi data modern yang murni berbasis kode Swift, terintegrasi mulus dengan SwiftUI, dan didukung macro **`@Model`**.

---

## 1. Membangun Entitas Data dengan Macro `@Model`

Cukup buat `class` Swift biasa dan sematkan macro **`@Model`**:

```swift
import SwiftData
import Foundation

@Model
class CatatanTugas {
    // 1. Kolom ID unik:
    @Attribute(.unique) var id: UUID
    var judul: String
    var isSelesai: Bool
    var tanggalDibuat: Date

    // 2. Relasi Tabel (Relationship):
    @Relationship(deleteRule: .cascade) var kategori: KategoriTugas?

    init(judul: String, isSelesai: Bool = false, kategori: KategoriTugas? = nil) {
        self.id = UUID()
        self.judul = judul
        self.isSelesai = isSelesai
        self.tanggalDibuat = Date()
        self.kategori = kategori
    }
}

@Model
class KategoriTugas {
    var nama: String
    @Relationship(inverse: \CatatanTugas.kategori) var daftarTugas: [CatatanTugas]?

    init(nama: String) {
        self.nama = nama
    }
}
```

---

## 2. Injeksi Container di Root App

Pasang modifier **`.modelContainer`** di titik masuk aplikasi (`@main`):

```swift
import SwiftUI
import SwiftData

@main
struct TodoApp: App {
    var body: some Scene {
        WindowGroup {
            DaftarTugasView()
        }
        // Inisialisasi schema database SQLite di balik layar secara otomatis:
        .modelContainer(for: [CatatanTugas.self, KategoriTugas.self])
    }
}
```

---

## 3. Query Reaktif di Layar dengan `@Query`

Anda tidak perlu memanggil query `SELECT` manual. Cukup deklarasikan variabel dengan macro **`@Query`**, dan tampilan UI Anda akan **otomatis ter-update secara reaktif setiap kali data di database bertambah atau berubah**!

```swift
struct DaftarTugasView: View {
    // 1. Akses ModelContext untuk operasi simpan/hapus:
    @Environment(\.modelContext) private var modelContext

    // 2. Query Otomatis (Urutkan dari yang terbaru):
    @Query(
        filter: #Predicate<CatatanTugas> { $0.isSelesai == false }, // Hanya tugas yang belum selesai!
        sort: \CatatanTugas.tanggalDibuat, 
        order: .reverse
    ) private var daftarTugas: [CatatanTugas]

    @State private var inputJudul = ""

    var body: some View {
        NavigationStack {
            List {
                Section(header: Text("Tambah Tugas")) {
                    HStack {
                        TextField("Judul tugas baru...", text: $inputJudul)
                        Button("Tambah") {
                            tambahTugas()
                        }
                        .disabled(inputJudul.isEmpty)
                    }
                }

                Section(header: Text("Daftar Tugas Aktif (\(daftarTugas.count))")) {
                    ForEach(daftarTugas) { tugas in
                        HStack {
                            Image(systemName: tugas.isSelesai ? "checkmark.circle.fill" : "circle")
                                .foregroundStyle(tugas.isSelesai ? .green : .gray)
                                .onTapGesture {
                                    tugas.isSelesai.toggle() // Langsung tersimpan otomatis!
                                }
                            Text(tugas.judul)
                        }
                    }
                    .onDelete(perform: hapusTugas)
                }
            }
            .navigationTitle("Catatan SwiftData")
        }
    }

    // CREATE (Insert):
    func tambahTugas() {
        let tugasBaru = CatatanTugas(judul: inputJudul)
        modelContext.insert(tugasBaru)
        inputJudul = ""
        // Tidak perlu panggil modelContext.save() secara manual!
        // SwiftData otomatis melakukan auto-save di background.
    }

    // DELETE:
    func hapusTugas(at offsets: IndexSet) {
        for index in offsets {
            let itemDihapus = daftarTugas[index]
            modelContext.delete(itemDihapus)
        }
    }
}
```

---

## 4. Keunggulan Predicate Type-Safe (`#Predicate`)

Di Core Data lama, filter ditulis dengan teks string `NSPredicate(format: "status == %@", "DONE")` yang rawan typo dan crash saat runtime.

Di SwiftData, macro **`#Predicate`** memvalidasi ekspresi filter **saat waktu kompilasi**:
```swift
let keyword = "Penting"
let predicate = #Predicate<CatatanTugas> { tugas in
    tugas.judul.contains(keyword) && tugas.isSelesai == false
}
```
Jika Anda salah mengetik nama properti, Xcode akan langsung menampilkan garis merah seketika!
