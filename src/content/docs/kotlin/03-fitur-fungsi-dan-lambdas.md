---
title: "03. Fitur Fungsi & Lambdas"
description: Single expression function, named argument, extension function, infix, tailrec, trailing lambda, it, dan inline fun.
---

# 🟣 Kotlin - Modul 03: Fitur Fungsi & Lambdas

Fungsi di Kotlin adalah *first-class citizen*. Kotlin menyediakan banyak fitur sintaks ekspresif yang membuat kode terasa ringkas, mudah dibaca, dan bebas *boilerplate*.

---

## 1. Single Expression & Named Arguments

### A. Single Expression Function
Jika fungsi hanya terdiri dari 1 baris ekspresi, buang `{ }` dan kata kunci `return`:

```kotlin
fun kaliDua(num: Int): Int = num * 2
fun hitungLuas(p: Int, l: Int) = p * l // Tipe return Int otomatis di-infer
```

### B. Default & Named Arguments
Kamu bisa memberikan nilai default dan memanggil fungsi dengan menyebutkan nama parameternya secara eksplisit (urutan bebas):

```kotlin
fun buatRequest(
    url: String,
    method: String = "GET",
    timeoutMs: Long = 5000L
) {
    println("[$method] $url (Timeout: ${timeoutMs}ms)")
}

// 1. Pakai nilai default:
buatRequest(url = "https://api.eka-dev.cloud")

// 2. Override hanya parameter tertentu secara acak:
buatRequest(
    timeoutMs = 10000L,
    url = "https://api.eka-dev.cloud/upload",
    method = "POST"
)
```

---

## 2. Parameter `vararg` (Variable Arguments) & Spread Operator (`*`)

Menampung jumlah argumen dinamis ke dalam fungsi (seperti `...args` di JavaScript):

```kotlin
fun hitungTotal(vararg angka: Int): Int {
    return angka.sum()
}

println(hitungTotal(1, 2, 3, 4, 5)) // 15

// Jika sudah punya array, kirim dengan spread operator (*):
val listAngka = intArrayOf(10, 20, 30)
println(hitungTotal(*listAngka)) // 60
```

---

## 3. Extension Function (Fitur Andalan Kotlin)

Menambahkan fungsi baru ke tipe data yang sudah ada (bahkan tipe bawaan SDK Android / Java) tanpa perlu mewariskan (*inherit*) class aslinya. Nilai objek diakses lewat kata kunci **`this`**:

```kotlin
// Tambah fungsi ke String:
fun String.tambahEmoticon(): String = "$this 🚀"

// Tambah fungsi ke Int untuk memformat mata uang:
fun Int.toRupiah(): String = "Rp %,d".format(this).replace(',', '.')

println("Semangat".tambahEmoticon()) // "Semangat 🚀"
println(250000.toRupiah())            // "Rp 250.000"
```

---

## 4. Infix Function (Membuat Sintaks Seperti Membaca Buku)

Fungsi dengan **1 parameter** bisa diberi kata kunci `infix` sehingga dapat dipanggil tanpa tanda titik `.` dan tanda kurung `()`:

```kotlin
infix fun String.gabungDengan(kataLain: String): String {
    return "$this & $kataLain"
}

// Pemanggilan ala bahasa manusia:
val duet = "Eka" gabungDengan "Dev"
println(duet) // "Eka & Dev"
```

---

## 5. `tailrec` (Tail Recursion Optimization)

Fungsi rekursif rawan menyebabkan `StackOverflowError` jika kedalamannya ribuan kali. Di Kotlin, jika panggilan rekursif berada di baris paling akhir, tambahkan `tailrec`. Compiler akan mengubahnya menjadi perulangan biasa tanpa overhead stack memori:

```kotlin
tailrec fun faktorial(n: Long, akumulator: Long = 1): Long {
    if (n <= 1) return akumulator
    return faktorial(n - 1, n * akumulator) // Rekursi di posisi ekor (tail call)
}

println(faktorial(5)) // 120
```

---

## 6. High-Order Functions & Trailing Lambdas

Fungsi yang menerima fungsi lain sebagai parameter atau mengembalikan fungsi.

### Trailing Lambda & Implicit Parameter `it`:
Jika parameter terakhir fungsi adalah lambda, kurung kurawal `{ }` bisa ditarik ke luar kurung `()`. Jika lambda hanya punya 1 parameter, parameternya bisa langsung diakses dengan nama **`it`**:

```kotlin
fun jalankanOperasi(label: String, action: (Int) -> Unit) {
    println("Mulai: $label")
    action(100)
}

// Trailing lambda dengan parameter 'it':
jalankanOperasi("Proses Transaksi") {
    println("Menerima data transaksi sejumlah: $it")
}
```

---

## 7. `inline fun` (Zero Overhead Lambdas)

Di Kotlin, melewatkan lambda biasanya membuat objek anonim di memori heap (overhead). Dengan menambahkan kata kunci `inline`, compiler akan **menyisipkan langsung kode badan fungsi dan lambdanya ke tempat pemanggilan** pada saat kompilasi:

```kotlin
inline fun ukurWaktu(block: () -> Unit) {
    val mulai = System.currentTimeMillis()
    block()
    val selesai = System.currentTimeMillis()
    println("Waktu eksekusi: ${selesai - mulai}ms")
}

ukurWaktu {
    Thread.sleep(100)
}
```
