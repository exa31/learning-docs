---
title: "04. State Management (GetX)"
description: Reaktivitas super cepat dengan GetX (.obs, GetxController, Obx), Dependency Injection Get.put/Get.find, dan Workers (debounce, ever).
---

# 🎨 Flutter - Modul 04: State Management (GetX)

**GetX** adalah library state management, dependency injection, dan route navigation paling populer dan produktif di ekosistem Flutter. Keunggulan utamanya: **Super cepat, sintaks bersih, dan tidak membutuhkan `BuildContext` yang rumit**.

---

## 1. Tiga Pilar Utama GetX

1. **State Management**: Reactive programming dengan menambahkan akhiran **`.obs`** pada variabel.
2. **Route Management**: Navigasi antar-layar tanpa `BuildContext` (`Get.to()`, `Get.back()`).
3. **Dependency Management**: Injeksi controller instan dengan `Get.put()` dan akses di mana saja via `Get.find()`.

---

## 2. Reaktivitas `.obs` & `GetxController`

Jadikan variabel apa pun menjadi reaktif cukup dengan menambahkan `.obs`:

```dart
import 'package:get/get.dart';

class CounterController extends GetxController {
  // 1. Variabel reaktif (RxInt):
  var count = 0.obs;
  var namaUser = 'Eka'.obs;
  var items = <String>[].obs;

  // 2. Fungsi bisnis:
  void tambah() {
    count++; // UI otomatis tahu nilai berubah!
  }

  void gantiNama(String baru) {
    namaUser.value = baru;
  }
}
```

### Siklus Hidup `GetxController`:
- **`onInit()`**: Dipanggil saat controller pertama kali dimasukkan ke memori (mirip `initState`).
- **`onReady()`**: Dipanggil 1 frame setelah widget selesai digambar di layar.
- **`onClose()`**: Dipanggil saat controller dihapus dari memori (mirip `dispose`, controller otomatis dibersihkan!).

---

## 3. Merender UI dengan `Obx(() => ...)`

Widget `Obx` hanya akan menggambar ulang widget di dalam lambdanya ketika variabel `.obs` yang dibacanya mengalami perubahan:

```dart
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class CounterScreen extends StatelessWidget {
  const CounterScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Inject controller ke dalam layar:
    final CounterController c = Get.put(CounterController());

    return Scaffold(
      appBar: AppBar(title: const Text('GetX Counter')),
      body: Center(
        // HANYA widget Text di dalam Obx ini yang dirender ulang saat tombol diklik!
        child: Obx(
          () => Text(
            'Total: ${c.count.value}',
            style: const TextStyle(fontSize: 32),
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: c.tambah,
        child: const Icon(Icons.add),
      ),
    );
  }
}
```

---

## 4. Dependency Injection: `Get.put` vs `Get.lazyPut`

### A. `Get.put(Controller())` (Langsung Dibuat)
Instansi controller langsung dibuat di memori RAM seketika baris kode dijalankan:
```dart
final c = Get.put(AuthController());
```

### B. `Get.lazyPut(() => Controller())` (Inisialisasi Tertunda)
Controller **hanya akan dibuat ketika pertama kali dipanggil via `Get.find()`**. Sangat menghemat RAM untuk controller halaman yang belum tentu dibuka:
```dart
Get.lazyPut<ProfilController>(() => ProfilController());
```

### C. Menemukan Controller di Widget Anak / Layar Lain (`Get.find`):
Tidak perlu mengoper controller lewat constructor parameter! Cukup panggil:
```dart
final AuthController auth = Get.find();
print(auth.userToken.value);
```

---

## 5. Workers Sakti di GetX (`ever`, `debounce`, `interval`)

Didaftarkan di dalam method `onInit()` controller untuk mendengarkan perubahan state:

```dart
@override
void onInit() {
  super.onInit()

  // 1. debounce: Menunda eksekusi sampai user BERHENTI mengetik (Anti-Spam Search Bar):
  debounce(
    queryPencarian,
    (query) => cariProdukKeApi(query),
    time: const Duration(milliseconds: 500),
  );

  // 2. ever: Dijalankan SETIAP KALI nilai variabel berubah:
  ever(userRole, (role) {
    print('Role berubah menjadi: $role');
  });

  // 3. interval: Mengabaikan panggilan berulang dalam rentang waktu (Anti double-click):
  interval(
    tombolKlik,
    (_) => print('Klik diproses satu kali per detik'),
    time: const Duration(seconds: 1),
  );
}
```
