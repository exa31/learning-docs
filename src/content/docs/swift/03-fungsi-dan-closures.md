---
title: "03. Fungsi & Closures"
description: Argument labels (_, external & internal), inout parameters, closures expression syntax, shorthand $0/$1, trailing closures, dan @escaping.
---

# 🍏 Swift - Modul 03: Fungsi & Closures

Cheatsheet fungsi dan closure (lambda) di Swift. Swift sangat unik karena menggunakan *argument labels* agar pemanggilan fungsi terbaca seperti kalimat bahasa Inggris alami.

---

## 1. Parameter & Argument Labels

Di Swift, tiap parameter fungsi punya 2 label: **External Label** (dipakai saat pemanggil fungsi) dan **Internal Label** (dipakai di dalam badan fungsi).

```swift
// 1. External label beda dengan Internal label
func sapa(ke penerima: String, dari pengirim: String) {
    print("Halo \(penerima), salam hangat dari \(pengirim)!")
}
// Panggil seperti membaca kalimat:
sapa(ke: "Eka", dari: "Budi")

// 2. Menghilangkan argument label dengan underscore (_)
func tambah(_ a: Int, _ b: Int) -> Int {
    return a + b
}
let hasil = tambah(10, 20) // Langsung tanpa 'a:' atau 'b:'

// 3. Default Parameter Value
func connect(host: String = "localhost", port: Int = 8080) {
    print("Connecting to \(host):\(port)")
}
connect() // localhost:8080
connect(port: 3000) // localhost:3000
```

---

## 2. Parameter `inout` (Pass by Reference)

Secara default, parameter fungsi di Swift adalah konstan (`let`). Jika ingin memodifikasi variabel asli dari luar fungsi, gunakan keyword `inout` dan kirim dengan tanda `&`:

```swift
func dobelkan(nilai: inout Int) {
    nilai *= 2
}

var saldo = 50000
dobelkan(nilai: &saldo)
print(saldo) // 100000 (variabel luar ikut berubah)
```

---

## 3. Closures (Anonymous Function / Lambda)

Closure adalah blok kode mandiri yang bisa disimpan ke variabel atau dioper sebagai parameter.

### Sintaks Dasar Closure:
```swift
let kaliDua: (Int) -> Int = { (angka: Int) -> Int in
    return angka * 2
}
print(kaliDua(5)) // 10
```

### Type Inference & Shorthand Arguments (`$0`, `$1`):
Swift bisa menebak tipe data parameter dan return, sehingga bisa disingkat drastis:

```swift
let angka = [5, 2, 8, 1, 9]

// Sintaks panjang:
let urut1 = angka.sorted(by: { (a: Int, b: Int) -> Bool in
    return a < b
})

// Sintaks super pendek dengan shorthand $0 dan $1:
let urut2 = angka.sorted { $0 < $1 }
print(urut2) // [1, 2, 5, 8, 9]
```

---

## 4. Trailing Closure Syntax

Jika argumen terakhir sebuah fungsi adalah closure, closure tersebut bisa ditarik ke luar kurung kurawal `()`. Pola ini adalah **fondasi utama sintaks deklaratif SwiftUI**:

```swift
func jalankanOperasi(label: String, action: () -> Void) {
    print("Mulai: \(label)")
    action()
    print("Selesai")
}

// Tanpa trailing:
jalankanOperasi(label: "Download", action: { print("Downloading...") })

// Dengan Trailing Closure (Sangat dianjurkan):
jalankanOperasi(label: "Download") {
    print("Downloading file...")
}
```

---

## 5. Higher Order Functions Praktis: `map`, `filter`, `compactMap`

```swift
let rawAngka = ["10", "dua puluh", "30", "40"]

// 1. map: ubah tiap item
let doubled = [1, 2, 3].map { $0 * 2 } // [2, 4, 6]

// 2. filter: saring kondisi
let genap = [1, 2, 3, 4, 5, 6].filter { $0 % 2 == 0 } // [2, 4, 6]

// 3. compactMap: mapping sekaligus otomatis membuang nil / parsing gagal
let parsedAngka = rawAngka.compactMap { Int($0) }
print(parsedAngka) // [10, 30, 40] ("dua puluh" otomatis dibuang tanpa error)

// 4. reduce: agregasi nilai
let total = [10, 20, 30].reduce(0) { $0 + $1 } // 60
```

---

## 6. `@escaping` Closures & Mencegah Memory Leak

Jika closure disimpan ke properti luar atau dipanggil secara asynchronous setelah fungsi selesai dieksekusi, Swift mewajibkan anotasi `@escaping`.

Untuk menghindari *retain cycle* (kebocoran memori / memory leak), gunakan capture list `[weak self]`:

```swift
class DataFetcher {
    var hasil: String = ""

    func fetchData(completion: @escaping (String) -> Void) {
        // Disimulasikan async callback
        DispatchQueue.global().asyncAfter(deadline: .now() + 1.0) {
            completion("Data dari server")
        }
    }

    func load() {
        // Cegah memory leak dengan [weak self]
        fetchData { [weak self] data in
            guard let self = self else { return }
            self.hasil = data
            print("Berhasil simpan: \(self.hasil)")
        }
    }
}
```
