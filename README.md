# 📚 Personal Dev Docs & Cheatsheets (Astro Starlight)

Buku saku sintaks dan dokumentasi teknis pribadi harian berbasis **Astro Starlight** (`@astrojs/starlight: ^0.43.1`). Didesain khusus untuk mencari dan mengingat kembali konsep bahasa pemrograman, framework UI, cloud IaC, dan sistem database modern (JavaScript, TypeScript, Python, Golang, Rust, Dart, Kotlin, Swift, Flutter, Jetpack Compose, SwiftUI, Terraform, PostgreSQL, MySQL, Redis, MongoDB, BigQuery, Bigtable) secara instan, to-the-point, dan aplikatif.

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

## 🧭 Peta Modul Dokumentasi Lengkap (18 Tech Stacks & Databases)

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

### 🟣 [Kotlin (7 Modul)](file:///Users/macbookair/learning/src/content/docs/kotlin/01-sintaks-dasar-dan-tipe-data.md)
1. `01. Sintaks Dasar & Tipe Data` (`val` vs `var`, `Unit` vs `Nothing`, string template `${ekspresi}`, multiline `"""`, Smart Cast `is`, safe cast `as?`, looping range).
2. `02. Null Safety & Operator Khusus` (Sound Null Safety `?`, Safe call `?.`, Elvis `?:` untuk fallback & early return, bahaya `!!`, `filterNotNull()`, safe unwrapping `?.let`).
3. `03. Fitur Fungsi & Lambdas` (Single expression, default & named arguments, `vararg` & spread `*`, extension functions, `infix`, `tailrec`, trailing lambda & `it`, `inline fun`).
4. `04. Koleksi & Sequence` (List/Set/Map read-only vs mutable, transformasi `map`/`filter`/`flatMap`/`partition`, `groupBy` & `associateBy`, `sumOf`/`fold`, optimasi lazy `Sequence`).
5. `05. OOP, Data Class, & Delegasi` (Primary constructor, `lateinit var`, `data class` & `.copy()`, singleton `object` & `companion`, `sealed class`/`sealed interface` exhaustive `when`, properti delegasi `by lazy`).
6. `06. Cheatsheet Scope Functions` (Matriks 5 fungsi: `apply`, `also`, `let`, `run`, `with`, perbedaan `this` vs `it`, context object vs lambda result, rumus cepat pemilih).
7. `07. Coroutines & Flow` (`suspend fun`, `Dispatchers` Main/IO/Default, `withContext`, `launch` vs `async`/`await`, `supervisorScope`, Reactive Cold Stream `Flow`, `StateFlow` vs `SharedFlow`).

### 🍏 [Swift (6 Modul)](file:///Users/macbookair/learning/src/content/docs/swift/01-sintaks-dasar-dan-optionals.md)
1. `01. Sintaks Dasar & Optionals` (`let` vs `var`, string interpolation, Optional `?`, unwrapping via `guard let`, `if let`, nil-coalescing `??`).
2. `02. Koleksi & Control Flow` (Array, Set unik, Dictionary optional return, range `1...5` vs `0..<5`, switch pattern matching tuples/where, pembersihan `defer`).
3. `03. Fungsi & Closures` (Argument labels `_` & external/internal, `inout` reference, closures expression syntax, shorthand `$0`/`$1`, trailing closures, `@escaping`, memory leak `[weak self]`).
4. `04. Struct, Class, dan Enum` (Value type Struct vs Reference type Class, keyword `mutating`, ARC & `weak`, Enums Associated Values status network, CaseIterable).
5. `05. Protocols, Extension, & Generics` (POP Protocol-Oriented Programming, default implementation extension, retroactive modeling tipe bawaan `Int`/`String`, Generics `<T>`, protocol `Codable` & `Identifiable`).
6. `06. Concurrency & Actors` (Modern `async`/`await`, `Task`, `async let`, `withTaskGroup`, `actor` bebas data-race, `@MainActor`, protokol `Sendable`).

