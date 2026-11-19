---
title: "05. Protocols, Extension, & Generics"
description: Protocol-Oriented Programming (POP), default implementation via extension, retroactive modeling, Generics, serta built-in protocols Codable & Identifiable.
---

# 🍏 Swift - Modul 05: Protocols, Extensions, & Generics

Swift dijuluki sebagai bahasa bertaraf **Protocol-Oriented Programming (POP)**. Alih-alih hierarki warisan kelas (OOP klasik) yang kaku dan rawan masalah, Swift menyusun kapabilitas sistem lewat komposisi protokol dan ekstensi.

---

## 1. Definisi Protocol & Adopsi

Protocol adalah kontrak rancangan (blueprint) fungsi atau properti:

```swift
protocol Pembayaran {
    var mataUang: String { get }
    func prosesTransaksi(jumlah: Double) -> Bool
}

struct PembayaranQRIS: Pembayaran {
    var mataUang: String = "IDR"

    func prosesTransaksi(jumlah: Double) -> Bool {
        print("Memproses QRIS sebesar \(mataUang) \(jumlah)... Sukses!")
        return true
    }
}
```

---

## 2. Protocol Extensions (Default Implementation)

Kamu bisa memberikan implementasi default ke dalam protocol via `extension`. Tipe data yang mengadopsinya tidak perlu lagi menulis ulang fungsi tersebut kecuali jika ingin melakukan *override*:

```swift
protocol Notifiable {
    func kirimPeringatan(pesan: String)
}

// Berikan perilaku default:
extension Notifiable {
    func kirimPeringatan(pesan: String) {
        print("📢 Notifikasi Default: \(pesan)")
    }
}

struct UserNotification: Notifiable {
    // Tidak wajib tulis method kirimPeringatan, otomatis pakai default!
}

let notif = UserNotification()
notif.kirimPeringatan(pesan: "Server restart dalam 5 menit")
```

---

## 3. Extension untuk Tipe Bawaan (*Retroactive Modeling*)

Salah satu fitur paling dicintai developer Swift: menambahkan method atau computed property ke tipe data bawaan Apple (`String`, `Int`, `Double`, dsb.) tanpa perlu membuat subclass:

```swift
extension Int {
    // Menghitung kuadrat
    var kuadrat: Int {
        return self * self
    }

    // Melakukan looping sebanyak N kali
    func ulangi(aksi: () -> Void) {
        for _ in 0..<self {
            aksi()
        }
    }
}

print(5.kuadrat) // 25

3.ulangi {
    print("Swift is Awesome!")
}
```

---

## 4. Generics & Protocol Constraints

Generics memungkinkan kita menulis kode yang fleksibel dan reusable untuk berbagai tipe data, dengan jaminan keamanan tipe statis (*Type Safe*).

```swift
// Fungsi generic dengan constraint 'Comparable' (harus bisa dibandingkan dengan <, >)
func temukanNilaiMaksimal<T: Comparable>(a: T, b: T) -> T {
    return a > b ? a : b
}

print(temukanNilaiMaksimal(a: 10, b: 25))          // 25 (Int)
print(temukanNilaiMaksimal(a: "Apel", b: "Zebra")) // "Zebra" (String)
```

### Generic Data Structure (Contoh: Stack)
```swift
struct Stack<Elemen> {
    private var items: [Elemen] = []

    mutating func push(_ item: Elemen) {
        items.append(item)
    }

    mutating func pop() -> Elemen? {
        return items.popLast()
    }
}

var tumpukanNama = Stack<String>()
tumpukanNama.push("Eka")
tumpukanNama.push("Budi")
print(tumpukanNama.pop() ?? "") // "Budi"
```

---

## 5. Built-in Protocols Wajib di Dunia Nyata

### A. `Codable` (Parsing JSON Otomatis)
Cukup tambahkan protokol `Codable` (gabungan `Encodable` & `Decodable`), maka parsing JSON ke struct bisa dilakukan 1 baris tanpa library pihak ketiga:

```swift
import Foundation

struct Produk: Codable {
    let id: Int
    let nama: String
    let harga: Double
}

let jsonString = """
{
    "id": 101,
    "nama": "MacBook Air M3",
    "harga": 18500000.0
}
"""

// Decode dari JSON:
if let jsonData = jsonString.data(using: .utf8) {
    let produk = try JSONDecoder().decode(Produk.self, from: jsonData)
    print("Produk: \(produk.nama), Rp \(produk.harga)")
}
```

### B. `Identifiable` (Wajib untuk SwiftUI)
Protokol wajib jika data ingin ditampilkan ke dalam `List` atau `ForEach` di SwiftUI agar framework tahu id unik setiap baris:

```swift
struct TaskItem: Identifiable {
    let id = UUID() // Menghasilkan unique ID otomatis
    var judul: String
}
```
