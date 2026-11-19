---
title: "02. Koleksi & Control Flow"
description: Array, Set, Dictionary, range loopings, switch pattern matching tingkat lanjut, dan pembersihan dengan defer.
---

# 🍏 Swift - Modul 02: Koleksi & Control Flow

Cheatsheet kilat 3 koleksi data utama di Swift, perulangan range, dan percabangan pattern matching.

---

## 1. Tiga Koleksi Utama: Array, Set, Dictionary

### A. Array (Urut, boleh duplikat)
```swift
var buah = ["Apel", "Jeruk", "Mangga"]
buah.append("Pisang")
buah.insert("Alpukat", at: 0)
let itemTerakhir = buah[buah.count - 1]
```

### B. Set (Himpunan Unik Tanpa Urutan)
```swift
var angkaUnik: Set<Int> = [1, 2, 2, 3] // Isinya hanya {1, 2, 3}
angkaUnik.insert(4)
```

### C. Dictionary (Key-Value)
Mengakses dictionary di Swift **selalu mengembalikan nilai Optional** (karena key belum tentu ada):
```swift
var skorUser: [String: Int] = ["Ali": 90, "Budi": 85]

// Akses aman dengan default value:
let skorSiti = skorUser["Siti", default: 0] // 0
```

---

## 2. Looping dengan Range

```swift
// 1. Closed Range (1 sampai 5 inklusif):
for i in 1...5 {
    print(i) // 1, 2, 3, 4, 5
}

// 2. Half-Open Range (0 sampai sebelum 5):
for i in 0..<5 {
    print(i) // 0, 1, 2, 3, 4
}

// 3. Looping Dictionary:
for (nama, skor) in skorUser {
    print("\(nama): \(skor)")
}
```

---

## 3. `switch` Sakti (Otomatis Break & Pattern Matching)

Di Swift, `switch` **otomatis berhenti** tanpa butuh kata kunci `break`. Mendukung pencocokan range, tuple, dan kondisi `where`:

```swift
let koordinat = (x: 5, y: 0)

switch koordinat {
case (0, 0):
    print("Titik pusat")
case (_, 0):
    print("Berada di garis horizontal Y=0")
case (let x, let y) where x == y:
    print("Nilai X dan Y sama: \(x)")
case (-10...10, -10...10):
    print("Berada di dalam kotak range 10")
default:
    print("Di luar area")
}
```

---

## 4. Kata Kunci `defer` (Eksekusi Pembersihan Terakhir)

`defer` menunda eksekusi blok kode sampai **fungsi saat ini selesai dieksekusi** (mirip `defer` di Golang):

```swift
func bukaDatabase() {
    print("1. Buka koneksi DB")
    
    // Wajib: Jadwalkan penutupan koneksi:
    defer {
        print("3. Tutup koneksi DB (Selalu jalan terakhir!)")
    }

    print("2. Proses query data...")
}
// Output berurutan: 1 -> 2 -> 3
```
