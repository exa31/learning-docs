---
title: "07. Coroutines & Flow"
description: Asinkronus modern Kotlin Coroutines (suspend, Dispatchers, launch vs async), Structured Concurrency, dan Reactive Flow.
---

# 🟣 Kotlin - Modul 07: Coroutines & Reactive Flow

Coroutines adalah fitur unggulan Kotlin untuk pemrograman asinkronus dan konkuren. Coroutine adalah **lightweight thread** (thread ringan) yang dapat ditangguhkan (*suspend*) tanpa memblokir thread sistem operasi aslinya.

---

## 1. `suspend fun` & Suspension Points

Fungsi yang diberi tanda `suspend` hanya bisa dipanggil dari dalam coroutine atau dari fungsi `suspend` lainnya:

```kotlin
import kotlinx.coroutines.delay

suspend fun ambilDataUser(id: Int): String {
    println("Mengambil data user...")
    delay(1000L) // delay TIDAK memblokir thread (non-blocking sleep)
    return "User #$id: Eka"
}
```

---

## 2. Pilihan Dispatchers

Kotlin menyediakan pembagian kerja thread melalui **Dispatchers**:

| Dispatcher | Peruntukan Kerja |
|---|---|
| **`Dispatchers.Main`** | Operasi UI (Android Main Thread), animasi, interaksi ringan |
| **`Dispatchers.IO`** | Operasi I/O disk atau jaringan: REST API, database Room/SQLite, baca/tulis file |
| **`Dispatchers.Default`** | Perhitungan berat CPU (*CPU-bound*): sorting array besar, enkripsi, parsing JSON ribuan baris |

### Berpindah Dispatcher dengan `withContext`:
```kotlin
suspend fun prosesGambar() = withContext(Dispatchers.Default) {
    // Komputasi berat berjalan di thread Default
    "Gambar ter-filter"
}
```

---

## 3. Coroutine Builders: `launch` vs `async`

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    // 1. launch: Fire-and-forget (tidak butuh nilai kembalian), me-return Job
    val job: Job = launch(Dispatchers.IO) {
        println("Simpan analitik ke database...")
    }
    job.join() // Tunggu sampai selesai (opsional)

    // 2. async: Menjalankan task paralel dan MENGEMBALIKAN NILAI (Deferred<T>)
    val taskA: Deferred<Int> = async(Dispatchers.IO) {
        delay(500)
        100
    }
    val taskB: Deferred<Int> = async(Dispatchers.IO) {
        delay(500)
        200
    }

    // Ambil hasil paralel dengan .await():
    val total = taskA.await() + taskB.await()
    println("Total: $total") // 300 (selesai dalam ~500ms secara paralel)
}
```

---

## 4. Structured Concurrency & Penanganan Error

Jika satu coroutine anak gagal/crash, secara default semua coroutine di scope yang sama akan ikut dibatalkan. Gunakan `supervisorScope` jika kamu ingin anak lain tetap berjalan meskipun satu anak mengalami error:

```kotlin
suspend fun fetchMultipleApis() = supervisorScope {
    val api1 = async { ambilDataApi1() } // Jika ini error...
    val api2 = async { ambilDataApi2() } // ...api2 TETAP lanjut jalan!

    try {
        println("Hasil API 1: ${api1.await()}")
    } catch (e: Exception) {
        println("API 1 Gagal: ${e.message}")
    }

    println("Hasil API 2: ${api2.await()}")
}
```

---

## 5. Reactive `Flow` (Cold Stream)

Flow adalah aliran data asinkronus yang mengalirkan banyak nilai secara berurutan (*stream*). Bersifat **Cold** (hanya akan memproduksi data ketika ada yang memanggil `.collect`):

```kotlin
import kotlinx.coroutines.flow.*

// 1. Membuat Flow:
fun hitungMundur(detik: Int): Flow<Int> = flow {
    for (i in detik downTo 1) {
        emit(i) // Pancarkan data
        delay(1000L)
    }
}

// 2. Mengonsumsi Flow:
suspend fun mulaiTimer() {
    hitungMundur(3)
        .map { "Sisa waktu: $it detik" }
        .flowOn(Dispatchers.Default) // Menentukan thread penghasil data
        .catch { e -> println("Terjadi error: ${e.message}") }
        .collect { teks ->
            println(teks) // Diprint tiap detik
        }
    println("Waktu Habis! 🚀")
}
```

---

## 6. `StateFlow` vs `SharedFlow` (Hot Stream)

- **`StateFlow`**: Selalu menyimpan 1 nilai state terkini (`.value`), cocok untuk UI State di Jetpack Compose / ViewModel.
- **`SharedFlow`**: Mengirimkan event satu kali jalan (*one-off events*) seperti navigasi layar atau pop-up toast.
