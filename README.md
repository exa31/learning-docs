# 📚 Personal Dev Docs & Cheatsheets (Astro Starlight)

Buku saku sintaks dan dokumentasi teknis pribadi harian berbasis **Astro Starlight** (`@astrojs/starlight: ^0.43.1`). Didesain khusus untuk mencari dan mengingat kembali konsep bahasa pemrograman, framework UI, cloud IaC, dan sistem database modern (JavaScript, TypeScript, Python, PHP, Golang, Rust, Dart, Kotlin, Swift, Flutter, Jetpack Compose, SwiftUI, Terraform, PostgreSQL, MySQL, Redis, MongoDB, BigQuery, Bigtable) secara instan, to-the-point, dan aplikatif.

---

## 🚀 Menjalankan Web Dokumentasi Lokal

```bash
# 1. Jalankan development server:
npm run dev

# Web otomatis aktif di:
# 👉 http://localhost:4321
```

Perintah lain:
- `npm run build`: Kompilasi static site ke `dist/` (164 halaman + Pagefind search index).
- `npm run preview`: Preview lokal hasil build produksi.

---

## 🧭 Peta Modul Dokumentasi Lengkap (19 Tech Stacks & Databases — 162 Modul)

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

### 🔷 [TypeScript (10 Modul Masterclass)](file:///Users/macbookair/learning/src/content/docs/typescript/01-basic-types-type-inference-dan-any-unknown-never.md)
1. `01. Basic Types, Inference & Top/Bottom Types` (Primitif, type inference, `any` vs `unknown` vs `never`, type assertions `as`).
2. `02. Interface vs Type Alias & Declaration Merging` (`interface` vs `type`, declaration merging express/window, index signatures).
3. `03. Generics, Constraints & Built-in Utility Types` (Generic functions/classes, `extends` constraint, `Partial`, `Pick`, `Omit`, `Record`, `Awaited`).
4. `04. Advanced Conditional Types & infer` (Ternary types `T extends U ? X : Y`, keyword `infer`, unwrap Promise/Array, recursive types).
5. `05. Mapped Types, keyof & Template Literal Types` (`keyof`, mapped types `[K in keyof T]`, homomorphic mapping, template literal types).
6. `06. Type Narrowing, Custom Guards & Discriminated Unions` (`typeof`/`instanceof`/`in`, user-defined type guards `is`, discriminated union exhaustiveness).
7. `07. Classes, Modifiers & Stage 3 Decorators` (Parameter properties, `#private` vs `private`, abstract class, TC39 Stage 3 decorators modern).
8. `08. Runtime Validation dengan Zod` (Schema definition, `z.infer`, safeParse, custom refinements, error formatting).
9. `09. Type-Safe API Client & Result Pattern` (Generic fetch wrapper, typed query params & body, RFC 7807 error handling, Result/Either type).
10. `10. Strict tsconfig, .d.ts Declarations & Monorepo` (`noImplicitAny`, `strictNullChecks`, ambient declarations `.d.ts`, Project References).

### 🐍 [Python (10 Modul Masterclass)](file:///Users/macbookair/learning/src/content/docs/python/01-sintaks-dasar-tipe-data-dan-mutability.md)
1. `01. Sintaks Dasar, Tipe Data & Mutability` (Primitif, string interning, mutability trap, copy shallow vs deep).
2. `02. Kontrol Alur, Comprehensions & Pattern Matching` (walrus operator `:=`, list/dict/set comprehension, structural pattern matching `match-case`).
3. `03. Fungsi, *args/**kwargs, Closures & Decorators` (First-class functions, closures `nonlocal`, parameterized decorators, functools.wraps).
4. `04. OOP, Dunder Methods & Descriptors` (Dunder methods `__str__`/`__repr__`/`__getitem__`, `@property`, descriptor protocol `__get__`/`__set__`).
5. `05. Dataclasses, Pydantic V2 & Modern Type Hints` (`@dataclass(slots=True)`, Pydantic `BaseModel`, `Field`, custom validator).
6. `06. Generators, Iterators & Context Managers` (Iterator protocol `__iter__`/`__next__`, `yield` generator, contextlib `@contextmanager`).
7. `07. Concurrency: GIL, Threading & Multiprocessing` (Global Interpreter Lock GIL, I/O-bound `ThreadPoolExecutor`, CPU-bound `ProcessPoolExecutor`).
8. `08. Asyncio: Event Loop, TaskGroup & Networking` (Event loop, `async`/`await`, Python 3.11+ `TaskGroup`, `asyncio.gather`, aiohttp client).
9. `09. Memory Management & Garbage Collection` (CPython reference counting, cyclic garbage collector `gc`, memory leaks & `sys.getrefcount`).
10. `10. Metaclasses, Protocols (Structural Typing) & Modern Tooling` (`type` metaclass, `typing.Protocol` duck typing, modern tooling uv/ruff/mypy).

