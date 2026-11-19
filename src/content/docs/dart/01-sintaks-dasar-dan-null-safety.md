---
title: "01. Sintaks Dasar & Sound Null Safety"
description: Variabel var/final/const, Sound Null Safety (?, !, ??), late keyword, dan interpolasi string di Dart.
---

# 🎯 Dart - Modul 01: Sintaks Dasar & Null Safety

Cheatsheet kilat bahasa Dart: bahasa di balik Flutter dengan sistem pengetikan ketat dan *Sound Null Safety*.

---

## 1. Variabel: `var` vs `final` vs `const`

- **`var`**: Tipe data otomatis ditebak (*inferred*). Nilainya bisa diubah (*mutable*).
- **`final`**: Nilai hanya bisa diisi **satu kali saat runtime** (misal: hasil response API atau waktu sekarang `DateTime.now()`).
- **`const`**: Nilai harus sudah diketahui pasti **saat waktu kompilasi (*compile-time constant*)**. Sangat hemat memori untuk widget Flutter!

```dart
var nama = "Eka";
nama = "Budi"; //  Bisa

final waktuSekarang = DateTime.now(); //  Bisa saat runtime
// const waktuSalah = DateTime.now(); // ❌ Error: bukan nilai konstan compile time!

const double pi = 3.14159; // Nilai permanen sejati
```

---

## 2. Sound Null Safety (Bebas Null Pointer Exception)

Di Dart, semua tipe data secara default **tidak boleh null (*non-nullable*)**:

### Operator Null Safety Wajib Hafal:
| Simbol | Nama | Fungsi | Contoh |
|---|---|---|---|
| **`?`** | Nullable Type | Mengizinkan variabel bernilai `null` | `String? email;` |
| **`?.`** | Null-Aware Access | Akses properti hanya jika tidak null (cegah crash) | `user?.profile?.name` |
| **`??`** | Null-Coalescing | Berikan nilai default jika null | `email ?? "tamu@domain.com"` |
| **`??=`** | Null-Aware Assignment | Isi nilai HANYA jika variabel saat ini null | `saldo ??= 10000;` |
| **`!`** | Bang Operator | Memaksa compiler: *"Pasti tidak null!"* (Hati-hati crash!) | `nama!.length` |

```dart
void main() {
  String? username; // Boleh bernilai null

  // Cetak aman dengan default value:
  print("Halo, ${username ?? 'Tamu'}!"); // "Halo, Tamu!"
}
```

---

## 3. Kata Kunci `late` (Inisialisasi Tertunda)

Memberitahu Dart: *"Variabel ini non-nullable, tapi akan saya isi nanti sebelum pertama kali dipakai!"* (Mirip `lateinit` di Kotlin):

```dart
class UserController {
  late String token;

  void login() {
    token = "xyz123"; // Diisi sebelum digunakan
  }
}
```

---

## 4. String Interpolasi

Gunakan tanda dollar `$namaVariabel` atau `${ekspresi}`:

```dart
String nama = "Eka";
int umur = 24;

print("Nama: $nama, tahun depan umur: ${umur + 1}");
```
