---
title: "04. Advanced Types & Type Narrowing"
description: Discriminated unions, type guards kustom, typeof, keyof, conditional types, dan mapped types.
---

# 🔷 TypeScript - Modul 04: Advanced Types & Narrowing

Cheatsheet kilat fitur tipe lanjutan TypeScript untuk menangani arsitektur data kompleks tanpa rasa takut.

---

## 1. Type Guards & Narrowing

### A. Operator Bawaan (`typeof` & `instanceof`)
```typescript
function prosesNilai(input: string | number | Date) {
  if (typeof input === "string") {
    return input.trim(); // TS tahu ini string
  }
  if (input instanceof Date) {
    return input.getFullYear(); // TS tahu ini Date
  }
  return input.toFixed(2); // Pasti number
}
```

### B. Custom Type Guard (`arg is Type`)
Fungsi pemeriksa tipe buatan sendiri:
```typescript
interface Admin {
  role: "admin";
  bisaBannedUser: boolean;
}

interface User {
  role: "user";
}

// Perhatikan return type: 'u is Admin'
function isAdmin(u: User | Admin): u is Admin {
  return (u as Admin).bisaBannedUser !== undefined;
}

function handleAuth(orang: User | Admin) {
  if (isAdmin(orang)) {
    console.log("Status banned:", orang.bisaBannedUser); // Auto-complete aman!
  }
}
```

---

## 2. Pola Emas: Discriminated Unions

Gunakan 1 properti pembeda unik (biasanya properti `type` atau `status` berupa string literal) agar compiler TypeScript bisa 100% membedakan objek secara otomatis di dalam `switch-case`:

```typescript
type ApiResponse =
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; message: string };

function renderUI(res: ApiResponse) {
  switch (res.status) {
    case "loading":
      return "Tampilkan spinner...";
    case "success":
      return `Data: ${res.data.join(", ")}`; // Otomatis tahu punya properti .data!
    case "error":
      return `Error: ${res.message}`; // Otomatis tahu punya properti .message!
  }
}
```

---

## 3. Operator Tipe: `keyof` dan `typeof`

- **`typeof`**: Mengambil tipe data dari variabel JavaScript yang sudah ada.
- **`keyof`**: Mengambil seluruh nama properti dari sebuah tipe dan menggabungkannya jadi union string.

```typescript
const temaWarna = {
  primer: "#3b82f6",
  sekunder: "#64748b",
  bahaya: "#ef4444",
};

// 1. Ekstrak tipe objek dari variabel temaWarna:
type Tema = typeof temaWarna;

// 2. Ambil union nama key-nya:
type NamaWarna = keyof typeof temaWarna; // "primer" | "sekunder" | "bahaya"

function ambilWarna(key: NamaWarna) {
  return temaWarna[key];
}
ambilWarna("primer"); //  Bisa
// ambilWarna("kuning"); // ❌ Error compiler langsung!
```

---

## 4. Conditional Types (`T extends U ? X : Y`)

Tipe yang berperilaku seperti operasi `if-else` di level tipe data:

```typescript
// Jika tipe T adalah string, jadikan string[], kalau bukan jadikan T:
type JadiArray<T> = T extends string ? string[] : T;

type Hasil1 = JadiArray<string>; // string[]
type Hasil2 = JadiArray<number>; // number
```

---

## 5. Mapped Types (Transformasi Objek)

Membuat tipe baru dengan melooping setiap key dari tipe yang ada:

```typescript
type FiturFlags = {
  darkMode: boolean;
  notifikasi: boolean;
};

// Ubah seluruh value-nya menjadi fungsi getter:
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type FiturGetters = Getters<FiturFlags>;
// Hasil otomatis:
// {
//   getDarkMode: () => boolean;
//   getNotifikasi: () => boolean;
// }
```
