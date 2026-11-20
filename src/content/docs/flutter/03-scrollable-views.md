---
title: "03. Scrollable Views & Lists"
description: Menampilkan dataset besar dengan ListView.builder, GridView.builder, RefreshIndicator (pull-to-refresh), dan ScrollController pagination.
---

# 🎨 Flutter - Modul 03: Scrollable Views & Lists

Jika kamu memiliki puluhan hingga ribuan data, jangan pernah memasukkannya ke dalam `Column` atau `ListView` biasa karena semua widget akan langsung dibuat di memori RAM sekaligus. Gunakan **`ListView.builder`** yang hanya merender item yang sedang terlihat di layar (*on-demand lazy recycling*).

---

## 1. `ListView.builder` (Padanan RecyclerView / LazyColumn)

```dart
import 'package:flutter/material.dart';

class ModelProduk {
  final int id;
  final String nama;
  final int harga;

  ModelProduk({required this.id, required this.nama, required this.harga});
}

class DaftarProdukScreen extends StatelessWidget {
  final List<ModelProduk> produkList;

  const DaftarProdukScreen({super.key, required this.produkList});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: produkList.length,
      padding: const EdgeInsets.all(12),
      itemBuilder: (context, index) {
        final produk = produkList[index];

        return Card(
          key: ValueKey(produk.id), //  Key unik untuk efisiensi render
          margin: const EdgeInsets.only(bottom: 8),
          child: ListTile(
            leading: CircleAvatar(child: Text('${index + 1}')),
            title: Text(produk.nama),
            subtitle: Text('Rp ${produk.harga}'),
            trailing: const Icon(Icons.arrow_forward_ios, size: 16),
            onTap: () {
              print('Klik produk ID: ${produk.id}');
            },
          ),
        );
      },
    );
  }
}
```

---

## 2. Pemisah Item Otomatis: `ListView.separated`

Jika kamu ingin menambahkan garis pembatas (*divider*) di antara item tanpa repot menghitung index:

```dart
ListView.separated(
  itemCount: items.length,
  separatorBuilder: (context, index) => const Divider(height: 1),
  itemBuilder: (context, index) {
    return ListTile(title: Text(items[index]));
  },
)
```

---

## 3. GridView.builder (Tampilan Grid Multi-Kolom)

```dart
GridView.builder(
  itemCount: produkList.length,
  padding: const EdgeInsets.all(12),
  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
    crossAxisCount: 2,        // 2 Kolom mendatar
    mainAxisSpacing: 12,      // Jarak vertikal
    crossAxisSpacing: 12,     // Jarak horizontal
    childAspectRatio: 0.75,   // Rasio lebar:tinggi kartu
  ),
  itemBuilder: (context, index) {
    final item = produkList[index];
    return Card(
      child: Column(
        children: [
          Expanded(child: Placeholder()),
          Text(item.nama, style: const TextStyle(fontWeight: FontWeight.bold)),
        ],
      ),
    );
  },
)
```

---

## 4. Tarik untuk Memperbarui: `RefreshIndicator` (Pull-to-Refresh)

Cukup bungkus ListView dengan widget `RefreshIndicator`:

```dart
RefreshIndicator(
  onRefresh: () async {
    // Panggil fungsi API reload:
    await Future.delayed(const Duration(seconds: 1));
    print('Data berhasil diperbarui!');
  },
  child: ListView.builder(
    itemCount: items.length,
    itemBuilder: (context, index) => ListTile(title: Text(items[index])),
  ),
)
```

---

## 5. Deteksi Infinite Scroll (Pagination) via `ScrollController`

Mendeteksi kapan pengguna sudah men-scroll mendekati ujung bawah list:

```dart
class PaginationScreen extends StatefulWidget {
  const PaginationScreen({super.key});

  @override
  State<PaginationScreen> createState() => _PaginationScreenState();
}

class _PaginationScreenState extends State<PaginationScreen> {
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
  }

  void _onScroll() {
    // Cek jika posisi scroll sudah mencapai 90% dari panjang maksimum:
    if (_scrollController.position.pixels >= _scrollController.position.maxScrollExtent - 200) {
      print('Memuat halaman berikutnya...');
    }
  }

  @override
  void dispose() {
    _scrollController.dispose(); // Wajib dibersihkan!
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      controller: _scrollController,
      itemCount: 50,
      itemBuilder: (context, index) => ListTile(title: Text('Data #$index')),
    );
  }
}
```
