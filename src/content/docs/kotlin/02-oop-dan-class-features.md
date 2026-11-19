---
title: "02. OOP & Class Features"
---

# 🟣 Kotlin - Modul 02: OOP & Class Features (Gaya Santai)

Cheatsheet kilat fitur class, objek, data model, dan properti modern di Kotlin.

---

## 1. Data Model & Properti

### `lateinit var`
Biar kita **tidak harus memberi nilai awal (*initial value*)** saat variabel dideklarasikan:
```kotlin
lateinit var apiService: ApiService

fun setup() {
    apiService = RetrofitClient.create()
}
```

### `data class` & Fungsi Sakti `.copy()`
Sangat bagus untuk DTO (Data Transfer Object) atau representasi state data.
- Otomatis menyediakan fungsi `.copy()` untuk menyalin objek dan hanya mengubah properti yang diinginkan:
```kotlin
data class User(val id: Int, val name: String, val role: String)

val user1 = User(1, "Eka", "Staff")

// Ganti role tanpa mengubah id dan nama:
val user2 = user1.copy(role = "Manager")
```

### Destructuring Data Class
Bisa membongkar data class menjadi variabel terpisah (seperti destructuring di JS). Gunakan garis bawah `_` jika properti tidak dibutuhkan:
```kotlin
val (namaUser, _, roleUser) = user2
println("$namaUser adalah $roleUser")
```

---

## 2. Object & Singleton

### Singleton `object`
Membuat objek tunggal global tanpa perlu instansiasi `new`:
```kotlin
object Utilities {
    fun formatRupiah(n: Int): String = "Rp $n"
}

// Cara panggil:
Utilities.formatRupiah(10000)
```

### `companion object`
Singleton di dalam sebuah class yang dipersingkat sehingga bisa diakses langsung via nama class-nya (padanan keyword `static` di Java):
```kotlin
class Database {
    companion object {
        fun connect() = println("DB Connected")
    }
}

// Cara panggil langsung:
Database.connect()
```

---

## 3. Delegation & Properties Keren

### Class Delegation (`by`)
Meneruskan fungsi yang ada dari class yang di-inject ke class lain tanpa harus menulis ulang method satu-persatu:
```kotlin
interface Base {
    fun cetak()
}

class BaseImpl : Base {
    override fun cetak() = println("Dari Base")
}

// Class Delegate otomatis meneruskan implementasi 'base':
class Delegate(val base: Base) : Base by base
```

### `by lazy`
Inisialisasi variabel menggunakan lambda yang **baru dihitung saat pertama kali diakses**:
```kotlin
val koneksiBerat: String by lazy {
    println("Menghitung koneksi...")
    "Koneksi Berhasil"
}

// Saat pertama dipanggil: mencetak hitung + return hasil
println(koneksiBerat)
// Panggilan kedua: langsung ambil cache tanpa hitung ulang
println(koneksiBerat)
```

### `Delegates.observable`
Memantau perubahan properti (bisa melihat `oldValue` dan `newValue`):
```kotlin
import kotlin.properties.Delegates

var saldo: Int by Delegates.observable(0) { prop, oldValue, newValue ->
    println("Saldo berubah dari $oldValue menjadi $newValue")
}

saldo = 50000 // Otomatis trigger println!
```

---

## 4. Trik Hemat Memori & Singkatan

- **`typealias`**: Mempersingkat nama tipe data atau fungsi lambda yang panjang:
  ```kotlin
  typealias ClickHandler = (buttonId: Int, label: String) -> Unit
  ```
- **`inline class` / `value class`**: Jika kamu hanya punya 1 properti saja di dalam class, bungkus dengan ini agar saat runtime tidak ada overhead alokasi objek baru di memori:
  ```kotlin
  @JvmInline
  value class UserId(val id: String)
  ```
