---
title: "03. Generics, Constraints & 12 Built-in Utility Types"
description: Generic functions, type constraints extends, default generics, serta cheatsheet lengkap 12 built-in Utility Types bawaan TypeScript.
---

# 🔷 TypeScript - Modul 03: Generics, Constraints & 12 Built-in Utility Types

Generics memungkinkan kita membuat komponen yang fleksibel dan *reusable* dengan mempertahankan informasi tipe data yang presisi saat pemanggilan (*type preservation*).

---

## 1. Generic Functions & Preservasi Tipe

Bandingkan fungsi biasa dengan fungsi generic:

```typescript
// Fungsi Tanpa Generic: Mengembalikan 'any', informasi tipe hilang!
function ambilItemPertamaAny(list: any[]): any {
    return list[0];
}

// Fungsi Generic: Mengembalikan tipe T yang sama persis dengan input!
function ambilItemPertama<T>(list: T[]): T | undefined {
    return list[0];
}

const angka = ambilItemPertama([10, 20, 30]); // Tipe otomatis tertebak: number | undefined
const teks = ambilItemPertama(["apel", "mangga"]); // Tipe otomatis tertebak: string | undefined
```

---

## 2. Generic Constraints (`extends`)

Kita bisa membatasi parameter generic agar wajib memiliki field tertentu menggunakan keyword `extends`:

```typescript
interface HasID {
    id: string | number;
}

// T wajib berupa objek yang memiliki properti 'id'
function logEntitasID<T extends HasID>(item: T): void {
    console.log("ID Entitas:", item.id);
}

logEntitasID({ id: 101, nama: "Produk A" }); // Valid!
// logEntitasID({ nama: "Produk B" }); // COMPILE ERROR: Property 'id' is missing
```

---

## 3. Matriks Lengkap 12 Built-in Utility Types

TypeScript menyediakan pustaka Utility Types bawaan untuk mentransformasikan bentuk tipe data secara instan:

```typescript
interface User {
    id: string;
    nama: string;
    email: string;
    umur?: number;
}
```

### A. Modifikasi Fleksibilitas Properti
| Utility Type | Fungsi | Hasil |
|---|---|---|
| **`Partial<T>`** | Mengubah semua properti menjadi **opsional (`?`)** | `{ id?: string; nama?: string; email?: string; umur?: number; }` |
| **`Required<T>`**| Menghapus semua tanda opsional, semua properti **wajib diisi** | `{ id: string; nama: string; email: string; umur: number; }` |
| **`Readonly<T>`**| Mengunci semua properti menjadi **read-only** | Properti tidak bisa di-assign ulang setelah dibuat |

```typescript
// Sangat berguna untuk fungsi UPDATE PATCH database:
function updateUser(id: string, payload: Partial<User>) {
    // payload boleh hanya berisi { nama: "Baru" } tanpa wajib menyertakan email
}
```

### B. Pemotongan & Pembentukan Objek
| Utility Type | Fungsi | Hasil |
|---|---|---|
| **`Pick<T, Keys>`** | Mengambil hanya segelintir properti tertentu | `Pick<User, "id" \| "email">` $\to$ `{ id: string; email: string; }` |
| **`Omit<T, Keys>`** | Membuang properti tertentu dari objek | `Omit<User, "id">` $\to$ Bentuk DTO untuk form registrasi |
| **`Record<K, T>`** | Membuat objek kamus dengan keys K dan values T | `Record<string, User>` $\to$ Objek lookup `{ [key: string]: User }` |

### C. Manipulasi Union Types
| Utility Type | Fungsi | Contoh |
|---|---|---|
| **`Exclude<T, U>`** | Membuang tipe dari union jika ada di U | `Exclude<"A" \| "B" \| "C", "A">` $\to$ `"B" \| "C"` |
| **`Extract<T, U>`** | Mengambil irisan yang cocok dari union | `Extract<string \| number, number>` $\to$ `number` |
| **`NonNullable<T>`**| Membuang `null` dan `undefined` dari union | `NonNullable<string \| null \| undefined>` $\to$ `string` |

### D. Ekstraksi Fungsi & Asynchronous
| Utility Type | Fungsi | Contoh |
|---|---|---|
| **`ReturnType<F>`** | Mengambil tipe nilai kembalian dari suatu fungsi | `type HandlerReturn = ReturnType<typeof buatHandler>;` |
| **`Parameters<F>`** | Mengambil tuple daftar parameter suatu fungsi | `type HandlerArgs = Parameters<typeof buatHandler>;` |
| **`Awaited<T>`** | **Membongkar Promise bersarang** secara tuntas | `Awaited<Promise<Promise<string>>>` $\to$ `string` |

```typescript
// Contoh Nyata Awaited: Mengambil tipe data response dari service asinkron
async function fetchProfilUser() {
    return { id: 1, nama: "Eka", role: "Developer" };
}

// Tipe data otomatis diekstrak tanpa Promise wrapper:
type ProfilData = Awaited<ReturnType<typeof fetchProfilUser>>;
// ProfilData = { id: number; nama: string; role: string; }
```