### 🐘 [PHP (10 Modul Masterclass)](file:///Users/macbookair/learning/src/content/docs/php/01-sintaks-dasar-tipe-data-dan-modern-syntax.md)
1. `01. Sintaks Dasar, Type System Modern & Operator PHP 8.x` (`strict_types=1`, Union/Intersection/DNF types, type juggling traps, spaceship `<=>`, nullsafe `?->`, `??=`).
2. `02. Control Flow, Match Expression & Error Handling Modern` (`match` expression vs `switch`, jebakan `foreach` by-reference, `Throwable` hierarchy, multi-catch).
3. `03. Fungsi, Closures, Arrow Functions & Generators` (Named arguments, first-class callables `f(...)`, variadic `...`, closures `use`, memory streaming `yield`).
4. `04. OOP Modern: Constructor Promotion, Readonly & Magic Methods` (Constructor property promotion, `readonly class`, typed constants, `final`, 12 magic methods).
5. `05. Traits, Interfaces & First-Class Enums (PHP 8.1+)` (Multiple interfaces, trait collision `insteadof`/`as`, Pure vs Backed Enums, enum methods & pattern matching).
6. `06. Attributes, Reflection API & Dependency Injection Container` (Native `#[Attribute]`, runtime Reflection inspection, pembuatan IoC Container auto-wiring dari nol).
7. `07. Array Internals (Zend HashTable) & Modern Collections` (Zend HashTable C struct, array destructuring, spread `...` string keys, cheatsheet fungsi array, Fluent Collection).
8. `08. Composer, Autoloading PSR-4 & Standar PSR Modern` (Composer SemVer, PSR-4 autoloader, PSR-7/PSR-15 middleware pipeline, `composer dump-autoload --classmap-authoritative`).
9. `09. Database PDO, Transaksi ACID & Web Security Wajib` (PDO native prepared statements, transaksi ACID, XSS protection, CSRF `hash_equals`, password hashing Argon2id, secure cookies).
10. `10. OPcache, JIT Compiler, PHP-FPM & Modern Runtimes` (Zend VM lifecycle, OPcache tuning & preloading, JIT Tracing, PHP-FPM static pooling, FrankenPHP worker mode).

### 🐹 [Golang (10 Modul Masterclass)](file:///Users/macbookair/learning/src/content/docs/golang/01-sintaks-dasar-dan-tipe-data.md)
1. `01. Sintaks Dasar, Variabel & Tipe Data` (`package main`, `var` vs `:=`, zero values, `iota`, custom types).
2. `02. Control Flow & Fungsi` (if with short statement, for loop variants, switch tanpa break, multiple return values, named returns).
3. `03. Slice, Map & Memory Internals` (Slice header struct, capacity doubling growth, map hash table buckets, comma-ok idiom).
4. `04. Pointer & Escape Analysis` (Pointer `*` vs `&`, Stack vs Heap allocation, compiler escape analysis `-gcflags="-m"`).
5. `05. Struct, Method & Interface Internals` (Struct embedding komposisi, value vs pointer receiver, interface internals `iface` & `eface`).
6. `06. GMP Scheduler & Goroutine Internals` (Goroutine 2KB stack growth, M:N scheduler GMP Model, work stealing, sysmon).
7. `07. Channel Internals & Concurrency Patterns` (Channel `hchan` circular ring buffer, unbuffered vs buffered, Worker Pool, Fan-Out Fan-In, Or-Done).
8. `08. Sync Primitives & Atomic Operations` (`sync.Mutex` vs `RWMutex`, `sync.WaitGroup`, `sync.Once`, `sync.Pool`, `sync/atomic`).
9. `09. Context, Cancellation & Modern Error Handling` (`context.WithTimeout`/`WithCancel`, `errors.Is`/`As`, error wrapping `%w`, `defer`/`panic`/`recover`).
10. `10. Generics, Benchmarking & Profiling (pprof)` (Generics type parameters, constraints, `testing.B` benchmark, `pprof` CPU & heap analysis).

