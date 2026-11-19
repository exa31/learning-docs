---
title: "05. Classes & Modern Decorators"
description: Parameter properties, access modifiers, abstract class, dan decorators modern di TypeScript.
---

# 🔷 TypeScript - Modul 05: Classes & Decorators

Cheatsheet kilat Object-Oriented Programming (OOP) modern di TypeScript dan penggunaan decorator.

---

## 1. Parameter Properties (Trik Konstruktor Bersih)

Daripada mendeklarasikan properti dan menulis `this.x = x` berulang-ulang, letakkan modifier akses (`public`, `private`, `readonly`) langsung di dalam parameter constructor:

```typescript
// ❌ Gaya Jadul (Berbelit-belit):
class UserOld {
  public id: number;
  public name: string;
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

//  Gaya Modern TypeScript (Parameter Property):
class User {
  constructor(
    public readonly id: number,
    public name: string,
    private token: string
  ) {}

  printInfo() {
    console.log(`User ${this.name} (${this.id})`);
  }
}
```

---

## 2. Access Modifiers: `private` vs `#private` (Hard Private)

- **`private` (TypeScript)**: Hanya berlaku saat compile time. Saat runtime di-transpile ke JS, nilainya masih bisa diakses jika di-cast ke `any`.
- **`#private` (Native ECMAScript)**: Privasi keras (*hard private*). Benar-benar dikunci oleh engine JavaScript di level memori dan tidak bisa diakses dari luar sama sekali!

```typescript
class RekeningBank {
  private saldoTs: number = 1000;
  #saldoNative: number = 2000; // Native private

  getSaldo() {
    return this.#saldoNative;
  }
}

const rek = new RekeningBank();
// (rek as any).saldoTs;     // Masih bisa lolos di runtime JS
// (rek as any).#saldoNative // ❌ SyntaxError keras!
```

---

## 3. Abstract Class (Cetak Biru)

Class dasar yang tidak bisa di-instansiasi langsung (`new`), hanya boleh diwarisi (*inherited*):

```typescript
abstract class Kendaraan {
  constructor(public merk: string) {}

  // Method wajib yang harus diimplementasikan oleh anak class-nya:
  abstract berjalan(): void;

  // Method biasa yang bisa langsung dipakai:
  klakson(): void {
    console.log("Tin tin!");
  }
}

class Mobil extends Kendaraan {
  berjalan(): void {
    console.log(`${this.merk} melaju dengan 4 roda.`);
  }
}
```

---

## 4. Modern Decorators (Stage 3 Standard)

Decorator adalah fungsi yang membungkus dan memodifikasi class, method, atau property.

```typescript
// Contoh Decorator pencatat log durasi eksekusi method:
function LogWaktu(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const methodAsli = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    console.time(propertyKey);
    const hasil = await methodAsli.apply(this, args);
    console.timeEnd(propertyKey);
    return hasil;
  };
}

class DataService {
  @LogWaktu
  async fetchData() {
    // Simulasi delay
    return new Promise(res => setTimeout(res, 500));
  }
}
```
