---
title: "08. Property Wrappers & Swift 5.9+ Macros"
description: Panduan arsitektur @propertyWrapper, nilai proyeksi bertanda $, serta revolusi Swift Macros (@Observable, #Preview, #URL).
---

# 🍏 Swift - Modul 08: Property Wrappers & Swift 5.9+ Macros

Sebelum Swift 5.1, mengulang logika penyimpanan data (seperti validasi angka atau penyimpanan ke `UserDefaults`) mengharuskan kita menulis getter dan setter panjang di setiap properti. **Property Wrappers** dan **Swift Macros** (Swift 5.9+) hadir untuk mengotomatisasi pola-pola tersebut di tingkat compiler.

---

## 1. Anatomi `@propertyWrapper`

Sebuah Property Wrapper adalah struct atau class yang membungkus logika akses sebuah properti:
- Wajib memiliki properti **`wrappedValue`**.
- Opsional memiliki **`projectedValue`** (dapat diakses publik dengan menambahkan prefix tanda dollar **`$`**).

```mermaid
flowchart LR
    Caller[Kode Aplikasi] -->|Baca / Tulis| PW["@propertyWrapper"]
    PW -->|wrappedValue| Val[Nilai Asli Tersimpan]
    PW -->|projectedValue ($)| Proj[State Ekstra / Binding Publisher]
```

### Praktik 1: Wrapper `@Clamped` (Membatasi Rentang Angka)
```swift
@propertyWrapper
struct Clamped<T: Comparable> {
    private var nilai: T
    let range: ClosedRange<T>

    init(wrappedValue: T, _ range: ClosedRange<T>) {
        self.range = range
        self.nilai = min(max(wrappedValue, range.lowerBound), range.upperBound)
    }

    var wrappedValue: T {
        get { nilai }
        set { nilai = min(max(newValue, range.lowerBound), range.upperBound) }
    }
}

// Penggunaan di Class/Struct:
struct KarakterGame {
    @Clamped(0...100) var hp: Int = 100
    @Clamped(0...50) var stamina: Int = 30
}

var hero = KarakterGame()
hero.hp = 150 // Nilai otomatis dibatasi menjadi 100!
print("HP Hero: \(hero.hp)") // 100

hero.hp = -20 // Nilai otomatis dibatasi menjadi 0!
print("HP Hero: \(hero.hp)") // 0
```

---

### Praktik 2: Wrapper `@UserDefault` dengan Projected Value (`$`)
```swift
import Foundation

@propertyWrapper
struct UserDefault<T> {
    let key: String
    let defaultValue: T

    var wrappedValue: T {
        get { UserDefaults.standard.object(forKey: key) as? T ?? defaultValue }
        set { UserDefaults.standard.set(newValue, forKey: key) }
    }

    // Projected Value: Diekspos dengan tanda $
    var projectedValue: String {
        return "UserDefaults Key: [\(key)]"
    }
}

struct AppSettings {
    @UserDefault(key: "is_dark_mode", defaultValue: false)
    var isDarkMode: Bool
}

var settings = AppSettings()
settings.isDarkMode = true

// Mengakses nilai asli:
print("Dark Mode: \(settings.isDarkMode)") // true

// Mengakses Projected Value menggunakan tanda $:
print(settings.$isDarkMode) // "UserDefaults Key: [is_dark_mode]"
```
> [!NOTE]
> Inilah rahasia mengapa di SwiftUI Anda menulis `$nama` saat mem-passing binding ke TextField. Tanda `$` adalah **projectedValue** dari wrapper `@State` atau `@Binding`!

---

## 2. Revolusi Swift 5.9+ Macros

Berbeda dengan macro C/C++ yang sekadar melakukan *copy-paste string* teks liar sebelum kompilasi, **Swift Macros** adalah ekstensi compiler yang aman (*Type-Safe*), tervalidasi AST (*Abstract Syntax Tree*), dan kodenya dapat diinspeksi secara transparan di Xcode.

### A. Freestanding Expression Macros (`#`)
Diawali dengan tanda pagar `#`:

#### 1. `#Preview` (SwiftUI Preview Cepat):
Menggantikan protokol `PreviewProvider` yang berbelit-belit:
```swift
#Preview {
    ProfilUserView(nama: "Eka Dev")
}
```

#### 2. `#URL` (Validasi URL Waktu Kompilasi!):
Di Swift lama, membuat URL dari string menghasilkan Optional: `URL(string: "...")!`. Jika ada typo huruf, aplikasi crash saat runtime. 
Macro `#URL` memverifikasi format URL saat Anda mengetik di Xcode:
```swift
let endpoint = #URL("https://api.eka-dev.cloud/v1/users")
// Jika string bukan URL valid, Xcode akan melempar COMPILE ERROR merah!
```

---

### B. Attached Macros (`@`) - Macro `@Observable`

Diperkenalkan di iOS 17 (Swift 5.9), macro **`@Observable`** merevolusi arsitektur SwiftUI dengan memensiunkan framework Combine (`ObservableObject`, `@Published`, `@StateObject`).

```swift
import SwiftUI
import Observation

// Cukup tambahkan SATU baris macro ini:
@Observable 
class UserViewModel {
    var nama: String = "Eka"
    var email: String = "eka@dev.local"
    var saldo: Double = 0.0
}
```

### Mengapa `@Observable` 10x Lebih Cepat?
- **Fine-Grained Dependency Tracking**: Pada sistem lama (`ObservableObject`), jika properti `saldo` berubah, SEMUA View yang memegang ViewModel tersebut akan di-render ulang secara boros.
- Dengan macro `@Observable`, SwiftUI secara presisi hanya me-render ulang **View yang benar-benar membaca properti `saldo`**! Text yang membaca `nama` tidak akan disentuh sama sekali.