### 🎨 [Flutter (5 Modul)](file:///Users/macbookair/learning/src/content/docs/flutter/01-widget-tree-dan-lifecycle.md)
1. `01. Widget Tree & Lifecycle` (Everything is a Widget, `StatelessWidget` vs `StatefulWidget`, State Lifecycle `initState`/`build`/`dispose`, Hot Reload vs Hot Restart).
2. `02. Layouts & Constraints` (Layout containers `Column`/`Row`/`Stack`, `Container` vs `SizedBox`, `Expanded` vs `Flexible`, solusi error `RenderFlex overflowed`).
3. `03. Scrollable Views & Lists` (Pengganti RecyclerView: `ListView.builder`, `GridView.builder`, `RefreshIndicator` pull-to-refresh, `ScrollController` infinite scroll).
4. `04. State Management (GetX)` (Reaktivitas `.obs` & `GetxController`, `Obx(() => ...)`, Dependency Injection `Get.put()`/`Get.find()`, Workers `debounce`/`ever`).
5. `05. Navigation & REST API` (Navigasi tanpa BuildContext `Get.to()`/`Get.back()`, dialog/snackbar instan, integrasi REST API dengan `http`, Clean Architecture layout).

### 📱 [Jetpack Compose (6 Modul)](file:///Users/macbookair/learning/src/content/docs/compose/01-mental-model-dan-recomposition.md)
1. `01. Mental Model & Recomposition` (Kamus padanan GetX $\to$ Compose, deklaratif `UI = f(State)`, Recomposition skipping, `remember` vs `rememberSaveable`).
2. `02. State Management & ViewModel` (Unidirectional Data Flow UDF & State Hoisting, `_private MutableStateFlow` vs `public StateFlow`, `collectAsStateWithLifecycle()`, `sealed interface UiState`).
3. `03. Layouts & Modifiers` (Container `Column`/`Row`/`Box`/`Scaffold`, hukum urutan modifier chaining, Alignment vs Arrangement, `Spacer` & `weight`).
4. `04. Lazy Layouts & Lists` (Pengganti RecyclerView: `LazyColumn`/`LazyRow`/`LazyVerticalGrid`, stable key `items(key = ...)`, sticky headers, pagination infinite scroll).
5. `05. Side Effects & Lifecycle` (Kapan butuh effect, `LaunchedEffect`, `rememberCoroutineScope`, `DisposableEffect`, handling one-off events Snackbar & navigasi).
6. `06. Navigation & Arsitektur` (Compose Navigation modern `NavHost`, argument passing, type-safe navigation, DI Koin/Hilt, arsitektur Clean Architecture presentation layer).

### 🍎 [SwiftUI (5 Modul)](file:///Users/macbookair/learning/src/content/docs/swiftui/01-mental-model-dan-layout.md)
1. `01. Mental Model & Layouts` (Deklaratif `UI = f(State)`, View Builder `some View`, container `VStack`/`HStack`/`ZStack`, hukum urutan modifier chaining, `.frame()`).
2. `02. State Management` (`@State` private local, `@Binding` dua arah dengan `$`, modern macro `@Observable` Swift 5.9+ / iOS 17+, `@Environment` konteks global).
3. `03. List & Navigation` (Pengganti TableView: `List` & `ForEach` `Identifiable`, `NavigationStack` modern iOS 16+, type-safe `.navigationDestination(for:)`, `.searchable()`).
4. `04. Lifecycle & Modal Effects` (Async `.task`, `.onAppear`/`.onDisappear`, `.onChange` reaktif, pop-up Sheet modal, Alert dialog).
5. `05. Arsitektur MVVM & REST API` (Clean Architecture MVVM, `@Observable` ViewModel, REST API async/await dengan URLSession, mock data `#Preview`).

### ☁️ [Terraform IaC (1 Modul)](file:///Users/macbookair/learning/src/content/docs/terraform/01-commands-dan-workflow.md)
1. `01. Perintah Inti & Alur Kerja` (5 Perintah wajib: `init` $\to$ `validate` $\to$ `plan` $\to$ `apply` $\to$ `destroy`, `-auto-approve`, fungsi file `terraform.tfstate`).

