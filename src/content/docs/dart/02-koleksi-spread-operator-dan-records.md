---
title: "02. Koleksi, Spread Operator & Dart 3 Records"
description: List, Set, Map, Collection-if dan Collection-for untuk declarative UI, spread operator (...), dan anonymous tuples Dart 3 Records.
---

# 🎯 Dart - Modul 02: Koleksi, Spread Operator & Dart 3 Records

Fitur koleksi di Dart dirancang khusus untuk mempermudah penulisan **UI Pohon Widget Deklaratif di Flutter** tanpa perlu logika percabangan luar yang berantakan.

---

## 1. Tiga Koleksi Utama: List, Set & Map

```dart
void main() {
  // 1. List (Array dinamis)
  List<String> buah = ["Apel", "Jeruk", "Mangga"];
  buah.add("Pisang");

  // 2. Set (Himpunan unik otomatis)
  Set<int> angkaUnik = {1, 2, 2, 3, 3, 4}; // {1, 2, 3, 4}

  // 3. Map (Kamus key-value)
  Map<String, dynamic> konfigurasi = {
    "host": "localhost",
    "port": 8080,
    "debug": true
  };
}
```

---

## 2. Senjata Rahasia UI Flutter: Collection-If, Collection-For & Spread

Fitur ini memungkinkan penulisan logika kondisional langsung di dalam deklarasi list:

```dart
List<Widget> bangunMenuNavigasi(bool isAdmin, List<String> tagsTambahan) {
  List<String>? tagsOpsional = ["Promo", "Diskon"];

  return [
    BerandaWidget(),
    
    // 1. Collection-If: Tampilkan widget hanya jika kondisi true
    if (isAdmin)
      AdminPanelWidget()
    else
      UserDashboardWidget(),

    // 2. Collection-For: Ulangi elemen langsung di dalam list
    for (var tag in tagsTambahan)
      BadgeChip(label: tag),

    // 3. Spread Operator (...): Menyebarkan isi list lain
    ...daftarMenuStandar,

    // 4. Null-Aware Spread Operator (...?): Aman jika list bernilai null!
    ...?tagsOpsional,
  ];
}
```

---

## 3. Dart 3 Records: Multi-Return Tanpa Boilerplate Class

Sebelum Dart 3, jika sebuah fungsi ingin mengembalikan 2 nilai sekaligus (misal: data dan status error), developer terpaksa membuat class terpisah.

**Records** adalah tipe agregat anonim yang *immutable*, ringan, dan bervolume tetap (*fixed-size tuple*):

```dart
// 1. Positional Fields: Diakses via $1, $2
(int, String) ambilStatusKoneksi() {
  return (200, "OK"); // Mengembalikan tuple anonim
}

// 2. Named Fields: Diakses via nama propertinya
({int statusCode, String message, bool isSuccess}) fetchApiResult() {
  return (statusCode: 200, message: "Berhasil", isSuccess: true);
}

void main() {
  // Akses Positional Record:
  final status = ambilStatusKoneksi();
  print("Kode: ${status.$1}, Pesan: ${status.$2}");

  // Akses Named Record:
  final api = fetchApiResult();
  print("Status: ${api.statusCode}, Sukses: ${api.isSuccess}");
}
```
Records otomatis memiliki kesetaraan nilai struktural (*structural value equality* `==`) dan hash code bawaan!
