---
title: "10. tsconfig.json Strictness, .d.ts & Monorepo Project References"
description: Anatomi tsconfig.json produksi, bedah opsi strict compiler flags, penulisan declaration files (.d.ts), path aliases, dan Project References di TypeScript.
---

# 🔷 TypeScript - Modul 10: tsconfig.json Strictness, .d.ts & Monorepo Project References

`tsconfig.json` adalah pusat komando kompilator TypeScript. Memahami bendera (*flags*) kompilator yang tepat dapat mengubah TypeScript dari sekadar linter opsional menjadi benteng sistematis yang mencegah bug di skala enterprise.

---

## 1. Konfigurasi Produksi Modern (`tsconfig.json`)

Berikut konfigurasi standar emas untuk aplikasi modern berbasis bundler (Vite, Astro, Next.js):

```json
{
  "compilerOptions": {
    /* Target Lingkungan & Modul */
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    
    /* Kebijakan Ketat (Strict Mode) */
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    
    /* Emit & Kompilasi */
    "noEmit": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    
    /* Path Aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"]
    }
  },
  "include": ["src/**/*"]
}
```

---

## 2. Bedah 3 Flag Strict Paling Krusial

### 1. `"noUncheckedIndexedAccess": true` (Paling Direkomendasikan!)
Secara default saat mengakses array atau objek via index, TypeScript menganggap elemen **selalu ada**:
```typescript
const daftar = ["apel", "jeruk"];
const item = daftar[10]; // Tanpa flag: tipe 'string' (Padahal runtime bernilai undefined!)

// Dengan noUncheckedIndexedAccess: true:
// Tipe otomatis di-infer sebagai: string | undefined
// Kamu dipaksa melakukan pengecekan 'if (item)' sebelum mengaksesnya!
```

### 2. `"exactOptionalPropertyTypes": true`
Mencegah kerancuan antara field yang tidak ada vs field yang sengaja diisi `undefined`:
```typescript
interface Konfigurasi {
    timeout?: number;
}

// Dengan flag ini diaktifkan:
// const c: Konfigurasi = { timeout: undefined }; // COMPILE ERROR!
// 'timeout' hanya boleh berupa number atau tidak didefinisikan sama sekali.
```

### 3. `"verbatimModuleSyntax": true` (TS 5.0+)
Menegakkan pemisahan tegas antara import tipe data vs import kode runtime:
```typescript
// Wajib menggunakan kata kunci 'type' eksplisit:
import type { UserDTO } from "./types";
import { formatTanggal } from "./utils";
```

---

## 3. Menulis File Deklarasi Tipe (`.d.ts`)

File `.d.ts` hanya berisi informasi tipe (*ambient declarations*) tanpa kode JavaScript executable. Digunakan saat:
1. Mendistribusikan pustaka npm.
2. Memberikan tipe data pada library JavaScript lama yang tidak punya `@types/`.

### Contoh Mengetik Pustaka Pihak Ketiga Manual:
```typescript
// src/types/legacy-payment.d.ts
declare module "legacy-payment-sdk" {
    export interface PaymentConfig {
        apiKey: string;
        sandbox?: boolean;
    }

    export function init(config: PaymentConfig): void;
    export function charge(amount: number): Promise<{ success: boolean; id: string }>;
}
```

Sekarang kamu bisa melakukan `import { init, charge } from "legacy-payment-sdk"` dengan autocompletion dan type checking penuh!

---

## 4. Skalabilitas Monorepo: TypeScript Project References

Pada monorepo besar dengan banyak package (misal: `packages/ui`, `packages/core`, `apps/web`), menjalankan satu `tsc` raksasa akan sangat lambat.

Gunakan **Project References** untuk kompilasi bertahap (*incremental builds*):

### A. Sub-package (`packages/core/tsconfig.json`):
```json
{
  "compilerOptions": {
    "composite": true,       // Wajib true untuk Project References!
    "declaration": true,
    "declarationMap": true,
    "rootDir": "src",
    "outDir": "dist"
  }
}
```

### B. Root Monorepo (`tsconfig.json`):
```json
{
  "files": [],
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/ui" },
    { "path": "./apps/web" }
  ]
}
```

Jalankan kompilasi super cepat berbasis cache dependency graph dengan:
```bash
tsc --build --verbose
```
Hanya sub-project yang kodenya berubah yang akan di-recompile!