### 🦀 [Rust (10 Modul Masterclass)](file:///Users/macbookair/learning/src/content/docs/rust/01-sintaks-dasar-mutability-dan-shadowing.md)
1. `01. Sintaks Dasar, Mutability & Shadowing` (`let` immutable vs `let mut`, variable shadowing, scalar & compound types, const vs static).
2. `02. Ownership, Borrowing & Slices` (3 Rules of Ownership, Move semantics vs Copy trait, Borrowing rules `&` vs `&mut`, String vs `&str`).
3. `03. Struct, Enum & Advanced Pattern Matching` (Struct types, enum with data, exhaustive `match`, guard clause `if`, `if let`, `while let`).
4. `04. Error Handling: Option, Result & thiserror/anyhow` (`Option<T>`, `Result<T, E>`, operator `?`, domain errors `thiserror`, app errors `anyhow`).
5. `05. Traits, Generics & Advanced Lifetimes` (Traits & default impl, trait bounds, orphan rule, lifetime annotations `'a`, subtyping, static dispatch).
6. `06. Smart Pointers & Interior Mutability` (`Box<T>`, `Rc<T>`, `Arc<T>`, `RefCell<T>` runtime borrow checking, interior mutability pattern).
7. `07. Multithreading, Mutex & Crossbeam` (`thread::spawn`, `move` closures, `Arc<Mutex<T>>`, channels `mpsc`, scoped threads `std::thread::scope`).
8. `08. Async/Await, Tokio & Futures` (Future trait & polling model, Tokio runtime, `async`/`await`, `tokio::spawn`, `tokio::select!`).
9. `09. Macros: Declarative & Procedural` (Declarative macros `macro_rules!`, procedural macros derive/attribute/function-like, syn & quote).
10. `10. Unsafe Rust, FFI & Performance Tuning` (5 Superpowers unsafe, raw pointers, external C FFI, inline assembly, zero-cost abstractions).

### 🎯 [Dart (8 Modul Masterclass)](file:///Users/macbookair/learning/src/content/docs/dart/01-sintaks-dasar-dan-sound-null-safety.md)
1. `01. Sintaks Dasar & Sound Null Safety` (`var`/`final`/`const`, Sound Null Safety `?`/`!`/`??`/`?.`, `late`, flow analysis).
2. `02. Koleksi, Spread Operator & Records (Dart 3)` (List, Set, Map, collection-if, collection-for, spread `...`/`...?`, Records & destructuring).
3. `03. Fungsi, Named Parameters & Closures` (First-class functions, required/optional named params, closures & lexical scope).
4. `04. OOP, Mixin, Interface & Extensions` (Constructors, mixins `with`, implicit interfaces, extension methods).
5. `05. Dart 3 Pattern Matching & Exhaustiveness` (Pattern types, switch expressions, destructuring tuples/objects, sealed class exhaustiveness).
6. `06. Asynchronous: Future, Stream & Zones` (`Future`, `Stream` single vs broadcast, `async`/`await`, `async*`/`yield`, error handling di Zones).
7. `07. Isolates & Concurrency Internals` (Actor model, Isolate memory isolation, SendPort/ReceivePort, `Isolate.run` helper).
8. `08. Extension Types, FFI & Code Generation` (Dart 3.3 Extension Types, `dart:ffi` C-interop, build_runner & code generation).

### 🟣 [Kotlin (10 Modul Lengkap)](file:///Users/macbookair/learning/src/content/docs/kotlin/01-sintaks-dasar-dan-tipe-data.md)
1. `01. Sintaks Dasar, Variabel & Tipe Data` (`val` vs `var`, `Unit` vs `Nothing`, Smart Cast `is`, safe cast `as?`, looping range `..`/`until`/`downTo`, ekspresi `when`).
2. `02. Null Safety & Operator Spesial` (Sound Null Safety `?`, Safe call `?.`, Elvis `?:` guard return, assertion `!!`, `filterNotNull()`, Java platform types `T!`).
3. `03. Fitur Fungsi, Lambdas & Inline Optimization` (Default & named args, `vararg` & spread `*`, extension functions, `infix`, `tailrec`, `inline`/`noinline`/`crossinline`).
4. `04. Koleksi, Transformasi & Lazy Sequences` (Read-only vs Mutable, `partition`, `groupBy` vs `associateBy`, `flatMap`, `sumOf`/`fold`, vertical traversal `Sequence`).
5. `05. OOP, Sealed Hierarchy & Properti Delegasi` (`data class` & destructuring, `sealed interface` state machine, companion object, `by lazy`, `Delegates.observable`).
6. `06. Cheatsheet 5 Scope Functions & Idiom Kotlin` (Matriks komparasi `apply`, `also`, `let`, `run`, `with`, `this` vs `it`, flowchart pemilih).
7. `07. Generics, Variance (in/out) & Reified Types` (Type constraints, Covariance `out` vs Contravariance `in` PECS, Type Erasure JVM, `inline fun <reified T>`).
8. `08. Coroutines Deep Dive & Structured Concurrency` (CPS state machine, Dispatchers Main/IO/Default, `launch` vs `async`/`await`, `ensureActive()`, `SupervisorJob`, `Mutex`).
9. `09. Reactive Flow, StateFlow & SharedFlow` (Cold Stream `flow`, `flowOn`, `debounce`, backpressure `buffer`/`conflate`, Hot `StateFlow` UI & `SharedFlow` events).
10. `10. kotlinx.serialization & Fondasi KMP` (`@Serializable`, polymorphic sealed serialization, filosofi KMP share logic keep UI native, `expect`/`actual`).

