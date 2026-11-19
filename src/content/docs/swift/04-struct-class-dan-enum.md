---
title: "04. Struct, Class, dan Enum"
description: Perbedaan mendasar Struct (Value Type) vs Class (Reference Type), mutating method, ARC memori, dan Enum dengan Associated Values.
---

# 🍏 Swift - Modul 04: Struct, Class, & Enum

Pemahaman orientasi objek dan pemodelan data di Swift. Aturan emas arsitektur Swift modern (khususnya SwiftUI): **Selalu utamakan `struct`, gunakan `class` hanya jika benar-benar butuh shared reference!**

---

## 1. Struct (Value Type) vs Class (Reference Type)

| Fitur | `struct` (Value Type) | `class` (Reference Type) |
| :--- | :--- | :--- |
| **Penyimpanan Memori** | Disalin nilainya (*Copy-on-write*) | Berbagi referensi alamat memori (*Pointer*) |
| **Kecepatan** | Sangat cepat (Stack / Inlined) | Overhead alokasi Heap & ARC |
| **Inheritance** | Tidak mendukung warisan (pakai Protocol) | Mendukung warisan (*subclassing*) |
| **Default Initializer**| Otomatis (*Memberwise Init*) | Wajib buat `init()` sendiri jika ada properti tanpa nilai default |
| **Kapan Dipakai** | Model data, DTO, View SwiftUI, logika murni | Shared state, Service singleton, Network manager |

### Bukti Perilaku:
```swift
// 1. Struct (Copy)
struct UserStruct {
    var nama: String
}
var userA = UserStruct(nama: "Eka")
var userB = userA // Disalin total
userB.nama = "Budi"
print(userA.nama) // Tetap "Eka" (Aman dari efek samping)

// 2. Class (Reference)
class UserClass {
    var nama: String
    init(nama: String) { self.nama = nama }
}
let refA = UserClass(nama: "Eka")
let refB = refA // Menunjuk objek yang sama di memori
refB.nama = "Budi"
print(refA.nama) // Berubah jadi "Budi"! (Shared state)
```

---

## 2. Struct & Keyword `mutating`

Di struct, fungsi yang memodifikasi nilai propertinya sendiri wajib diberi tanda `mutating`. Jika struct disimpan ke dalam `let`, method mutating dilarang dipanggil oleh compiler:

```swift
struct Counter {
    var hitungan: Int = 0

    mutating func tambah() {
        hitungan += 1
    }
}

var c1 = Counter()
c1.tambah() //  Bisa karena c1 adalah var

let c2 = Counter()
// c2.tambah() // ❌ Error Compiler: Cannot use mutating member on immutable value
```

---

## 3. Class: ARC & Mencegah Retain Cycle (`weak`)

Swift mengelola memori menggunakan **ARC (Automatic Reference Counting)**. Jika dua objek saling mereferensikan secara kuat (*strong reference*), memori tidak akan pernah dilepas (*memory leak*).

Solusinya: gunakan `weak` (selalu bertipe optional `?`):

```swift
class Karyawan {
    let nama: String
    weak var kantor: Perusahaan? // weak mencegah retain cycle!

    init(nama: String) { self.nama = nama }
    deinit {
        print("Karyawan \(nama) dihapus dari RAM")
    }
}

class Perusahaan {
    let namaPerusahaan: String
    var staf: Karyawan?

    init(namaPerusahaan: String) { self.namaPerusahaan = namaPerusahaan }
    deinit {
        print("Perusahaan \(namaPerusahaan) dihapus dari RAM")
    }
}
```

---

## 4. Enum Tingkat Lanjut (Powerful Enums)

Enum di Swift jauh lebih kuat dibanding bahasa C/Java, karena mendukung **Raw Values**, **Associated Values**, dan fungsi internal.

### A. Enum dengan Associated Values (Algebraic Data Types)
Sangat berguna untuk pemodelan status respons API atau State Management:

```swift
enum NetworkState {
    case idle
    case loading
    case success(data: [String])
    case error(kode: Int, pesan: String)
}

let status: NetworkState = .error(kode: 404, pesan: "Endpoint tidak ditemukan")

// Pola konsumsi dengan Switch Pattern Matching:
switch status {
case .idle:
    print("Menunggu...")
case .loading:
    print("Sedang mengambil data...")
case .success(let data):
    print("Data diterima: \(data.count) item")
case .error(let kode, let pesan):
    print("Gagal! Error \(kode): \(pesan)")
}
```

### B. Enum dengan Raw Value & CaseIterable
```swift
enum Role: String, CaseIterable {
    case admin = "ADMINISTRATOR"
    case user = "REGULAR_USER"
    case guest = "GUEST"
}

// Akses raw string value:
let userRole = Role.admin
print(userRole.rawValue) // "ADMINISTRATOR"

// Loop semua case yang ada:
for r in Role.allCases {
    print("Role tersedia: \(r.rawValue)")
}
```
