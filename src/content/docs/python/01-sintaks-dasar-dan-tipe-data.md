---
title: "01. Sintaks Dasar & Tipe Data"
description: Dynamic typing, type hints, f-strings, dan 4 struktur data bawaan Python (List, Tuple, Set, Dict).
---

# 🐍 Python - Modul 01: Sintaks Dasar & Koleksi Data

Cheatsheet kilat bahasa Python dengan pengetikan modern, f-string, dan 4 struktur data utama.

---

## 1. Variabel, Type Hints & F-String

Python menganut *dynamic typing*, tetapi di versi modern (Python 3.9+) sangat dianjurkan menulis **Type Hints** agar auto-complete editor berjalan tajam:

```python
# Deklarasi variabel dengan type hint:
nama: str = "Eka"
umur: int = 25
tinggi: float = 175.5
is_aktif: bool = True

# F-String (String formatting modern & cepat):
pesan = f"Halo {nama}, umurmu {umur} tahun dan tahun depan {umur + 1}."
print(pesan)

# Trik format angka ribuan & desimal di f-string:
harga = 1500000.758
print(f"Harga: Rp {harga:,.2f}") # "Harga: Rp 1,500,000.76"
```

---

## 2. Empat Struktur Data Koleksi Inti

| Tipe | Simbol | Sifat (*Mutable* / Bisa Diubah?) | Urut (*Ordered*)? | Menerima Duplikat? |
|---|---|---|---|---|
| **`list`** | `[1, 2, 3]` |  Bisa diubah (*Mutable*) |  Urut |  Boleh duplikat |
| **`tuple`** | `(1, 2, 3)` | ❌ Terkunci (*Immutable*) |  Urut |  Boleh duplikat |
| **`set`** | `{1, 2, 3}` |  Bisa diubah (*Mutable*) | ❌ Tidak urut | ❌ Otomatis buang duplikat |
| **`dict`** | `{"a": 1}` |  Bisa diubah (*Mutable*) |  Urut (sejak 3.7) | ❌ Key harus unik |

### A. List (Array Dinamis)
```python
buah = ["apel", "jeruk", "mangga"]
buah.append("pisang")      # Tambah belakang
buah.insert(0, "alpukat")  # Sisip depan
buah.pop()                 # Hapus belakang
print(buah[-1])            # Ambil paling belakang ("mangga")
```

### B. Tuple (Data Permanen)
Sangat hemat memori dibanding list. Cocok untuk data koordinat atau konfigurasi tetap:
```python
koordinat = (106.8, -6.2)
# koordinat[0] = 100 # ❌ Error: 'tuple' object does not support item assignment!
```

### C. Set (Himpunan Unik)
Otomatis menyaring duplikasi data seketika:
```python
angka_duplikat = [1, 2, 2, 3, 3, 3, 4]
angka_unik = list(set(angka_duplikat)) # [1, 2, 3, 4]

# Operasi matematika himpunan:
a = {1, 2, 3}
b = {3, 4, 5}
print(a & b) # Irisan: {3}
print(a | b) # Gabungan: {1, 2, 3, 4, 5}
```

### D. Dictionary (Key-Value)
```python
user = {"id": 1, "username": "eko31"}

# Ambil data aman tanpa crash KeyError:
role = user.get("role", "tamu") # Default fallback "tamu" jika tidak ada
```

---

## 3. Unpacking (Destructuring ala Python)

```python
# Unpack List/Tuple:
x, y, z = [10, 20, 30]

# Rest unpacking (pakai bintang *):
pertama, *sisa, terakhir = [1, 2, 3, 4, 5]
print(pertama) # 1
print(sisa)    # [2, 3, 4]
print(terakhir)# 5

# Merge Dict (seperti spread operator di JS):
dict1 = {"a": 1, "b": 2}
dict2 = {"b": 99, "c": 3}
merged = {**dict1, **dict2} # {'a': 1, 'b': 99, 'c': 3}
```
