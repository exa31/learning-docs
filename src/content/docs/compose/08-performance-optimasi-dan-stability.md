---
title: "08. Optimasi Kinerja, Stability & derivedStateOf"
description: Panduan performa Jetpack Compose tingkat lanjut, sistem Stability Compiler (@Stable & @Immutable), jebakan List, dan penghematan recompose dengan derivedStateOf.
---

# 📱 Jetpack Compose - Modul 08: Optimasi Kinerja & Stability

Jetpack Compose dirancang sangat cepat. Namun, ketika developer menulis kode yang tanpa sadar melanggar aturan **Compiler Stability**, aplikasi bisa mengalami *lagging* atau frame drop (*jank*) karena ribuan composable di-recompose terus-menerus tanpa pernah di-skip.

---

## 1. Sistem Stability Compose Compiler

Compose Compiler menganalisis setiap parameter fungsi composable dan mengkategorikannya menjadi dua jenis:
1. **Stable**: Nilai yang tidak bisa berubah (*Immutable*) atau nilai yang memberi tahu Compose saat berubah (*MutableState*). Composable dengan parameter Stable **BISA DI-SKIP saat recomposition**.
2. **Unstable**: Nilai yang bisa berubah sewaktu-waktu tanpa sepengetahuan Compose. Composable dengan parameter Unstable **DILARANG DI-SKIP** dan akan selalu di-recompose setiap kali parent-nya berkedip!

```mermaid
flowchart TD
    Comp["Compose Compiler Menganalisis Parameter Composable"]

    Comp -->|Tipe Primitif Int, String, Boolean| S1["✅ STABLE (Bisa di-skip!)"]
    Comp -->|data class dengan semua properti 'val' primitif| S2["✅ STABLE (Bisa di-skip!)"]
    Comp -->|List[T], Set[T], Map[K, V] bawaan Kotlin!| U1["❌ UNSTABLE! (Tidak bisa di-skip!)"]
    Comp -->|Class dari modul luar yang tidak pakai Compose compiler| U2["❌ UNSTABLE! (Tidak bisa di-skip!)"]
```

---

## 2. Perangkap Terbesar: Mengapa `List<T>` Dianggap Unstable?

Banyak developer terkejut mengetahui bahwa kode berikut **tidak pernah bisa di-skip**:

```kotlin
// ⚠️ MASALAH: Composable ini AKAN SELALU DI-RECOMPOSE, skipping gagal!
@Composable
fun DaftarSiswaView(daftarNama: List<String>) {
    LazyColumn { items(daftarNama) { Text(it) } }
}
```

### Mengapa `List<String>` Dianggap Unstable oleh Compiler?
Karena di Kotlin, interface `List` adalah antarmuka abstrak. Objek yang di-passing ke fungsi tersebut di balik layar bisa saja berupa `ArrayList` yang dimutasi diam-diam di thread lain! Compose tidak bisa menjamin immutabilitasnya.

---

### 2 Solusi Mengatasi Unstable List:

#### Solusi A: Gunakan `kotlinx.collections.immutable` (Rekomendasi Google)
```kotlin
// build.gradle.kts:
// implementation("org.jetbrains.kotlinx:kotlinx-collections-immutable:0.3.8")

import kotlinx.collections.immutable.ImmutableList

@Composable
fun DaftarSiswaView(daftarNama: ImmutableList<String>) {
    // ✅ SEKARANG COMPOSABLE BISA DI-SKIP 100%!
}
```

#### Solusi B: Bungkus dengan `@Immutable` Data Class
```kotlin
@Immutable
data class SiswaListWrapper(
    val items: List<String>
)

@Composable
fun DaftarSiswaView(wrapper: SiswaListWrapper) {
    // ✅ Compiler mempercayai anotasi @Immutable dan mengaktifkan skipping!
}
```

---

## 3. Mencegah Recompose Berulang: `derivedStateOf`

Bayangkan Anda ingin menampilkan tombol "Kembali ke Atas" saat user melakukan scroll. Nilai `listState.firstVisibleItemScrollOffset` berubah **setiap 1 pixel pergeseran jari**.

```kotlin
// ❌ CARA BURUK (Memicu Recomposition 60x per detik saat scrolling!):
val showButton = listState.firstVisibleItemIndex > 5

// ✅ CARA BENAR: derivedStateOf (Hanya memicu recomposition saat HASIL BOOLEAN BERUBAH!)
val showButton by remember {
    derivedStateOf {
        listState.firstVisibleItemIndex > 5
    }
}
```
`derivedStateOf` bertindak seperti bendungan: ribuan perubahan angka offset di dalam tidak akan memicu recomposition layar, sampai hasil evaluasi boolean-nya benar-benar berganti dari `false` menjadi `true`!

---

## 4. Tunda Pembacaan State ke Draw Phase (Lambda Modifiers)

Compose memiliki 3 fase eksekusi:
$$\mathbf{1.\ Composition} \longrightarrow \mathbf{2.\ Layout} \longrightarrow \mathbf{3.\ Draw}$$

Jika Anda hanya menganimasikan posisi koordinat atau transparansi warna, **jangan baca state di fase Composition!** Lewatkan fase 1 dan 2 menggunakan **Lambda Modifiers**:

```kotlin
val scrollOffset by animateFloatAsState(targetValue = ...)

// ❌ BURUK: Membaca state di fase Composition (Seluruh fungsi di-recompose!)
Box(modifier = Modifier.offset(x = scrollOffset.dp))

// ✅ OPTIMAL: Menggunakan Lambda Offset Modifier
// Pembacaan state ditunda langsung ke fase Layout/Draw tanpa recomposition sama sekali!
Box(modifier = Modifier.offset { IntOffset(x = scrollOffset.roundToInt(), y = 0) })
```

---

## 5. Memeriksa Recomposition di Android Studio (Layout Inspector)

Untuk membuktikan apakah composable Anda berhasil di-skip:
1. Jalankan aplikasi di Emulator dengan tombol **Run**.
2. Buka **Layout Inspector** di Android Studio.
3. Centang opsi **Show Recomposition Counts**.
4. Perhatikan dua angka di samping setiap nama Composable:
   - **Recomposition Count**: Berapa kali fungsi dieksekusi.
   - **Skip Count**: Berapa kali fungsi berhasil di-skip. Targetkan nilai Skip Count setinggi mungkin pada komponen statis!
