---
title: "02. Interface vs Type Alias & Declaration Merging"
description: Matriks keputusan Interface vs Type Alias, performa compiler table lookup vs intersection, Declaration Merging pada Window & Express Request.
---

# 🔷 TypeScript - Modul 02: Interface vs Type Alias & Declaration Merging

Perdebatan paling abadi di komunitas TypeScript adalah: *"Kapan harus menggunakan `interface` dan kapan harus menggunakan `type`?"*. Meskipun 90% kasus keduanya bisa saling menggantikan, terdapat perbedaan fundamental dalam arsitektur kompilator dan kemampuan penggabungan deklarasi.

---

## 1. Matriks Keputusan: `interface` vs `type`

| Kasus Penggunaan | Direkomendasikan | Alasan & Contoh |
|---|:---:|---|
| **Mendefinisikan Bentuk Objek / DTO** | `interface` | Lebih cepat di-cache oleh compiler TypeScript. |
| **Union Types (`A \| B`)** | `type` | ❌ Tidak bisa dilakukan oleh interface (`type ID = string \| number;`). |
| **Primitif Alias / Tuple** | `type` | ❌ Tidak bisa dilakukan oleh interface (`type Koordinat = [number, number];`). |
| **Kontrak Implementasi Class** | `interface` | Sintaks standar OOP: `class UserRepo implements IUserRepo`. |
| **Extensible Library / SDK Publik** | `interface` | Mengizinkan konsumen library melakukan *Declaration Merging*. |
| **Mapped & Conditional Types** | `type` | Fitur manipulasi tipe lanjutan hanya ada pada `type`. |

---

## 2. Performa Kompilator: Inheritance vs Intersection (`&`)

Kompilator TypeScript mengoptimalkan performa type checking secara berbeda:
- **`interface B extends A`**: Membentuk hierarki terstruktur. Kompilator mendeteksi konflik properti seketika dan membuat representasi tipe ter-cache (*flat cached lookup table*).
- **`type B = A & C` (Intersection)**: Kompilator harus mengevaluasi gabungan setiap properti berulang-ulang, yang bisa memperlambat proses kompilasi pada codebase besar.

```typescript
// 1. Pewarisan dengan Interface (Direkomendasikan untuk relasi OOP)
interface UserBase {
    id: string;
    nama: string;
}

interface UserAdmin extends UserBase {
    permissions: string[];
}

// 2. Gabungan dengan Type Intersection (&)
type Timestamps = {
    createdAt: Date;
    updatedAt: Date;
};

type AuditUser = UserBase & Timestamps;
```

---

## 3. Fitur Eksklusif: Declaration Merging

Jika kamu mendeklarasikan dua `interface` dengan nama yang sama di scope yang sama, TypeScript akan **menggabungkan kedua interface tersebut menjadi satu**:

```typescript
interface KeranjangBelanja {
    totalItem: number;
}

interface KeranjangBelanja {
    totalHarga: number;
}

// Hasil akhir KeranjangBelanja otomatis memiliki KEDUA properti:
const cart: KeranjangBelanja = {
    totalItem: 3,
    totalHarga: 150000,
};
```

> [!NOTE]
> `type` alias **TIDAK MENDUKUNG Declaration Merging**. Mendeklarasikan `type X` dua kali akan memicu error kompilasi: *Duplicate identifier 'X'*.

---

## 4. Kasus Nyata: Module Augmentation (Express & Window)

Declaration Merging adalah cara standar memperluas objek global atau library pihak ketiga tanpa mengubah source code library tersebut:

### A. Menambahkan Properti ke Objek Browser `window`:
```typescript
// globals.d.ts
export {};

declare global {
    interface Window {
        googleAnalyticsId?: string;
        userToken?: string;
    }
}

// Sekarang bisa diakses di file mana pun secara type-safe:
window.googleAnalyticsId = "UA-992182";
```

### B. Menambahkan Field `user` ke Express `Request`:
```typescript
// express.d.ts
import { JwtPayload } from "./auth";

declare module "express-serve-static-core" {
    interface Request {
        currentUser?: JwtPayload; // Field baru tersedia di semua middleware!
    }
}
```

---

## 5. Index Signatures & Kelemahan Keamanannya

Index signature digunakan saat nama key tidak diketahui sebelumnya:

```typescript
// Index signature tradisional:
interface CacheMemory {
    [key: string]: string;
}

const c: CacheMemory = {};
const val = c["key_tidak_ada"]; // Tipe di-infer sebagai 'string', padahal runtime bernilai undefined!
```

> [!TIP]
> **Praktik Lebih Aman**:
> Gunakan `Record<string, unknown>` atau aktifkan opsi `noUncheckedIndexedAccess: true` di `tsconfig.json` agar nilai kembalian otomatis bertipe `string | undefined`.
