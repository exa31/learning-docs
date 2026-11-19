---
title: "04. OOP, Mixin & Extension"
description: Constructor modern this.prop, named & factory constructors, mixin dengan keyword with, dan extension methods.
---

# 🎯 Dart - Modul 04: OOP, Mixin & Extension

Cheatsheet kilat Pemrograman Berorientasi Objek di Dart: konstruktor ringkas, multiple behavior dengan Mixin, dan penambahan method via Extension.

---

## 1. Konstruktor Modern & Named Constructor

Dart menyediakan sintaks ringkas `this.properti` langsung di dalam parameter constructor:

```dart
class User {
  final int id;
  final String nama;
  final String role;

  // 1. Primary Constructor Ringkas:
  User({required this.id, required this.nama, this.role = "member"});

  // 2. Named Constructor (Konstruktor tambahan dengan nama khusus):
  User.admin({required this.id, required this.nama}) : role = "admin";

  // 3. Factory Constructor (Bagus untuk parsing JSON atau returning cached instance):
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as int,
      nama: json['name'] as String,
      role: json['role'] as String? ?? "member",
    );
  }
}
```

---

## 2. Mixins (`with` Keyword)

Mixin memungkinkan sebuah class **menggunakan sekumpulan kode/fitur dari class lain tanpa melalui pewarisan bertingkat (*multiple inheritance*)**:

```dart
mixin LoggerMixin {
  void log(String pesan) {
    print("[LOG ${DateTime.now().toIso8601String()}]: $pesan");
  }
}

mixin ValidasiMixin {
  bool isEmailValid(String email) => email.contains("@");
}

// Pasang mixin dengan kata kunci 'with':
class AuthController with LoggerMixin, ValidasiMixin {
  void login(String email) {
    if (!isEmailValid(email)) {
      log("Email tidak valid: $email");
      return;
    }
    log("User berhasil login: $email");
  }
}
```

---

## 3. Extension Methods (`extension on`)

Bisa menambahkan method baru pada tipe data yang sudah ada (bahkan tipe data bawaan Dart/Flutter) tanpa mengubah kode aslinya:

```dart
// Menambah method .kapitalAwal() ke tipe String bawaan:
extension StringExt on String {
  String kapitalAwal() {
    if (isEmpty) return this;
    return '${this[0].toUpperCase()}${substring(1)}';
  }
}

void main() {
  String nama = "eko";
  print(nama.kapitalAwal()); // "Eko"
}
```
