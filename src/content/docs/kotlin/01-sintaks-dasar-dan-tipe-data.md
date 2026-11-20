---
title: "01. Sintaks Dasar & Tipe Data"
description: Variabel val vs var, Unit vs Nothing, String template multiline, Smart Cast is, dan looping range.
---

# 🟣 Kotlin - Modul 01: Sintaks Dasar & Tipe Data

Cheatsheet kilat sintaks dasar bahasa Kotlin. Kotlin adalah bahasa modern statically typed yang berjalan di atas JVM (dan Native / JS) dengan fokus keselamatan (*null-safety*), keringkasan, dan interoperabilitas penuh dengan Java.

---

## 1. Variabel: `val` vs `var`

- **`val`**: Read-only / Immutable (tidak bisa di-reassign). **Gunakan ini sebagai default!**
- **`var`**: Mutable (nilainya bisa diubah-ubah).

```kotlin
val nama: String = "Eka"
// nama = "Budi" // ❌ Error: Val cannot be reassigned

var skor: Int = 100
skor = 150 //  Bisa karena bertipe var

// Type Inference (Tipe data otomatis ditebak compiler):
val umur = 25       // Ditebak Int
val saldo = 5000.0  // Ditebak Double
val isAktif = true  // Ditebak Boolean
```

---

## 2. Return Type: `Unit` vs `Nothing`

### A. `Unit` (Padanan `void`)
Menandakan bahwa fungsi **tidak mengembalikan nilai apa pun**. Penulisan `: Unit` bersifat opsional dan boleh dihapus:

```kotlin
fun cetakPesan(pesan: String): Unit {
    println("Pesan: $pesan")
}
// Sama dengan:
fun cetakPesanSingkat(pesan: String) {
    println("Pesan: $pesan")
}
```

### B. `Nothing` (Fungsi yang Tidak Pernah Selesai Normal)
Menandakan bahwa eksekusi fungsi pasti melempar (*throw*) exception atau masuk ke dalam infinite loop:

```kotlin
fun lemparError(pesan: String): Nothing {
    throw IllegalStateException("Error fatal: $pesan")
}
```

---

## 3. String Templates & Multiline Raw String

### A. Interpolasi String
Gunakan `$nama` untuk variabel sederhana, dan `${ekspresi}` jika mengakses properti atau logika:

```kotlin
val barang = "MacBook"
val harga = 18000000

println("Beli $barang seharga Rp ${harga * 0.9} (setelah diskon 10%)")
```

### B. Multiline Raw String (`"""`)
Tidak perlu ribet menyambung baris dengan `\n`. Gunakan `"""` dan `.trimIndent()`:

```kotlin
val querySQL = """
    SELECT id, username, email
    FROM users
    WHERE is_active = true
    ORDER BY created_at DESC
""".trimIndent()
```

---

## 4. Smart Cast (`is`) & Safe Cast (`as?`)

Compiler Kotlin sangat cerdas: jika kamu sudah mengecek tipe data dengan `is`, kamu **tidak perlu melakukan casting manual lagi**!

### Smart Cast:
```kotlin
fun prosesObjek(data: Any) {
    if (data is String) {
        // Otomatis di-cast jadi String di dalam blok ini!
        println("Panjang string: ${data.length}")
    } else if (data is Int) {
        // Otomatis di-cast jadi Int
        println("Nilai kuadrat: ${data * data}")
    }
}
```

### Unsafe (`as`) vs Safe Cast (`as?`):
```kotlin
val objek: Any = "Halo Kotlin"

// Unsafe cast (Bisa Crash / ClassCastException jika tipe beda):
val str1 = objek as String 

// Safe cast (Mengembalikan null jika gagal cast, anti crash!):
val angka = objek as? Int // Hasilnya null (bukan crash)
println(angka) // null
```

---

## 5. Looping Range & Stepping

Kotlin menggunakan ekspresi *range* yang sangat bersih untuk perulangan:

```kotlin
// 1. Inklusif (1 sampai 5):
for (i in 1..5) {
    print("$i ") // 1 2 3 4 5
}

// 2. Until (0 sampai sebelum 5):
for (i in 0 until 5) {
    print("$i ") // 0 1 2 3 4
}

// 3. Mundur (5 sampai 1):
for (i in 5 downTo 1) {
    print("$i ") // 5 4 3 2 1
}

// 4. Lompat (Step):
for (i in 1..10 step 2) {
    print("$i ") // 1 3 5 7 9
}
```
