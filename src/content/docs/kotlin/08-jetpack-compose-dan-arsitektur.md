---
title: "08. Jetpack Compose & Arsitektur"
description: Jetpack Compose mental model GetX, Recomposition, StateFlow pattern, Layout Column/Row/LazyColumn, remember, dan Clean Architecture.
---

# 🟣 Kotlin - Modul 08: Jetpack Compose & Arsitektur (Mental Model: GetX)

Cheatsheet kilat Android UI modern Jetpack Compose yang dipetakan langsung ke konsep **Flutter GetX**. Didesain agar developer yang terbiasa dengan Flutter GetX langsung paham konsep Compose dalam hitungan menit!

---

## 1. Kamus Padanan GetX (Flutter) $\to$ Jetpack Compose (Android)

| Fitur di GetX | Padanan di Jetpack Compose | Cara Kerja Singkat |
|---|---|---|
| `.obs` (Reactive Variable) | `StateFlow` / `MutableStateFlow` | Data yang jika nilainya berubah, UI yang mendengarkannya ikut update |
| `GetxController` | `ViewModel` (Android Jetpack) | Tempat menaruh state dan logic bisnis di luar UI |
| `Obx(() => ...)` | `val state by vm.state.collectAsState()` | Mengamati state reaktif dan menggambar ulang UI otomatis |
| `Get.to(DetailPage())` | `navController.navigate("detail")` | Berpindah halaman via NavHost |
| `Get.put(Controller())` | **Koin**: `single { ... }` atau **Hilt**: `@Inject` | Dependency Injection |
| `Get.snackbar(...)` | `snackbarHostState.showSnackbar(...)` | Menampilkan pesan melayang (*snackbar*) |

---

## 2. Apa itu Recomposition?

**Recomposition** adalah proses di mana Compose **menggambar ulang hanya komponen UI yang datanya berubah**, tanpa harus me-render ulang seluruh layar dari awal.
- Komponen yang datanya tidak berubah akan otomatis **dilewati (*skip*)**, sehingga performanya sangat hemat dan cepat.

---

## 3. Pola StateFlow: `_private` Mutable vs `public` Read-Only

```kotlin
import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class CounterViewModel : ViewModel() {
    // 1. Private: HANYA ViewModel yang boleh mengubah nilai (_count.value = ...)
    private val _count = MutableStateFlow(0)

    // 2. Public Read-Only: UI HANYA boleh membaca dan mengamati
    val count: StateFlow<Int> = _count.asStateFlow()

    fun increment() {
        _count.value += 1
    }
}
```

> 🧠 **Kenapa tidak langsung ekspos `MutableStateFlow` ke UI?**
> Agar UI tidak bisa merusak logic bisnis ViewModel secara sembarangan! UI hanya boleh mengirim aksi (seperti klik tombol) ke ViewModel (*Unidirectional Data Flow*).

---

## 4. `remember` vs `rememberSaveable`

Di Compose, fungsi composable dieksekusi berkali-kali saat recomposition:

```kotlin
@Composable
fun FormInput() {
    // 1. remember: Nilai diingat selama Recomposition, tapi HILANG jika layar diputar (Rotate)
    var text by remember { mutableStateOf("") }

    // 2. rememberSaveable: Nilai TETAP SELAMAT saat layar diputar atau activity di-recreate
    var textTetap by rememberSaveable { mutableStateOf("") }
}
```

---

## 5. Layout Containers Populer

```kotlin
@Composable
fun LayarContoh() {
    // 1. Column (Vertikal)
    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Text("Item 1")
        Text("Item 2")
    }

    // 2. Row (Horizontal)
    Row(horizontalArrangement = Arrangement.SpaceBetween) {
        Text("Kiri")
        Text("Kanan")
    }

    // 3. LazyColumn (Pengganti ListView / RecyclerView untuk ribuan item)
    val daftarNama = listOf("Eka", "Budi", "Siti", "Dewi")
    LazyColumn {
        items(daftarNama) { nama ->
            Text("Nama: $nama", modifier = Modifier.padding(8.dp))
        }
    }
}
```

---

## 6. Contoh UI + ViewModel Lengkap

```kotlin
@Composable
fun CounterScreen(viewModel: CounterViewModel = viewModel()) {
    // Collect StateFlow menjadi Compose State:
    val hitungan by viewModel.count.collectAsState()

    Column(
        modifier = Modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Total Klik: $hitungan",
            style = MaterialTheme.typography.headlineMedium
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        Button(onClick = { viewModel.increment() }) {
            Text("Tambah Nilai")
        }
    }
}
```

---

## 7. Rekomendasi Struktur Direktori Clean Architecture

```text
com.eka.app/
├── data/
│   ├── model/         # Data class DTO
│   ├── remote/        # Retrofit API Service
│   └── repository/    # Implementasi Repository
├── domain/
│   ├── model/         # Entity domain murni
│   └── repository/    # Interface Repository
└── presentation/
    ├── home/
    │   ├── HomeScreen.kt          # UI Composable murni
    │   ├── HomeViewModel.kt       # StateFlow & Logic
    │   └── HomeUiState.kt         # Sealed interface status UI
    └── navigation/
        └── AppNavigation.kt       # NavHost & Route
```
