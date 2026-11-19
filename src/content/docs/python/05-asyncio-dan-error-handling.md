---
title: "05. Asyncio & Error Handling"
description: Try-except-else-finally, custom exception, async/await, asyncio.gather, dan context manager with.
---

# 🐍 Python - Modul 05: Asyncio & Error Handling

Cheatsheet kilat penanganan error terstruktur, context manager `with`, dan pemrograman asynchronous dengan `asyncio`.

---

## 1. Error Handling Lengkap (`try...except...else...finally`)

```python
def bagi_angka(a: float, b: float):
    try:
        hasil = a / b
    except ZeroDivisionError as err:
        print("❌ Error: Tidak bisa membagi dengan angka 0!", err)
        return None
    except TypeError:
        print("❌ Error: Input wajib berupa angka!")
        return None
    else:
        # Dijalankan HANYA jika TIDAK ADA error sama sekali:
        print("✅ Pembagian berhasil tanpa kendala.")
        return hasil
    finally:
        # Selalu dijalankan terlepas dari ada error atau tidak:
        print("🏁 Blok selesai dieksekusi.")
```

---

## 2. Context Manager (`with` Statement)

Menjamin resource (seperti file atau koneksi database) otomatis ditutup dan dibersihkan, bahkan jika terjadi error crash di tengah jalan:

```python
# Otomatis close() file setelah keluar dari blok:
with open("data.txt", "w", encoding="utf-8") as f:
    f.write("Halo dari Python!")
# Di sini file sudah otomatis ditutup dengan aman!
```

---

## 3. Asynchronous Programming (`asyncio`)

Python mendukung `async` dan `await` menggunakan pustaka bawaan `asyncio`:

```python
import asyncio

async def fetch_api(nama: str, delay: int):
    print(f"Mulai ambil data: {nama}")
    await asyncio.sleep(delay) # Non-blocking sleep
    print(f"Selesai data: {nama}")
    return f"Hasil {nama}"

async def main():
    # Jalankan secara paralel bersamaan (seperti Promise.all di JS):
    hasil1, hasil2 = await asyncio.gather(
        fetch_api("User", 2),
        fetch_api("Produk", 1)
    )
    print("Hasil Akhir:", hasil1, hasil2)

# Titik masuk eksekusi event loop:
if __name__ == "__main__":
    asyncio.run(main())
```
