---
title: "04. OOP, Dunder Methods & Protocol Descriptors"
description: Perbedaan __new__ vs __init__, overload operator dunder methods, @property decorator, protokol Descriptor canggih, dan C3 Linearization MRO di Python.
---

# 🐍 Python - Modul 04: OOP, Dunder Methods & Protocol Descriptors

Python memiliki model objek yang sangat fleksibel. Melalui **Dunder Methods (Double Underscore / Magic Methods)** dan **Protokol Descriptor**, kamu bisa membuat class buatan sendiri berperilaku persis seperti tipe data bawaan Python.

---

## 1. Siklus Hidup Objek: `__new__` vs `__init__`

Mayoritas developer mengira `__init__` adalah constructor. Di Python:
- **`__new__(cls, ...)`**: Constructor sesungguhnya! Bertanggung jawab **mengalokasikan memori dan membuat objek baru** di heap.
- **`__init__(self, ...)`**: Initializer! Bertanggung jawab **mengisi atribut** pada objek yang sudah dibuat oleh `__new__`.

```python
# Pola Nyata Singleton menggunakan __new__:
class DatabasePool:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            # Alokasikan objek baru hanya jika belum pernah ada
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self, url):
        self.url = url

db1 = DatabasePool("postgres://localhost:5432")
db2 = DatabasePool("postgres://remote:5432")

print(db1 is db2) # True! Objek fisik di memori RAM dijamin sama persis!
```

---

## 2. Dunder Methods Penting (Kamus Cheat Sheet)

```python
class Vektor:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    # __repr__: Representasi resmi untuk developer/debugging (harus bisa di-eval ulang)
    def __repr__(self):
        return f"Vektor(x={self.x}, y={self.y})"

    # __str__: Representasi cantik yang dibaca oleh end-user saat print()
    def __str__(self):
        return f"({self.x}, {self.y})"

    # Overload Operator Tambah (+):
    def __add__(self, other):
        return Vektor(self.x + other.x, self.y + other.y)

    # Overload Operator Perbandingan Sama Dengan (==):
    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

    # Emulasi Fungsi: Menjadikan objek bisa dipanggil seperti fungsi objek()!
    def __call__(self, pengali):
        return Vektor(self.x * pengali, self.y * pengali)

v1 = Vektor(2, 3)
v2 = Vektor(4, 1)
v3 = v1 + v2       # Memanggil v1.__add__(v2)
print(v3)          # (6, 4)
print(v1 == Vektor(2, 3)) # True

v4 = v1(10)        # Memanggil v1.__call__(10)
print(v4)          # (20, 30)
```

---

## 3. Emulasi Kontainer Koleksi (`__len__`, `__getitem__`)

Membuat class buatan kita bisa di-indeks (`obj[0]`) dan diukur panjangnya (`len(obj)`):

```python
class RakBuku:
    def __init__(self, daftar_buku):
        self._buku = list(daftar_buku)

    def __len__(self):
        return len(self._buku)

    def __getitem__(self, index):
        return self._buku[index] # Mendukung indexing, slicing [0:2], dan perulangan for-in!

rak = RakBuku(["Clean Code", "Design Patterns", "The Rust Book"])
print("Total buku:", len(rak)) # 3
print("Buku pertama:", rak[0]) # Clean Code

for b in rak: # Otomatis bisa di-iterasi berkat __getitem__!
    print("-", b)
```

---

## 4. Protokol Descriptor: Di Balik Layar `@property` & ORM

Descriptor adalah mekanisme tingkat rendah yang menggerakkan `@property`, `@classmethod`, `@staticmethod`, dan validasi field ORM (seperti SQLAlchemy atau Django).

Descriptor adalah class yang mengimplementasikan salah satu dari: `__get__`, `__set__`, atau `__delete__`.

```python
# Descriptor untuk memvalidasi bahwa suatu atribut tidak boleh bernilai negatif:
class PositiveNumber:
    def __set_name__(self, owner, name):
        self.public_name = name
        self.private_name = "_" + name

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        return getattr(obj, self.private_name, 0)

    def __set__(self, obj, value):
        if value < 0:
            raise ValueError(f"Field '{self.public_name}' tidak boleh bernilai negatif! Nilai: {value}")
        setattr(obj, self.private_name, value)

class DompetDigital:
    saldo = PositiveNumber() # Menggunakan Descriptor!
    poin = PositiveNumber()

    def __init__(self, saldo_awal):
        self.saldo = saldo_awal

d = DompetDigital(50000)
d.saldo += 10000
print("Saldo valid:", d.saldo) # 60000

# d.saldo = -500 # ValueError: Field 'saldo' tidak boleh bernilai negatif!
```

---

## 5. Multiple Inheritance & C3 Linearization (MRO)

Python mendukung pewarisan berganda (*multiple inheritance*). Untuk memecahkan ambiguitas jika dua parent class memiliki method dengan nama yang sama (*Diamond Problem*), Python menggunakan algoritma **C3 Linearization** untuk menyusun **Method Resolution Order (MRO)**:

```python
class A:
    def halo(self): print("Dari A")

class B(A):
    def halo(self): print("Dari B")

class C(A):
    def halo(self): print("Dari C")

class D(B, C):
    pass

d = D()
d.halo() # Output: Dari B!

# Selalu periksa MRO untuk melihat urutan pencarian method:
print([cls.__name__ for cls in D.__mro__])
# Output: ['D', 'B', 'C', 'A', 'object']
```
