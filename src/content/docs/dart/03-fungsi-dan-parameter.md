---
title: "03. Fungsi & Parameter"
description: Positional vs Named parameter ({required}), default parameter, arrow function, dan closures di Dart.
---

# 🎯 Dart - Modul 03: Fungsi & Parameter

Cheatsheet kilat fungsi di Dart, terutama **Named Parameters** yang menjadi fondasi seluruh widget Flutter.

---

## 1. Arrow Function (`=>`) untuk Single Expression

Jika fungsi hanya terdiri dari 1 baris, gunakan `=>` (otomatis me-return nilai):

```dart
int kaliDua(int n) => n * 2;

bool isGenap(int n) => n % 2 == 0;
```

---

## 2. Parameter Bernama: Named Parameters (`{ }`)

Inilah pola sintaks yang dipakai 100% di Flutter (seperti `Text("halo", style: TextStyle(...))`):
- Dibungkus kurung kurawal `{}`.
- Opsional secara default, atau pasang keyword **`required`** jika wajib diisi:

```dart
// Definisi fungsi dengan Named Parameter:
void buatUser({
  required String username,
  required String email,
  String role = "user", // Default value
  int? umur,            // Opsional nullable
}) {
  print("User: $username ($role), Email: $email");
}

void main() {
  // Pemanggilan sangat deskriptif dan urutan parameter bebas:
  buatUser(
    email: "ali@example.com",
    username: "ali_dev",
  );
}
```

---

## 3. Parameter Posisi Opsional (`[ ]`)

Jika kamu ingin parameter posisi menjadi opsional:

```dart
String sapa(String nama, [String? gelar, String bahasa = "ID"]) {
  if (gelar != null) {
    return "Halo, $nama, $gelar! (Bahasa: $bahasa)";
  }
  return "Halo, $nama! (Bahasa: $bahasa)";
}

// Cara panggil:
sapa("Budi");
sapa("Budi", "S.Kom");
sapa("Budi", "S.Kom", "EN");
```

---

## 4. Fungsi Sebagai First-Class Citizen (Callback)

```dart
void eksekusiOperasi(int a, int b, int Function(int, int) operasi) {
  int hasil = operasi(a, b);
  print("Hasil kalkulasi: $hasil");
}

void main() {
  // Oper anonymous function langsung:
  eksekusiOperasi(10, 5, (x, y) => x + y); // 15
}
```
