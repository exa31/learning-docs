---
title: "02. State Management & ViewModel"
description: Unidirectional Data Flow (UDF), State Hoisting, pola MutableStateFlow vs StateFlow, collectAsStateWithLifecycle, dan sealed interface UiState.
---

# 📱 Jetpack Compose - Modul 02: State Management & ViewModel

Pengelolaan state yang rapi adalah kunci performa aplikasi Android yang bebas bug. Compose menganut arsitektur **Unidirectional Data Flow (UDF)** di mana State mengalir ke bawah (ke UI) dan Event mengalir ke atas (ke ViewModel).

---

## 1. Konsep Unidirectional Data Flow (UDF)

```text
       ┌───────────────────────────────┐
       │           ViewModel           │
       │  (Memegang State & Bisnis)    │
       └───────┬───────────────▲───────┘
               │               │
        State  │               │ Event
     (Ke Bawah)│               │ (Ke Atas)
               ▼               │
       ┌───────────────────────┴───────┐
       │        Composable UI          │
       │   (Stateless & Murni Render)  │
       └───────────────────────────────┘
```

1. **State mengalir turun**: ViewModel mengekspos data yang siap ditampilkan ke UI.
2. **Event mengalir naik**: UI menangkap interaksi pengguna (klik tombol, swipe, input teks) dan mengirim event kembali ke ViewModel untuk diproses.

---

## 2. Pola StateFlow: `_private Mutable` vs `public Read-Only`

Jangan pernah mengekspos `MutableStateFlow` langsung ke Composable! Buat variabel private mutabel di dalam ViewModel, dan ekspos versi read-only `StateFlow`:

```kotlin
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class ProdukViewModel : ViewModel() {
    // 1. Private: HANYA ViewModel yang berhak mengubah data
    private val _uiState = MutableStateFlow<ProdukUiState>(ProdukUiState.Loading)

    // 2. Public Read-Only: UI hanya boleh membaca dan mengamati
    val uiState: StateFlow<ProdukUiState> = _uiState.asStateFlow()

    init {
        muatProduk()
    }

    fun muatProduk() {
        viewModelScope.launch {
            _uiState.value = ProdukUiState.Loading
            try {
                val data = repo.ambilSemuaProduk() // API Call
                _uiState.value = ProdukUiState.Success(data)
            } catch (e: Exception) {
                _uiState.value = ProdukUiState.Error(e.message ?: "Gagal memuat produk")
            }
        }
    }
}
```

---

## 3. Pemodelan Status UI dengan `sealed interface`

Gunakan `sealed interface` agar penanganan kondisi layar di UI dijamin *exhaustive* oleh compiler Kotlin:

```kotlin
sealed interface ProdukUiState {
    object Loading : ProdukUiState
    data class Success(val daftarProduk: List<Produk>) : ProdukUiState
    data class Error(val pesan: String) : ProdukUiState
}
```

---

## 4. Mengonsumsi State di UI: `collectAsStateWithLifecycle()`

> 💡 **PENTING**: Selalu gunakan `collectAsStateWithLifecycle()` (dari dependensi `androidx.lifecycle.compose`), **BUKAN** `collectAsState()` biasa!
> `collectAsStateWithLifecycle()` otomatis menghentikan pengumpulan data (*stop collecting*) saat aplikasi masuk ke background, sehingga menghemat baterai dan memori perangkat.

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel

@Composable
fun ProdukScreen(
    viewModel: ProdukViewModel = viewModel(),
    onItemClick: (Int) -> Unit
) {
    // Mengubah StateFlow menjadi State Compose yang sadar lifecycle:
    val state by viewModel.uiState.collectAsStateWithLifecycle()

    when (val currentState = state) {
        is ProdukUiState.Loading -> {
            ShimmerLoadingView()
        }
        is ProdukUiState.Success -> {
            DaftarProdukView(
                items = currentState.daftarProduk,
                onItemClick = onItemClick
            )
        }
        is ProdukUiState.Error -> {
            ErrorPlaceholder(
                pesan = currentState.pesan,
                onRetry = { viewModel.muatProduk() }
            )
        }
    }
}
```

---

## 5. State Hoisting (Membuat Komponen Stateless)

Komponen UI yang baik tidak boleh memegang ViewModel-nya sendiri. Pisahkan antara **Stateful Component** (mengambil ViewModel) dan **Stateless Component** (hanya menerima data & callback lambda):

```kotlin
// Stateless Component: Sangat mudah diuji dan dipakai ulang di mana saja!
@Composable
fun CounterWidget(
    hitungan: Int,
    onTambahClick: () -> Unit
) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Text("Total: $hitungan")
        Spacer(modifier = Modifier.width(8.dp))
        Button(onClick = onTambahClick) {
            Text("+1")
        }
    }
}
```
