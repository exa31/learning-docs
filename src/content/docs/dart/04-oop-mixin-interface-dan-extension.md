---
title: "04. OOP, Factory Constructors, Mixins & Class Modifiers"
description: Named & Factory Constructors, Implicit Interfaces, Mixin with/on, Dart 3 Class Modifiers (base/interface/final/sealed), dan Extension Methods di Dart.
---

# 🎯 Dart - Modul 04: OOP, Factory Constructors, Mixins & Class Modifiers

Dart menolak kerumitan *multiple inheritance* dan menggantikannya dengan kombinasi **Implicit Interfaces**, **Mixins**, serta **Class Modifiers** modern di Dart 3.

---

## 1. Named & Factory Constructors

Dart mengizinkan pembuatan beberapa constructor bernama pada class yang sama:

```dart
class User {
  final String id;
  final String nama;

  // 1. Generative Constructor Utama
  User({required this.id, required this.nama});

  // 2. Named Constructor (Sering dipakai untuk deserialisasi JSON)
  User.fromJson(Map<String, dynamic> json)
      : id = json["id"] as String,
        nama = json["nama"] as String;

  // 3. Factory Constructor: Bisa mengembalikan instance dari cache atau subtype!
  static final Map<String, User> _cache = {};

  factory User.dariCache(String id, String nama) {
    return _cache.putIfAbsent(id, () => User(id: id, nama: nama));
  }
}
```

---

## 2. Implicit Interfaces: Semua Class adalah Interface

Di Dart, kamu tidak perlu menulis kata kunci khusus `interface`. **Setiap class di Dart secara otomatis menjadi interface**:

```dart
class LayananPembayaran {
  void bayar(int nominal) {
    print("Bayar via Gateway Produksi: Rp$nominal");
  }
}

// Untuk Unit Testing di Flutter, cukup gunakan 'implements':
class MockLayananPembayaran implements LayananPembayaran {
  @override
  void bayar(int nominal) {
    print("[MOCK TEST] Bayar Rp$nominal disimulasikan sukses");
  }
}
```

---

## 3. Mixins: Berbagi Logika Antar Class Tanpa Pewarisan

Mixin memungkinkan penyuntikan kumpulan method ke berbagai class tanpa hierarki *parent-child*:

```dart
mixin LoggerMixin {
  void log(String pesan) {
    print("[LOG ${DateTime.now().toIso8601String()}] $pesan");
  }
}

// Batasi mixin hanya bisa disuntikkan ke turunan class tertentu via 'on':
mixin AnimasiTicker on TickerProviderStateMixin {
  // Hanya bisa dipakai di widget yang memiliki ticker animasi!
}

class ApiService with LoggerMixin {
  void fetchData() {
    log("Mengambil data dari server...");
  }
}
```

---

## 4. Dart 3 Class Modifiers: Kontrol Ketat Arsitektur

Mulai Dart 3, kamu bisa mengontrol bagaimana class dikonsumsi oleh package lain:

| Modifier | Bisa di-`extend`? | Bisa di-`implement`? | Bisa di-instansiasi langsung? |
|---|:---:|:---:|:---:|
| **`sealed`** | ❌ (Hanya di file yang sama) | ❌ (Hanya di file yang sama) | ❌ (Abstrak) |
| **`final`** | ❌ Dilarang subclass | ❌ Dilarang implement | ✅ Ya |
| **`base`** | ✅ Hanya boleh `extend` | ❌ Dilarang `implements` | ✅ Ya |
| **`interface`**| ❌ Dilarang `extend` | ✅ Hanya boleh `implements` | ✅ Ya |

---

## 5. Extension Methods: Memperluas Class Orang Lain

Kamu bisa menambahkan method baru ke tipe data bawaan (`String`, `List`, `BuildContext`) tanpa memodifikasi source code aslinya:

```dart
extension StringValidator on String {
  bool get isEmail {
    return RegExp(r"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$").hasMatch(this);
  }

  String get kapitalHurufPertama {
    if (isEmpty) return this;
    return this[0].toUpperCase() + substring(1);
  }
}

void main() {
  String input = "eka@dev.cloud";
  print(input.isEmail); // true! (Langsung tersedia sebagai getter bawaan)
}
```
