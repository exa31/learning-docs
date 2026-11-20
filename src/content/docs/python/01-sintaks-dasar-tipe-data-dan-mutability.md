---
title: "01. Sintaks Dasar, Mutability & Reference Semantics"
description: Tipe data primitif vs koleksi, mutable vs immutable, semantik pointer referensi di Python, is vs ==, dan shallow copy vs deep copy.
---

# 🐍 Python - Modul 01: Sintaks Dasar, Mutability & Reference Semantics

Python adalah bahasa pemrograman berorientasi objek dinamis (*dynamically and strongly typed*). Di Python, **semua hal adalah objek** (*everything is an object*), mulai dari angka integer, fungsi, modul, hingga class itu sendiri.

---

## 1. Segregasi Mutlak: Mutable vs Immutable Types

Memahami apakah suatu tipe data bersifat *Mutable* (bisa dimutasi di tempat) atau *Immutable* (selalu membuat objek baru saat nilainya diubah) adalah kunci mencegah *side effect bug* di Python:

| Kategori | Tipe Data | Perilaku di Memori RAM |
|---|---|---|
| **Immutable** (Kekal) | `int`, `float`, `bool`, `str`, `tuple`, `frozenset`, `bytes` | Objek **tidak bisa diubah**. Operasi modifikasi akan mengalokasikan objek baru dengan alamat memori (`id`) yang berbeda. |
| **Mutable** (Dapat Diubah) | `list`, `dict`, `set`, `bytearray`, custom class objects | Nilai di dalam objek **bisa dimodifikasi langsung di alamat memori yang sama**. |

```python
# 1. Perilaku Immutable (Integer):
x = 10
print("Alamat awal x:", id(x))
x += 1 # Python TIDAK mengubah angka 10, melainkan membuat objek 11 baru!
print("Alamat baru x:", id(x)) # id(x) BERUBAH!

# 2. Perilaku Mutable (List):
daftar = [1, 2, 3]
print("Alamat awal daftar:", id(daftar))
daftar.append(4) # Dimodifikasi di tempat (In-Place Mutation)
print("Alamat setelah append:", id(daftar)) # id(daftar) TETAP SAMA!
```

---

## 2. Reference Semantics: `is` vs `==`

Di Python, variabel hanyalah **label pointer nama yang menunjuk ke suatu objek di memori heap**:

- **`==` (Value Equality)**: Memeriksa apakah **nilai/konten** kedua objek sama (memanggil dunder method `__eq__`).
- **`is` (Identity Check)**: Memeriksa apakah kedua variabel menunjuk ke **alamat memori fisik yang sama persis** (`id(a) == id(b)`).

```python
list_a = [1, 2, 3]
list_b = [1, 2, 3]
list_c = list_a

print(list_a == list_b) # True  (Karena isinya sama)
print(list_a is list_b) # False (Karena dua objek list berbeda di RAM)
print(list_a is list_c) # True  (Menunjuk ke objek fisik yang sama!)
```

> [!CAUTION]
> **Jebakan Python Integer Interning**:
> Python meng-cache angka kecil dari `-5` sampai `256` di memori saat startup. Jadi `a = 100; b = 100; a is b` bernilai `True`. Namun untuk angka besar `a = 1000; b = 1000; a is b` bisa bernilai `False`! Selalu gunakan `==` untuk membandingkan angka atau teks. Gunakan `is` HANYA untuk mengecek singleton seperti `if x is None:`.

---

## 3. Bahaya Fatal: Default Argument Mutable di Fungsi

Salah satu jebakan paling mematikan bagi pemula di Python adalah menggunakan objek mutable sebagai default parameter fungsi:

```python
# BAHAYA: Parameter default dievaluasi HANYA SEKALI saat modul pertama kali di-load!
def tambah_tugas(tugas, daftar=[]): # 'daftar' adalah list mutable yang dibagikan ke semua pemanggil!
    daftar.append(tugas)
    return daftar

print(tambah_tugas("Beli Kopi"))  # Output: ['Beli Kopi']
print(tambah_tugas("Coding Go"))   # Output: ['Beli Kopi', 'Coding Go'] (BUG: Riwayat tercampur!)

# SOLUSI STANDAR INDUSTRI: Gunakan None sebagai sentinel default
def tambah_tugas_aman(tugas, daftar=None):
    if daftar is None:
        daftar = [] # List baru dibuat setiap kali fungsi dipanggil
    daftar.append(tugas)
    return daftar
```

---

## 4. Shallow Copy vs Deep Copy

Ketika kita menduplikasi objek bersarang (*nested data structure*):

- **Shallow Copy (`list.copy()`, `dict.copy()`, `copy.copy()`)**: Membuat kontainer luar baru, namun elemen di dalamnya tetap berupa referensi ke objek anak yang sama!
- **Deep Copy (`copy.deepcopy()`)**: Menyalin kontainer dan seluruh objek anak bersarangnya secara rekursif dan mandiri.

```python
import copy

data_asli = [[1, 2], [3, 4]]

# 1. Shallow Copy
shallow = data_asli.copy()
shallow[0][0] = 99
print("Data asli setelah shallow edit:", data_asli) # [[99, 2], [3, 4]] (IKUT TERUBAH!)

# 2. Deep Copy
deep = copy.deepcopy(data_asli)
deep[0][0] = 777
print("Data asli setelah deep edit:", data_asli)    # Tetap [[99, 2], [3, 4]] (AMAN!)
```
