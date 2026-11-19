# 📚 Personal Dev Docs & Cheatsheets (Astro Starlight)

Buku saku sintaks dan dokumentasi teknis pribadi harian berbasis **Astro Starlight** (`@astrojs/starlight: ^0.43.1`). Didesain khusus untuk mencari dan mengingat kembali konsep bahasa pemrograman (JavaScript, TypeScript, Python, Golang, Rust, Dart, Kotlin, Terraform) secara instan, to-the-point, dan aplikatif.

---

## 🚀 Menjalankan Web Dokumentasi Lokal

```bash
# 1. Jalankan development server:
npm run dev

# Web otomatis aktif di:
# 👉 http://localhost:4321
```

Perintah lain:
- `npm run build`: Kompilasi static site ke `dist/` (42 halaman + Pagefind search index).
- `npm run preview`: Preview lokal hasil build produksi.

---

## 🧭 Peta Modul Dokumentasi Lengkap (8 Tech Stacks)

### 🟡 [JavaScript (9 Modul)](file:///Users/macbookair/learning/src/content/docs/javascript/01-variables-dan-tipe-data.md)
1. `01. Variabel & Tipe Data` (`const`, `let`, `var`, primitif vs reference, template literals, type casting).
2. `02. Operator & Logika Kondisi` (`===` vs `==`, optional chaining `?.`, nullish `??`, ternary, `switch-case`).
3. `03. Looping & Label` (`for...of`, `for...in`, `for` klasik, `while`, `do...while`, label loop).
4. `04. Fungsi & Timers` (arrow single expression, default param, rest param `...`, `setTimeout`, `setInterval`).
5. `05. Array Methods Lengkap` (Semua method array ditandai tegas **Immutable** vs **Mutating**).
6. `06. Objek & Destructuring` (destructuring object/array, spread `...`, `Object.keys/values/entries`).
7. `07. Async / Await & Promises` (`async`, `await`, error handling `fetch`, `Promise.all` vs `allSettled`, looping async).
8. `08. DOM & Event Handling` (`querySelector`, event delegation, preventDefault, classList, dataset).
9. `09. ES Modules & Web Storage` (import/export named & default, localStorage vs sessionStorage).

### 🔷 [TypeScript (5 Modul)](file:///Users/macbookair/learning/src/content/docs/typescript/01-basic-types-dan-interface.md)
1. `01. Tipe Dasar & Interface` (primitif, tuple, `void`, `unknown`, `interface` vs `type`, union, optional `?`, `readonly`).
2. `02. Generics & Utility Types` (Generic `<T>`, `Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record`, `Awaited`).
3. `03. Async & Error Handling` (`Promise<T>`, `catch(err: unknown)`, generic API fetcher, perangkap wajib `return await`).
4. `04. Advanced Types & Narrowing` (Discriminated unions, custom type guard `is`, `keyof`, `typeof`, conditional & mapped types).
5. `05. Classes & Decorators` (Parameter properties, `private` vs `#private`, abstract class, stage 3 decorators).

### 🐍 [Python (5 Modul)](file:///Users/macbookair/learning/src/content/docs/python/01-sintaks-dasar-dan-tipe-data.md)
1. `01. Sintaks Dasar & Koleksi Data` (Type hints, f-strings, list, tuple, set himpunan, dict, unpacking `*`).
2. `02. Kontrol Alur & Comprehension` (if-elif-else, match-case Python 3.10, list/dict/set comprehension sakti).
3. `03. Fungsi, Decorator & Generator` (`*args`, `**kwargs`, bahaya mutable default arg, generator `yield`, decorator `@`).
4. `04. OOP & Data Classes` (class, `__init__`, dunder methods, `@property` getter/setter, `@dataclass` model).
5. `05. Asyncio & Error Handling` (try-except-else-finally, context manager `with`, `async`/`await`, `asyncio.gather`).

### 🐹 [Golang (6 Modul)](file:///Users/macbookair/learning/src/content/docs/golang/01-sintaks-dasar-dan-tipe-data.md)
1. `01. Sintaks Dasar & Tipe Data` (`package main`, `var` vs `:=`, zero values, konstanta & `iota`, casting tipe).
2. `02. Control Flow & Fungsi` (if short statement, for sebagai while, switch tanpa break, multiple return values).
3. `03. Slice, Map & Pointer` (Pointer `&` vs `*`, slice `make`/`append`, map comma-ok idiom).
4. `04. Struct, Method & Interface` (struct embedding komposisi, value vs pointer receiver, interface implisit).
5. `05. Goroutine, Channel & Concurrency` (goroutine `go`, channel buffered/unbuffered, `select`, `sync.WaitGroup`).
6. `06. Error Handling, Defer & Panic` (idiom `if err != nil`, LIFO `defer`, `panic` & `recover`).

