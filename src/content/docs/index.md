---
title: Personal Dev Docs 📖
description: Catatan sintaks praktis, cheatsheet, dan pengingat teknologi harian dengan bahasa santai to-the-point.
template: splash
hero:
  tagline: Dokumentasi & cheatsheet praktis pribadi untuk JavaScript, TypeScript, Python, Golang, Rust, Dart, Kotlin, Jetpack Compose, Swift, dan Terraform. Langsung ke intinya tanpa teori bertele-tele.
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
	<Card title="📱 Jetpack Compose (6 Modul)" icon="android">
		Mental Model GetX $\to$ Compose, Recomposition, UDF & StateFlow, Layouts & Modifiers, Lazy Lists & Sticky Headers, Side Effects, dan Navigation Clean Architecture.
		<br/>
		[Buka Catatan Compose &rarr;](/compose/01-mental-model-dan-recomposition/)
	</Card>
	<Card title="🍏 Swift & SwiftUI (6 Modul)" icon="apple">
		Optionals (`guard let`, `if let`), Value vs Reference (Struct vs Class), Enums Associated Values, Extensions, Async/Await, dan **SwiftUI State**.
		<br/>
		[Buka Catatan Swift &rarr;](/swift/01-sintaks-dasar-dan-optionals/)
	</Card>
	<Card title="☁️ Terraform IaC (1 Modul)" icon="seti:terraform">
		5 Perintah wajib alur kerja Terraform: `init` &rarr; `validate` &rarr; `plan` &rarr; `apply` &rarr; `destroy`.
		<br/>
		[Buka Catatan Terraform &rarr;](/terraform/01-commands-dan-workflow/)
	</Card>
</CardGrid>