### 🍏 [Swift (9 Modul Lengkap)](file:///Users/macbookair/learning/src/content/docs/swift/01-sintaks-dasar-dan-optionals.md)
1. `01. Sintaks Dasar & Optionals Terlengkap` (`let` vs `var`, string interpolation, Optional enum di balik layar, `guard let` vs `if let`, nil-coalescing `??`).
2. `02. Koleksi, Control Flow & Pola Defer` (Array, Set unik Hashable, Dictionary optional return, ranges, `for-in` enumerated, switch pattern matching, LIFO `defer`).
3. `03. Fungsi, Closures & Memory Capture Lists` (Argument labels, `inout` reference, closures `$0`/`$1`, trailing closures, escaping closures `@escaping`, capture list `[weak self]`).
4. `04. Struct, Class & Manajemen Memori ARC` (Value Types Struct Stack vs Reference Types Class Heap, Copy-on-Write CoW, `mutating`, ARC reference counting, `weak` vs `unowned`).
5. `05. Enums, Associated Values & State Machines` (First-class enum, Raw Values vs Associated Values memodelkan status UI, `CaseIterable`, recursive `indirect enum`).
6. `06. Protocols, Generics & Opaque Types (some vs any)` (Protocol-Oriented Programming POP, default implementation extensions, generics, `some View` vs `any Protocol`).
7. `07. Error Handling, Result Type & Codable JSON` (Custom `LocalizedError`, `throws`/`do-catch`, `try?`, enum `Result`, protokol `Codable`, `CodingKeys`).
8. `08. Property Wrappers & Swift 5.9+ Macros` (Anatomi `@propertyWrapper`, `wrappedValue`, projected value `$`, Swift Macros compile-time `#Preview`, revolusi `@Observable`).
9. `09. Swift 6 Concurrency, Actors & AsyncStream` (Compile-Time Data Race Safety, `async`/`await`, `async let`, `TaskGroup`, proteksi data race via `actor`, `@MainActor`, `AsyncStream`).

### 🎨 [Flutter (8 Modul Masterclass)](file:///Users/macbookair/learning/src/content/docs/flutter/01-widget-tree-element-dan-renderobject.md)
1. `01. Widget Tree, Element Tree & RenderObject` (3 Trees architecture, `StatelessWidget` vs `StatefulWidget`, lifecycle, BuildContext).
2. `02. Layout Constraints & Solusi RenderFlex Overflow` (Constraints go down sizes go up parent sets position, Unbounded constraints, BoxConstraints).
3. `03. Scrollable Views & Advanced Slivers` (ListView/GridView builder, CustomScrollView, `SliverAppBar`, `SliverPersistentHeader`, `SliverList`).
4. `04. Keys & State Preservation` (ValueKey, ObjectKey, UniqueKey, `GlobalKey`, State preservation saat reordering).
5. `05. State Management: GetX & Komparasi Modern` (GetX `.obs` reaktif, `GetxController`, `Obx`, DI `Get.put`, komparasi Riverpod vs Bloc).
6. `06. CustomPainter & Low-Level Canvas Drawing` (CustomPainter paint & shouldRepaint, Canvas drawPath/drawCircle, linear gradients, performance).
7. `07. Platform Channels & Pigeon Native Interop` (MethodChannel, EventChannel streaming, type-safe code generator `pigeon` Kotlin/Swift).
8. `08. Performance Profiling, DevTools & RepaintBoundary` (Flutter DevTools timeline, junk frames 60/120fps, `RepaintBoundary`, `const` constructors).