### 🦀 [Rust (6 Modul)](file:///Users/macbookair/learning/src/content/docs/rust/01-sintaks-dasar-dan-mutability.md)
1. `01. Sintaks Dasar & Mutability` (`fn main`, `let` immutable vs `let mut`, variable shadowing, scalar & compound types).
2. `02. Ownership, Borrowing & Slices` (3 Aturan Ownership, Move vs Copy, Borrowing `&` vs `&mut`, `String` vs `&str`).
3. `03. Struct, Enum & Pattern Matching` (struct & `impl`, enum dengan data, exhaustive `match`, `if let`).
4. `04. Error Handling (Option & Result)` (tidak ada null di Rust, `Option<T>`, `Result<T, E>`, operator tanda tanya `?`).
5. `05. Traits, Generics & Lifetimes` (generics `<T>`, trait kontrak, trait bounds, konsep lifetime `'a`).
6. `06. Concurrency & Threads` (`thread::spawn` dengan `move`, channels `mpsc`, shared state `Arc<Mutex<T>>`).

### 🎯 [Dart (5 Modul)](file:///Users/macbookair/learning/src/content/docs/dart/01-sintaks-dasar-dan-null-safety.md)
1. `01. Sintaks Dasar & Null Safety` (`var`/`final`/`const`, Sound Null Safety `?`/`!`/`??`, `late`, string interpolasi).
2. `02. Koleksi & Collection Operators` (List/Set/Map, collection-if, collection-for, spread `...` dan `...?`).
3. `03. Fungsi & Parameter` (Arrow `=>`, Named parameters `{required}` Flutter style, anonymous function).
4. `04. OOP, Mixin & Extension` (Constructor `this.prop`, named constructor, mixin `with`, extension methods).
5. `05. Async, Stream & Fitur Dart 3` (`Future`, `Stream` reaktif, Records tuple Dart 3, switch expression).

### 🟣 [Kotlin & Jetpack Compose (3 Modul)](file:///Users/macbookair/learning/src/content/docs/kotlin/01-syntax-dasar-dan-fungsi.md)
1. `01. Sintaks Dasar & Fitur Fungsi` (`Unit`, single-expression, `vararg`, extension function + `$this`, `infix`, `tailrec`, lambda & `it`, `inline fun`, `suspend fun`).
2. `02. OOP & Class Features` (`lateinit var`, `data class` + `.copy()`, destructuring, singleton `object` vs `companion object`, delegation `by`, `by lazy`, observable properties).
3. `03. Jetpack Compose & Arsitektur (Gaya GetX)` (Kamus GetX $\to$ Compose, Recomposition, `_private MutableStateFlow` vs `public StateFlow`, layout `Column`/`Row`/`Box`/`LazyColumn`, struktur Clean Architecture).

### ☁️ [Terraform IaC (1 Modul)](file:///Users/macbookair/learning/src/content/docs/terraform/01-commands-dan-workflow.md)
1. `01. Perintah Inti & Alur Kerja` (5 Perintah wajib: `init` $\to$ `validate` $\to$ `plan` $\to$ `apply` $\to$ `destroy`, `-auto-approve`, fungsi file `terraform.tfstate`).

---

## 📂 Struktur Direktori Proyek

```text
learning/
├── Dockerfile                             # Multi-stage build (Node 22 -> Nginx Alpine ~25MB)
├── nginx.conf                             # Konfigurasi Nginx produksi (gzip, healthz, caching)
├── package.json                           # Scripts (dev, build, preview) & dependencies
├── astro.config.mjs                       # Konfigurasi Astro Starlight & autogenerate sidebar
│
├── src/content/docs/                      # 📖 Sumber Markdown Dokumentasi
│   ├── index.md                           # Landing page portal
│   ├── javascript/                        # 9 modul JS
│   ├── typescript/                        # 5 modul TS
│   ├── python/                            # 5 modul Python
│   ├── golang/                            # 6 modul Go
│   ├── rust/                              # 6 modul Rust
│   ├── dart/                              # 5 modul Dart
│   ├── kotlin/                            # 3 modul Kotlin
│   └── terraform/                         # 1 modul Terraform
│
├── javascript -> src/content/docs/javascript # Symlink cepat di root
├── typescript -> src/content/docs/typescript # Symlink cepat di root
├── python -> src/content/docs/python         # Symlink cepat di root
├── golang -> src/content/docs/golang         # Symlink cepat di root
├── rust -> src/content/docs/rust             # Symlink cepat di root
├── dart -> src/content/docs/dart             # Symlink cepat di root
├── kotlin -> src/content/docs/kotlin         # Symlink cepat di root
└── terraform -> src/content/docs/terraform   # Symlink cepat di root
```
