---
title: "09. Modules & Web Storage"
description: ESM import/export, Web Storage (localStorage, sessionStorage), dan Cookies praktis.
---

# 🟡 JavaScript - Modul 09: ES Modules & Web Storage

Cheatsheet kilat sistem modul modern JavaScript dan penyimpanan data lokal di browser.

---

## 1. ES Modules (`import` & `export`)

### A. Named Export (Bisa banyak per file)
```javascript
// utils.js
export const API_URL = "https://api.example.com";

export function hitungDiskon(harga, persen) {
  return harga - (harga * persen) / 100;
}

// app.js (Nama wajib sama persis, bisa di-rename pakai 'as'):
import { API_URL, hitungDiskon as diskon } from "./utils.js";
```

### B. Default Export (Hanya boleh 1 per file)
```javascript
// authService.js
export default class AuthService {
  login() { return "Login berhasil"; }
}

// app.js (Bisa dinamai bebas tanpa kurung kurawal):
import AuthService from "./authService.js";
```

### C. Re-export / Aggregator (`index.js`)
```javascript
// components/index.js
export { Button } from "./Button.js";
export { Card } from "./Card.js";

// Pemakaian jadi rapi 1 baris:
import { Button, Card } from "./components";
```

---

## 2. Web Storage: `localStorage` vs `sessionStorage`

| Fitur | `localStorage` | `sessionStorage` |
|---|---|---|
| **Masa Simpan Data** | Selamanya (sampai dihapus manual/coding) | Hanya selama tab browser masih terbuka |
| **Kapasitas** | ~5MB - 10MB | ~5MB |
| **Akses Antar Tab** | Bisa diakses semua tab di domain yang sama | Hanya tab itu saja |

### Operasi Dasar (Wajib Menggunakan String JSON):
```javascript
// 1. Simpan Data:
localStorage.setItem("tema", "dark");

// Objek/Array WAJIB di-stringify dulu:
const user = { id: 1, name: "Ali", role: "admin" };
localStorage.setItem("user_profile", JSON.stringify(user));

// 2. Ambil Data:
const tema = localStorage.getItem("tema"); // "dark"
const userObj = JSON.parse(localStorage.getItem("user_profile"));
console.log(userObj.name); // "Ali"

// 3. Hapus 1 Data:
localStorage.removeItem("tema");

// 4. Bersihkan Seluruh Penyimpanan:
localStorage.clear();
```

### Helper Aman Penyimpanan Objek:
```javascript
const storage = {
  get(key, fallback = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.warn("Storage penuh / quota exceeded", e);
    }
  }
};
```
