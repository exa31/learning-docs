---
title: "02. Walrus Operator, Comprehensions & Pattern Matching"
description: Operator penugasan Walrus (:=), List/Dict/Set Comprehension, Generator Expressions hemat RAM, dan Structural Pattern Matching (match/case) di Python.
---

# 🐍 Python - Modul 02: Walrus Operator, Comprehensions & Pattern Matching

Python terkenal dengan sintaksnya yang bersih dan ekspresif. Fitur modern seperti **Walrus Operator (`:=`)** dan **Structural Pattern Matching (`match / case`)** menyederhanakan alur kontrol logika yang kompleks menjadi kode yang sangat mudah dibaca (*Pythonic*).

---

## 1. Walrus Operator (`:=`): Assignment Expressions

Diperkenalkan pada Python 3.8, operator Walrus `:=` memungkinkan kita **menugaskan nilai ke suatu variabel di tengah-tengah ekspresi logika**:

```python
# CARA LAMA (Variabel 'baris' dipanggil berulang atau kode bersarang):
data = ["apel", "belimbing", "ceri"]
if len(data) > 2:
    print(f"Data banyak: ada {len(data)} item")

# CARA MODERN DENGAN WALRUS OPERATOR:
if (n := len(data)) > 2:
    print(f"Data banyak: ada {n} item") # 'n' langsung bisa dipakai!

# Sangat berguna untuk membaca stream file / chunk socket:
with open("log.txt", "r") as f:
    while (chunk := f.read(1024)): # Baca dan periksa sekaligus dalam 1 baris
        proses_chunk(chunk)
```

---

## 2. Comprehensions: List, Dict, Set & Generator Expressions

Comprehension adalah idiom khas Python untuk mentransformasikan dan menyaring data secara ringkas:

```python
angka = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# 1. List Comprehension dengan Filter Kondisional:
genap_kuadrat = [x**2 for x in angka if x % 2 == 0]
# [4, 16, 36, 64, 100]

# 2. Dictionary Comprehension:
harga_usd = {"kopi": 2.5, "teh": 1.5, "roti": 3.0}
harga_idr = {k: int(v * 16000) for k, v in harga_usd.items()}
# {'kopi': 40000, 'teh': 24000, 'roti': 48000}

# 3. Set Comprehension (Otomatis Deduplikasi):
tags_kotor = ["Python", "python", "GO", "Go", "RUST"]
tags_bersih = {t.lower() for t in tags_kotor}
# {'python', 'go', 'rust'}

# 4. Flattening 2D Matrix (Matriks Bersarang):
matriks = [[1, 2], [3, 4], [5, 6]]
flat = [val for baris in matriks for val in baris]
# [1, 2, 3, 4, 5, 6]
```

### ⚠️ List Comprehension vs Generator Expression (Efisiensi RAM):
Jika datanya berjumlah 10 juta item:
- `[x**2 for x in range(10_000_000)]` $\to$ Mengalokasikan **$800\text{ MB}$ RAM** sekaligus!
- `(x**2 for x in range(10_000_000))` $\to$ Menggunakan tanda kurung biasa `()` menghasilkan **Generator Expression**. Objek dievaluasi secara *lazy* (satu per satu saat diminta), hanya memakan **$120\text{ byte}$ RAM**!

```python
# Hemat RAM: langsung kirim generator ke fungsi agregasi sum()
total = sum(x**2 for x in range(10_000_000))
```

---

## 3. Structural Pattern Matching (`match / case` di Python 3.10+)

Bukan sekadar `switch-case` biasa, Pattern Matching di Python mampu mencocokkan bentuk struktur data, mendestrukturisasi isi list/dict, dan memvalidasi tipe sekaligus:

```python
def jalankan_perintah(cmd):
    match cmd.split():
        # Pola 1: Perintah tunggal
        case ["quit"] | ["exit"]:
            print("Keluar dari aplikasi...")

        # Pola 2: Sequence Destructuring dengan Rest Parameter (*args)
        case ["load", filename, *options]:
            print(f"Memuat file: {filename} dengan opsi tambahan: {options}")

        # Pola 3: Mencocokkan nilai numerik dengan Guard (if clause)
        case ["set", "volume", val] if val.isdigit():
            v = int(val)
            print(f"Volume diatur ke: {v}%")

        # Wildcard fallback
        case _:
            print(f"Perintah tidak dikenal: {cmd}")

jalankan_perintah("load data.csv --fast --verbose")
# Output: Memuat file: data.csv dengan opsi tambahan: ['--fast', '--verbose']
```

### Pattern Matching pada Objek Dictionary (JSON API):
```python
def proses_event(event: dict):
    match event:
        case {"type": "PAYMENT", "status": "SUCCESS", "amount": nominal}:
            print(f"Pembayaran lunas sebesar: Rp{nominal:,}")
            
        case {"type": "PAYMENT", "status": "FAILED", "reason": error_msg}:
            print(f"Transaksi gagal: {error_msg}")
            
        case {"type": "USER_LOGIN", "user_id": uid}:
            print(f"User {uid} berhasil login")
```
