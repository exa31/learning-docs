---
title: "07. Async / Await & Promises"
---

# 🟡 JavaScript - Modul 07: Async / Await & Promises

Cheatsheet kilat pemrograman asynchronous: Promise, Async/Await, Error Handling, Eksekusi Paralel, dan Resep Praktis.

---

## 1. Aturan Dasar `async` & `await`

- **`async`**: Fungsi yang diawali `async` **pasti mengembalikan Promise**. Nilai kembaliannya otomatis dibungkus `Promise.resolve(...)`.
- **`await`**: Menjeda fungsi secara lokal hingga Promise selesai (*settled*), lalu langsung membongkar nilainya.

```javascript
async function ambilData() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  const data = await res.json();
  return data;
}
```

---

## 2. Error Handling & Perangkap `fetch()`

### ⚠️ Awas: `fetch()` Tidak Throw Error pada HTTP 404 / 500!
`fetch()` hanya throw error jika koneksi jaringan putus total. Selalu periksa `response.ok`:

```javascript
async function fetchUserSafe(id) {
  try {
    const res = await fetch(`https://api.example.com/users/${id}`);
    
    // Wajib cek status HTTP:
    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Gagal ambil user:", err.message);
    return null; // Fallback value
  }
}
```

---

## 3. Eksekusi Serial vs Paralel

### ❌ Serial (Lambat - jika task saling independen)
Total waktu = 1 detik + 1 detik = ~2 Detik:
```javascript
const user = await fetchUser();       // 1s
const posts = await fetchPosts();     // 1s
```

###  Paralel dengan `Promise.all` (Cepat)
Total waktu = Max(1s, 1s) = ~1 Detik (dijalankan serentak):
```javascript
const [user, posts] = await Promise.all([
  fetchUser(),
  fetchPosts()
]);
```

### `Promise.all` vs `Promise.allSettled`
- **`Promise.all`**: *Fail-fast*. Kalau ada 1 request yang gagal, seluruhnya langsung dianggap gagal/throw error.
- **`Promise.allSettled`**: Tahan banting. Menunggu semua selesai terlepas apakah ada yang sukses atau gagal:
```javascript
const hasil = await Promise.allSettled([fetchA(), fetchB()]);
// hasil: [ { status: "fulfilled", value: ... }, { status: "rejected", reason: ... } ]
```

---

## 4. Looping Asynchronous: `for...of` vs `forEach`

### ❌ Jangan pakai `forEach` dengan `await`!
`forEach` **tidak menunggu** promise selesai:
```javascript
// ❌ SALAH:
items.forEach(async (item) => { await simpan(item); });
console.log("Selesai"); // Jalan DULUAN sebelum data tersimpan!

//  BENAR A: Berurutan satu per satu (Serial)
for (const item of items) {
  await simpan(item);
}

//  BENAR B: Serentak bersamaan (Paralel)
await Promise.all(items.map(item => simpan(item)));
```

---

## 5. Resep Cepat yang Sering Dicari

### A. Jeda Waktu: `sleep(ms)`
```javascript
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
await sleep(2000); // Tunggu 2 detik
```

### B. Timeout Request (Batalkan jika server lemot)
```javascript
function withTimeout(promise, ms = 5000) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout!")), ms)
  );
  return Promise.race([promise, timeout]);
}
```

### C. Cancel Fetch via `AbortController`
```javascript
const controller = new AbortController();

fetch("/api/search", { signal: controller.signal });

// Batalkan request kapan saja (misal saat user ganti halaman):
controller.abort();
```
