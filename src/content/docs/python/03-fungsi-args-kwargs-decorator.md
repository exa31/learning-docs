---
title: "03. Fungsi, *args, **kwargs & Decorator"
description: Parameter dinamis (*args, **kwargs), bahaya default argumen, lambda, generator & yield, serta decorator.
---

# 🐍 Python - Modul 03: Fungsi, Decorator & Generator

Cheatsheet kilat fungsi tingkat lanjut, parameter tak terbatas, generator hemat memori, dan decorator.

---

## 1. Parameter Dinamis: `*args` dan `**kwargs`

- **`*args`**: Menampung parameter posisi tak terbatas menjadi sebuah **`tuple`** (seperti `vararg` di Kotlin).
- **`**kwargs`**: Menampung parameter bernama (*keyword arguments*) menjadi sebuah **`dict`**.

```python
def cetak_semuanya(pesan_utama, *args, **kwargs):
    print("Pesan Utama:", pesan_utama)
    print("Args (Tuple):", args)
    print("Kwargs (Dict):", kwargs)

cetak_semuanya("Pemberitahuan", 10, 20, 30, role="admin", aktif=True)
# Output:
# Pesan Utama: Pemberitahuan
# Args (Tuple): (10, 20, 30)
# Kwargs (Dict): {'role': 'admin', 'aktif': True}
```

---

## 2. ⚠️ Jebakan Fatal: Mutable Default Argument

Jangan pernah menggunakan objek mutable (seperti `[]` atau `{}`) sebagai default parameter! Nilai tersebut di-cache di memori sepanjang proses aplikasi hidup:

```python
# ❌ SALAH BESAR (Bug Memori!):
def tambah_user(nama, list_user=[]):
    list_user.append(nama)
    return list_user

print(tambah_user("Ali"))  # ['Ali']
print(tambah_user("Budi")) # ['Ali', 'Budi'] -> OOPS! Ali ikutan kebawa!

#  BENAR: Gunakan None sebagai sentinel value
def tambah_user_aman(nama, list_user=None):
    if list_user is None:
        list_user = []
    list_user.append(nama)
    return list_user
```

---

## 3. Generator & Kata Kunci `yield` (Hemat Memori Jutaan Baris)

Fungsi biasa me-return seluruh isi data sekaligus ke memori RAM. **Generator** menghasilkan data **satu-per-satu saat diminta**, sehingga tidak pernah bikin RAM habis:

```python
def hitung_angka(maksimal):
    n = 1
    while n <= maksimal:
        yield n # Mengembalikan nilai sementara dan menjeda fungsi di sini
        n += 1

gen = hitung_angka(1000000) # Tidak makan RAM 1 juta item!
print(next(gen)) # 1
print(next(gen)) # 2
```

---

## 4. Decorator (`@`)

Decorator adalah fungsi yang menerima fungsi lain dan menambahkan perilaku baru sebelum/sesudah dieksekusi:

```python
import time
from functools import wraps

def ukur_waktu(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        awal = time.time()
        hasil = func(*args, **kwargs)
        durasi = time.time() - awal
        print(f"⏱️ Fungsi {func.__name__} selesai dalam {durasi:.4f} detik")
        return hasil
    return wrapper

@ukur_waktu
def proses_data():
    time.sleep(0.5)
    return "Selesai"

proses_data()
```
