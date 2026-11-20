---
title: "06. Iterators, Generators & Context Managers (with)"
description: Protokol Iterator (__iter__, __next__), generator berbasis yield dan yield from, penghematan memori big data, dan context manager __enter__/__exit__ di Python.
---

# 🐍 Python - Modul 06: Iterators, Generators & Context Managers (with)

Pengelolaan memori yang efisien dan alokasi resource yang aman (koneksi database, file handle, thread lock) di Python bersandar pada dua pilar utama: **Generators / Iterators** untuk aliran data besar, dan **Context Managers (`with`)** untuk *resource cleanup* otomatis.

---

## 1. Protokol Iterator: Di Balik Perulangan `for`

Saat Python mengeksekusi `for x in koleksi:`, di balik layar Python menjalankan **Protokol Iterator**:

1. Memanggil `iter(koleksi)` yang mencari dunder method `__iter__()` untuk mendapatkan objek iterator.
2. Memanggil `next(iterator)` berulang kali yang mengeksekusi dunder method `__next__()`.
3. Menghentikan perulangan saat `StopIteration` exception dilempar.

```python
class HitungMundur:
    def __init__(self, mulai):
        self.saat_ini = mulai

    def __iter__(self):
        return self # Objek ini adalah iterator itu sendiri

    def __next__(self):
        if self.saat_ini <= 0:
            raise StopIteration # Sinyal resmi bahwa data telah habis
        nilai = self.saat_ini
        self.saat_ini -= 1
        return nilai

for n in HitungMundur(3):
    print(n) # Output: 3, 2, 1
```

---

## 2. Generators & Kata Kunci `yield`

Menulis class iterator manual di atas memakan banyak boilerplate. **Generator** adalah fungsi yang menggunakan kata kunci `yield`:

Saat fungsi generator dipanggil, **kodenya tidak langsung dieksekusi**, melainkan mengembalikan objek generator. Setiap kali `next()` dipanggil, fungsi berjalan hingga menemukan `yield`, mengembalikan nilainya, dan **membekukan (*pause*) seluruh variabel lokalnya di memori** sampai diminta kembali:

```python
def fibonacci(limit):
    a, b = 0, 1
    count = 0
    while count < limit:
        yield a # Kembalikan nilai dan pause eksekusi di sini!
        a, b = b, a + b
        count += 1

gen = fibonacci(5)
print(next(gen)) # 0
print(next(gen)) # 1
print(next(gen)) # 1

# Atau konsumsi sisa data dengan for-in:
for val in gen:
    print(val) # 2, 3
```

---

## 3. Streaming Big Data: Mengolah File 50GB dengan RAM 100MB

Jangan pernah membaca file besar dengan `file.readlines()` karena seluruh file akan ditarik ke RAM dan memicu crash OOM (*Out Of Memory*). Gunakan Generator:

```python
def baca_file_raksasa_per_baris(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        for baris in f: # File object di Python secara alami adalah Generator!
            yield baris.strip()

# Pipeline Pengolahan Data (Chained Generators):
semua_baris = baca_file_raksasa_per_baris("access_log_50gb.txt")
log_error = (b for b in semua_baris if "ERROR" in b) # Generator filter
ip_addresses = (b.split()[0] for b in log_error)     # Generator mapping

# Memori RAM yang digunakan HANYA beberapa kilobyte meskipun file berukuran 50GB!
for ip in ip_addresses:
    kirim_alert_ip(ip)
```

### Delegasi Generator: `yield from`
Untuk menggabungkan beberapa generator atau meloloskan sub-generator:
```python
def gabung_generator(gen1, gen2):
    yield from gen1 # Setara: for item in gen1: yield item
    yield from gen2
```

---

## 4. Context Managers & Pernyataan `with`

Pernyataan `with` menjamin bahwa resource (seperti koneksi atau file) **selalu dibersihkan dan ditutup**, bahkan jika terjadi runtime exception di tengah kode.

### Anatomi Protokol Context Manager:
- **`__enter__(self)`**: Menyiapkan resource dan mengembalikan objek untuk variabel `as target`.
- **`__exit__(self, exc_type, exc_val, exc_tb)`**: Membersihkan resource. Jika mengembalikan `True`, exception di dalam blok `with` akan diredam (*suppressed*).

```python
class DatabaseTransaction:
    def __init__(self, db_conn):
        self.db = db_conn

    def __enter__(self):
        print("1. Memulai transaksi: BEGIN TRANSACTION")
        return self.db

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is not None:
            # Terjadi error di dalam blok with!
            print(f"⚠️ Terjadi error ({exc_val})! Menjalankan: ROLLBACK")
            return False # Biarkan error tetap meletup ke pemanggil
        else:
            print("2. Semua operasi sukses: COMMIT")
            return True

# Penggunaan:
with DatabaseTransaction("db_production") as db:
    print("Mengeksekusi INSERT data...")
    # Jika baris ini melempar error, ROLLBACK otomatis dipanggil!
```

---

## 5. Membuat Context Manager Ringkas via `@contextmanager`

Gunakan pustaka bawaan `contextlib` untuk membuat context manager berbasis generator tanpa perlu membuat class:

```python
from contextlib import contextmanager
import time

@contextmanager
def timer_benchmark(label):
    start = time.perf_counter()
    try:
        yield # Titik di mana kode di dalam blok 'with' dieksekusi!
    finally:
        # Bagian ini DIJAMIN selalu dieksekusi saat blok 'with' selesai
        durasi = time.perf_counter() - start
        print(f"[{label}] Durasi eksekusi: {durasi:.4f} detik")

# Penggunaan super elegan:
with timer_benchmark("Proses Matriks 1000x1000"):
    total = sum(i * j for i in range(1000) for j in range(1000))
```
