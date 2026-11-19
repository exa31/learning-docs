---
title: "02. Kontrol Alur & Comprehension"
description: If-else, match-case modern, looping, dan list/dict comprehension sakti di Python.
---

# 🐍 Python - Modul 02: Kontrol Alur & Comprehension

Cheatsheet kilat percabangan logika, perulangan, dan fitur terkuat Python: **Comprehension**.

---

## 1. Percabangan: `if...elif...else` & Ternary

```python
skor = 85

# If-Elif-Else biasa:
if skor >= 90:
    grade = "A"
elif skor >= 75:
    grade = "B"
else:
    grade = "C"

# Ternary Operator ala Python (nilai_jika_true IF kondisi ELSE nilai_jika_false):
status = "Lulus" if skor >= 75 else "Remedial"
```

---

## 2. Pattern Matching Modern: `match...case` (Python 3.10+)

Mirip `switch-case` di bahasa lain, tapi jauh lebih pintar karena bisa memeriksa struktur data:

```python
status_code = 404

match status_code:
    case 200:
        print("OK Sukses")
    case 400 | 404:
        print("Client Error")
    case 500:
        print("Server Rusak")
    case _:
        print("Status tidak dikenal (default)")
```

---

## 3. Looping: `for` & `while`

### `enumerate()` (Ambil index + nilai sekaligus):
```python
buah = ["Apel", "Mangga", "Jeruk"]

for index, b in enumerate(buah):
    print(f"{index + 1}. {b}")
```

### `zip()` (Looping dua list paralel bersamaan):
```python
nama = ["Ali", "Budi", "Cici"]
umur = [20, 25, 22]

for n, u in zip(nama, umur):
    print(f"{n} berumur {u} tahun")
```

---

## 4. Fitur Sakti: Comprehensions

Mengubah looping tradisional menjadi 1 baris ekspresi yang sangat cepat dieksekusi di C-level Python.

### A. List Comprehension (`[ekspresi for item in list if kondisi]`)
```python
angka = [1, 2, 3, 4, 5, 6]

# Ambil angka genap lalu kuadratkan:
# ❌ Gaya Tradisional:
# hasil = []
# for x in angka:
#     if x % 2 == 0:
#         hasil.append(x ** 2)

#  Gaya Pythonic:
hasil = [x ** 2 for x in angka if x % 2 == 0] # [4, 16, 36]
```

### B. Dict Comprehension
```python
users = [("ali", "admin"), ("budi", "user")]

# Ubah list of tuple menjadi dictionary:
user_dict = {username: role for username, role in users}
# {'ali': 'admin', 'budi': 'user'}
```

### C. Set Comprehension
```python
kalimat = "halo dunia selamat belajar"
huruf_unik = {huruf for huruf in kalimat if huruf != " "}
```