### 📱 [Jetpack Compose (9 Modul Lengkap)](file:///Users/macbookair/learning/src/content/docs/compose/01-mental-model-dan-recomposition.md)
1. `01. Mental Model, Siklus Hidup & Recomposition` (Deklaratif `UI = f(State)`, `@Composable`, Smart Recomposition skipping, `remember` vs `rememberSaveable`).
2. `02. State Management, ViewModel & UDF` (Unidirectional Data Flow UDF, State Hoisting stateless vs stateful, `collectAsStateWithLifecycle()`, ViewModel StateFlow).
3. `03. Layouts, Modifiers & Scaffold Material 3` (Container `Column`/`Row`/`Box`, Alignment vs Arrangement, urutan modifier chaining, `Modifier.weight`, `Scaffold`).
4. `04. Lazy Layouts, Sticky Headers & Paging 3` (Pengganti RecyclerView `LazyColumn`/`LazyRow`, parameter `key`, `stickyHeader`, `LazyListState`, AndroidX Paging 3).
5. `05. Side Effects & Lifecycle Awareness` (5 handlers: `LaunchedEffect`, `rememberCoroutineScope`, `DisposableEffect`, `rememberUpdatedState`, `LifecycleEventEffect`).
6. `06. Animasi & Gestures Lengkap` (`animate*AsState`, `AnimatedVisibility`, `AnimatedContent`, Shimmer Loading skeleton, `pointerInput`).
7. `07. Theming Material 3 & CompositionLocal` (Pilar M3 Color/Typography/Shapes, Dynamic Colors Material You, `CompositionLocalProvider`).
8. `08. Optimasi Kinerja, Stability & derivedStateOf` (Stability Compiler `@Stable` & `@Immutable`, bahaya Unstable `List<T>`, `derivedStateOf`, lambda offset modifier).
9. `09. Navigation Type-Safe 2.8+ & Clean Architecture` (Navigation Compose 2.8+ rute `@Serializable` tanpa URL string, `toRoute()`, Route Screen Content pattern).

### 🍎 [SwiftUI (8 Modul Lengkap)](file:///Users/macbookair/learning/src/content/docs/swiftui/01-mental-model-dan-layout.md)
1. `01. Mental Model, ViewBuilder & Tata Letak Dasar` (Deklaratif `UI = f(State)`, mengapa view adalah `struct`, container `VStack`/`HStack`/`ZStack`, modifier chaining).
2. `02. State Management Modern (@Observable vs Legacy)` (Framework Observation iOS 17 `@Observable` & `@Bindable`, `@State` lokal, two-way binding `$`, `@Environment`).
3. `03. List, NavigationStack Modern & Modals` (List `Identifiable`, swipe actions, pull-to-refresh, `NavigationStack` type-safe iOS 16+, `presentationDetents` sheet).
4. `04. Form, Input Controls & Manajemen Fokus Keyboard` (Formulir via `Form` & `Section`, Picker/Toggle/DatePicker, manajemen kursor via `@FocusState`).
5. `05. Animasi, Transisi & matchedGeometryEffect` (Animasi eksplisit `withAnimation`, transisi asimetris, efek hero zoom via `.matchedGeometryEffect`).
6. `06. Custom Modifiers, GeometryReader & Layout Protocol` (`ViewModifier` kustom, `GeometryReader`, `PreferenceKey`, `Layout` protocol FlowLayout).
7. `07. SwiftData & Persistensi Lokal Modern` (Pengganti Core Data: macro `@Model`, kueri reaktif `@Query`, CRUD `ModelContext`, filter `#Predicate`).
8. `08. Arsitektur Clean MVVM, REST API & #Preview` (Struktur Clean MVVM, networking `URLSession` async/await, enum `ViewState`, Canvas `#Preview` mock service).

### ☁️ [Terraform IaC (6 Modul Masterclass)](file:///Users/macbookair/learning/src/content/docs/terraform/01-commands-dan-workflow-dasar.md)
1. `01. Commands & Core Workflow` (`init`, `validate`, `plan`, `apply`, `destroy`, fmt, taint/replace, target flag).
2. `02. HCL Syntax, Variables & Outputs` (Tipe variabel primitives & structural, validation blocks, local values, sensitive outputs).
3. `03. Remote State, Locking & S3/GCS Backends` (Remote state S3 + DynamoDB locking, GCS backend, state inspection `state list`/`show`, split state isolation).
4. `04. Modules & Reusability` (Module creation, input/output contracts, module sourcing Git/Registry/Local, best practices).
5. `05. Dynamic Blocks, For Expressions & Splat` (`count` vs `for_each`, dynamic nested blocks, list/map comprehension, splat operator `[*]`).
6. `06. State Management, Import, Drift & CI/CD` (`terraform import` & `import {}` block HCL modern, drift detection, state manipulation `mv`/`rm`, secure CI/CD pipeline).

