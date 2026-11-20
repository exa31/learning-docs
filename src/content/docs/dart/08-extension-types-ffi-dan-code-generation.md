---
title: "08. Extension Types (Dart 3.3), FFI C Interop & Code Generation"
description: Zero-cost wrappers Extension Types di Dart 3.3, interop C tingkat rendah via dart:ffi, dan generator build_runner tanpa runtime reflection di Dart.
---

# 🎯 Dart - Modul 08: Extension Types (Dart 3.3), FFI C Interop & Code Generation

Di modul penutup Dart ini, kita akan membedah optimasi tingkat compiler terdalam: **Extension Types (Zero-Cost Abstractions)**, interop C/C++ native via **`dart:ffi`**, serta alasan mendasar mengapa ekosistem Flutter sangat bergantung pada **`build_runner`**.

---

## 1. Extension Types (Dart 3.3+): Zero-Cost Type Wrapper

Sebelum Dart 3.3, jika kamu ingin membuat pembungkus tipe (*Type Wrapper*) agar type-safe (misal: membedakan `UserId` dengan `OrderId` padahal keduanya sama-sama integer), kamu harus membuat class baru:
```dart
class UserId { final int value; UserId(this.value); } // BOROS: Mengalokasikan objek baru di RAM Heap!
```

**Extension Types** adalah pembungkus masa kompilasi murni yang **DIHAPUS TOTAL SAAT RUNTIME (*Zero-Cost Abstraction*)**:

```dart
// Mendefinisikan Extension Type di atas tipe 'int':
extension type UserId(int id) {
  // Tambahkan getter atau method custom:
  bool get isValid => id > 0;
  String get formatTeks => "USR-$id";
}

extension type OrderId(int id) {}

void prosesUser(UserId uid) {
  print(uid.formatTeks);
}

void main() {
  final u = UserId(1001);
  final o = OrderId(1001);

  prosesUser(u); // Valid!

  // prosesUser(o); // COMPILE ERROR: The argument type 'OrderId' cannot be assigned to 'UserId'!
  // Di memori RAM saat runtime, u dan o murni berupa angka integer primitif biasa tanpa overhead class!
}
```

---

## 2. Foreign Function Interface (`dart:ffi`): Panggil C/C++ Langsung

Jika kamu butuh menjalankan engine komputasi C/C++ (seperti OpenCV, SQLite, atau decoder video) di Flutter tanpa overhead serialisasi JSON Platform Channel yang lambat:

```dart
import 'dart:ffi' as ffi;
import 'dart:io';

// 1. Definisikan tipe fungsi C:
typedef CFunctionType = ffi.Int32 Function(ffi.Int32 a, ffi.Int32 b);

// 2. Definisikan tipe fungsi Dart:
typedef DartFunctionType = int Function(int a, int b);

void main() {
  // 3. Muat dynamic library C (.dylib di macOS, .so di Linux/Android):
  final dylib = ffi.DynamicLibrary.open("libkalkulator_native.so");

  // 4. Cari simbol fungsi C dan binding ke Dart:
  final DartFunctionType tambahNative = dylib
      .lookup<ffi.NativeFunction<CFunctionType>>("tambah_angka")
      .asFunction();

  // 5. Panggil fungsi C langsung secepat instruksi mesin natif:
  final hasil = tambahNative(10, 20);
  print("Hasil komputasi C native: $hasil");
}
```

---

## 3. Mengapa Flutter Sangat Bergantung pada `build_runner`?

Banyak developer bertanya: *"Mengapa kita harus menjalankan `dart run build_runner build` hanya untuk mem-parse JSON (seperti json_serializable atau freezed)?"*

Jawabannya adalah **Keputusan Arsitektur AOT (Ahead-Of-Time)**:
- Pada runtime Java atau C#, framework menggunakan **Reflection (`java.lang.reflect`)** untuk membaca nama field secara dinamis saat aplikasi berjalan.
- **Dart secara sengaja MEMATIKAN Reflection (`dart:mirrors`) pada Flutter** demi:
  1. **Tree-Shaking Agresif**: Kompilator bisa membuang seluruh kode yang tidak terpakai, sehingga ukuran APK/IPA sangat kecil.
  2. **Startup Super Cepat**: Aplikasi terbuka instan dalam hitungan milidetik tanpa perlu memindai metadata class saat boot.

Oleh karena itu, kode parsing di-generate saat masa kompilasi menggunakan generator resmi:
```bash
# Menjalankan build runner untuk men-generate file *.g.dart dan *.freezed.dart:
dart run build_runner build --delete-conflicting-outputs
```
Dengan strategi ini, Flutter mendapatkan **kecepatan binary C++ murni** tanpa mengorbankan kenyamanan developer!
