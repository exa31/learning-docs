---
title: "03. Scrollable Views, Paginasi & Slivers Canggih"
description: Virtualisasi ListView.builder on-demand, Infinite Scroll pagination via ScrollController, CustomScrollView, dan efek kolaps SliverAppBar di Flutter.
---

# 🎨 Flutter - Modul 03: Scrollable Views, Paginasi & Slivers Canggih

Merender daftar berisi 10.000 item di HP dengan RAM terbatas membutuhkan teknik **Virtualisasi Tampilan**. Flutter menyediakan abstraksi **Slivers** yang mengontrol pengguliran layar secara presisi hingga tingkat piksel.

---

## 1. `ListView` Biasa vs `ListView.builder` (Virtualisasi On-Demand)

| Karakteristik | `ListView(children: [...])` | `ListView.builder(...)` |
|---|---|---|
| **Alokasi Memori** | **Membuat seluruh 1.000 widget sekaligus di RAM** saat halaman dibuka, meskipun yang terlihat di layar hanya 5 item! | **Virtualisasi Murni**: Hanya merender item yang sedang terlihat di layar (+ sedikit buffer `cacheExtent`). |
| **Batas Kapasitas** | Maksimal 20-30 item statis. Jika 1.000 item $\to$ Lag parah atau crash OOM! | **Tak Terbatas**: Mampu menggulir 1.000.000 item dengan mulus di 120 FPS. |

```dart
// Pola Virtualisasi Produksi:
ListView.separated(
  itemCount: daftarUser.length,
  separatorBuilder: (context, index) => const Divider(height: 1), // Garis pemisah otomatis
  itemBuilder: (context, index) {
    final user = daftarUser[index];
    return ListTile(
      leading: CircleAvatar(child: Text("${index + 1}")),
      title: Text(user.nama),
      subtitle: Text(user.email),
    );
  },
)
```

---

## 2. Pola Produksi: Infinite Scroll & Pull-to-Refresh

Menggabungkan gestur tarik untuk refresh (*Pull-to-Refresh*) dengan paginasi otomatis saat user menggulir ke bawah:

```dart
class HalamanKatalogState extends State<HalamanKatalog> {
  final ScrollController _scrollController = ScrollController();
  final List<String> _items = [];
  bool _isLoadingMore = false;

  @override
  void initState() {
    super.initState();
    _muatDataAwal();

    // Listener deteksi posisi gulir (Infinite Scroll):
    _scrollController.addListener(() {
      // Jika sisa jarak gulir tinggal 200px dari bawah:
      if (_scrollController.position.pixels >= 
          _scrollController.position.maxScrollExtent - 200 && !_isLoadingMore) {
        _muatHalamanBerikutnya();
      }
    });
  }

  @override
  void dispose() {
    _scrollController.dispose(); // Wajib bersihkan controller!
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: _muatDataAwal, // Dipanggil saat ditarik ke bawah
      child: ListView.builder(
        controller: _scrollController,
        itemCount: _items.length + (_isLoadingMore ? 1 : 0),
        itemBuilder: (context, index) {
          if (index == _items.length) {
            return const Center(child: CircularProgressIndicator()); // Spinner bawah
          }
          return ListTile(title: Text(_items[index]));
        },
      ),
    );
  }
}
```

---

## 3. Slivers & `CustomScrollView`: Efek Visual Tingkat Tinggi

Sliver adalah porsi area gulir yang dapat mengubah bentuk dan ukurannya secara dinamis berdasarkan posisi offset gulir pengguna.

### Contoh Klasik: Collapsing Header (`SliverAppBar` Efek Parallax)
```dart
CustomScrollView(
  slivers: [
    // 1. Header yang mengecil dan gambar memudar saat di-scroll ke atas:
    SliverAppBar(
      expandedHeight: 250.0,
      floating: false,
      pinned: true, // Judul bar tetap menempel di atas saat di-scroll
      flexibleSpace: FlexibleSpaceBar(
        title: const Text("Profil Artis"),
        background: Image.network(
          "https://picsum.photos/800/400",
          fit: BoxFit.cover,
        ),
      ),
    ),

    // 2. Widget biasa non-sliver wajib dibungkus SliverToBoxAdapter:
    SliverToBoxAdapter(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Text("Daftar Lagu Populer", style: Theme.of(context).textTheme.titleLarge),
      ),
    ),

    // 3. SliverList virtualisasi:
    SliverList(
      delegate: SliverChildBuilderDelegate(
        (context, index) => ListTile(title: Text("Track #$index")),
        childCount: 50,
      ),
    ),
  ],
)
```
`CustomScrollView` memungkinkan penggabungan `SliverAppBar`, `SliverGrid`, dan `SliverList` dalam **satu kesatuan kanvas gulir tunggal yang mulus tanpa konflik scroll-physics**!