### 🐘 [PostgreSQL (10 Modul Masterclass)](file:///Users/macbookair/learning/src/content/docs/postgresql/01-sintaks-dasar-ddl-dml-dan-tipe-data.md)
1. `01. Sintaks Dasar, DDL, DML & Tipe Data` (DDL & DML, `TEXT` vs `VARCHAR`, `TIMESTAMPTZ`, `UUID`, `BOOLEAN`, `RETURNING`, `UPSERT ON CONFLICT`).
2. `02. JSONB Internals, Indexing & Operator` (`JSON` vs `JSONB`, decomposed binary format, GIN index jsonb_path_ops, jsonpath querying).
3. `03. Joins, Recursive CTE & Window Functions` (Nested Loop / Hash / Merge Join, CTE hierarkis `WITH RECURSIVE`, Window functions `ROW_NUMBER`/`LEAD`/`LAG`).
4. `04. Transaksi, MVCC & Locking Internals` (ACID, 4 Isolation levels, MVCC xmin/xmax tuple visibility, row-level locks `FOR UPDATE` / `SKIP LOCKED`).
5. `05. EXPLAIN ANALYZE & Query Optimization` (`EXPLAIN (ANALYZE, BUFFERS)`, Seq Scan vs Index Scan vs Bitmap Scan, buffer cache hits, cost model).
6. `06. Declarative Table Partitioning` (Range, List, and Hash partitioning, partition pruning, maintenance table bloat prevention).
7. `07. Ekstensi: pgvector, PostGIS & citext` (Vector embeddings pgvector HNSW/IVFFlat cosine similarity, spatial GIS queries PostGIS, case-insensitive text).
8. `08. Performance Tuning: postgresql.conf` (Tuning `shared_buffers`, `work_mem`, `effective_cache_size`, `wal_buffers`, checkpoint tuning).
9. `09. Vacuum, Autovacuum & Bloat Management` (Dead tuples, MVCC cleanup, table & index bloat calculation, `pg_repack` zero-downtime compaction).
10. `10. Logical Replication, CDC & PgBouncer` (WAL levels, publication/subscription logical replication, Debezium CDC, PgBouncer transaction pooling).

### 🐬 [MySQL (10 Modul Lengkap)](file:///Users/macbookair/learning/src/content/docs/mysql/01-sintaks-dasar-dan-tipe-data.md)
1. `01. Sintaks Dasar, DDL, DML & Tipe Data` (DDL, DML, DECIMAL vs FLOAT, DATETIME vs TIMESTAMP, kolom JSON, Generated Columns).
2. `02. Storage Engines & Arsitektur Internal InnoDB` (InnoDB vs MyISAM, Buffer Pool LRU, Redo Log WAL, Undo Log MVCC, Doublewrite Buffer, Crash Recovery).
3. `03. DML Lanjutan, Window Functions & CTE` (Upsert `ON DUPLICATE KEY UPDATE`, Recursive CTE hierarki breadcrumb, Window Functions `ROW_NUMBER`, `DENSE_RANK`, `LAG`, `LEAD`).
4. `04. Indexing Mendalam & Optimasi Query` (Clustered vs Secondary B+Tree, Covering Index `Using index`, Leftmost Prefix Rule, FTS, Functional Index, `EXPLAIN ANALYZE`).
5. `05. Transaksi, Locking & Analisis Deadlock` (ACID, 4 Tingkat Isolasi, Record/Gap/Next-Key Lock anti Phantom Read, deteksi deadlock `SHOW ENGINE INNODB STATUS`).
6. `06. Stored Procedures, Functions, Triggers & Views` (Stored Procedures `DELIMITER //`, Handler SQLEXCEPTION, UDF Functions, Triggers Audit Trail Log `OLD`/`NEW`, Views `WITH CHECK OPTION`).
7. `07. Manajemen User, Privileges & Keamanan` (Format `'user'@'host'`, Least Privilege matrix, Roles MySQL 8.0, enforce SSL/TLS, Zero-Downtime Password Rotation).
8. `08. Performance Tuning & Konfigurasi my.cnf` (Tuning Buffer Pool 70-80% RAM, `innodb_flush_log_at_trx_commit` 0/1/2, `O_DIRECT`, Slow Query Log).
9. `09. Backup, Restore & Point-in-Time Recovery (PITR)` (`mysqldump` `--single-transaction`, multi-threaded `mydumper`, penyelamatan bencana via `mysqlbinlog`).
10. `10. Replikasi, High Availability & ProxySQL` (Replikasi GTID format ROW, Asynchronous vs Semi-synchronous, split Read/Write via ProxySQL, Vitess Sharding).

