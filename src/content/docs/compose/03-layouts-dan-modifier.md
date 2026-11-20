---
title: "03. Layouts & Modifiers"
description: Layout containers inti (Column, Row, Box, Scaffold), hukum urutan Modifier chaining, Alignment vs Arrangement, dan Spacer weight.
---

# 📱 Jetpack Compose - Modul 03: Layouts & Modifiers

Menyusun layout di Compose tidak memerlukan XML yang berlapis-lapis. Semua layout dibangun dari 3 container fundamental (`Column`, `Row`, `Box`) dan disesuaikan perilakunya menggunakan **`Modifier`**.

---

## 1. Tiga Container Fundamental

### A. `Column` (Vertikal / Padanan LinearLayout vertical)
Menyusun elemen anak secara vertikal dari atas ke bawah:
```kotlin
Column(
    modifier = Modifier.fillMaxWidth().padding(16.dp),
    verticalArrangement = Arrangement.spacedBy(8.dp),
    horizontalAlignment = Alignment.CenterHorizontally
) {
    Text("Judul Kartu", style = MaterialTheme.typography.titleLarge)
    Text("Deskripsi singkat konten kartu.")
}
```

### B. `Row` (Horizontal / Padanan LinearLayout horizontal)
Menyusun elemen anak secara mendatar dari kiri ke kanan:
```kotlin
Row(
    modifier = Modifier.fillMaxWidth(),
    horizontalArrangement = Arrangement.SpaceBetween,
    verticalAlignment = Alignment.CenterVertically
) {
    Text("Total Harga")
    Text("Rp 150.000", fontWeight = FontWeight.Bold)
}
```

### C. `Box` (Tumpukan Z-Index / Padanan FrameLayout atau Stack Flutter)
Menumpuk elemen anak di atas elemen lainnya (Z-axis). Sangat cocok untuk badge notifikasi, overlay gambar, atau placeholder:
```kotlin
Box(modifier = Modifier.size(60.dp)) {
    Icon(Icons.Default.Notifications, contentDescription = "Lonceng")
    // Badge angka merah di pojok kanan atas:
    Box(
        modifier = Modifier
            .size(18.dp)
            .background(Color.Red, shape = CircleShape)
            .align(Alignment.TopEnd)
    ) {
        Text("3", color = Color.White, modifier = Modifier.align(Alignment.Center))
    }
}
```

---

## 2. Struktur Layar Utuh: `Scaffold`

`Scaffold` menyediakan struktur kerangka Material Design standar untuk aplikasi (TopAppBar, BottomNavigation, FloatingActionButton, SnackbarHost):

```kotlin
@Composable
fun LayarUtama() {
    val snackbarHostState = remember { SnackbarHostState() }

    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Dev Cheatsheets") })
        },
        floatingActionButton = {
            FloatingActionButton(onClick = { /* aksi */ }) {
                Icon(Icons.Default.Add, contentDescription = "Tambah")
            }
        },
        snackbarHost = { SnackbarHost(snackbarHostState) }
    ) { paddingValues ->
        // Wajib gunakan paddingValues agar konten tidak tertutup TopBar/BottomBar!
        Box(modifier = Modifier.fillMaxSize().padding(paddingValues)) {
            Text("Konten Utama Di Sini")
        }
    }
}
```

---

## 3. Hukum Urutan `Modifier` (Chaining Order Matters!)

> ⚠️ **ATURAN PENTING**: Di Compose, **urutan pemanggilan method pada `Modifier` dieksekusi berurutan dari atas ke bawah**. Efeknya bisa sangat berbeda drastis!

### Kasus: Margin vs Padding
Compose tidak punya properti `margin`. Efek margin dicapai dengan urutan chaining:

```kotlin
// 1. PADDING BIASA (Background menutupi seluruh padding):
Modifier
    .background(Color.Blue)
    .padding(16.dp)

// 2. SEPERTI MARGIN (Jarak luar dulu, baru background di dalamnya):
Modifier
    .padding(16.dp)         // Berperan sebagai Margin luar
    .background(Color.Blue) // Background hanya mewarnai isi dalam
    .padding(8.dp)          // Berperan sebagai Padding dalam
```

### Kasus: Clickable Ripple Effect
```kotlin
//  BENAR: Clip dulu bentuknya, baru pasang clickable (efek ripple bulat rapi):
Modifier
    .clip(RoundedCornerShape(12.dp))
    .clickable { /* aksi */ }

// ❌ SALAH: Pasang clickable dulu baru di-clip (efek ripple persegi bocor ke luar sudut):
Modifier
    .clickable { /* aksi */ }
    .clip(RoundedCornerShape(12.dp))
```

---

## 4. Alignment vs Arrangement

- **`Arrangement`**: Mengatur **jarak & distribusi ruang kosong** di sumbu utama (*Main Axis*).
  - Pilihan: `Arrangement.SpaceBetween`, `Arrangement.Center`, `Arrangement.spacedBy(8.dp)`.
- **`Alignment`**: Mengatur **posisi penjajaran** di sumbu silang (*Cross Axis*).
  - Di Column: `Alignment.Start`, `Alignment.CenterHorizontally`, `Alignment.End`.
  - Di Row: `Alignment.Top`, `Alignment.CenterVertically`, `Alignment.Bottom`.

---

## 5. Fleksibilitas Ruang: `Spacer` & `Modifier.weight`

Untuk membagi porsi ruang kosong antar elemen secara proporsional:

```kotlin
Row(modifier = Modifier.fillMaxWidth()) {
    // Tombol Kiri mengambil 1 bagian (25%)
    Button(onClick = {}, modifier = Modifier.weight(1f)) {
        Text("Batal")
    }

    Spacer(modifier = Modifier.width(8.dp))

    // Tombol Kanan mengambil 3 bagian (75%)
    Button(onClick = {}, modifier = Modifier.weight(3f)) {
        Text("Konfirmasi Pembayaran")
    }
}
```
