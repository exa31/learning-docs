# 📚 Personal Dev Docs & Cheatsheets (Astro Starlight)

Buku saku sintaks dan dokumentasi teknis pribadi harian berbasis **Astro Starlight** (`@astrojs/starlight: ^0.43.1`). Didesain khusus untuk mencari dan mengingat kembali konsep bahasa pemrograman (JavaScript, TypeScript, Python, Golang, Rust, Dart, Kotlin, Swift, Terraform) secara instan, to-the-point, dan aplikatif.

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

## 🧭 Peta Modul Dokumentasi Lengkap (9 Tech Stacks)

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

### 🟣 [Kotlin & Jetpack Compose (8 Modul)](file:///Users/macbookair/learning/src/content/docs/kotlin/01-sintaks-dasar-dan-tipe-data.md)
1. `01. Sintaks Dasar & Tipe Data` (`val` vs `var`, `Unit` vs `Nothing`, string template `${ekspresi}`, multiline `"""`, Smart Cast `is`, safe cast `as?`, looping range).
2. `02. Null Safety & Operator Khusus` (Sound Null Safety `?`, Safe call `?.`, Elvis `?:` untuk fallback & early return, bahaya `!!`, `filterNotNull()`, safe unwrapping `?.let`).
3. `03. Fitur Fungsi & Lambdas` (Single expression, default & named arguments, `vararg` & spread `*`, extension functions, `infix`, `tailrec`, trailing lambda & `it`, `inline fun`).
4. `04. Koleksi & Sequence` (List/Set/Map read-only vs mutable, transformasi `map`/`filter`/`flatMap`/`partition`, `groupBy` & `associateBy`, `sumOf`/`fold`, optimasi lazy `Sequence`).
5. `05. OOP, Data Class, & Delegasi` (Primary constructor, `lateinit var`, `data class` & `.copy()`, singleton `object` & `companion`, `sealed class`/`sealed interface` exhaustive `when`, properti delegasi `by lazy`).
6. `06. Cheatsheet Scope Functions` (Matriks 5 fungsi: `apply`, `also`, `let`, `run`, `with`, perbedaan `this` vs `it`, context object vs lambda result, rumus cepat pemilih).
7. `07. Coroutines & Flow` (`suspend fun`, `Dispatchers` Main/IO/Default, `withContext`, `launch` vs `async`/`await`, `supervisorScope`, Reactive Cold Stream `Flow`, `StateFlow` vs `SharedFlow`).
8. `08. Jetpack Compose & Arsitektur (Gaya GetX)` (Kamus GetX $\to$ Compose, Recomposition, `_private MutableStateFlow` vs `public StateFlow`, `remember` vs `rememberSaveable`, layout `Column`/`Row`/`LazyColumn`, struktur Clean Architecture).

### 🍏 [Swift & SwiftUI (6 Modul)](file:///Users/macbookair/learning/src/content/docs/swift/01-sintaks-dasar-dan-optionals.md)
1. `01. Sintaks Dasar & Optionals` (`let` vs `var`, string interpolation, Optional `?`, unwrapping via `guard let`, `if let`, nil-coalescing `??`).
2. `02. Koleksi & Control Flow` (Array, Set unik, Dictionary optional return, range `1...5` vs `0..<5`, switch pattern matching tuples/where, pembersihan `defer`).
3. `03. Fungsi & Closures` (Argument labels `_` & external/internal, `inout` reference, closures expression syntax, shorthand `$0`/`$1`, trailing closures, `@escaping`, memory leak `[weak self]`).
4. `04. Struct, Class, dan Enum` (Value type Struct vs Reference type Class, keyword `mutating`, ARC & `weak`, Enums Associated Values status network, CaseIterable).
5. `05. Protocols, Extension, & Generics` (POP Protocol-Oriented Programming, default implementation extension, retroactive modeling tipe bawaan `Int`/`String`, Generics `<T>`, protocol `Codable` & `Identifiable`).
6. `06. Concurrency & SwiftUI State` (Modern `async`/`await`, `Task`, `actor` bebas data-race, `@MainActor`, arsitektur SwiftUI deklaratif, state management `@State`, `@Binding`, `@Observable`).

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
│   ├── kotlin/                            # 8 modul Kotlin
│   ├── swift/                             # 6 modul Swift & SwiftUI
│   └── terraform/                         # 1 modul Terraform
│
├── javascript -> src/content/docs/javascript # Symlink cepat di root
├── typescript -> src/content/docs/typescript # Symlink cepat di root
├── python -> src/content/docs/python         # Symlink cepat di root
├── golang -> src/content/docs/golang         # Symlink cepat di root
├── rust -> src/content/docs/rust             # Symlink cepat di root
├── dart -> src/content/docs/dart             # Symlink cepat di root
├── kotlin -> src/content/docs/kotlin         # Symlink cepat di root
├── swift -> src/content/docs/swift           # Symlink cepat di root
└── terraform -> src/content/docs/terraform   # Symlink cepat di root
```
