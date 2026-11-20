---
title: "05. OOP, Data Class, & Delegasi"
description: Primary constructor, lateinit var, data class .copy(), singleton object & companion, sealed class exhaustive when, dan property delegation by lazy.
---

# 🟣 Kotlin - Modul 05: OOP, Data Class, & Delegasi

Pemodelan data berorientasi objek modern di Kotlin. Kotlin membuang seluruh kelemahan warisan OOP Java yang bertele-tele dan menggantinya dengan fitur ringkas seperti `data class`, `sealed class`, dan delegasi properti.

---

## 1. Class & Constructor

Kotlin menggabungkan deklarasi constructor dan properti langsung di header class (*Primary Constructor*):

```kotlin
class Mobil(val merk: String, var kecepatan: Int = 0) {
    // Blok inisialisasi yang jalan pertama kali:
    init {
        println("Mobil $merk siap dijalankan!")
    }

    fun gas(tambah: Int) {
        kecepatan += tambah
    }
}

val avanza = Mobil("Toyota", 20)
avanza.gas(40)
println(avanza.kecepatan) // 60
```

---

## 2. `lateinit var`

Digunakan ketika properti tidak bisa diinisialisasi di constructor (misalnya di-inject oleh framework Retrofit/Hilt atau Lifecycle Android), namun kita yakin tidak akan null saat digunakan:

```kotlin
class ProfilActivity {
    lateinit var apiService: ApiService

    fun onCreate() {
        apiService = RetrofitClient.create()
    }

    fun loadData() {
        // Cek apakah sudah diinisialisasi:
        if (::apiService.isInitialized) {
            apiService.fetchUser()
        }
    }
}
```

---

## 3. `data class` & Fungsi Sakti `.copy()`

Khusus untuk model data / DTO. Otomatis menyediakan `toString()`, `equals()`, `hashCode()`, dan `.copy()`:

```kotlin
data class User(val id: Int, val nama: String, val role: String)

val user1 = User(1, "Eka", "Staff")

// 1. Salin objek dan modifikasi hanya field tertentu:
val user2 = user1.copy(role = "Tech Lead")
println(user2) // User(id=1, nama=Eka, role=Tech Lead)

// 2. Destructuring Declaration:
val (id, nama, role) = user2
println("$nama menjabat sebagai $role")
```

---

## 4. `object` (Singleton) vs `companion object`

### A. Singleton `object`
Membuat objek tunggal di memori tanpa perlu instansiasi `new`:
```kotlin
object DatabaseConfig {
    val host = "localhost"
    val port = 5432
    fun connect() = "Connected to $host:$port"
}

println(DatabaseConfig.connect())
```

### B. `companion object` (Padanan `static` di Java)
Objek yang menempel pada suatu class, sering dipakai untuk Factory Method:
```kotlin
class Token private constructor(val value: String) {
    companion object {
        fun createFromHeader(header: String): Token {
            val tokenValue = header.removePrefix("Bearer ")
            return Token(tokenValue)
        }
    }
}

val token = Token.createFromHeader("Bearer xyz123")
```

---

## 5. `sealed class` & `sealed interface` (State Management Modern)

`sealed class` membatasi hierarki inheritance hanya pada sub-tipe yang sudah ditentukan. Saat dipasangkan dengan `when`, compiler **menjamin seluruh kasus tertangani (exhaustive)** tanpa perlu blok `else`:

```kotlin
sealed interface UiState {
    object Loading : UiState
    data class Success(val data: List<String>) : UiState
    data class Error(val pesan: String) : UiState
}

fun renderUi(state: UiState) {
    // Compiler akan error jika ada salah satu state yang belum kamu tangani!
    when (state) {
        is UiState.Loading -> println("Tampilkan Shimmer Loading...")
        is UiState.Success -> println("Tampilkan ${state.data.size} item")
        is UiState.Error -> println("Tampilkan Snackbar error: ${state.pesan}")
    }
}
```

---

## 6. Property Delegation: `by lazy` & `by Delegates.observable`

Kotlin memungkinkan delegasi logika getter/setter ke objek lain menggunakan kata kunci **`by`**:

### A. `by lazy` (Inisialisasi Tertunda)
Nilai hanya akan dihitung/dibuat **saat pertama kali properti tersebut diakses**:
```kotlin
val koneksiBerat: String by lazy {
    println("Melakukan koneksi database berat...")
    "Koneksi DB Aktif"
}

// Belum dijalankan sama sekali di sini
println("Aplikasi mulai")
// Baru dieksekusi sekarang:
println(koneksiBerat) 
// Akses kedua langsung mengembalikan cache:
println(koneksiBerat) 
```

### B. `by Delegates.observable` (Listener Perubahan Data)
```kotlin
import kotlin.properties.Delegates

var saldo: Int by Delegates.observable(0) { property, nilaiLama, nilaiBaru ->
    println("Properti '${property.name}' berubah dari $nilaiLama menjadi $nilaiBaru")
}

saldo = 50000 // Log: Properti 'saldo' berubah dari 0 menjadi 50000
saldo = 75000 // Log: Properti 'saldo' berubah dari 50000 menjadi 75000
```
