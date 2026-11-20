---
title: "05. Mapped Types, Key Remapping & Template Literal Types"
description: Operator keyof & typeof, Mapped Types, penambahan/penghapusan modifier (+/-), key remapping via as, dan Template Literal Types di TypeScript.
---

# 🔷 TypeScript - Modul 05: Mapped Types, Key Remapping & Template Literal Types

Mapped Types memungkinkan kita **melakukan iterasi (*looping*) pada key tipe data objek** untuk mentransformasikan setiap propertinya secara sistematis, mirip seperti array `.map()` namun beroperasi pada tingkat tipe kompilator.

---

## 1. Fondasi: Operator `keyof` & `typeof`

- **`keyof T`**: Mengambil semua nama key dari sebuah tipe objek dan menjadikannya **Union String Literal**.
- **`typeof val`**: Mengambil tipe data statis dari sebuah variabel nilai runtime.

```typescript
const temaWarna = {
    primer: "#3B82F6",
    sekunder: "#10B981",
    bahaya: "#EF4444",
};

// 1. Ekstrak tipe objek dari variabel runtime:
type Tema = typeof temaWarna;
// Tema = { primer: string; sekunder: string; bahaya: string; }

// 2. Ekstrak union keys dari tipe objek:
type WarnaKey = keyof Tema;
// WarnaKey = "primer" | "sekunder" | "bahaya"
```

---

## 2. Mapped Types Dasar & Kontrol Modifier (`+` / `-`)

Struktur umum Mapped Type: `[K in UnionKeys]: TipeNilai`. Kita juga bisa menambahkan atau mencabut modifier `readonly` dan `?` secara eksplisit:

```typescript
interface UserProfile {
    id: string;
    nama?: string;
    readonly createdAt: Date;
}

// 1. Membuat Semua Properti Menjadi Mutable (Mencabut 'readonly' dengan -readonly)
type Mutable<T> = {
    -readonly [K in keyof T]: T[K];
};

// 2. Membuat Semua Properti Menjadi Wajib (Mencabut tanda '?' dengan -?)
// Inilah cara kerja sesungguhnya dari Utility Type bawaan Required<T>!
type Concrete<T> = {
    [K in keyof T]-?: T[K];
};

type UserProfileBersih = Concrete<Mutable<UserProfile>>;
// Hasil: { id: string; nama: string; createdAt: Date; }
```

---

## 3. Key Remapping Menggunakan Kata Kunci `as`

Sejak TypeScript 4.1, kita bisa **mengubah nama key** saat melakukan iterasi menggunakan klausul `as`:

### Kasus: Menghasilkan Method Getter Otomatis untuk Setiap Field
```typescript
interface Akun {
    id: number;
    saldo: number;
}

// Ubah nama properti 'saldo' menjadi 'getSaldo'
type BuatGetters<T> = {
    [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type AkunGetters = BuatGetters<Akun>;
// AkunGetters = {
//     getId: () => number;
//     getSaldo: () => number;
// }
```

### Menyaring Key Menggunakan `never`:
Jika ekspresi remapping menghasilkan `never`, key tersebut otomatis dibuang dari objek:
```typescript
interface ServiceData {
    nama: string;
    umur: number;
    simpanKeDatabase(): Promise<void>;
    resetCache(): void;
}

// Ambil HANYA properti yang berupa fungsi/method:
type HanyaMethod<T> = {
    [K in keyof T as T[K] extends Function ? K : never]: T[K];
};

type MethodService = HanyaMethod<ServiceData>;
// MethodService = { simpanKeDatabase: () => Promise<void>; resetCache: () => void; }
```

---

## 4. Template Literal Types

Template literal types menggabungkan sintaks template string `${...}` dengan sistem tipe data untuk menghasilkan permutasi string yang aman dan terprediksi:

```typescript
type Entitas = "USER" | "ORDER" | "PRODUCT";
type Aksi = "CREATED" | "UPDATED" | "DELETED";

// Menghasilkan 9 kombinasi string event secara otomatis:
type DomainEvent = `${Entitas}_${Aksi}`;
// "USER_CREATED" | "USER_UPDATED" | "USER_DELETED" |
// "ORDER_CREATED" | "ORDER_UPDATED" | "ORDER_DELETED" |
// "PRODUCT_CREATED" | "PRODUCT_UPDATED" | "PRODUCT_DELETED"

function emitEvent(event: DomainEvent) {
    console.log("Memancarkan event:", event);
}

emitEvent("USER_CREATED"); // Valid!
// emitEvent("PAYMENT_SUCCESS"); // COMPILE ERROR: Typo terdeteksi seketika!
```

### 4 Intrinsic String Manipulation Utilities Bawaan:
TypeScript menyediakan fungsi manipulasi teks compile-time bawaan:
- **`Uppercase<S>`**: `"user"` $\to$ `"USER"`
- **`Lowercase<S>`**: `"ADMIN"` $\to$ `"admin"`
- **`Capitalize<S>`**: `"nama"` $\to$ `"Nama"`
- **`Uncapitalize<S>`**: `"Title"` $\to$ `"title"`
