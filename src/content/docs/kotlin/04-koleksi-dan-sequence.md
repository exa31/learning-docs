---
title: "04. Koleksi & Sequence"
description: List, Set, Map immutable vs mutable, operasi transformasi koleksi lengkap, serta optimasi performa Sequence (Lazy Evaluation).
---

# 🟣 Kotlin - Modul 04: Koleksi & Sequence

Kotlin membagi seluruh koleksi data menjadi 2 kategori tegas: **Read-Only (Immutable)** dan **Mutable**. Hal ini mencegah efek samping (*side-effects*) perubahan data yang tidak sengaja.

---

## 1. Tiga Koleksi Utama: List, Set, Map

```kotlin
// 1. LIST (Urut, boleh duplikat)
val listTetap = listOf("Apel", "Jeruk", "Mangga") // Read-only
// listTetap.add("Pisang") // ❌ Error: Tidak ada method add

val listBisaUbah = mutableListOf("Apel", "Jeruk")
listBisaUbah.add("Pisang") //  Bisa

// 2. SET (Himpunan Unik, tanpa duplikat)
val angkaUnik = setOf(1, 2, 2, 3, 3, 3)
println(angkaUnik) // [1, 2, 3]

// 3. MAP (Key-Value)
val skorSiswa = mapOf(
    "Ali" to 95,
    "Budi" to 80
)
println(skorSiswa["Ali"]) // 95
```

---

## 2. Operasi Transformasi & Filtering Populer

```kotlin
val angka = listOf(1, 2, 3, 4, 5, 6)

// 1. filter: menyaring data
val genap = angka.filter { it % 2 == 0 } // [2, 4, 6]

// 2. map: mengubah tiap elemen
val kuadrat = angka.map { it * it } // [1, 4, 9, 16, 25, 36]

// 3. flatMap: membongkar list di dalam list menjadi 1 list datar
val menu = listOf(listOf("Kopi", "Teh"), listOf("Roti", "Donat"))
val semuaMenu = menu.flatMap { it } // ["Kopi", "Teh", "Roti", "Donat"]

// 4. partition: membelah list jadi 2 bagian (lolos kondisi vs tidak lolos)
val (lulus, gagal) = listOf(80, 55, 90, 45).partition { it >= 70 }
println("Lulus: $lulus, Gagal: $gagal") // Lulus: [80, 90], Gagal: [55, 45]
```

---

## 3. Pengelompokan Data: `groupBy` & `associateBy`

```kotlin
data class User(val id: Int, val role: String, val nama: String)

val users = listOf(
    User(1, "ADMIN", "Eka"),
    User(2, "USER", "Budi"),
    User(3, "USER", "Siti")
)

// 1. groupBy: Mengelompokkan list menjadi Map<String, List<User>>
val grupByRole = users.groupBy { it.role }
// Hasil: {ADMIN=[User(1, ...)], USER=[User(2, ...), User(3, ...)]}

// 2. associateBy: Membuat lookup Map dengan key unik Map<Int, User>
val userById = users.associateBy { it.id }
println(userById[1]?.nama) // "Eka"
```

---

## 4. Agregasi: `sumOf`, `fold`, & `reduce`

```kotlin
val belanjaan = listOf(
    Item("Buku", 50000),
    Item("Pulpen", 10000)
)

// Menghitung total harga dengan sumOf:
val total = belanjaan.sumOf { it.harga } // 60000

// fold (dengan nilai awal akumulator):
val gabungNama = listOf("Kotlin", "is", "Awesome").fold("Catatan:") { acc, kata ->
    "$acc $kata"
}
println(gabungNama) // "Catatan: Kotlin is Awesome"
```

---

## 5. `Sequence` (Lazy Evaluation untuk Data Besar)

Secara default, method koleksi Kotlin (`map`, `filter`) bersifat **Eager** (tiap langkah langsung membuat list baru di memori).

Jika memproses ribuan/jutaan data atau chaining bertingkat banyak, ubah menjadi `Sequence` dengan `.asSequence()` agar evaluasi berjalan secara **Lazy** (per-item satu demi satu, tanpa membuat intermediate list):

```kotlin
val hasil = (1..1_000_000).asSequence()
    .filter { it % 2 == 0 }
    .map { it * 2 }
    .take(5) // Berhenti tepat setelah 5 data ditemukan!
    .toList()

println(hasil) // [4, 8, 12, 16, 20] (Hanya mengevaluasi sebagian kecil data)
```
