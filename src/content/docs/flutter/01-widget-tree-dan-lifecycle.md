---
title: "01. Widget Tree & Lifecycle"
description: Mental model Flutter (Everything is a Widget), StatelessWidget vs StatefulWidget, siklus hidup State (initState, build, dispose), dan Hot Reload.
---

# 🎨 Flutter - Modul 01: Widget Tree & Lifecycle

Flutter adalah framework UI lintas-platform (*cross-platform*) buatan Google yang mengkompilasi kode Dart ke kode mesin native (Android, iOS, Web, Desktop). Filosofi utama Flutter: **Everything is a Widget**.

---

## 1. Filosofi "Everything is a Widget"

Di Flutter, tampilan, teks, gambar, tata letak (*layout* seperti `Padding`, `Center`, `Row`), hingga animasi adalah **Widget**. Semua widget tersusun membentuk sebuah pohon berjenjang (*Widget Tree*):

```text
       App (MaterialApp)
             │
        Scaffold (Layar)
       ┌─────┴─────┐
     AppBar      Body (Center)
                   │
                Column
               ┌───┴───┐
             Text    ElevatedButton
```

---

## 2. StatelessWidget vs StatefulWidget

| Fitur | `StatelessWidget` | `StatefulWidget` |
|---|---|---|
| **Sifat Data** | Statis / Konstan / Read-Only | Dinamis / Nilai bisa berubah-ubah |
| **Metode Render** | Hanya punya method `build()` | Memiliki class `State` terpisah |
| **Pemicu Render Ulang** | Parameter luar berubah dari parent | Memanggil fungsi `setState(() { ... })` |
| **Contoh Penggunaan** | Label teks, ikon, divider, kartu info | Form input, counter, tombol toggle, animasi |

### A. Contoh `StatelessWidget`:
```dart
import 'package:flutter/material.dart';

class KartuInfo extends StatelessWidget {
  final String judul;
  final String deskripsi;

  const KartuInfo({
    super.key,
    required this.judul,
    required this.deskripsi,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.blue.shade50,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(judul, style: const TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text(deskripsi),
        ],
      ),
    );
  }
}
```

### B. Contoh `StatefulWidget`:
```dart
class CounterLayar extends StatefulWidget {
  const CounterLayar({super.key});

  @override
  State<CounterLayar> createState() => _CounterLayarState();
}

class _CounterLayarState extends State<CounterLayar> {
  int _counter = 0;

  void _tambah() {
    setState(() {
      _counter++; // Memicu build() ulang hanya pada widget ini
    });
  }

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: _tambah,
      child: Text('Total Klik: $_counter'),
    );
  }
}
```

---

## 3. Siklus Hidup `State` (State Lifecycle)

Hafalkan 4 fase utama siklus hidup `StatefulWidget`:

```text
createState() ──> initState() ──> didChangeDependencies() ──> build() ──> dispose()
```

1. **`initState()`**: Dipanggil tepat **satu kali** saat widget pertama kali dibuat. Tempat terbaik untuk inisialisasi controller (Animation, TextEditing, Scroll) atau memicu fetch data pertama kali.
2. **`didChangeDependencies()`**: Dipanggil saat objek `InheritedWidget` (seperti `Theme.of(context)` atau `MediaQuery`) berubah.
3. **`build()`**: Dipanggil setiap kali widget harus digambar ulang ke layar (termasuk saat `setState()` dipanggil). Wajib bebas dari operasi berat!
4. **`dispose()`**: Dipanggil saat widget dihancurkan dari widget tree. **WAJIB mematikan listener, timer, dan controller** (`controller.dispose()`) untuk mencegah kebocoran memori (*memory leak*).

```dart
@override
void initState() {
  super.initState();
  _textController = TextEditingController();
  print('Widget siap diinisialisasi');
}

@override
void dispose() {
  _textController.dispose(); // Wajib dibersihkan!
  super.dispose();
}
```

---

## 4. Hot Reload vs Hot Restart

- **Hot Reload (`r`)**: Menyuntikkan perubahan kode UI ke Dart VM yang sedang berjalan **tanpa mereset state**. Nilai variabel di layar tetap ada, selesai dalam <1 detik!
- **Hot Restart (`R`)**: Mereset seluruh state aplikasi kembali ke kondisi awal (memanggil ulang fungsi `main()` dan `initState()`).
