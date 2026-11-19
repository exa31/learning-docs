---
title: "03. Jetpack Compose (Gaya GetX)"
---

# 🟣 Kotlin - Modul 03: Jetpack Compose & Arsitektur (Mental Model: GetX)

Cheatsheet kilat Android UI modern Jetpack Compose yang dipetakan langsung ke konsep **Flutter GetX**.

---

## 1. Kamus Padanan GetX (Flutter) $\to$ Jetpack Compose (Android)

| Fitur di GetX | Padanan di Jetpack Compose | Cara Kerja Singkat |
|---|---|---|
| `.obs` (Reactive Variable) | `StateFlow` / `MutableStateFlow` | Data yang jika nilainya berubah, UI yang mendengarkannya ikut update |
| `GetxController` | `ViewModel` (Jetpack) | Tempat menaruh state dan logic bisnis di luar UI |
| `Obx(() => ...)` | `val state by vm.state.collectAsState()` | Mengamati state reaktif dan menggambar ulang UI otomatis |
| `Get.to(DetailPage())` | `navController.navigate("detail")` | Berpindah halaman via NavHost |
| `Get.put(Controller())` | **Koin**: `single { ... }` atau **Hilt**: `@Inject` | Dependency Injection |
| `Get.snackbar(...)` | `snackbarHostState.showSnackbar(...)` | Menampilkan pesan melayang |

---

## 2. Apa itu Recomposition?

**Recomposition** adalah proses di mana Compose **menggambar ulang hanya komponen UI yang datanya berubah**, tanpa harus me-render ulang seluruh layar dari awal.
- Komponen yang datanya tidak berubah akan otomatis **dilewati (*skip*)**, sehingga performanya sangat cepat dan efisien.

---

## 3. Pola StateFlow: `_private` Mutable vs `public` Read-Only

```kotlin
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
> Agar UI tidak bisa merusak logic bisnis ViewModel secara sembarangan! UI hanya boleh mengirim aksi (seperti klik tombol) ke ViewModel.

---

## 4. Katalog Dasar Composable & Layout

- **`Column`**: Menyusun anak ke bawah secara vertikal.
- **`Row`**: Menyusun anak ke samping secara horizontal.
- **`Box`**: Menumpuk anak secara z-index / lapisan (seperti `Stack` di Flutter).
- **`Modifier`**: Seperti "CSS inline cerdas" untuk mengatur ukuran, padding, background, dan klik:
  ```kotlin
  Modifier.fillMaxWidth().padding(16.dp).background(Color.Black).clickable { /* ... */ }
  ```
- **`LazyColumn`**: Padanan `RecyclerView` / `ListView.builder`. Hanya merender item yang terlihat di layar:
  ```kotlin
  LazyColumn {
      items(listUser) { user ->
          Text(text = user.name)
      }
  }
  ```

---

## 5. Rekomendasi Struktur Folder (Clean Architecture)

```text
app/src/main/java/com/yourapp/
 ├─ ui/
 │   ├─ theme/             # Color.kt, Typography.kt, Theme.kt (Style global)
 │   ├─ components/        # Widget reusable kecil (CustomButton, CustomCard, InputText)
 │   └─ screen/            # Satu folder per halaman (Screen + ViewModel)
 │       ├─ login/
 │       │   ├─ LoginScreen.kt
 │       │   └─ LoginViewModel.kt
 │       └─ home/
 │           ├─ HomeScreen.kt
 │           └─ HomeViewModel.kt
 ├─ navigation/            # AppNavHost.kt (NavHost + Routes)
 ├─ data/
 │   ├─ model/             # Data class DTO (User.kt)
 │   └─ repository/        # Panggilan API / DB (AuthRepository.kt)
 └─ di/                    # Dependency Injection (Hilt / Koin AppModule.kt)
```
