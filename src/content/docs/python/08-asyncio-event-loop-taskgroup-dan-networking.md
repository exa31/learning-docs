---
title: "08. Asyncio, Event Loop, TaskGroup & Modern Networking"
description: Cooperative multitasking, siklus Event Loop, Structured Concurrency via TaskGroup (Python 3.11+), uvloop, dan asynchronous HTTP client di Python.
---

# 🐍 Python - Modul 08: Asyncio, Event Loop, TaskGroup & Modern Networking

Untuk aplikasi jaringan modern dengan puluhan ribu koneksi konkuren (seperti backend FastAPI, chat server WebSocket, atau bot scraper raksasa), **`asyncio`** adalah senjata utama yang memungkinkan model *single-threaded cooperative multitasking*.

---

## 1. Mental Model: Cooperative Multitasking

- **Preemptive Multi-Threading**: Sistem operasi yang menentukan kapan thread dijeda secara paksa (*preempted*).
- **Cooperative Multitasking (`asyncio`)**: Coroutine **secara sukarela menyerahkan kontrol (*yield control*)** kembali ke Event Loop saat sedang menunggu operasi I/O menggunakan kata kunci **`await`**.

```mermaid
sequenceDiagram
    participant Loop as Event Loop
    participant TaskA as Task A (Fetch User)
    participant TaskB as Task B (Query DB)

    Loop->>TaskA: Jalankan Task A
    TaskA->>Loop: await fetch() -> Serahkan Kontrol ke Loop!
    Loop->>TaskB: Jalankan Task B sementara Task A menunggu network
    TaskB->>Loop: await db.query() -> Serahkan Kontrol ke Loop!
    Note over Loop: Network Task A Selesai!
    Loop->>TaskA: Lanjutkan Task A
```

---

## 2. Structured Concurrency: `asyncio.TaskGroup` (Python 3.11+)

Tinggalkan `asyncio.gather()`. Sejak Python 3.11, standar industri menggunakan **`asyncio.TaskGroup()`** yang menerapkan prinsip *Structured Concurrency*:
- Jika **satu task di dalam grup gagal/melempar error**, semua task lain di dalam grup tersebut **otomatis dibatalkan (*auto-cancelled*)**.
- Tidak akan ada lagi *dangling / orphaned tasks* yang bocor di background!

```python
import asyncio
import time

async def fetch_service_a():
    await asyncio.sleep(0.1)
    return {"service": "Auth", "status": "UP"}

async def fetch_service_b():
    await asyncio.sleep(0.2)
    return {"service": "Billing", "status": "UP"}

async def main():
    async with asyncio.TaskGroup() as tg:
        # Daftarkan task ke taskgroup:
        task1 = tg.create_task(fetch_service_a())
        task2 = tg.create_task(fetch_service_b())

    # Saat blok 'async with' keluar, DIJAMIN kedua task sudah selesai!
    print("Hasil Task 1:", task1.result())
    print("Hasil Task 2:", task2.result())

asyncio.run(main())
```

---

## 3. Batas Waktu Modern: Context Manager `asyncio.timeout` (Python 3.11+)

Mengatur batas waktu eksekusi secara elegan tanpa boilerplate:

```python
async def query_lambat():
    await asyncio.sleep(5.0)
    return "Data Rahasia"

async def main():
    try:
        # Batasi operasi maksimal 1.5 detik:
        async with asyncio.timeout(1.5):
            hasil = await query_lambat()
            print("Hasil:", hasil)
    except TimeoutError:
        print("⏱️ Operasi dibatalkan karena melebihi batas waktu 1.5 detik!")

asyncio.run(main())
```

---

## 4. Klien Jaringan Async Berkecepatan Tinggi: `httpx`

Library standar `urllib` dan `requests` bersifat *blocking*. Untuk aplikasi async, gunakan **`httpx`** dengan connection pooling:

```python
# pip install httpx
import httpx
import asyncio

async def fetch_crypto_price(client: httpx.AsyncClient, symbol: str):
    url = f"https://api.binance.com/api/v3/ticker/price?symbol={symbol}"
    response = await client.get(url)
    data = response.json()
    return symbol, data.get("price")

async def main():
    pairs = ["BTCUSDT", "ETHUSDT", "SOLUSDT"]

    # Gunakan 1 client session bersama (Connection Pool HTTP/2):
    async with httpx.AsyncClient() as client:
        async with asyncio.TaskGroup() as tg:
            tasks = [tg.create_task(fetch_crypto_price(client, pair)) for pair in pairs]

        for t in tasks:
            simbol, harga = t.result()
            print(f"💰 {simbol}: ${float(harga):,.2f}")

asyncio.run(main())
```

---

## 5. Trik Sakti: `uvloop` (Performa Setara Go & Node.js)

`uvloop` adalah pengganti drop-in untuk Event Loop bawaan Python. Ditulis menggunakan Cython di atas pustaka C **`libuv`** (engine yang menggerakkan Node.js).

`uvloop` membuat kinerja `asyncio` **$2\times - 4\times$ lebih cepat**:

```python
# pip install uvloop
import asyncio
import uvloop

# Cukup 1 baris ini di entrypoint aplikasi:
uvloop.install()

# Semua asyncio.run() setelah ini otomatis berjalan di atas C engine ultra cepat!
asyncio.run(main())
```
> [!TIP]
> Web server populer seperti **Uvicorn** (penggerak FastAPI) secara otomatis mendeteksi dan menggunakan `uvloop` di lingkungan produksi Linux/macOS!
