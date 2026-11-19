---
title: "05. Async, Stream & Dart 3 Patterns"
description: Future, async/await, Stream reaktif, Records (tuple di Dart 3), dan Switch Expressions modern.
---

# 🎯 Dart - Modul 05: Async, Stream & Fitur Dart 3

Cheatsheet kilat operasi asynchronous, aliran data reaktif (*Stream*), dan fitur revolusioner Dart 3 (Records & Pattern Matching).

---

## 1. `Future` & `async/await`

Operasi asynchronous tunggal yang mengembalikan data di masa depan (padanan `Promise` di JS):

```dart
Future<String> fetchUser(int id) async {
  // Simulasi network delay 1 detik:
  await Future.delayed(Duration(seconds: 1));
  return "User_$id";
}

void main() async {
  try {
    print("Mengambil data...");
    String user = await fetchUser(101);
    print("Selesai: $user");
  } catch (err) {
    print("Terjadi error: $err");
  }
}
```

---

## 2. `Stream` (Aliran Data Berkelanjutan)

Jika `Future` hanya mengembalikan **1 data**, `Stream` menghasilkan **banyak data secara berkala** (sangat cocok untuk websocket, sensor GPS, atau state management reactive):

```dart
// Generator Stream menggunakan async*:
Stream<int> hitungMundur(int awal) async* {
  for (int i = awal; i >= 1; i--) {
    await Future.delayed(Duration(seconds: 1));
    yield i; // Kirim data ke aliran stream
  }
}

void main() async {
  // Konsumsi stream dengan await for:
  await for (int sisa in hitungMundur(3)) {
    print("Detik ke-$sisa");
  }
  print("Selesai!");
}
```

---

## 3. Fitur Modern Dart 3: Records (Tuple Bawaan)

Mengembalikan beberapa nilai sekaligus dari dalam fungsi tanpa perlu membuat class model baru:

```dart
// Fungsi me-return Record bertipe (String, int):
(String, int) ambilProfil() {
  return ("Ali", 25);
}

// Named Record:
({String nama, int umur}) ambilProfilBernama() {
  return (nama: "Budi", umur: 30);
}

void main() {
  // Destructuring Record secara langsung:
  var (nama, umur) = ambilProfil();
  print("$nama berumur $umur tahun");

  var profil = ambilProfilBernama();
  print(profil.nama); // "Budi"
}
```

---

## 4. Fitur Modern Dart 3: Pattern Matching & Switch Expression

`switch` di Dart 3 bisa langsung mengembalikan nilai (*expression*):

```dart
String deskripsiStatus(String status) => switch (status) {
  "PENDING" => "Menunggu pembayaran",
  "PAID"    => "Pembayaran sukses diterima",
  "FAILED"  => "Gagal memproses transaksi",
  _         => "Status tidak dikenal", // Wildcard default
};
```
