---
title: Personal Dev Docs 📖
description: Catatan sintaks praktis, cheatsheet, dan pengingat teknologi harian dengan bahasa santai to-the-point.
template: splash
hero:
  tagline: Dokumentasi & cheatsheet praktis pribadi untuk 8 Bahasa Pemrograman, 3 UI Frameworks, Terraform, dan 6 Database Modern (PostgreSQL, MySQL, Redis, MongoDB, BigQuery, Bigtable). Langsung ke intinya tanpa teori bertele-tele.
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
	<Card title="🔷 TypeScript (5 Modul)" icon="seti:typescript">
		Static Typing, Interface vs Type, Utility Types (`Partial`, `Pick`, `Omit`, `Awaited`), Discriminated Unions, Narrowing, dan Decorator.
		<br/>
		[Buka Catatan TypeScript &rarr;](/typescript/01-basic-types-dan-interface/)
	</Card>
	<Card title="🐍 Python (5 Modul)" icon="seti:python">
		Type Hints, f-strings, List/Dict/Set Comprehension sakti, `*args`/`**kwargs`, generator `yield`, `@dataclass`, dan `asyncio`.
		<br/>
		[Buka Catatan Python &rarr;](/python/01-sintaks-dasar-dan-tipe-data/)
	</Card>
	<Card title="🐹 Golang (6 Modul)" icon="seti:go">
		Short declaration `:=`, slice internals, struct embedding, interface implisit, goroutine & channel, LIFO `defer`, dan `if err != nil`.
		<br/>
		[Buka Catatan Golang &rarr;](/golang/01-sintaks-dasar-dan-tipe-data/)
	</Card>
	<Card title="🦀 Rust (6 Modul)" icon="seti:rust">
		Ownership rules, Move vs Copy, Borrowing `&` vs `&mut`, struct/enum pattern matching, `Option`/`Result` tanda tanya `?`, dan `Arc<Mutex<T>>`.
		<br/>
		[Buka Catatan Rust &rarr;](/rust/01-sintaks-dasar-dan-mutability/)
	</Card>
	<Card title="🎯 Dart (5 Modul)" icon="seti:dart">
		Sound Null Safety (`?`, `!`, `??`), Collection-if/for, Named parameters `{required}`, Mixin `with`, Extension methods, dan Records Dart 3.
		<br/>
		[Buka Catatan Dart &rarr;](/dart/01-sintaks-dasar-dan-null-safety/)
	</Card>
	<Card title="🟣 Kotlin (7 Modul)" icon="seti:kotlin">
		Sintaks dasar, Sound Null Safety (`?.`, `?:`), Lambdas & Infix, Koleksi & Sequence, OOP Data Class & Delegasi, 5 Scope Functions, dan Coroutines & Reactive Flow.
		<br/>
		[Buka Catatan Kotlin &rarr;](/kotlin/01-sintaks-dasar-dan-tipe-data/)
	</Card>
	<Card title="🍏 Swift (6 Modul)" icon="apple">
		Optionals (`guard let`, `if let`), Value vs Reference (Struct vs Class), Enums Associated Values, Extensions, Generics, dan Structured Concurrency (`async`/`await`, `actor`, `Sendable`).
		<br/>
		[Buka Catatan Swift &rarr;](/swift/01-sintaks-dasar-dan-optionals/)
	</Card>
	<Card title="🎨 Flutter (5 Modul)" icon="puzzle">
		Widget Tree & Lifecycle, Layouts Constraints & Overflow, ListView.builder, State Management GetX (`.obs`, `Obx`, `Get.put`), dan Navigation REST API.
		<br/>
		[Buka Catatan Flutter &rarr;](/flutter/01-widget-tree-dan-lifecycle/)
	</Card>
	<Card title="📱 Jetpack Compose (6 Modul)" icon="android">
		Mental Model GetX $\to$ Compose, Recomposition, UDF & StateFlow, Layouts & Modifiers, Lazy Lists & Sticky Headers, Side Effects, dan Navigation Clean Architecture.
		<br/>
		[Buka Catatan Compose &rarr;](/compose/01-mental-model-dan-recomposition/)
	</Card>
	<Card title="🍎 SwiftUI (5 Modul)" icon="apple">
		Deklaratif `View = f(State)`, VStack/HStack/ZStack, `@State`, `@Binding`, modern `@Observable` (iOS 17+), NavigationStack, dan Clean MVVM REST API.
		<br/>
		[Buka Catatan SwiftUI &rarr;](/swiftui/01-mental-model-dan-layout/)
	</Card>
	<Card title="☁️ Terraform IaC (1 Modul)" icon="seti:terraform">
		5 Perintah wajib alur kerja Terraform: `init` &rarr; `validate` &rarr; `plan` &rarr; `apply` &rarr; `destroy`.
		<br/>
		[Buka Catatan Terraform &rarr;](/terraform/01-commands-dan-workflow/)
	</Card>
	<Card title="🐘 PostgreSQL (5 Modul)" icon="seti:db">
		Tipe data canggih, JSONB & GIN indexing, CTE recursive, Window functions, Transaksi ACID & Isolation Level, serta EXPLAIN ANALYZE tuning.
		<br/>
		[Buka Catatan PostgreSQL &rarr;](/postgresql/01-sintaks-dasar-dan-tipe-data/)
	</Card>
	<Card title="🐬 MySQL (10 Modul Lengkap)" icon="seti:db">
		Sintaks & DDL/DML, InnoDB internals (Buffer Pool & WAL), Upsert & Recursive CTE, Indexing B+Tree & Covering Index, Deadlock analysis, Stored Procedures & Triggers, User privileges & Roles, my.cnf tuning, Backup PITR, serta Replikasi GTID & ProxySQL.
		<br/>
		[Buka Catatan MySQL &rarr;](/mysql/01-sintaks-dasar-dan-tipe-data/)
	</Card>
	<Card title="🔴 Redis (5 Modul)" icon="seti:redis">
		8 Struktur Data lengkap, Pola Caching & TTL Eviction, Pub/Sub & Streams persisten, Transaksi MULTI/EXEC & Scripting Lua, serta Sentinel & Cluster.
		<br/>
		[Buka Catatan Redis &rarr;](/redis/01-data-structures-lengkap/)
	</Card>
	<Card title="🍃 MongoDB (4 Modul)" icon="seti:bicep">
		BSON & CRUD operators, Indexing B-Tree & ESR Rule sakti, Aggregation Pipeline lengkap ($match, $group, $lookup, $facet), dan Transaksi ACID.
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
