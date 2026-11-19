---
title: "04. OOP & Data Classes"
description: Class, constructor __init__, magic methods, pewarisan, @property getter/setter, dan @dataclass modern.
---

# 🐍 Python - Modul 04: OOP & Data Classes

Cheatsheet kilat Pemrograman Berorientasi Objek di Python dan cara modern merepresentasikan data model.

---

## 1. Class Dasar & Dunder Methods

Setiap method di dalam class Python wajib menerima parameter pertama bernama **`self`** (merujuk ke instance objek tersebut):

```python
class Karyawan:
    # Constructor:
    def __init__(self, nama: str, gaji: int):
        self.nama = nama
        self.gaji = gaji

    # Dunder Method: Representasi string saat di-print
    def __str__(self) -> str:
        return f"Karyawan({self.nama}, Rp {self.gaji:,})"

    def naikkan_gaji(self, persen: float):
        self.gaji += int(self.gaji * (persen / 100))

karyawan1 = Karyawan("Budi", 5000000)
karyawan1.naikkan_gaji(10)
print(karyawan1) # Karyawan(Budi, Rp 5,500,000)
```

---

## 2. `@property` (Getter & Setter Elegan)

Membuat method bisa diakses seperti properti biasa tanpa kurung buka-tutup `()`, sekaligus memberi validasi data:

```python
class Rekening:
    def __init__(self, saldo_awal: int):
        self._saldo = saldo_awal # Konvensi private dengan underscore _

    @property
    def saldo(self) -> int:
        """Getter"""
        return self._saldo

    @saldo.setter
    def saldo(self, nilai_baru: int):
        """Setter dengan validasi"""
        if nilai_baru < 0:
            raise ValueError("Saldo tidak boleh negatif!")
        self._saldo = nilai_baru

rek = Rekening(10000)
print(rek.saldo) # 10000 (tanpa rek.saldo())
rek.saldo = 15000 # Menjalankan setter
```

---

## 3. Fitur Modern: `@dataclass` (Padanan `data class` Kotlin)

Daripada menulis `__init__`, `__repr__`, dan `__eq__` manual yang memakan puluhan baris boilerplate, gunakan decorator bawaan `@dataclass`:

```python
from dataclasses import dataclass, field

@dataclass
class Produk:
    id: int
    nama: str
    harga: float
    stok: int = 0
    kategori: list[str] = field(default_factory=list)

# Otomatis dapat constructor, string representasi yang indah, dan kesetaraan nilai:
p1 = Produk(1, "Laptop Gaming", 15000000.0, 5)
p2 = Produk(1, "Laptop Gaming", 15000000.0, 5)

print(p1)       # Produk(id=1, nama='Laptop Gaming', harga=15000000.0, stok=5, kategori=[])
print(p1 == p2) # True (dibandingkan berdasarkan isinya, bukan referensi memori!)
```
