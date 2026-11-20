---
title: "01. Sintaks Dasar, Flow Analysis & Sound Null Safety"
description: Sound Type System di Dart, Sound Null Safety (? ! late), Type Promotion, operator Elvis/Null-aware, dan final vs const.
---

# 🎯 Dart - Modul 01: Sintaks Dasar, Flow Analysis & Sound Null Safety

Dart adalah bahasa yang dioptimalkan untuk klien (*client-optimized*) oleh Google, menggerakkan jutaan aplikasi Flutter dengan kompilasi ganda: **JIT (Just-In-Time)** untuk *Hot Reload* cepat saat development, dan **AOT (Ahead-Of-Time)** untuk kompilasi binary mesin native secepat C++.

---

## 1. Sound Type System & Sound Null Safety

Dart mengimplementasikan **Sound Null Safety**. Berbeda dengan TypeScript yang hanya memeriksa null saat compile-time (namun bisa bocor saat runtime), di Dart:
> *"Jika sebuah variabel bertipe non-nullable (`String`), variabel tersebut **DIJAMIN 100% TIDAK AKAN PERNAH BERNILAI NULL** saat aplikasi berjalan di HP pengguna!"*

```dart
void main() {
  // 1. Non-Nullable (Default): Wajib ada nilai, tidak boleh null
  String nama = "Eka";
  // nama = null; // COMPILE ERROR!

  // 2. Nullable Type (T?): Boleh bernilai null
  String? bio; // Bernilai null secara default

  // 3. Null-Aware Operators:
  // Operator ?. (Safe Navigation):
  int? panjangBio = bio?.length; // Bernilai null tanpa crash!

  // Operator ?? (Default Fallback):
  String tampilanBio = bio ?? "Pengguna belum menulis bio.";

  // Operator ??= (Assign jika null):
  bio ??= "Bio default otomatis diisi";

  // Operator ! (Null Assertion): Paksa buka (Gunakan hanya jika yakin!)
  // print(bio!.toUpperCase());
}
```

---

## 2. Kata Kunci `late`: Penundaan Inisialisasi

Kata kunci `late` digunakan untuk variabel non-nullable yang nilainya baru bisa diisi setelah objek dibuat (misal: di method `initState()` Flutter):

```dart
class ProfilPage {
  // late menjamin bahwa variabel ini non-nullable dan akan diisi sebelum dibaca:
  late final String userAuthToken;

  void inisialisasi(String token) {
    userAuthToken = token; // Diisi kemudian
  }

  void cetakToken() {
    print(userAuthToken); // Jika dibaca sebelum diinisialisasi -> LateInitializationError!
  }
}
```

---

## 3. Flow Analysis & Smart Type Promotion

Kompilator Dart memiliki algoritma analisis alur (*Flow Analysis*) cerdas yang otomatis menaikkan tipe data (*Type Promotion*) begitu nullability diverifikasi:

```dart
void prosesNilai(String? teks) {
  if (teks == null) {
    return; // Early return golden path
  }

  // Di baris ini ke bawah, Dart otomatis MEMPROMOSIKAN 'teks'
  // dari tipe 'String?' menjadi 'String' non-nullable murni!
  print(teks.toUpperCase()); // AMAN TANPA BUTUH teks! ATAU teks?.!
}
```

---

## 4. `final` vs `const`: Perbedaan Kritis di Flutter

| Parameter | `final` | `const` |
|---|---|---|
| **Evaluasi Waktu** | **Runtime Constant**: Nilainya baru diketahui saat kode dieksekusi, namun tidak bisa diubah lagi setelah penugasan pertama. | **Compile-Time Constant**: Nilainya **wajib diketahui secara mutlak saat aplikasi di-compile**! |
| **Karakteristik Memori**| Setiap inisialisasi bisa mengalokasikan objek baru di RAM. | **Canonicalized**: Objek identik di-cache di memori dan dibagikan (*Memory Sharing*). |
| **Penggunaan di Flutter** | ID pengguna, response API, waktu sekarang `DateTime.now()`. | Widget konstan (`const Text("Halo")`), ikon, padding, warna statis. |

```dart
final waktuSekarang = DateTime.now(); // VALID: Dievaluasi saat runtime
// const waktuError = DateTime.now(); // COMPILE ERROR: Cannot be evaluated at compile-time!

// Menghemat RAM di Flutter dengan const canonicalization:
const paddingA = EdgeInsets.all(16);
const paddingB = EdgeInsets.all(16);
print(identical(paddingA, paddingB)); // TRUE! Alamat fisik di memori RAM sama persis!
```
