---
title: "05. Navigation & REST API"
description: Navigasi tanpa BuildContext (Get.to, Get.back, arguments), dialog/snackbar, integrasi REST API dengan http package, dan Clean Architecture.
---

# 🎨 Flutter - Modul 05: Navigation & REST API

Menghubungkan alur navigasi antar-layar dan komunikasi jaringan HTTP ke REST API backend menggunakan arsitektur bersih (*Clean Architecture*).

---

## 1. Navigasi Tanpa `BuildContext` via GetX

Tidak perlu lagi mengetik `Navigator.of(context).push(MaterialPageRoute(...))` yang panjang dan kaku:

```dart
import 'package:get/get.dart';

// 1. Berpindah ke layar baru:
Get.to(const DetailProdukScreen());

// 2. Berpindah dengan membawa data (Arguments):
Get.to(const DetailProdukScreen(), arguments: {'id': 101, 'nama': 'MacBook Pro'});

// 3. Menutup layar saat ini (Kembali ke sebelumnya):
Get.back();

// 4. Pindah layar dan HAPUS layar sebelumnya (Cocok untuk Login -> Home):
Get.off(const HomeScreen());

// 5. Pindah layar dan BERSIHKAN seluruh riwayat navigasi (Logout -> Login):
Get.offAll(const LoginScreen());
```

### Membaca Arguments di Layar Tujuan:
```dart
class DetailProdukScreen extends StatelessWidget {
  const DetailProdukScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Ambil data arguments yang dikirim:
    final Map<String, dynamic> data = Get.arguments;

    return Scaffold(
      appBar: AppBar(title: Text(data['nama'])),
      body: Center(child: Text('ID Barang: ${data['id']}')),
    );
  }
}
```

---

## 2. Dialog, Snackbar, & BottomSheet Instan

```dart
// 1. Snackbar Mengambang:
Get.snackbar(
  'Sukses!',
  'Data transaksi berhasil disimpan.',
  snackPosition: SnackPosition.BOTTOM,
  backgroundColor: Colors.green.shade700,
  colorText: Colors.white,
);

// 2. Alert Dialog Konfirmasi:
Get.defaultDialog(
  title: 'Hapus Item',
  middleText: 'Apakah kamu yakin ingin menghapus item ini?',
  onConfirm: () {
    print('Item dihapus');
    Get.back(); // Tutup dialog
  },
  onCancel: () {},
);

// 3. Modal BottomSheet:
Get.bottomSheet(
  Container(
    color: Colors.white,
    padding: const EdgeInsets.all(16),
    child: Wrap(
      children: [
        ListTile(leading: const Icon(Icons.share), title: const Text('Bagikan')),
        ListTile(leading: const Icon(Icons.copy), title: const Text('Salin Link')),
      ],
    ),
  ),
);
```

---

## 3. Integrasi REST API dengan Package `http`

### A. Model Class (`User.dart`)
```dart
class UserModel {
  final int id;
  final String name;
  final String email;

  UserModel({required this.id, required this.name, required this.email});

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'],
      name: json['name'],
      email: json['email'],
    );
  }
}
```

### B. Controller dengan API Fetcher (`UserController.dart`)
```dart
import 'dart:convert';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;

class UserController extends GetxController {
  var isLoading = true.obs;
  var userList = <UserModel>[].obs;

  @override
  void onInit() {
    super.onInit();
    fetchUsers();
  }

  void fetchUsers() async {
    try {
      isLoading(true);
      final response = await http.get(
        Uri.parse('https://jsonplaceholder.typicode.com/users'),
      );

      if (response.statusCode == 200) {
        final List<dynamic> rawData = jsonDecode(response.body);
        userList.value = rawData.map((e) => UserModel.fromJson(e)).toList();
      } else {
        Get.snackbar('Error', 'Server merespons kode: ${response.statusCode}');
      }
    } catch (e) {
      Get.snackbar('Error Jaringan', e.toString());
    } finally {
      isLoading(false);
    }
  }
}
```

### C. Menampilkan di UI (`UserScreen.dart`)
```dart
class UserScreen extends StatelessWidget {
  const UserScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final UserController c = Get.put(UserController());

    return Scaffold(
      appBar: AppBar(title: const Text('Daftar Pengguna')),
      body: Obx(() {
        if (c.isLoading.value) {
          return const Center(child: CircularProgressIndicator());
        }

        return ListView.builder(
          itemCount: c.userList.length,
          itemBuilder: (context, index) {
            final user = c.userList[index];
            return ListTile(
              leading: const CircleAvatar(child: Icon(Icons.person)),
              title: Text(user.name),
              subtitle: Text(user.email),
            );
          },
        );
      }),
    );
  }
}
```

---

## 4. Rekomendasi Struktur Direktori Clean Architecture di Flutter

```text
lib/
├── app/
│   ├── data/
│   │   ├── models/            # Model data JSON (UserModel.dart)
│   │   ├── providers/         # API HTTP Client provider
│   │   └── repositories/      # Repository penyedia data
│   │
│   ├── modules/
│   │   ├── home/
│   │   │   ├── controllers/   # HomeController.dart
│   │   │   ├── views/         # HomeView.dart & Widgets
│   │   │   └── bindings/      # HomeBinding.dart (Dependency injection)
│   │   └── auth/
│   │
│   └── routes/
│       ├── app_pages.dart     # Daftar GetPage & Route mapping
│       └── app_routes.dart    # Konstanta string nama rute ('/home', '/login')
└── main.dart                  # Entrypoint GetMaterialApp
```