### 🔴 [Redis (8 Modul Masterclass)](file:///Users/macbookair/learning/src/content/docs/redis/01-data-structures-lengkap-dan-perintah.md)
1. `01. Data Structures Lengkap & Perintah` (Strings, Hashes, Lists, Sets, Sorted Sets, Bitmaps, HyperLogLog, Geospatial, Streams).
2. `02. Caching Patterns, Eviction & TTL` (Cache-Aside, Write-Through, Write-Back, 8 eviction policies, cache stampede prevention via probabilistic early expiration).
3. `03. Pub/Sub & Redis Streams` (Pub/Sub fire-and-forget vs Redis Streams persistent, consumer groups `XREADGROUP`, acknowledgment `XACK`, pending claim `XAUTOCLAIM`).
4. `04. Transaksi, Pipelining & Lua Scripting` (Network latency RTT pipelining, `MULTI`/`EXEC`/`WATCH`, atomic Lua scripts `EVALSHA`, distributed lock Redlock).
5. `05. Memory Internals: Ziplist, Quicklist & Skiplist` (Raw encoding vs compact encoding, quicklist, skiplist O(log N) sorted set, memory optimization tricks).
6. `06. Persistensi: RDB, AOF & Hybrid` (RDB snapshot fork copy-on-write, AOF fsync policies `appendfsync`, background rewrite, hybrid persistence).
7. `07. Redis Sentinel & Cluster Sharding` (Sentinel automated failover quorum, Redis Cluster 16,384 hash slots, MOVED & ASK redirections, resharding).
8. `08. Redis 7 Functions, Security & ACL` (Redis 7 functions persistence over Lua, fine-grained ACL users & keys permissions, TLS encryption, latency doctor).

### 🍃 [MongoDB (8 Modul Masterclass)](file:///Users/macbookair/learning/src/content/docs/mongodb/01-dokumen-dan-crud-dasar.md)
1. `01. Dokumen, BSON & CRUD Dasar` (BSON format, 12-byte ObjectId anatomy, write concerns `w: "majority"`, read concerns, atomic document updates).
2. `02. Indexing Mendalam & ESR Rule` (B-Tree index internals, Equality-Sort-Range ESR rule, Multikey array indexing, TTL indexes, Partial indexes, `executionStats`).
3. `03. Aggregation Pipeline Lengkap` (Multi-stage data processing `$match`, `$group`, `$project`, `$unwind`, `$lookup` subquery join, `$facet` pagination).
4. `04. Transaksi ACID & Desain Skema Produksi` (1-to-1, 1-to-N embedding vs referencing, anti-unbounded 16MB array pattern, multi-document ACID transactions).
5. `05. WiredTiger Storage Engine Internals` (WiredTiger architecture, in-memory cache eviction, Snappy compression, write-ahead journaling checkpointing).
6. `06. Replica Set: Elections, Oplog & HA` (Primary-Secondary-Arbiter architecture, Raft-like election algorithm, local oplog replication stream, write/read concerns).
7. `07. Sharding: Architecture, Chunk Splitting & Balancer` (Mongos router, Config Server replica set, Shard cluster, Range vs Hashed shard key, jumbo chunk mitigation).
8. `08. Change Streams & MongoDB Administration` (Real-time Change Streams on oplog, server status metrics, index maintenance, mongodump/mongorestore backup).

### 📊 [Google BigQuery (5 Modul)](file:///Users/macbookair/learning/src/content/docs/bigquery/01-arsitektur-dan-konsep-inti.md)
1. `01. Arsitektur & Konsep Inti` (Pemisahan compute Dremel & storage Capacitor via Jupiter Network, hierarki Project/Dataset/Table, billing On-Demand vs Editions).
2. `02. SQL Analitik & Window Functions` (GoogleSQL, `ROW_NUMBER`/`LEAD`/`LAG`, klausa sakti `QUALIFY`, `SELECT * EXCEPT/REPLACE`, `APPROX_COUNT_DISTINCT`, UDF).
3. `03. Partisi & Clustering` (Partitioned Tables by date/timestamp, partition pruning, Clustered Tables, kombinasi pangkas 99% biaya query).
4. `04. Nested & Repeated Fields (STRUCT & ARRAY)` (Denormalisasi dokumen, `STRUCT` object & `ARRAY` list, pembongkaran dengan `UNNEST()`, `ARRAY_AGG()`).
5. `05. Optimasi Biaya & Best Practices` (Aturan hemat biaya, `bq query --dry_run`, Materialized Views & smart rewriting, BI Engine cache, BigQuery ML).

