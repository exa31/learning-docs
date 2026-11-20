---
title: "02. State Management, ViewModel & UDF"
description: Arsitektur Unidirectional Data Flow (UDF), teknik State Hoisting, konsumsi StateFlow aman via collectAsStateWithLifecycle, dan pemodelan UiState.
---

# 📱 Jetpack Compose - Modul 02: State Management, ViewModel & UDF

Dalam aplikasi skala menengah hingga besar, state tidak boleh disimpan berserakan di dalam fungsi Composable. Jetpack Compose dirancang secara khusus untuk bekerja harmonis dengan pola **Unidirectional Data Flow (UDF)** dan **Android ViewModel**.

---

## 1. Arsitektur Unidirectional Data Flow (UDF)

UDF adalah pola desain di mana data mengalir hanya ke satu arah, dan peristiwa (*events*) mengalir ke arah yang berlawanan.

```mermaid
flowchart TD
    VM["Android ViewModel<br/>(Pusat Logika Bisnis & State)"]

    Screen["Screen Composable (Stateful)<br/>collectAsStateWithLifecycle()"]
    Child["Child Composable (Stateless)<br/>(Hanya menampilkan UI)"]

    VM -->|1. State Mengalir ke Bawah| Screen
    Screen -->|2. State Mengalir ke Bawah| Child

    Child -->|3. Event Mengalir ke Atas (onClick)| Screen
    Screen -->|4. Event Mengalir ke Atas (Panggil Method)| VM
```

- **State Mengalir ke Bawah (*State flows down*)**: ViewModel memancarkan data terbaru ke composable.
- **Event Mengalir ke Atas (*Events flow up*)**: Interaksi pengguna (seperti klik tombol atau ketikan teks) memicu event lambda ke atas menuju ViewModel.

---

## 2. Teknik State Hoisting: Stateless vs Stateful Composable

**State Hoisting** adalah proses memindahkan state internal suatu komponen ke atas (ke pemanggilnya) agar komponen tersebut menjadi **Stateless** (bebas state internal).

### Keuntungan Komponen Stateless:
1. **Dapat Digunakan Kembali (*Reusable*)**: Komponen bisa ditaruh di layar mana saja.
2. **Mudah Diuji (*Testable*)**: Kita bisa mengetes UI tanpa perlu menyalakan database atau mock ViewModel.
3. **Mendukung Preview Xcode / Android Studio**: Sangat mudah di-render di `@Preview`.

```kotlin
// 1. STATELESS COMPOSABLE (Murni & Bersih)
// Menerima nilai dan callback event, tidak menyimpan state sendiri!
@Composable
fun CounterWidget(
    count: Int,
    onIncrement: () -> Unit,
    modifier: Modifier = Modifier
) {
    Row(modifier = modifier, verticalAlignment = Alignment.CenterVertically) {
        Text("Total: $count")
        Spacer(modifier = Modifier.width(16.dp))
        Button(onClick = onIncrement) {
            Text("Tambah")
        }
    }
}

// 2. STATEFUL COMPOSABLE (Menghubungkan State dengan Stateless Composable)
@Composable
fun CounterScreen(viewModel: CounterViewModel = viewModel()) {
    val count by viewModel.countState.collectAsStateWithLifecycle()
    
    CounterWidget(
        count = count,
        onIncrement = { viewModel.incrementCount() }
    )
}
```

---

## 3. Integrasi ViewModel & `collectAsStateWithLifecycle`

### Mengapa Dilarang Pakai `collectAsState()` Biasa?
Fungsi `collectAsState()` bawaan coroutine akan **terus mengumpulkan data di background meskipun aplikasi diminimize ke layar Home**, membuang kuota data internet dan baterai HP pengguna!

Gunakan **`collectAsStateWithLifecycle()`** dari pustaka `androidx.lifecycle:lifecycle-runtime-compose`:
Fungsi ini otomatis menangguhkan (*pause*) pengumpulan data saat Activity tidak terlihat oleh pengguna (`Lifecycle.State.STARTED`), dan melanjutkan kembali saat aplikasi dibuka!

```kotlin
// build.gradle.kts:
// implementation("androidx.lifecycle:lifecycle-runtime-compose:2.8.7")

@Composable
fun DaftarProdukScreen(
    viewModel: ProdukViewModel = hiltViewModel()
) {
    // Pengumpulan State yang Sadar Siklus Hidup (Lifecycle-Aware):
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    when (val state = uiState) {
        is ProdukUiState.Loading -> {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
        }
        is ProdukUiState.Success -> {
            LazyColumn {
                items(state.items) { item ->
                    Text(text = item.nama)
                }
            }
        }
        is ProdukUiState.Error -> {
            Text(text = "Gagal memuat data: ${state.pesan}", color = Color.Red)
        }
    }
}
```

---

## 4. Pola ViewModel Lengkap dengan StateFlow & UiEffect

```kotlin
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

// 1. Model State Layar
sealed interface ProdukUiState {
    data object Loading : ProdukUiState
    data class Success(val items: List<ProdukModel>) : ProdukUiState
    data class Error(val pesan: String) : ProdukUiState
}

// 2. Model Efek Satu-Kali (One-Off Event)
sealed interface ProdukUiEffect {
    data class TampilkanSnackbar(val pesan: String) : ProdukUiEffect
    data class NavigasiKeDetail(val idProduk: String) : ProdukUiEffect
}

class ProdukViewModel(private val repository: ProdukRepository) : ViewModel() {

    // A. Backing Property untuk State Layar:
    private val _uiState = MutableStateFlow<ProdukUiState>(ProdukUiState.Loading)
    val uiState: StateFlow<ProdukUiState> = _uiState.asStateFlow()

    // B. Channel untuk One-Off Side Effect:
    private val _effectChannel = Channel<ProdukUiEffect>()
    val effectFlow = _effectChannel.receiveAsFlow()

    fun fetchProduk() {
        viewModelScope.launch {
            _uiState.value = ProdukUiState.Loading
            try {
                val data = repository.getProdukList()
                _uiState.value = ProdukUiState.Success(data)
            } catch (e: Exception) {
                _uiState.value = ProdukUiState.Error(e.message ?: "Unknown Error")
                _effectChannel.send(ProdukUiEffect.TampilkanSnackbar("Gagal memperbarui data"))
            }
        }
    }
}
```
