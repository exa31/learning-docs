---
title: "07. Classes, OOP & Stage-3 Decorators (TS 5.0+)"
description: Parameter properties shorthand, private vs #private runtime field, abstract class, dan modern TC39 Stage-3 Decorators tanpa flag experimental di TypeScript.
---

# 🔷 TypeScript - Modul 07: Classes, OOP & Stage-3 Decorators (TS 5.0+)

TypeScript memperkaya fitur class JavaScript ES6 dengan **Access Modifiers**, **Parameter Properties**, **Abstract Classes**, dan implementasi modern **TC39 Stage-3 Decorators** bawaan TypeScript 5.0+.

---

## 1. Parameter Properties Shorthand

Alih-alih menulis deklarasi field berulang kali di class dan di dalam constructor, TypeScript menyediakan sintaks singkat *Parameter Properties*:

```typescript
// CARA LAMA YANG MEMBOSANKAN:
class UserLama {
    public id: string;
    private secretKey: string;
    constructor(id: string, secretKey: string) {
        this.id = id;
        this.secretKey = secretKey;
    }
}

// CARA ELEGAN TYPESCRIPT (Parameter Properties):
class UserModern {
    constructor(
        public readonly id: string,      // Public & tidak bisa diubah
        private secretKey: string,        // Private tingkat kompilator
        protected role: string = "user"   // Protected (Bisa diakses oleh subclass turunan)
    ) {}
}
```

---

## 2. Access Modifiers: `private` vs ECMAScript `#private`

Ini adalah perbedaan krusial antara keamanan masa kompilasi vs keamanan nyata di runtime browser:

| Karakteristik | `private field` (TypeScript) | `#privateField` (ECMAScript Native) |
|---|---|---|
| **Pemeriksaan** | **Compile-Time Saja** | **Runtime Engine V8 Nyata** |
| **Bisa Dibobol?** | ✅ **Bisa** via `(obj as any).field` | ❌ **Mustahil**: Syntax Error jika diakses dari luar class! |
| **Output JavaScript** | Menjadi properti publik biasa di file .js | Tetap memiliki tanda `#` asli yang dilindungi engine JS |

```typescript
class KeamananData {
    private pinTs: number = 1234;
    #pinNative: number = 5678; // Hard Runtime Privacy!
}

const k = new KeamananData();
// (k as any).pinTs;     // BERHASIL DIBACA (Hanya dicegah oleh compiler, bukan runtime!)
// (k as any).#pinNative; // SYNTAX ERROR: Private field '#pinNative' must be declared in an enclosing class!
```

---

## 3. Abstract Classes vs Interfaces

- **`interface`**: Murni kontrak tipe data tanpa implementasi kode sama sekali (dihapus total saat kompilasi ke JS).
- **`abstract class`**: Bisa memiliki method abstrak yang wajib diisi subclass, sekaligus menyediakan **implementasi method default (*concrete logic*)** yang dibagikan ke semua subclass:

```typescript
abstract class BaseRepository<T> {
    abstract getTableName(): string; // Wajib diisi oleh subclass

    // Concrete logic: Bisa langsung dipakai oleh semua subclass turunan
    public logActivity(action: string) {
        console.log(`[Tabel: ${this.getTableName()}] Aksi: ${action}`);
    }
}

class UserRepository extends BaseRepository<{ id: number; nama: string }> {
    getTableName(): string {
        return "users";
    }
}
```

---

## 4. TC39 Stage-3 Decorators (TypeScript 5.0+ Modern)

Sebelum TS 5.0, decorator memerlukan flag usang `"experimentalDecorators": true`. Di TypeScript 5.0+, decorator sudah menjadi **standar resmi JavaScript (TC39 Stage-3)** dengan type-safety penuh dan parameter `context`.

### Contoh: Method Decorator `@Logged` (Mencatat Waktu Eksekusi)
```typescript
function Logged<This, Args extends any[], Return>(
    target: (this: This, ...args: Args) => Return,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
) {
    const methodName = String(context.name);

    return function (this: This, ...args: Args): Return {
        console.log(`[Panggil] Method '${methodName}' dimulai dengan argumen:`, args);
        const start = performance.now();
        
        const result = target.call(this, ...args);
        
        const end = performance.now();
        console.log(`[Selesai] Method '${methodName}' selesai dalam ${(end - start).toFixed(2)}ms`);
        return result;
    };
}

class KalkulatorService {
    @Logged
    hitungFaktorial(n: number): number {
        if (n <= 1) return 1;
        return n * this.hitungFaktorial(n - 1);
    }
}

const service = new KalkulatorService();
service.hitungFaktorial(5);
```
Output:
```text
[Panggil] Method 'hitungFaktorial' dimulai dengan argumen: [5]
...
[Selesai] Method 'hitungFaktorial' selesai dalam 0.15ms
```
