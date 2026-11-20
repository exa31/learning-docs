---
title: "06. Navigation & Arsitektur"
description: Compose Navigation modern (NavHost, passing arguments, type-safe nav), DI dengan Koin/Hilt, dan arsitektur Clean Architecture presentation layer.
---

# 📱 Jetpack Compose - Modul 06: Navigation & Arsitektur

Membangun aplikasi Android skala produksi yang modular, terstruktur rapi dengan Clean Architecture, dan memiliki alur navigasi antar layar yang aman (*Type-Safe*).

---

## 1. Setup Navigation Compose Modern

```kotlin
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController

@Composable
fun AppNavigation() {
    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = "home"
    ) {
        // Layar 1: Home
        composable("home") {
            HomeScreen(
                onUserClick = { userId ->
                    navController.navigate("detail/$userId")
                }
            )
        }

        // Layar 2: Detail dengan Parameter ID
        composable(
            route = "detail/{userId}",
            arguments = listOf(navArgument("userId") { type = NavType.IntType })
        ) { backStackEntry ->
            val userId = backStackEntry.arguments?.getInt("userId") ?: 0
            DetailScreen(
                userId = userId,
                onBackClick = { navController.popBackStack() }
            )
        }
    }
}
```

---

## 2. Type-Safe Navigation (Jetpack Navigation 2.8+)

Di versi modern, kamu tidak perlu lagi mengetik string manual `"detail/$userId"` yang rawan typo. Gunakan Kotlin Serialization `@Serializable`:

```kotlin
import kotlinx.serialization.Serializable

// Definisikan route sebagai class/object data:
@Serializable
object HomeRoute

@Serializable
data class DetailRoute(val userId: Int)

// NavHost Type-Safe:
NavHost(navController = navController, startDestination = HomeRoute) {
    composable<HomeRoute> {
        HomeScreen(onUserClick = { id -> navController.navigate(DetailRoute(id)) })
    }

    composable<DetailRoute> { backStackEntry ->
        val detail: DetailRoute = backStackEntry.toRoute()
        DetailScreen(userId = detail.userId)
    }
}
```

---

## 3. Dependency Injection (Koin vs Hilt) di Compose

Inject ViewModel langsung di dalam fungsi Composable:

### A. Dengan Koin:
```kotlin
import org.koin.androidx.compose.koinViewModel

@Composable
fun ProfilScreen(
    viewModel: ProfilViewModel = koinViewModel() // Otomatis di-inject oleh Koin!
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()
    // ...
}
```

### B. Dengan Hilt:
```kotlin
import androidx.hilt.navigation.compose.hiltViewModel

@Composable
fun ProfilScreen(
    viewModel: ProfilViewModel = hiltViewModel() // Otomatis di-inject oleh Hilt!
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()
    // ...
}
```

---

## 4. Struktur Clean Architecture Presentation Layer

Pisahkan setiap fitur layar ke dalam 4 berkas dengan tanggung jawab terfokus:

```text
presentation/
└── home/
    ├── HomeRoute.kt        # Navigasi & DI (Mengambil ViewModel, mengirim callback nav)
    ├── HomeScreen.kt       # UI Murni Stateless (Hanya menerima data & event lambda)
    ├── HomeViewModel.kt    # StateFlow, logika bisnis, dan API call
    ├── HomeUiState.kt      # Sealed interface pemodelan status layar
    └── HomeUiEvent.kt      # Event interaksi user (klik, refresh, input)
```

### Contoh Penerapan Pemisahan:

#### A. `HomeUiState.kt`
```kotlin
sealed interface HomeUiState {
    object Loading : HomeUiState
    data class Success(val items: List<String>) : HomeUiState
    data class Error(val pesan: String) : HomeUiState
}
```

#### B. `HomeViewModel.kt`
```kotlin
class HomeViewModel(private val repository: FeedRepository) : ViewModel() {
    private val _uiState = MutableStateFlow<HomeUiState>(HomeUiState.Loading)
    val uiState = _uiState.asStateFlow()

    fun onRefresh() {
        // reload data
    }
}
```

#### C. `HomeRoute.kt` (Stateful Container)
```kotlin
@Composable
fun HomeRoute(
    viewModel: HomeViewModel = koinViewModel(),
    onNavigateToDetail: (Int) -> Unit
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()

    HomeScreen(
        uiState = state,
        onRefresh = { viewModel.onRefresh() },
        onItemClick = onNavigateToDetail
    )
}
```

#### D. `HomeScreen.kt` (Stateless UI Composable Murni)
```kotlin
@Composable
fun HomeScreen(
    uiState: HomeUiState,
    onRefresh: () -> Unit,
    onItemClick: (Int) -> Unit
) {
    when (uiState) {
        is HomeUiState.Loading -> CircularProgressIndicator()
        is HomeUiState.Success -> {
            LazyColumn {
                items(uiState.items) { item ->
                    Text(item, modifier = Modifier.clickable { onItemClick(1) })
                }
            }
        }
        is HomeUiState.Error -> Text("Gagal: ${uiState.pesan}")
    }
}
```

> 🎯 **Manfaat**: `HomeScreen` tidak bergantung pada Android SDK ViewModel, sehingga dapat dites dengan Preview Compose (`@Preview`) seketika tanpa perlu menjalankan emulator!
