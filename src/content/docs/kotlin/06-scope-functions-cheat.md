---
title: "06. Cheatsheet Scope Functions"
description: Panduan tuntas 5 Scope Functions Kotlin (let, apply, run, also, with) - matriks perbandingan this vs it, return value, dan contoh kasus nyata.
---

# 🟣 Kotlin - Modul 06: Cheatsheet Scope Functions

Kotlin memiliki 5 fungsi pelingkup (*Scope Functions*): **`let`**, **`run`**, **`with`**, **`apply`**, dan **`also`**. Tujuannya adalah mengeksekusi blok kode dalam konteks suatu objek secara ringkas.

---

## 1. Matriks Perbandingan 5 Scope Functions

Hafalkan 2 perbedaan kuncinya:
1. **Cara Mengakses Objek Konteks**: Apakah sebagai receiver **`this`** atau sebagai argumen **`it`**?
2. **Nilai yang Dikembalikan (*Return Value*)**: Apakah mengembalikan **Objek Konteks itu sendiri** (*Context Object*) atau **Hasil baris terakhir lambda** (*Lambda Result*)?

| Fungsi | Objek Konteks | Nilai Return | Apakah Extension? | Kasus Penggunaan Utama |
|---|---|---|---|---|
| **`apply`** | `this` | **Context Object** | Ya | Konfigurasi properti objek saat inisialisasi |
| **`also`** | `it` | **Context Object** | Ya | Efek samping tambahan (logging, verifikasi, validasi) |
| **`let`** | `it` | **Lambda Result** | Ya | Safe unwrapping nilai nullable (`?.let`) & transformasi |
| **`run`** | `this` | **Lambda Result** | Ya | Komputasi / kalkulasi hasil dari sebuah objek |
| **`with`** | `this` | **Lambda Result** | Bukan (`with(obj)`) | Memanggil banyak method dari satu objek non-null |

---

## 2. Contoh Penggunaan di Dunia Nyata

### A. `apply` (Konfigurasi Objek)
Paling cocok saat kamu baru membuat objek dan ingin mengatur banyak propertinya sekaligus:

```kotlin
class Button {
    var text: String = ""
    var color: String = ""
    var isEnabled: Boolean = false
}

// apply mengembalikan objek Button itu sendiri:
val myButton = Button().apply {
    text = "Submit"       // 'this.text' disingkat 'text'
    color = "Blue"
    isEnabled = true
}
```

---

### B. `also` (Side Effects & Logging)
Cocok saat kamu ingin melakukan aksi sampingan (misal print log) di tengah-tengah aliran pipeline tanpa mengubah nilai objek:

```kotlin
fun hitungDanSimpan(): List<Int> {
    return (1..5)
        .map { it * 10 }
        .also { listHasil ->
            println("Debug: Hasil komputasi list = $listHasil")
        }
        .filter { it > 20 }
}
```

---

### C. `let` (Null Checking & Transformasi)
Mengeksekusi blok hanya jika data tidak null dan mengembalikan hasil transformasi:

```kotlin
val username: String? = "eka31"

val panjangKarakter: Int = username?.let {
    println("Username ditemukan: $it")
    it.length // Return nilai panjang karakter
} ?: 0

println("Panjang: $panjangKarakter") // 5
```

---

### D. `run` (Konfigurasi + Mengembalikan Hasil)
Mirip seperti gabungan `apply` (bisa akses `this`) dan `let` (mengembalikan baris terakhir):

```kotlin
val service = ApiClient()

val responseCode = service.run {
    setBaseUrl("https://api.eka-dev.cloud")
    setTimeout(5000)
    executeGet() // Nilai baris terakhir ini yang di-return!
}
```

---

### E. `with` (Mengelompokkan Panggilan Method)
Bukan extension function. Mengoperasikan objek non-null tanpa perlu mengetik ulang nama variabelnya berulang kali:

```kotlin
val dataUser = StringBuilder()

val hasilString = with(dataUser) {
    append("Nama: Eka\n")
    append("Role: Software Engineer\n")
    toString() // Return string final
}
println(hasilString)
```

---

## 3. Rumus Cepat Menentukan Pilihan (*Cheat Decision*)

1. Mau **atur properti objek baru**? &rarr; Pakai **`apply`**.
2. Mau **cek null** atau **mapping nilai**? &rarr; Pakai **`let`**.
3. Mau **logging** / cek data tanpa ganggu alur return? &rarr; Pakai **`also`**.
4. Mau **hitung nilai akhir** dari suatu objek? &rarr; Pakai **`run`**.
