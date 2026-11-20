---
title: "06. Cheatsheet 5 Scope Functions & Idiom Kotlin"
description: Matriks komparasi lengkap 5 Scope Functions (let, run, with, apply, also), tabel pembeda this vs it, diagram alur keputusan, dan anti-pattern.
---

# 🟣 Kotlin - Modul 06: 5 Scope Functions & Idiom Kotlin

Kotlin menyediakan 5 fungsi pustaka standar (*Scope Functions*) yang mengeksekusi blok kode di dalam konteks suatu objek: **`let`**, **`run`**, **`with`**, **`apply`**, dan **`also`**. 

Meskipun kelimanya terlihat mirip, masing-masing memiliki perbedaan tegas pada dua dimensi: **cara merujuk objek konteks (`this` vs `it`)** dan **nilai apa yang dikembalikan oleh fungsi**.

---

## 1. Matriks Komparasi 5 Scope Functions

| Fungsi | Referensi Objek | Nilai Kembalian (*Return Value*) | Apakah Fungsi Ekstensi? | Kasus Penggunaan Utama |
|---|---|---|---|---|
| **`apply`** | **`this`** | **Objek Konteks itu sendiri** | ✅ Ya (`T.apply`) | Konfigurasi properti objek saat inisialisasi (*Builder*). |
| **`also`** | **`it`** | **Objek Konteks itu sendiri** | ✅ Ya (`T.also`) | Menjalankan efek samping tambahan (*logging*, print debug, validasi). |
| **`let`** | **`it`** | **Hasil kalkulasi Lambda** | ✅ Ya (`T.let`) | Null-checking unwrapping (`?.let`), transformasi tipe data lokal. |
| **`run`** | **`this`** | **Hasil kalkulasi Lambda** | ✅ Ya (`T.run`) | Konfigurasi objek lalu langsung menghitung suatu nilai kembalian. |
| **`with`** | **`this`** | **Hasil kalkulasi Lambda** | ❌ Bukan (`with(obj)`) | Mengelompokkan banyak pemanggilan method pada objek yang tidak null. |

---

## 2. Diagram Alur Memilih Scope Function yang Tepat

```mermaid
flowchart TD
    Q1{Apakah Anda butuh mengembalikan OBJEK KONTEKS itu sendiri?}

    Q1 -->|YA| Q2{Apakah Anda sedang mengonfigurasi properti objek tersebut?}
    Q2 -->|YA| Apply["✅ apply<br/>(Akses properti via 'this')"]
    Q2 -->|TIDAK (Hanya efek samping / logging)| Also["✅ also<br/>(Akses objek via 'it')"]

    Q1 -->|TIDAK (Butuh return hasil lambda)| Q3{Apakah objek tersebut bertipe Nullable?}
    Q3 -->|YA| Let["✅ let (dengan safe call ?.)<br/>obj?.let { ... }"]
    Q3 -->|TIDAK| Q4{Apakah Anda ingin memanggil banyak method objek tanpa nama variabel?}
    Q4 -->|YA| With["✅ with(obj) { ... }"]
    Q4 -->|TIDAK| Run["✅ run { ... }"]
```

---

## 3. Contoh Praktik Nyata Masing-Masing Fungsi

### A. `apply`: Inisialisasi Objek (Kembalikan `this`)
Sangat populer untuk konfigurasi objek view, network request, atau database client:
```kotlin
val notifIntent = Intent(this, MainActivity::class.java).apply {
    action = Intent.ACTION_VIEW
    putExtra("NOTIFICATION_ID", 101)
    flags = Intent.FLAG_ACTIVITY_NEW_TASK
    // Mengembalikan objek notifIntent itu sendiri!
}
```

### B. `also`: Efek Samping Tambahan (Kembalikan `this`)
Gunakan jika Anda ingin melakukan logging atau verifikasi di tengah-tengah alur tanpa mengubah objek:
```kotlin
fun buatUser(nama: String): User {
    return User(id = 1, nama = nama).also {
        // Objek diakses via 'it'
        println("Audit Log: Berhasil membuat user baru dengan ID: ${it.id}")
    }
}
```

### C. `let`: Null-Safety & Transformasi (Kembalikan Hasil Lambda)
```kotlin
val emailInput: String? = "   user@eka-dev.cloud   "

val domain: String = emailInput?.let {
    // it dijamin bukan null
    val emailBersih = it.trim()
    emailBersih.substringAfter("@") // Ini yang di-return oleh let!
} ?: "default.domain"

println(domain) // "eka-dev.cloud"
```

### D. `run`: Konfigurasi + Kalkulasi Hasil
```kotlin
val statusServer: String = serverClient.run {
    timeoutMs = 5000
    connect()
    checkHealth() // Baris terakhir di-return sebagai nilai statusServer
}
```

### E. `with`: Mengelompokkan Pemanggilan Method
```kotlin
val buffer = StringBuilder()
with(buffer) {
    append("Laporan Keuangan\n")
    append("----------------\n")
    append("Total: Rp 1.500.000\n")
}
val hasil = buffer.toString()
```

---

## 4. Anti-Patterns yang Wajib Dihindari

> [!CAUTION]
> **1. Hindari Scope Function Bersarang (*Nesting*)!**
> Menumpuk `let` di dalam `apply` yang ada di dalam `run` akan membingungkan developer lain: `this` dan `it` merujuk pada objek yang mana? Jika sudah bertingkat, gunakan fungsi privat atau penamaan variabel eksplisit (`user?.let { u -> ... }`).
>
> **2. Jangan Gunakan `apply` untuk Objek yang Tidak Dimutasi!**
> Jika Anda hanya ingin membaca nilai, gunakan fungsi biasa. Menggunakan `apply` hanya untuk membaca properti akan membingungkan pembaca kode karena `apply` diniatkan untuk mutasi konfigurasi.