### 🐘 [PostgreSQL (5 Modul)](file:///Users/macbookair/learning/src/content/docs/postgresql/01-sintaks-dasar-dan-tipe-data.md)
1. `01. Sintaks Dasar & Tipe Data` (`TEXT` vs `VARCHAR`, `TIMESTAMPTZ`, `UUID`, `BOOLEAN`, DDL/DML, `RETURNING`, `UPSERT ON CONFLICT`).
2. `02. JSONB & Indexing Canggih` (`JSON` vs `JSONB`, operator `->`/`->>`/`@>`, B-Tree vs Hash vs GIN vs GiST vs BRIN, Partial & Expression Index).
3. `03. Joins, Subqueries & CTE` (Inner/Left/Right/Full/Cross JOIN, CTE `WITH`, Recursive CTE hierarki parent-child, Window Functions `OVER()`).
4. `04. Transaksi & Concurrency Control` (ACID, 4 Tingkat Isolasi ANSI, MVCC snapshot, Explicit Row-Level Locking `FOR UPDATE`).
5. `05. Analisis Performa & Administrasi` (`EXPLAIN ANALYZE`, Sequential vs Index Scan, autovacuum & bloat, `pg_stat_statements`, connection pooling PgBouncer).

### 🐬 [MySQL (10 Modul Lengkap)](file:///Users/macbookair/learning/src/content/docs/mysql/01-sintaks-dasar-dan-tipe-data.md)
1. `01. Sintaks Dasar, DDL, DML & Tipe Data` (DDL, DML, perbandingan tipe data lengkap DECIMAL vs FLOAT, DATETIME vs TIMESTAMP, kolom JSON, Generated Columns).
2. `02. Storage Engines & Arsitektur Internal InnoDB` (InnoDB vs MyISAM vs Memory, Buffer Pool LRU, Redo Log WAL, Undo Log MVCC, Doublewrite Buffer, Crash Recovery).
3. `03. DML Lanjutan, Window Functions & CTE` (Upsert `ON DUPLICATE KEY UPDATE`, Recursive CTE hierarki breadcrumb, Window Functions `ROW_NUMBER`, `DENSE_RANK`, `LAG`, `LEAD`).
4. `04. Indexing Mendalam & Optimasi Query` (Clustered vs Secondary B+Tree, Covering Index `Using index`, Leftmost Prefix Rule, FTS, Functional Index, `EXPLAIN ANALYZE`).
5. `05. Transaksi, Locking & Analisis Deadlock` (ACID, 4 Tingkat Isolasi, Record/Gap/Next-Key Lock anti Phantom Read, deteksi deadlock `SHOW ENGINE INNODB STATUS`, pola pencegahan di kode).
6. `06. Stored Procedures, Functions, Triggers & Views` (Stored Procedures dengan `DELIMITER //`, Handler SQLEXCEPTION, UDF Functions, Triggers Audit Trail Log `OLD`/`NEW`, Views `WITH CHECK OPTION`).
7. `07. Manajemen User, Privileges & Keamanan` (Format `'user'@'host'`, Least Privilege matrix, Roles MySQL 8.0, enforce SSL/TLS, Zero-Downtime Password Rotation Dual Passwords).
8. `08. Performance Tuning & Konfigurasi my.cnf` (Tuning Buffer Pool 70-80% RAM, `innodb_flush_log_at_trx_commit` 0/1/2, `O_DIRECT`, Slow Query Log & `mysqldumpslow`/`pt-query-digest`).
9. `09. Backup, Restore & Point-in-Time Recovery (PITR)` (`mysqldump` standar produksi non-locking `--single-transaction`, multi-threaded `mydumper`, penyelamatan bencana via `mysqlbinlog`).
10. `10. Replikasi, High Availability & ProxySQL` (Replikasi GTID format ROW, Asynchronous vs Semi-synchronous, split Read/Write otomatis via ProxySQL port 6033, Vitess Sharding).

