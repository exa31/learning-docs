---
title: "01. Sintaks Dasar & Fitur Fungsi"
---

# 🟣 Kotlin - Modul 01: Sintaks Dasar & Fitur Fungsi (Gaya Santai)

Cheatsheet kilat fitur bahasa dan fungsi di Kotlin yang paling sering dipakai di dunia nyata.

---

## 1. Variabel Dasar & Return Type `Unit`

- **`val`**: Read-only / Immutable (tidak bisa di-reassign). **Gunakan ini sebagai default!**
- **`var`**: Mutable (bisa diubah-ubah nilainya).
- **`Unit`**: Padanan `void`. Artinya fungsi **tidak me-return nilai apapun**.

```kotlin
val nama: String = "Eka" // Nilai tetap
var skor: Int = 10       // Nilai bisa berubah
skor = 20

fun sapa(teks: String): Unit {
    println(teks)
}
// ': Unit' boleh dihapus karena default-nya sudah Unit
```

---

## 2. Gaya Deklarasi Fungsi

### A. Single Expression Function
Jika fungsi hanya terdiri dari 1 baris, buang tanda kurung `{ }` dan kata kunci `return`:
```kotlin
fun kaliDua(num: Int): Int = num * 2
```

### B. Type Param `vararg` (Variable Arguments)
Menampung sisa parameter berapapun jumlahnya menjadi array dari 1 tipe (seperti `...args` di JS):
```kotlin
fun hitungTotal(vararg values: Int): Int {
    return values.sum()
}

hitungTotal(1, 2, 3, 4, 5) // 15
```

---

## 3. Fitur Sintaks Keren: Extension & Infix

### Extension Function
Bisa menambahkan fungsi baru ke tipe data yang sudah ada tanpa perlu mewariskan (*inherit*) class-nya. Untuk mengakses datanya, gunakan kata kunci **`this`**:
```kotlin
fun String.sapa(): String {
    return "Halo, $this!"
}

val namaUser = "Eka"
println(namaUser.sapa()) // "Halo, Eka!"
```

### Infix Notation
Membuat pemanggilan fungsi seperti operasi custom rasa bahasa manusia (tanpa titik dan tanpa tanda kurung).
- Syarat: Fungsi member/extension dan **hanya punya 1 parameter**.
```kotlin
infix fun String.to(tipe: String): String {
    return "$this->$tipe"
}

// Cara pakai:
val hasil = "test" to "type" // "test->type"
```

---

## 4. Lambda, Rekursif & Performa

### Lambda & Implicit Parameter `it`
- **Baris terakhir di dalam lambda pasti otomatis di-return**.
- Jika parameternya cuma 1, tidak perlu dideklarasikan manual, langsung panggil keyword bawaan **`it`**:
```kotlin
val kaliTiga: (Int) -> Int = { it * 3 }
println(kaliTiga(5)) // 15
```

### Method References (`::`)
Mengoper fungsi yang sudah ada sebagai referensi langsung:
```kotlin
fun toUpper(str: String): String = str.uppercase()

val lambdaName: (String) -> String = ::toUpper
```

### Anonymous Function
```kotlin
val namaVar = fun(param: String): String {
    return "test"
}
```

### `tailrec` (Tail Recursive Function)
Mengubah fungsi recursive menjadi loop di balik layar secara otomatis, **bebas bahaya StackOverflow**.
- Syarat: Pemanggilan diri sendiri harus murni di baris akhir tanpa embel-embel operasi tambahan (+ / -):
```kotlin
tailrec fun hitungMundur(nilai: Int) {
    if (nilai <= 0) return
    println(nilai)
    hitungMundur(nilai - 1) // Murni panggil diri sendiri
}
```

### High Order Function & Solusi `inline` / `noinline`
High Order Function (fungsi yang menerima parameter fungsi lain) normalnya bikin performa agak turun karena Kotlin selalu membuat objek fungsi baru di memori.
- **Solusi**: Pasang keyword `inline`. Compiler akan langsung menyalin kodenya ke tempat pemanggilan (*zero object overhead*).
- Jika ada parameter fungsi yang gamau di-inline, kasih tanda `noinline`:
```kotlin
inline fun testInline(
    func: () -> String,
    noinline fungsiBiasa: () -> Unit // Yang ini tidak di-inline
) {
    func()
}
```

---

## 5. Control Flow & Coroutine

### If-Else Sebagai Expression
```kotlin
fun cekStatus(nilai: Int): String = if (nilai >= 75) "Lulus" else "Remedial"
```

### Label Loop (`@`)
Membantu `return`, `continue`, dan `break` pada perulangan bertingkat (*nested loop*):
```kotlin
loopI@ for (i in 1..3) {
    for (j in 1..3) {
        if (i == 2 && j == 2) {
            break@loopI // Langsung keluar dari loop terluar!
        }
    }
}
```

### `suspend fun` (Non-Blocking Async)
Menandai fungsi sebagai operasi asynchronous non-blocking di Kotlin Coroutines:
```kotlin
suspend fun login(email: String, pass: String): User {
    return api.login(email, pass)
}
```
