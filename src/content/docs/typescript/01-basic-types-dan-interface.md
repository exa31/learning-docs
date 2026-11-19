---
title: "01. Tipe Dasar & Interface"
---

# 🔷 TypeScript - Modul 01: Tipe Dasar, Interface & Type

Cheatsheet kilat pengetikan tipe data, perbedaan `interface` vs `type`, union, dan properti opsional di TypeScript.

---

## 1. Tipe Data Primitif Dasar

```typescript
let nama: string = "Eka";
let umur: number = 25;
let isAktif: boolean = true;

// Array:
let angka: number[] = [1, 2, 3];
let daftarNama: Array<string> = ["Ali", "Budi"];

// Tuple (Array dengan jumlah elemen & tipe posisi yang pasti):
let koordinat: [number, number] = [106.8, -6.2];

// Void (Fungsi tidak mengembalikan apapun):
function logInfo(pesan: string): void {
  console.log(pesan);
}

// Any (Matikan type checker - hindari sebisa mungkin!):
let sembarang: any = "bisa apa saja";

// Unknown (Tipe aman untuk data yang belum pasti - wajib diperiksa sebelum dipakai):
let dataLuar: unknown = ambilDariApi();
if (typeof dataLuar === "string") {
  console.log(dataLuar.toUpperCase()); // Aman setelah diperiksa
}
```

---

## 2. `interface` vs `type`

Keduanya sama-sama mendefinisikan bentuk objek (*shape*), tapi ada perbedaan kapan harus memakainya:

| Fitur | `interface` | `type` (Type Alias) |
|---|---|---|
| **Kegunaan Utama** | Objek model, DTO, OOP contract class | Union (`\|`), Tuple, Primitive, Function type |
| **Mewarisi (*Inheritance*)** | `interface B extends A` | Intersection: `type B = A & { ... }` |
| **Deklarasi Ulang (*Merge*)** | Bisa di-merge (*declaration merging*) | ❌ Tidak bisa di-merge |

### Contoh `interface`:
```typescript
interface User {
  id: number;
  name: string;
  email?: string;          // '?' = Opsional (boleh tidak diisi)
  readonly createdAt: Date; // 'readonly' = Tidak bisa diubah setelah dibuat
}

interface AdminUser extends User {
  role: "superadmin" | "admin";
}
```

### Contoh `type`:
```typescript
// Bagus untuk Union Type (nilai pasti):
type StatusPemesanan = "PENDING" | "PAID" | "CANCELLED";

// Type gabungan (Intersection):
type Product = { id: string; price: number };
type DiscountedProduct = Product & { discount: number };
```

---

## 3. Type Assertion (`as`)

Memberi tahu TypeScript: *"Percayalah pada saya, saya tahu persis tipe data variabel ini!"*:

```typescript
const inputElement = document.getElementById("search-input") as HTMLInputElement;
console.log(inputElement.value);
```
