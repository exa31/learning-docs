---
title: "01. Mental Model & Recomposition"
description: Mental model deklaratif Compose (UI = f(State)), kamus padanan GetX ke Compose, siklus Recomposition cerdas, serta remember vs rememberSaveable.
---

# 📱 Jetpack Compose - Modul 01: Mental Model & Recomposition

Jetpack Compose adalah toolkit UI deklaratif modern buatan Google untuk Android (pengganti XML & View klasik). Jika kamu sudah familiar dengan **Flutter (GetX)** atau **React / SwiftUI**, mental model Compose akan terasa sangat alami.

---

## 1. Kamus Padanan GetX (Flutter) $\to$ Jetpack Compose (Android)

| Fitur di GetX (Flutter) | Padanan di Jetpack Compose | Cara Kerja Singkat |
|---|---|---|
| `UI = f(state)` | `UI = f(State)` | Komponen UI adalah fungsi murni yang digambar ulang berdasarkan data state |
| `.obs` (Reactive Variable) | `StateFlow` / `MutableStateFlow` | Stream data reaktif yang memancarkan perubahan nilai secara otomatis |
| `GetxController` | `ViewModel` (Jetpack) | Kelas penampung logika bisnis dan pemegang state di luar UI |
| `Obx(() => ...)` | `val state by vm.state.collectAsState()` | Mendengarkan perubahan state dan memicu recomposition otomatis |
| `Get.to(DetailPage())` | `navController.navigate("detail")` | Berpindah layar menggunakan NavHost |
| `Get.put(Controller())` | **Koin**: `koinViewModel()` / **Hilt**: `hiltViewModel()` | Dependency Injection otomatis ke dalam layar |
| `Get.snackbar(...)` | `snackbarHostState.showSnackbar(...)` | Menampilkan pesan melayang (*toast / snackbar*) |

---

## 2. Paradigma: Imperatif (XML) vs Deklaratif (Compose)

- **Imperatif (XML / View Lama)**: Kita mencari widget via ID (`findViewById`), lalu mengubah propertinya secara manual (`textView.text = "Baru"`). Rawan inkonsistensi status dan *null reference*.
- **Deklaratif (Compose)**: UI **dideskripsikan bagaimana tampilannya untuk suatu State tertentu**. Saat state berubah, framework otomatis memperbarui tampilan yang terpengaruh.

```kotlin
// Komponen Compose hanyalah fungsi biasa dengan anotasi @Composable:
@Composable
fun KartuUser(nama: String, isOnline: Boolean) {
    Row(modifier = Modifier.padding(16.dp)) {
        Text("Halo, $nama")
        if (isOnline) {
            BadgeOnline() // Otomatis muncul HANYA jika isOnline bernilai true
        }
    }
}
```

---

## 3. Apa itu Recomposition?

**Recomposition** adalah proses di mana Compose memanggil ulang fungsi `@Composable` ketika data input atau state-nya berubah.

### Fitur Kunci Recomposition:
1. **Intelligent Skipping**: Compose melacak data yang masuk ke tiap Composable. Jika parameter tidak berubah, Composable tersebut **akan dilewati (*skip*)** dan tidak di-render ulang.
2. **Non-blocking / Optimistic**: Recomposition bisa dibatalkan di tengah jalan jika state berubah kembali sebelum frame berikutnya selesai dirender.
3. **Bisa berjalan di sembarang thread**: Jangan pernah melakukan operasi blocking I/O (seperti read disk atau API call) langsung di dalam body Composable!

---

## 4. State Lokal: `remember` vs `rememberSaveable`

Karena fungsi Composable dipanggil berulang-ulang setiap kali Recomposition terjadi, variabel lokal biasa akan ter-reset. Gunakan `remember` untuk mempertahankan nilai:

### A. `remember`: Bertahan Selama Recomposition
```kotlin
@Composable
fun CounterSederhana() {
    // Nilai bertahan saat recomposition, tapi TER-RESET jika layar diputar (Configuration Change)
    var hitungan by remember { mutableStateOf(0) }

    Button(onClick = { hitungan++ }) {
        Text("Total: $hitungan")
    }
}
```

### B. `rememberSaveable`: Selamat dari Rotasi Layar
Jika pengguna memutar layar dari Portrait ke Landscape (Activity di-destroy dan dibuat ulang oleh Android), gunakan `rememberSaveable`:

```kotlin
@Composable
fun InputFormNama() {
    // Nilai TETAP SELAMAT saat layar diputar atau proses aplikasi mati di background:
    var namaInput by rememberSaveable { mutableStateOf("") }

    TextField(
        value = namaInput,
        onValueChange = { namaInput = it },
        label = { Text("Nama Lengkap") }
    )
}
```

---

## 5. Ringkasan Aturan Emas Compose
1. **Fungsi Composable harus idempotensial**: Output tampilan hanya bergantung pada parameter yang dikirim.
2. **Bebas Side-Effect**: Jangan mutasi variabel global di dalam Composable (gunakan `LaunchedEffect` jika butuh async/side-effect).
3. **State Hoisting**: Angkat state ke parent view atau ViewModel agar komponen anak bersifat stateless dan mudah di-test.
