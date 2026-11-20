---
title: Personal Dev Docs 📖
description: Catatan sintaks praktis, cheatsheet, dan pengingat teknologi harian dengan bahasa santai to-the-point.
template: splash
hero:
  tagline: Dokumentasi & cheatsheet masterclass produksi personal untuk 9 Bahasa Pemrograman (termasuk PHP Modern), 3 UI Frameworks, Terraform IaC, dan 6 Database Modern (PostgreSQL, MySQL, Redis, MongoDB, BigQuery, Bigtable). Lengkap, mendalam, tanpa kulit-kulit doang.
  actions:
    - text: Mulai dari JavaScript
      link: /javascript/01-variables-dan-tipe-data/
      icon: right-arrow
      variant: primary
    - text: Repositori GitHub
      link: https://github.com/exa31/learning-docs
      icon: external
      variant: secondary
---

import { Card, CardGrid } from '@astrojs/starlight/components';

## 🚀 Kategori Dokumentasi & Cheatsheet

<CardGrid stagger>
	<Card title="🟡 JavaScript (9 Modul)" icon="seti:javascript">
		Variabel, Looping, Rest/Spread, Object Destructuring, **Cheatsheet Lengkap Array Methods**, Async/Await, DOM, dan ES Modules.
		<br/>
		[Buka Catatan JavaScript &rarr;](/javascript/01-variables-dan-tipe-data/)
	</Card>
	<Card title="🔷 TypeScript (10 Modul Lengkap)" icon="seti:typescript">
		Basic Types & any/unknown/never, Declaration Merging, 12 Built-in Utility Types, Conditional Types & infer, Mapped Types & Template Literals, Discriminated Unions, Stage-3 Decorators, Zod Runtime Validation, Type-Safe API Client, dan tsconfig strictness.
		<br/>
		[Buka Catatan TypeScript &rarr;](/typescript/01-basic-types-type-inference-dan-any-unknown-never/)
	</Card>
	<Card title="🐍 Python (10 Modul Lengkap)" icon="seti:python">
		Mutability & Reference Semantics, Walrus Operator & Pattern Matching, Positional/Keyword Delimiters (/, *), Dunder Methods & Descriptors, @dataclass slots & Pydantic V2, Generators & Context Managers, Concurrency GIL/Threading/Multiprocessing, Asyncio TaskGroup, Memory PyMalloc & Cyclic GC, serta Protocols & uv/ruff.
		<br/>
		[Buka Catatan Python &rarr;](/python/01-sintaks-dasar-tipe-data-dan-mutability/)
	</Card>
	<Card title="🐘 PHP (10 Modul Lengkap)" icon="seti:php">
		Strict types & Modern Type System (Union, Intersection, DNF), Match expression vs Switch, Named args & First-class callables, Constructor Promotion & Readonly class, First-Class Enums & Traits, Native Attributes & IoC Container Reflection, Zend HashTable internals & Fluent Collections, Composer PSR-4 & classmap-authoritative, PDO ACID & Web Security (Argon2id/CSRF), serta OPcache Preloading, JIT Tracing & FrankenPHP.
		<br/>
		[Buka Catatan PHP &rarr;](/php/01-sintaks-dasar-tipe-data-dan-modern-syntax/)
	</Card>
	<Card title="🐹 Golang (10 Modul Lengkap)" icon="seti:go">
		Sintaks & Mutability, Tagless & Type Switch, Slice 3-word header & Map memory, Pointer & Escape Analysis (-gcflags="-m"), Struct Method Sets & iface/eface internals, GMP Scheduler & Work Stealing, Channel hchan circular buffer & Worker Pools, Sync Primitives & Atomic, Context Tree & Graceful Shutdown, serta Generics & pprof profiling.
		<br/>
		[Buka Catatan Golang &rarr;](/golang/01-sintaks-dasar-dan-tipe-data/)
	</Card>
	<Card title="🦀 Rust (10 Modul Lengkap)" icon="seti:rust">
		Mutability & Shadowing, 3 Aturan Ownership & Borrowing NLL, Struct/Enum Algebraic Data Types, Error handling Result/? & thiserror, Traits static/dynamic dispatch (dyn) & Lifetimes, Smart Pointers Box/Rc/Arc/RefCell, Fearless Concurrency Send/Sync & Scoped Threads, Async Tokio & Futures internals, Declarative/Procedural Macros, serta Unsafe Rust & FFI.
		<br/>
		[Buka Catatan Rust &rarr;](/rust/01-sintaks-dasar-mutability-dan-shadowing/)
	</Card>
	<Card title="🎯 Dart (8 Modul Lengkap)" icon="seti:dart">
		Sound Type System & Null Safety, Collection-if/for & Dart 3 Records, Named parameters & Tear-offs, Mixins & Class Modifiers (sealed/base), Dart 3 Pattern Matching & Switch expressions, Event Loop & Streams, Isolates & Multi-Threading, serta Extension Types (zero-cost) & FFI.
		<br/>
		[Buka Catatan Dart &rarr;](/dart/01-sintaks-dasar-dan-sound-null-safety/)
	</Card>
	<Card title="🟣 Kotlin (10 Modul Lengkap)" icon="seti:kotlin">
		Sintaks & Null Safety, Extension/Infix/Inline functions, Koleksi & Lazy Sequences, Sealed Hierarchy, 5 Scope Functions, Generics Variance (in/out) & Reified, Coroutines deep dive, Reactive Flow/StateFlow, serta kotlinx.serialization & KMP.
		<br/>
		[Buka Catatan Kotlin &rarr;](/kotlin/01-sintaks-dasar-dan-tipe-data/)
	</Card>
	<Card title="🍏 Swift (9 Modul Lengkap)" icon="apple">
		Optionals & Control Flow, Closures & Capture Lists, Struct vs Class & ARC memory leaks, Enums Associated Values state machine, Protocols POP & some vs any, Error handling & Codable, Property Wrappers & Macros, serta Swift 6 Strict Concurrency & Actors.
		<br/>
		[Buka Catatan Swift &rarr;](/swift/01-sintaks-dasar-dan-optionals/)
	</Card>
	<Card title="🎨 Flutter (8 Modul Lengkap)" icon="puzzle">
		Tiga Pohon (Widget, Element, RenderObject), Layout Constraints & Solusi RenderFlex overflowed, Virtualisasi ListView.builder & Slivers canggih, Keys & State Preservation, State Management GetX reaktif & Workers, CustomPainter Canvas 2D, Platform Channels & Pigeon, serta Profiling 120 FPS & RepaintBoundary.
		<br/>
		[Buka Catatan Flutter &rarr;](/flutter/01-widget-tree-element-dan-renderobject/)
	</Card>
	<Card title="📱 Jetpack Compose (9 Modul Lengkap)" icon="android">
		Deklaratif UI & Recomposition skipping, UDF & collectAsStateWithLifecycle, Layouts & Modifier chaining, Lazy Layouts & Paging 3, Side Effects & Lifecycle, Animasi & Shimmer, Material 3 & CompositionLocal, Compiler Stability, serta Type-Safe Navigation 2.8+.
		<br/>
		[Buka Catatan Compose &rarr;](/compose/01-mental-model-dan-recomposition/)
	</Card>
	<Card title="🍎 SwiftUI (8 Modul Lengkap)" icon="apple">
		ViewBuilder & Stacks, State Management modern (@Observable & @Bindable), NavigationStack type-safe & Sheets, Form & @FocusState, Animasi & matchedGeometryEffect hero transitions, Custom ViewModifier & Layout Protocol, SwiftData persistensi, serta Clean MVVM.
		<br/>
		[Buka Catatan SwiftUI &rarr;](/swiftui/01-mental-model-dan-layout/)
	</Card>
	<Card title="☁️ Terraform IaC (6 Modul Lengkap)" icon="seti:terraform">
		Commands & Core Workflow deklaratif, HCL Syntax & Variables validation, Remote State locking S3/DynamoDB & GCS, Reusable Modules & Layout Dev/Prod, Dynamic Blocks & for expressions, serta Import deklaratif 1.5+ & Drift detection.
		<br/>
		[Buka Catatan Terraform &rarr;](/terraform/01-commands-dan-workflow-dasar/)
	</Card>
	<Card title="🐘 PostgreSQL (10 Modul Lengkap)" icon="seti:db">
		DDL/DML & RETURNING sakti, JSONB & GIN indexing, LATERAL Joins & Recursive CTE, MVCC xmin/xmax & FOR UPDATE SKIP LOCKED, EXPLAIN ANALYZE buffers, Declarative Partitioning, pgvector AI RAG & PostGIS, postgresql.conf tuning, VACUUM & Bloat management, serta Logical Replication CDC & PgBouncer.
		<br/>
		[Buka Catatan PostgreSQL &rarr;](/postgresql/01-sintaks-dasar-ddl-dml-dan-tipe-data/)
	</Card>
	<Card title="🐬 MySQL (10 Modul Lengkap)" icon="seti:db">
		Sintaks & DDL/DML, InnoDB internals (Buffer Pool & WAL), Upsert & Recursive CTE, Indexing B+Tree & Covering Index, Deadlock analysis, Stored Procedures & Triggers, User privileges & Roles, my.cnf tuning, Backup PITR, serta Replikasi GTID & ProxySQL.
		<br/>
		[Buka Catatan MySQL &rarr;](/mysql/01-sintaks-dasar-dan-tipe-data/)
	</Card>
	<Card title="🔴 Redis (8 Modul Lengkap)" icon="seti:redis">
		8 Struktur Data lengkap, Pola Caching & 8 Eviction Policies, Pub/Sub & Redis Streams (Kafka-like), Pipelining RTT & Lua Scripting atomik, Memory Internals (embstr, Quicklist, Skiplist), Persistensi RDB/AOF & Hybrid, High Availability Sentinel & 16.384 Hash Slots Cluster, serta Redis 7 Functions & ACL.
		<br/>
		[Buka Catatan Redis &rarr;](/redis/01-data-structures-lengkap-dan-perintah/)
	</Card>
	<Card title="🍃 MongoDB (8 Modul Lengkap)" icon="seti:bicep">
		Dokumen BSON & CRUD operators, Indexing B-Tree & ESR Rule sakti, Aggregation Pipeline lengkap ($match, $group, $lookup, $facet), Desain Skema Embedding vs Referencing & Transaksi ACID, WiredTiger engine internals, Replica Set Oplog & Raft election, Sharding Cluster & Chunk balancing, serta Change Streams reaktif.
		<br/>
		[Buka Catatan MongoDB &rarr;](/mongodb/01-dokumen-dan-crud-dasar/)
	</Card>
	<Card title="📊 Google BigQuery (5 Modul)" icon="seti:chart">
		Serverless Dremel compute & Capacitor storage, GoogleSQL analitik & klausa QUALIFY, Partisi & Clustering hemat 99% biaya, ARRAY/STRUCT, dan BQML.
		<br/>
		[Buka Catatan BigQuery &rarr;](/bigquery/01-arsitektur-dan-konsep-inti/)
	</Card>
	<Card title="⚡ Google Cloud Bigtable (4 Modul)" icon="seti:xml">
		NoSQL Wide-Column sub-10ms latency, Desain Row Key leksikografis anti-hotspot, Server-side RowFilter pipeline, dan Garbage Collection policies.
		<br/>
		[Buka Catatan Bigtable &rarr;](/bigtable/01-arsitektur-dan-konsep-inti/)
	</Card>
</CardGrid>
