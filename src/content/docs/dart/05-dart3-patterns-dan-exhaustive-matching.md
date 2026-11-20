---
title: "05. Dart 3 Pattern Matching, Switch Expressions & Sealed State"
description: Destructuring Records & Objek, Switch Expressions panah (=>), Guard clause when, dan pemodelan exhaustive UiState dengan Sealed Classes di Dart.
---

# 🎯 Dart - Modul 05: Dart 3 Pattern Matching, Switch Expressions & Sealed State

Pembaruan terbesar dalam sejarah Dart hadir di **Dart 3.0**: pengenalan **Pattern Matching**, **Switch Expressions**, dan **Sealed Classes** yang mengubah cara developer Flutter memodelkan arsitektur *State Management*.

---

## 1. Destructuring Records & Objek

Pola memungkinkan kita membongkar isi nilai dan mengikatnya ke variabel lokal dalam satu ekspresi:

```dart
// 1. Destructuring Record:
var (kode, pesan) = (404, "Not Found");
print("Error $kode: $pesan");

// 2. Destructuring Map JSON:
var json = {"user": "Eka", "role": "Admin", "id": 101};
if (json case {"user": String nama, "role": "Admin", "id": int uid}) {
  print("Admin terverifikasi: $nama dengan ID $uid");
}

// 3. Object Pattern Matching:
class Titik {
  final int x;
  final int y;
  Titik(this.x, this.y);
}

var titik = Titik(0, 10);
if (titik case Titik(x: 0, y: var yVal)) {
  print("Titik berada di sumbu Y pada ketinggian: $yVal");
}
```

---

## 2. Switch Expressions Modern (Sintaks Panah `=>`)

Switch di Dart 3 bukan lagi statement yang butuh `break`. Switch adalah **Ekspresi yang mengembalikan nilai**:

```dart
String terjemahkanKodeHttp(int statusCode) => switch (statusCode) {
  200 => "Sukses",
  201 => "Dibuat",
  400 || 404 => "Client Error",
  >= 500 && <= 599 => "Server Error",
  _ => "Status Tidak Dikenal", // Default wildcard
};
```

### Guard Clause dengan Kata Kunci `when`:
```dart
String klasifikasiAngka((int, int) koordinat) => switch (koordinat) {
  (var x, var y) when x == y => "Garis Diagonal Simetris",
  (var x, var y) when x > y  => "Sisi Bawah",
  _ => "Sisi Atas",
};
```

---

## 3. Standar Emas State Management Flutter: `sealed class`

Dengan menandai class sebagai `sealed`, **kompilator mengetahui seluruh kemungkinan subclass yang ada**. Switch expression menjamin **Exhaustive Check**: jika kamu lupa menangani satu status (misal status Error), kode **gagal dikompilasi**:

```dart
// Definisi State Mesin Terbatas:
sealed class UiState {}

class LoadingState extends UiState {}

class SuccessState extends UiState {
  final List<String> daftarProduk;
  SuccessState(this.daftarProduk);
}

class ErrorState extends UiState {
  final String pesan;
  ErrorState(this.pesan);
}

// Digunakan di Flutter Widget:
Widget buildUI(UiState state) {
  return switch (state) {
    LoadingState() => const CircularProgressIndicator(),
    SuccessState(daftarProduk: var items) => ListView.builder(
        itemCount: items.length,
        itemBuilder: (_, i) => Text(items[i]),
      ),
    ErrorState(pesan: var err) => Text("Gagal memuat: $err", style: TextStyle(color: Colors.red)),
    // JIKA KAMU MENAMBAHKAN EmptyState KE sealed class,
    // Baris ini akan langsung ERROR kompilasi hingga kamu menanganinya!
  };
}
```
Tidak ada lagi kemungkinan bug UI menampilkan layar kosong atau spinner abadi di HP pengguna!
