---
title: "02. Generics & Utility Types"
---

# 🔷 TypeScript - Modul 02: Generics & Utility Types

Cheatsheet kilat pembuatan fungsi Generic `<T>` dan utility types sakti bawaan TypeScript.

---

## 1. Generics (`<T>`)

Membuat fungsi atau interface fleksibel yang tipenya menyesuaikan dengan tipe data yang dioper saat pemanggilan:

```typescript
// Fungsi Generic pembungkus:
function bungkusArray<T>(item: T): T[] {
  return [item];
}

const arrString = bungkusArray<string>("halo"); // Tipe: string[]
const arrAngka = bungkusArray<number>(100);     // Tipe: number[]

// Generic pada Interface API Response:
interface ApiResponse<TData> {
  success: boolean;
  message: string;
  data: TData; // Tipe data dinamis
}

interface User {
  id: number;
  name: string;
}

const response: ApiResponse<User> = {
  success: true,
  message: "OK",
  data: { id: 1, name: "Ali" }
};
```

---

## 2. Utility Types Sakti Bawaan TypeScript

TypeScript menyediakan *helper types* untuk mengubah tipe objek yang sudah ada tanpa menulis ulang:

| Utility Type | Fungsi | Contoh |
|---|---|---|
| **`Partial<T>`** | Bikin semua properti jadi **opsional** (`?`). Cocok untuk fungsi update / patch. | `Partial<User>` |
| **`Required<T>`** | Bikin semua properti jadi **wajib diisi** (kebalikan Partial). | `Required<User>` |
| **`Readonly<T>`** | Kunci semua properti agar **tidak bisa diubah**. | `Readonly<User>` |
| **`Pick<T, Keys>`**| Ambil **hanya properti tertentu** dari sebuah type. | `Pick<User, "id" \| "name">` |
| **`Omit<T, Keys>`**| Buang properti tertentu dan ambil sisanya. | `Omit<User, "password">` |
| **`Record<K, T>`** | Bikin tipe dictionary / Map key-value. | `Record<string, number>` |
| **`Awaited<T>`**   | Bongkar isi nilai asli dari dalam Promise secara rekursif. | `Awaited<Promise<string>>` $\to$ `string` |

### Contoh Pemakaian `Partial` & `Omit`:
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
}

// Untuk fungsi update (tidak semua field harus dikirim):
function updateUser(id: number, fieldsToUpdate: Partial<User>) {
  // fieldsToUpdate: { name?: string, email?: string, ... }
}

// Untuk response ke public frontend (sembunyikan passwordHash):
type PublicUserProfile = Omit<User, "passwordHash">;
```
