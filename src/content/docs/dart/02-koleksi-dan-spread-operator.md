---
title: "02. Koleksi & Collection Operators"
description: List, Set, Map, Collection-if, Collection-for, dan Spread operator (... dan ...?) di Dart.
---

# 🎯 Dart - Modul 02: Koleksi & Collection Operators

Cheatsheet kilat manipulasi List, Set, Map, dan operator ekspresi cerdas yang sangat sering dipakai di Flutter.

---

## 1. Tiga Koleksi Utama: List, Set, Map

```dart
// 1. List (Array berurutan):
List<String> buah = ["Apel", "Jeruk", "Mangga"];

// 2. Set (Himpunan unik tanpa duplikat):
Set<int> angkaUnik = {1, 2, 2, 3}; // {1, 2, 3}

// 3. Map (Key-Value):
Map<String, dynamic> user = {
  "id": 101,
  "name": "Ali",
  "is_admin": true,
};
```

---

## 2. Collection-If (Menyisipkan Item Berdasarkan Kondisi)

Sangat sering dipakai untuk menampilkan atau menyembunyikan widget UI di Flutter:

```dart
bool isAdmin = true;

List<String> menu = [
  "Home",
  "Profile",
  if (isAdmin) "Admin Dashboard", // Otomatis disisipkan jika true!
];
// Hasil: ["Home", "Profile", "Admin Dashboard"]
```

---

## 3. Collection-For (Transformasi Langsung di Dalam List)

```dart
List<int> angka = [1, 2, 3];

// Buat list string baru langsung di dalam kurung siku:
List<String> labelAngka = [
  "#0",
  for (var n in angka) "#$n",
];
// Hasil: ["#0", "#1", "#2", "#3"]
```

---

## 4. Spread Operator (`...`) & Null-Aware Spread (`...?`)

Membongkar dan menggabungkan isi koleksi ke dalam koleksi lain:

```dart
List<int> awal = [1, 2];
List<int> lanjutan = [3, 4];

List<int> gabungan = [...awal, ...lanjutan]; // [1, 2, 3, 4]

// Null-Aware Spread '...?':
// Aman membongkar list meskipun variabel bernilai null tanpa bikin error crash!
List<int>? listNullable = null;
List<int> hasilAman = [0, ...?listNullable, 99]; // [0, 99]
```
