---
title: "03. Fitur Fungsi, Lambdas & Inline Optimization"
description: Panduan fungsi Kotlin, Extension Functions, Infix, Higher-Order Functions, Function Types with Receiver (DSL), serta optimasi inline, noinline, dan crossinline.
---

# 🟣 Kotlin - Modul 03: Fitur Fungsi, Lambdas & Inline Optimization

Kotlin memperlakukan fungsi sebagai warga negara kelas satu (*First-Class Citizens*). Anda dapat menyimpan fungsi dalam variabel, mengirimkannya sebagai argumen, mengembalikan fungsi dari fungsi lain, serta menambahkan fungsi baru ke kelas pihak ketiga tanpa perlu melakukan *subclassing*.

---

## 1. Parameter Default & Named Arguments

Di Java, developer sering membuat belasan method *overloading* hanya untuk menangani parameter opsional. Di Kotlin, masalah ini selesai dengan **Default Parameters**:

```kotlin
fun kirimNotifikasi(
    pesan: String,
    channel: String = "PUSH",
    prioritas: Int = 1,
    retryCount: Int = 3
) {
    println("Mengirim via $channel (Prioritas: $prioritas, Retry: $retryCount): $pesan")
}

// Pemanggilan dengan Named Arguments (Bebas ubah urutan parameter!):
kirimNotifikasi(
    pesan = "Pesanan sedang dikirim",
    channel = "WHATSAPP"
    // prioritas dan retryCount otomatis memakai nilai default
)
```

---

## 2. Extension Functions: Memperluas Class Tanpa Warisan

Ingin menambah method baru ke class `String` atau `Context` Android tanpa mewarisinya? Gunakan **Extension Function**:

```kotlin
// Menambah fungsi isEmailValid() ke tipe data bawaan String:
fun String.isEmailValid(): Boolean {
    val regex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$".toRegex()
    return this.matches(regex) // 'this' merujuk pada objek String pemanggil
}

// Penggunaan di kode aplikasi:
val inputEmail = "eka@dev.local"
if (inputEmail.isEmailValid()) {
    println("Email valid!")
}
```

> [!NOTE]
> Extension Function bersifat statis di balik layar (`public static final isEmailValid(String $this)`). Fungsi ini tidak benar-benar memodifikasi bytecode class target dan tidak bisa mengakses method/properti `private`.

---

## 3. Infix Functions & Tailrec

### A. Infix Functions (Sintaks Alami Tanpa Titik dan Kurung)
```kotlin
// Fungsi infix harus berupa member function atau extension function dengan TEPAT 1 parameter:
infix fun Int.kali(pengali: Int): Int = this * pengali

val hasil = 5 kali 10 // Ekuivalen dengan 5.kali(10) -> Menghasilkan 50
```

### B. Tail Recursive Functions (`tailrec`)
Fungsi rekursif rawan memicu `StackOverflowError` jika kedalaman rekursi terlalu besar. Beri anotasi **`tailrec`** agar compiler mengubah rekursi menjadi perulangan `while` biasa di level bytecode JVM:

```kotlin
tailrec fun hitungFaktorial(n: Int, akumulator: Long = 1): Long {
    return if (n <= 1) akumulator
    else hitungFaktorial(n - 1, n * akumulator) // Panggilan rekursif harus menjadi instruksi terakhir!
}
```

---

## 4. Higher-Order Functions & Trailing Lambda

Fungsi yang menerima parameter fungsi lain atau mengembalikan fungsi disebut **Higher-Order Function**.

```kotlin
// Fungsi yang mengukur waktu eksekusi:
fun ukurWaktu(aksi: () -> Unit) {
    val mulai = System.currentTimeMillis()
    aksi() // Eksekusi lambda
    val selesai = System.currentTimeMillis()
    println("Waktu eksekusi: ${selesai - mulai} ms")
}

// Trailing Lambda Syntax: Jika lambda adalah parameter TERAKHIR,
// kurung buka lambda bisa ditaruh di LUAR kurung fungsi!
ukurWaktu {
    // Blok kode yang ingin diukur
    Thread.sleep(100)
}
```

### Parameter Implisit `it`
Jika sebuah lambda hanya memiliki satu parameter, Anda tidak perlu menamainya; cukup gunakan kata kunci **`it`**:
```kotlin
val angka = listOf(1, 2, 3, 4, 5)
val kuadrat = angka.map { it * it } // 'it' mewakili setiap elemen integer
```

---

## 5. Function Type with Receiver (Fondasi Kotlin DSL)

Fondasi sintaks declarative di Gradle KTS, Jetpack Compose, dan Ktor Routing adalah **Function Type with Receiver**:

```kotlin
// Tipe fungsi: StringBuilder.() -> Unit
// Artinya: Lambda ini berjalan di DALAM konteks objek StringBuilder!
fun buildStringKustom(builderAction: StringBuilder.() -> Unit): String {
    val sb = StringBuilder()
    sb.builderAction() // sb menjadi 'this' di dalam lambda!
    return sb.toString()
}

val teks = buildStringKustom {
    // Di sini kita bisa langsung panggil method StringBuilder tanpa mengetik 'sb.'!
    append("Halo ")
    append("Eka Dev! ")
    append("Selamat Datang.")
}
```

---

## 6. Optimasi Kinerja: `inline`, `noinline` & `crossinline`

### Mengapa Lambda Biasa Boros Memori?
Di JVM, setiap kali Anda membuat lambda biasa, Kotlin membuat sebuah instance objek anonim baru (`new Function0()`) di memori Heap. Jika dipanggil di dalam loop 100.000 kali, memori akan banjir alokasi objek sampah!

```mermaid
flowchart LR
    subgraph NonInline["Tanpa inline (Regular Lambda)"]
        Caller1[Kode Pemanggil] -->|Alokasi Objek Baru di Heap!| Obj["new Function0()"]
        Obj --> Exec1[Eksekusi Kode]
    end

    subgraph Inline["Dengan inline"]
        Caller2[Kode Pemanggil] -->|Bytecode disalin langsung di tempat!| Exec2[Eksekusi Langsung (Zero Allocation!)]
    end
```

### A. Kata Kunci `inline`
Menyalin seluruh bytecode fungsi dan lambda langsung ke baris pemanggil, menghilangkan alokasi objek Heap secara total:
```kotlin
inline fun eksekusiCepat(blok: () -> Unit) {
    blok()
}
```

### B. `noinline`
Jika sebuah fungsi inline menerima beberapa lambda, namun Anda ingin satu lambda tetap diperlakukan sebagai objek biasa (misal ingin disimpan ke variabel):
```kotlin
inline fun prosesDuaAksi(
    aksiInlined: () -> Unit,
    noinline aksiDisimpan: () -> Unit // Jangan di-inline!
) {
    aksiInlined()
    antreanTugas.add(aksiDisimpan) // Aman disimpan ke list!
}
```

### C. `crossinline` (Mencegah Non-Local Returns)
Secara default, lambda di dalam fungsi inline boleh melakukan `return` yang menghentikan fungsi pemanggil di luar (*Non-local return*). Jika lambda tersebut akan dieksekusi di context lain (seperti thread baru), beri tanda `crossinline`:
```kotlin
inline fun jalankanAsync(crossinline tugas: () -> Unit) {
    val runnable = Runnable {
        tugas() // Aman! Developer dilarang melakukan 'return' liar keluar dari sini
    }
    Thread(runnable).start()
}
```
