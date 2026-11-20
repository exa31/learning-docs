---
title: "05. Side Effects & Lifecycle"
description: Menghubungkan dunia luar ke Compose secara aman via LaunchedEffect, rememberCoroutineScope, DisposableEffect, dan one-off events.
---

# 📱 Jetpack Compose - Modul 05: Side Effects & Lifecycle

Fungsi Composable idealnya adalah fungsi murni (*pure function*) yang hanya menggambar UI. Namun, aplikasi nyata butuh berinteraksi dengan dunia luar: memanggil API, memunculkan Snackbar, mendaftarkan sensor, atau berpindah halaman. Jembatan untuk operasi ini disebut **Effect Handlers**.

---

## 1. Peta Cepat: Kapan Harus Pakai Apa?

| Kasus Penggunaan | Effect yang Tepat | Contoh Skenario |
|---|---|---|
| Menjalankan coroutine asinkronus saat layar dibuka | **`LaunchedEffect`** | Mengambil data API pertama kali, animasi otomatis |
| Menjalankan coroutine dari callback tombol | **`rememberCoroutineScope`** | Klik tombol simpan $\to$ tampilkan Snackbar |
| Butuh pembersihan saat layar ditutup (*Cleanup*) | **`DisposableEffect`** | Mendaftarkan sensor kompas, lifecycle observer |
| Update objek eksternal setiap kali recomposition sukses | **`SideEffect`** | Mengupdate warna status bar Android |

---

## 2. `LaunchedEffect` (Coroutine Sadar Lifecycle)

`LaunchedEffect` akan membuat Coroutine Scope baru yang otomatis dibatalkan jika Composable keluar dari komposisi (*leaves composition*):

```kotlin
@Composable
fun DetailUserScreen(userId: Int, viewModel: UserViewModel) {
    // Dipanggil saat pertama kali Composable masuk ke layar.
    // Jika nilai 'userId' berubah, coroutine lama dibatalkan dan dimulai ulang dengan ID baru!
    LaunchedEffect(key1 = userId) {
        viewModel.ambilDetailUser(userId)
    }

    Text("Menampilkan data user #$userId")
}
```

> ⚠️ **Catatan**: Jika kamu ingin suatu aksi hanya berjalan **satu kali saja seumur hidup Composable**, gunakan `key1 = Unit` atau `key1 = true`.

---

## 3. `rememberCoroutineScope` (Untuk Callback Tombol)

Fungsi tombol `onClick` adalah lambda biasa (bukan fungsi `suspend`). Jika ingin memanggil suspend function (seperti menampilkan Snackbar), gunakan `rememberCoroutineScope`:

```kotlin
@Composable
fun TombolSimpanWithSnackbar() {
    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope() // Scope terikat dengan siklus hidup view

    Scaffold(snackbarHost = { SnackbarHost(snackbarHostState) }) { padding ->
        Button(
            onClick = {
                // Jalankan suspend function di dalam scope:
                scope.launch {
                    val result = snackbarHostState.showSnackbar(
                        message = "Data berhasil disimpan!",
                        actionLabel = "Lihat"
                    )
                    if (result == SnackbarResult.ActionPerformed) {
                        println("User menekan tombol aksi snackbar")
                    }
                }
            },
            modifier = Modifier.padding(padding)
        ) {
            Text("Simpan Perubahan")
        }
    }
}
```

---

## 4. `DisposableEffect` (Untuk Listener yang Butuh Cleanup)

Jika kamu mendaftarkan listener yang wajib dibersihkan agar tidak terjadi kebocoran memori (*memory leak*):

```kotlin
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver

@Composable
fun ObserveLifecycle(lifecycleOwner: LifecycleOwner, onResume: () -> Unit) {
    DisposableEffect(lifecycleOwner) {
        val observer = LifecycleEventObserver { _, event ->
            if (event == Lifecycle.Event.ON_RESUME) {
                onResume()
            }
        }

        // Pasang listener:
        lifecycleOwner.lifecycle.addObserver(observer)

        // ⚠️ onDispose WAJIB ditulis di akhir blok:
        onDispose {
            // Lepas listener saat Composable dihancurkan:
            lifecycleOwner.lifecycle.removeObserver(observer)
            println("Listener berhasil dibersihkan dari RAM")
        }
    }
}
```

---

## 5. Pola Menangani One-Off Events (Navigasi / Pop-up)

Jangan gunakan `StateFlow` biasa untuk event satu kali (seperti navigasi atau toast), karena saat layar diputar, event bisa terpanggil ulang secara tidak sengaja.

Gunakan **`SharedFlow`** atau **`Channel`** di ViewModel, dan dengarkan dengan `LaunchedEffect` di UI:

```kotlin
// Di ViewModel:
private val _eventFlow = Channel<UiEvent>()
val eventFlow = _eventFlow.receiveAsFlow()

fun login() {
    viewModelScope.launch {
        // ... logic login ...
        _eventFlow.send(UiEvent.NavigasiKeHome)
    }
}

// Di Composable Screen:
@Composable
fun LoginScreen(viewModel: LoginViewModel, onNavigateHome: () -> Unit) {
    LaunchedEffect(Unit) {
        viewModel.eventFlow.collect { event ->
            when (event) {
                is UiEvent.NavigasiKeHome -> onNavigateHome()
                is UiEvent.ShowToast -> { /* show */ }
            }
        }
    }
}
```
