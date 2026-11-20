---
title: "05. State Management: GetX Reaktif, Workers & Dependency Injection"
description: State Management GetX reaktif (.obs, Obx), Workers debounce/ever, Dependency Injection Get.put/find, dan perbandingan GetX vs Riverpod vs BLoC di Flutter.
---

# 🎨 Flutter - Modul 05: State Management: GetX Reaktif, Workers & Dependency Injection

Mengelola *State* (kondisi data) adalah jantung dari aplikasi Flutter yang responsif. **GetX** adalah salah satu solusi state management paling populer berkat pendekatannya yang **reaktif, tanpa boilerplate, dan memisahkan logika bisnis (Controller) dari tampilan (View)**.

---

## 1. Ephemeral State vs App State

- **Ephemeral State**: State lokal yang hanya dibutuhkan oleh 1 widget tunggal (misal: tab aktif di BottomNavBar, status checkbox dicentang). Cukup kelola dengan `setState()`.
- **App State**: State global yang dibagikan ke banyak layar (misal: token otentikasi login, keranjang belanja e-commerce, preferensi tema gelap). Memerlukan State Management seperti **GetX**, **Riverpod**, atau **BLoC**.

---

## 2. Arsitektur Reaktif GetX: `.obs` & `Obx`

GetX mendeteksi perubahan data secara otomatis (*Automatic Dependency Tracking*):

```dart
import 'package:get/get.dart';

// 1. Controller Logika Bisnis:
class KeranjangController extends GetxController {
  // Tambahkan '.obs' untuk mengubah tipe biasa menjadi Reactive Rx:
  var totalItem = 0.obs;
  var totalHarga = 0.0.obs;

  void tambahItem(double harga) {
    totalItem++;
    totalHarga.value += harga; // Update memicu reaktifitas seketika!
  }

  void kosongkan() {
    totalItem.value = 0;
    totalHarga.value = 0.0;
  }
}
```

```dart
// 2. View Tampilan UI:
class HalamanKatalog extends StatelessWidget {
  // Suntikkan Controller menggunakan Get.put():
  final KeranjangController c = Get.put(KeranjangController());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Toko Elektronik"),
        actions: [
          // Obx HANYA ME-REBUILD WIDGET DI DALAMNYA!
          // Seluruh AppBar dan Scaffold TIDAK IKUT REBUILD (Hemat CPU!):
          Obx(() => Center(
                child: Padding(
                  padding: const EdgeInsets.only(right: 16),
                  child: Text("Keranjang: ${c.totalItem.value} item"),
                ),
              )),
        ],
      ),
      body: Center(
        child: ElevatedButton(
          onPressed: () => c.tambahItem(150000),
          child: const Text("Tambah Headphone Rp150.000"),
        ),
      ),
    );
  }
}
```

---

## 3. GetX Workers: Penjinak Pencarian & Anti-Spam

Workers adalah listener khusus yang bereaksi terhadap perubahan variabel reaktif:

```dart
class SearchController extends GetxController {
  var searchQuery = "".obs;

  @override
  void onInit() {
    super.onInit();

    // 1. debounce: Tunggu user berhenti mengetik selama 500ms baru panggil API backend!
    // (Sangat hemat kuota server API search):
    debounce(searchQuery, (query) {
      panggilApiSearch(query);
    }, time: const Duration(milliseconds: 500));

    // 2. ever: Dijalankan SETIAP KALI variabel berubah:
    ever(searchQuery, (val) => print("Input berubah: $val"));

    // 3. interval: Anti-Spam! Abaikan klik beruntun dalam jeda 1 detik:
    // interval(tombolKlik, (val) => submit(), time: Duration(seconds: 1));
  }
}
```

---

## 4. Dependency Injection (DI) Bersih Tanpa Context

Tinggalkan `InheritedWidget` atau `Provider.of(context)` yang mewajibkan `BuildContext`. Di GetX:

```dart
// Di file main.dart atau binding (Lazy Initialization):
Get.lazyPut<AuthService>(() => AuthService());

// Di layar mana pun (Bahkan di dalam Service class non-widget):
final auth = Get.find<AuthService>();
auth.logout();

// Navigasi & Dialog Tanpa BuildContext:
Get.to(() => const HalamanDetail()); // Pindah halaman
Get.back();                          // Pop halaman
Get.snackbar("Sukses", "Item berhasil ditambahkan!"); // Snackbar instan
```

---

## 5. Matriks Perbandingan: GetX vs Riverpod vs BLoC

| Kriteria | **GetX** | **Riverpod** | **BLoC (Business Logic Component)** |
|---|---|---|---|
| **Kurva Belajar** | **Sangat Rendah (Super Mudah)** | Menengah | Tinggi (Banyak konsep Event/State) |
| **Boilerplate Code** | **Hampir Nol** | Sedikit | Banyak (Event class, State class, Bloc class) |
| **Ketergantungan Context**| Bebas Context (`Get.to()`, `Get.find()`) | Memerlukan `WidgetRef` | Memerlukan `BuildContext` (`context.read()`) |
| **Kasus Penggunaan Terbaik** | Startup, MVP cepat, aplikasi UKM, toko online skala menengah. | Aplikasi modern skala menengah-besar, pengujian (*testing*) ketat. | Aplikasi Perbankan, Enterprise besar, tim 50+ developer dengan arsitektur ketat. |
