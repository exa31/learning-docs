---
title: "04. Lazy Layouts & Lists"
description: Pengganti RecyclerView (LazyColumn, LazyRow, LazyVerticalGrid), optimasi stable key, sticky header, dan pagination infinite scroll.
---

# 📱 Jetpack Compose - Modul 04: Lazy Layouts & Lists

Jika kamu memiliki daftar data yang panjang (puluhan hingga ribuan item), jangan gunakan `Column` biasa karena semua item akan langsung dibuat di memori sekaligus. Gunakan **Lazy Layouts** (`LazyColumn`, `LazyRow`, `LazyVerticalGrid`) yang hanya me-render item yang sedang terlihat di layar (*view recycling* otomatis tanpa adapter XML).

---

## 1. `LazyColumn` (Padanan Modern RecyclerView)

```kotlin
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items

data class Kontak(val id: Int, val nama: String, val nomorHp: String)

@Composable
fun DaftarKontakScreen(kontakList: List<Kontak>) {
    LazyColumn(
        contentPadding = PaddingValues(16.dp), // Padding sekeliling list
        verticalArrangement = Arrangement.spacedBy(8.dp) // Jarak antar item
    ) {
        // 1. Single item (misalnya Header):
        item {
            Text("Daftar Teman Kamu", style = MaterialTheme.typography.titleMedium)
        }

        // 2. Daftar banyak item dinamis dengan KEY:
        items(
            items = kontakList,
            key = { kontak -> kontak.id } // ⚠️ WAJIB: Berikan key unik!
        ) { kontak ->
            ItemKontakCard(kontak)
        }

        // 3. Footer di bawah list:
        item {
            Text("Akhir dari daftar", modifier = Modifier.padding(16.dp))
        }
    }
}
```

---

## 2. Kenapa `key` Sangat Wajib Diberikan?

Secara default, jika kamu tidak memberikan parameter `key = { it.id }`, Compose akan menggunakan posisi indeks array sebagai identitas item.
- **Bahayanya**: Jika kamu menghapus atau menyisipkan item di tengah-tengah list, Compose akan merender ulang seluruh item di bawahnya!
- **Dengan `key` Unik**: Compose tahu persis item mana yang berpindah, ditambah, atau dihapus, sehingga animasi list berjalan mulus dan performanya sangat kencang.

---

## 3. `LazyRow` & `LazyVerticalGrid`

### A. `LazyRow` (Scroll Mendatar)
```kotlin
LazyRow(
    horizontalArrangement = Arrangement.spacedBy(12.dp),
    contentPadding = PaddingValues(horizontal = 16.dp)
) {
    items(kategoriList, key = { it.id }) { kategori ->
        KategoriChip(kategori)
    }
}
```

### B. `LazyVerticalGrid` (Grid Multi-Kolom)
```kotlin
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items

LazyVerticalGrid(
    columns = GridCells.Fixed(2), // 2 Kolom tetap
    contentPadding = PaddingValues(8.dp),
    verticalArrangement = Arrangement.spacedBy(8.dp),
    horizontalArrangement = Arrangement.spacedBy(8.dp)
) {
    items(produkList, key = { it.id }) { produk ->
        ProdukGridItem(produk)
    }
}
```

---

## 4. Sticky Headers (Header Melayang)

Sangat berguna untuk list yang dikelompokkan berdasarkan abjad atau tanggal transaksi (header akan menempel di atas sampai grup berikutnya lewat):

```kotlin
val kontakGrup: Map<Char, List<Kontak>> = kontakList.groupBy { it.nama.first() }

LazyColumn {
    kontakGrup.forEach { (hurufAwal, itemsDiGrup) ->
        // Header melayang (Sticky):
        stickyHeader {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(MaterialTheme.colorScheme.surfaceVariant)
                    .padding(8.dp)
            ) {
                Text(hurufAwal.toString(), fontWeight = FontWeight.Bold)
            }
        }

        items(itemsDiGrup, key = { it.id }) { kontak ->
            ItemKontakCard(kontak)
        }
    }
}
```

---

## 5. Pola Deteksi Infinite Scroll (Pagination)

Menggunakan `LazyListState` untuk mendeteksi kapan pengguna sudah men-scroll mendekati ujung bawah layar:

```kotlin
@Composable
fun InfiniteList(viewModel: FeedViewModel) {
    val listState = rememberLazyListState()

    // Amati apakah sudah mendekati item paling bawah:
    val shouldLoadMore by remember {
        derivedStateOf {
            val totalItems = listState.layoutInfo.totalItemsCount
            val lastVisibleIndex = listState.layoutInfo.visibleItemsInfo.lastOrNull()?.index ?: 0
            // Jika sisa 2 item lagi sebelum ujung bawah, muat halaman berikutnya:
            totalItems > 0 && lastVisibleIndex >= (totalItems - 2)
        }
    }

    LaunchedEffect(shouldLoadMore) {
        if (shouldLoadMore) {
            viewModel.muatHalamanBerikutnya()
        }
    }

    LazyColumn(state = listState) {
        items(viewModel.daftarPost, key = { it.id }) { post ->
            PostCard(post)
        }
    }
}
```
