---
title: "03. Named Parameters, Closures & Tear-Offs"
description: Positional optional [param], Named parameters {required}, first-class functions, callbacks, lexical closures, dan Tear-offs di Dart.
---

# 🎯 Dart - Modul 03: Named Parameters, Closures & Tear-Offs

Cara pendefinisian fungsi dan parameter di Dart adalah fondasi arsitektur **Constructor Widget di Flutter**.

---

## 1. Ragam Parameter: Positional vs Named Parameters

Dart membagi parameter menjadi dua kategori utama:

### A. Positional Parameters (Berdasarkan Urutan)
```dart
// 1. Positional Wajib
void sapa(String nama, int umur) {}

// 2. Positional Opsional dengan Tanda Kurung Siku [ ]
void logPesan(String pesan, [String level = "INFO", DateTime? waktu]) {
  print("[$level] $pesan pada $waktu");
}

// Dipanggil secara berurutan:
logPesan("Server menyala");
logPesan("Database error", "FATAL");
```

### B. Named Parameters dengan Kurung Kurawal `{ }` (Standar Flutter)
Parameter bernama dapat dipanggil dalam urutan acak dan sangat mudah dibaca (*self-documenting*):

```dart
// Kata kunci 'required' menandakan parameter wajib diisi pemanggil:
void buatTombol({
  required String label,
  required VoidCallback onTap,
  Color warna = Colors.blue, // Default value jika tidak diisi
  double? lebar,             // Nullable opsional
}) {
  // ...
}

// Cara pemanggilan di Flutter (Bebas urutan):
buatTombol(
  warna: Colors.green,
  label: "Submit Form",
  onTap: () => print("Klik!"),
);
```

---

## 2. First-Class Functions & Typedef Callbacks

Fungsi di Dart bisa didefinisikan sebagai tipe data kontrak menggunakan `typedef`:

```dart
// Kontrak Callback: Menerima int dan mengembalikan String
typedef TransformatorAngka = String Function(int nilai);

void prosesList(List<int> angka, TransformatorAngka pengubah) {
  for (var a in angka) {
    print(pengubah(a));
  }
}

void main() {
  // Passing anonymous function (Lambda):
  prosesList([10, 20, 30], (val) => "Nilai Rp$val");
}
```

---

## 3. Trik Menulis Bersih: Function Tear-Offs

Daripada membungkus pemanggilan fungsi yang parameternya identik ke dalam lambda closure baru:

```dart
List<String> namaUser = ["eka", "budi", "siti"];

// CARA KUNO DENGAN LAMBDA BOROS:
namaUser.forEach((n) => print(n));
var upperKuno = namaUser.map((n) => n.toUpperCase()).toList();

// CARA MODERN DENGAN TEAR-OFFS (Sangat Bersih!):
namaUser.forEach(print); // Mengirim referensi fungsi 'print' secara langsung
```
Tear-off menghemat alokasi closure sementara di memory dan membuat kode jauh lebih ringkas!