### 🔴 [Redis (5 Modul)](file:///Users/macbookair/learning/src/content/docs/redis/01-data-structures-lengkap.md)
1. `01. Struktur Data Lengkap & Perintah` (8 Struktur data: Strings, Hashes, Lists, Sets, Sorted Sets, Bitmaps, HyperLogLog, Streams).
2. `02. Pola Caching & TTL Eviction` (Cache-Aside, Write-Through, Write-Back, 8 Kebijakan Eviction `maxmemory-policy`, antisipasi Cache Stampede).
3. `03. Pub/Sub & Redis Streams` (Pub/Sub ephemeral vs Redis Streams persisten, consumer groups `XREADGROUP`, acknowledgement `XACK`, claim pending `XAUTOCLAIM`).
4. `04. Transaksi, Pipelining & Scripting Lua` (Pipelining RTT, `MULTI`/`EXEC`/`WATCH`, atomic Lua scripting `EVAL`/`EVALSHA`, distributed lock Redlock).
5. `05. Persistensi, Sentinel & Clustering` (RDB vs AOF vs Hybrid, Redis Sentinel automated failover, Redis Cluster 16.384 hash slots).

### 🍃 [MongoDB (4 Modul)](file:///Users/macbookair/learning/src/content/docs/mongodb/01-dokumen-dan-crud-dasar.md)
1. `01. Dokumen, BSON & CRUD Dasar` (BSON vs JSON, anatomi 12-byte ObjectId, `insertOne`/`insertMany`, operator perbandingan & array, `$set`/`$inc`/`$push`).
2. `02. Indexing & Analisis Performa` (Single/Compound index, aturan sakti ESR Equality-Sort-Range, Multikey, TTL index auto-delete, `explain("executionStats")`).
3. `03. Aggregation Pipeline Lengkap` (Pipeline stages: `$match`, `$project`, `$group`, `$unwind`, `$lookup` SQL JOIN, `$facet` multi-query paginasi).
4. `04. Transaksi ACID & Desain Skema` (Embedding vs Referencing, aturan anti-unbounded array 16MB, transaksi multi-dokumen `withTransaction`, Replica Set & Sharding).

### 📊 [Google BigQuery (5 Modul)](file:///Users/macbookair/learning/src/content/docs/bigquery/01-arsitektur-dan-konsep-inti.md)
1. `01. Arsitektur & Konsep Inti` (Pemisahan compute Dremel & storage Capacitor via Jupiter Network, hierarki Project/Dataset/Table, model billing On-Demand vs Editions).
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
├── src/content/docs/                      # 📖 Sumber Markdown Dokumentasi (101 Modul)
│   ├── index.md                           # Landing page portal
│   ├── javascript/                        # 9 modul JS
│   ├── typescript/                        # 5 modul TS
│   ├── python/                            # 5 modul Python
│   ├── golang/                            # 6 modul Go
│   ├── rust/                              # 6 modul Rust
│   ├── dart/                              # 5 modul Dart
│   ├── kotlin/                            # 7 modul Kotlin (Core)
│   ├── swift/                             # 6 modul Swift (Core)
│   ├── flutter/                           # 5 modul Flutter (Cross-Platform UI)
│   ├── compose/                           # 6 modul Jetpack Compose (Android UI)
│   ├── swiftui/                           # 5 modul SwiftUI (iOS & Apple UI)
│   ├── terraform/                         # 1 modul Terraform (IaC)
│   ├── postgresql/                        # 5 modul PostgreSQL
│   ├── mysql/                             # 10 modul MySQL (Lengkap)
│   ├── redis/                             # 5 modul Redis
│   ├── mongodb/                           # 4 modul MongoDB
│   ├── bigquery/                          # 5 modul Google BigQuery
│   └── bigtable/                          # 4 modul Google Cloud Bigtable
│
├── javascript -> src/content/docs/javascript # Symlink cepat di root
├── typescript -> src/content/docs/typescript # Symlink cepat di root
├── python -> src/content/docs/python         # Symlink cepat di root
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
