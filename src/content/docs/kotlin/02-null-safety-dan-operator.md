---
title: "02. Null Safety & Operator Khusus"
description: Sound Null Safety Kotlin, Safe Call ?., Elvis Operator ?:, bahaya !!, filterNotNull, dan safe unwrapping dengan let.
---

# 🟣 Kotlin - Modul 02: Null Safety & Operator Khusus

Di Java, musuh nomor 1 developer adalah `NullPointerException` (NPE). Kotlin menyelesaikan masalah ini secara fundamental di tingkat compiler dengan sistem **Sound Null Safety**.

---

## 1. Non-Null vs Nullable Type (`?`)

Secara default di Kotlin, variabel **sama sekali tidak boleh bernilai `null`**:

```kotlin
// 1. Tipe Biasa (Non-Null)
var nama: String = "Eka"
// nama = null // ❌ Error Compiler: Null can not be a value of a non-null type String

// 2. Tipe Nullable (Pasang tanda ?)
var bio: String? = "Software Engineer"
bio = null //  Aman, compiler mengizinkan
```

---

## 2. Safe Call Operator (`?.`)

Jika suatu variabel bertipe nullable, kamu tidak bisa langsung mengakses propertinya. Gunakan `?.` agar kode tidak melempar NPE jika nilainya null:

```kotlin
val email: String? = null

// val panjang = email.length // ❌ Error Compiler: Only safe (?.) or non-null asserted (!!.) calls are allowed

val panjang = email?.length //  Mengembalikan Int? (bernilai null tanpa crash)
println(panjang) // null
```

Chaining safe call untuk objek bersarang (*nested object*):
```kotlin
val namaKota = user?.alamat?.kota?.nama // Jika salah satu null, hasilnya null
```

---

## 3. Elvis Operator (`?:`)

Elvis operator digunakan untuk memberikan **nilai fallback default** jika variabel bernilai null.

```kotlin
val inputNama: String? = null

// Jika inputNama null, gunakan "Anonim":
val namaPanggilan = inputNama ?: "Anonim"
println(namaPanggilan) // "Anonim"
```

### Elvis untuk Early Return / Throw:
Sangat berguna untuk validasi input di awal fungsi:
```kotlin
fun prosesOrder(orderId: String?) {
    // Jika orderId null, langsung return atau lempar exception:
    val id = orderId ?: return println("Order ID kosong, lewati")
    
    println("Memproses order: $id")
}

fun ambilAkun(token: String?): String {
    val t = token ?: throw IllegalArgumentException("Token otentikasi wajib ada!")
    return "Akun valid dengan token: $t"
}
```

---

## 4. Unwrapping Idiomatis: `?.let { ... }`

Cara paling elegan dan populer di Kotlin untuk mengeksekusi blok kode **hanya jika nilainya tidak null**:

```kotlin
val dataUser: String? = "eka31"

dataUser?.let { nonNullValue ->
    // Blok ini HANYA jalan jika dataUser bukan null
    println("Mengirim email ke: $nonNullValue")
}

// Menggunakan shorthand 'it':
dataUser?.let {
    println("Huruf kapital: ${it.uppercase()}")
}
```

---

## 5. Bahaya Not-Null Assertion Operator (`!!`)

Operator `!!` memaksa compiler menganggap suatu variabel pasti tidak null (*force unwrap*). 

> ⚠️ **PERINGATAN**: Jika ternyata variabel bernilai `null` saat runtime, aplikasi kamu **akan crash seketika dengan `NullPointerException`**!

```kotlin
val token: String? = null

// JANGAN BIASAKAN INI:
// println(token!!.length) // 💥 Crash: KotlinNullPointerException!

// Solusi aman: selalu gunakan ?. atau ?:
println(token?.length ?: 0) // Aman: 0
```

---

## 6. Safe Collection: `filterNotNull()`

Jika kamu punya koleksi yang berisi nilai-nilai nullable, bersihkan elemen null dengan 1 fungsi:

```kotlin
val daftarNilai: List<Int?> = listOf(80, null, 95, null, 70)

val nilaiValid: List<Int> = daftarNilai.filterNotNull()
println(nilaiValid) // [80, 95, 70] (tipe otomatis berubah jadi List<Int> non-null!)
```