### ⚡ [Google Cloud Bigtable (4 Modul)](file:///Users/macbookair/learning/src/content/docs/bigtable/01-arsitektur-dan-konsep-inti.md)
1. `01. Arsitektur & Model Data Inti` (NoSQL Wide-Column sub-10ms latency, Peta multidimensi terurut, Tablet servers & Colossus SSTables, auto-split).
2. `02. Desain Row Key Sakti (Anti-Hotspot)` (Pengurutan leksikografis ASCII, bahaya hotspotting, delimiter `#`, salting, Reverse Timestamp untuk data sensor).
3. `03. Operasi Read, Write & Filters` (Single row write `MutateRow`, batch `ApplyBulk`, range scan, server-side `RowFilter` pipeline, atomik `CheckAndMutate`).
4. `04. Garbage Collection, Monitoring & Matriks Keputusan` (GC policies per family, Key Visualizer 2D heatmap diagnostik, matriks Bigtable vs BigQuery vs Spanner vs Firestore).

---

## 📂 Struktur Direktori Proyek

```text
learning/
├── Dockerfile                             # Multi-stage build (Node 22 -> Nginx Alpine ~25MB)
├── nginx.conf                             # Konfigurasi Nginx produksi (gzip, healthz, caching)
├── package.json                           # Scripts (dev, build, preview) & dependencies
├── astro.config.mjs                       # Konfigurasi Astro Starlight & autogenerate sidebar
│
├── src/content/docs/                      # 📖 Sumber Markdown Dokumentasi (162 Modul)
│   ├── index.md                           # Landing page portal
│   ├── javascript/                        # 9 modul JS
│   ├── typescript/                        # 10 modul TS (Masterclass)
│   ├── python/                            # 10 modul Python (Masterclass)
│   ├── php/                               # 10 modul PHP (Masterclass)
│   ├── golang/                            # 10 modul Go (Masterclass)
│   ├── rust/                              # 10 modul Rust (Masterclass)
│   ├── dart/                              # 8 modul Dart (Masterclass)
│   ├── kotlin/                            # 10 modul Kotlin (Masterclass)
│   ├── swift/                             # 9 modul Swift (Masterclass)
│   ├── flutter/                           # 8 modul Flutter (Masterclass)
│   ├── compose/                           # 9 modul Jetpack Compose (Masterclass)
│   ├── swiftui/                           # 8 modul SwiftUI (Masterclass)
│   ├── terraform/                         # 6 modul Terraform (Masterclass)
│   ├── postgresql/                        # 10 modul PostgreSQL (Masterclass)
│   ├── mysql/                             # 10 modul MySQL (Masterclass)
│   ├── redis/                             # 8 modul Redis (Masterclass)
│   ├── mongodb/                           # 8 modul MongoDB (Masterclass)
│   ├── bigquery/                          # 5 modul Google BigQuery
│   └── bigtable/                          # 4 modul Google Cloud Bigtable
│
├── javascript -> src/content/docs/javascript # Symlink cepat di root
├── typescript -> src/content/docs/typescript # Symlink cepat di root
├── python -> src/content/docs/python         # Symlink cepat di root
├── php -> src/content/docs/php               # Symlink cepat di root
├── golang -> src/content/docs/golang         # Symlink cepat di root
├── rust -> src/content/docs/rust             # Symlink cepat di root
├── dart -> src/content/docs/dart             # Symlink cepat di root
├── kotlin -> src/content/docs/kotlin         # Symlink cepat di root
├── swift -> src/content/docs/swift           # Symlink cepat di root
├── flutter -> src/content/docs/flutter       # Symlink cepat di root
├── compose -> src/content/docs/compose       # Symlink cepat di root
├── swiftui -> src/content/docs/swiftui       # Symlink cepat di root
├── terraform -> src/content/docs/terraform   # Symlink cepat di root
├── postgresql -> src/content/docs/postgresql # Symlink cepat di root
├── mysql -> src/content/docs/mysql           # Symlink cepat di root
├── redis -> src/content/docs/redis           # Symlink cepat di root
├── mongodb -> src/content/docs/mongodb       # Symlink cepat di root
├── bigquery -> src/content/docs/bigquery     # Symlink cepat di root
└── bigtable -> src/content/docs/bigtable     # Symlink cepat di root
```
