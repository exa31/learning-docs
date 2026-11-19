---
title: Personal Dev Docs 📖
description: Catatan sintaks praktis, cheatsheet, dan pengingat teknologi harian dengan bahasa santai to-the-point.
template: splash
hero:
  tagline: Dokumentasi & cheatsheet praktis pribadi untuk JavaScript, TypeScript, Kotlin, dan Terraform. Langsung ke intinya tanpa teori bertele-tele.
  actions:
    - text: Mulai dari JavaScript
      link: /javascript/01-variables-dan-tipe-data/
      icon: right-arrow
      variant: primary
    - text: Lihat Semua di GitHub / Folder
      link: /typescript/01-basic-types-dan-interface/
      icon: external
      variant: secondary
---

import { Card, CardGrid } from '@astrojs/starlight/components';

## 🚀 Kategori Dokumentasi

<CardGrid stagger>
	<Card title="🟡 JavaScript" icon="seti:javascript">
		Variabel, Looping, Rest/Spread, Object Destructuring, **Cheatsheet Lengkap Array Methods**, dan Async/Await.
		<br/>
		[Buka Catatan JavaScript &rarr;](/javascript/01-variables-dan-tipe-data/)
	</Card>
	<Card title="🔷 TypeScript" icon="seti:typescript">
		Static Typing, Interface vs Type, Utility Types (`Partial`, `Pick`, `Omit`, `Awaited`), Generic Fetcher, dan type-safe catch error.
		<br/>
		[Buka Catatan TypeScript &rarr;](/typescript/01-basic-types-dan-interface/)
	</Card>
	<Card title="🟣 Kotlin & Jetpack Compose" icon="seti:kotlin">
		Sintaks keren (extension, infix, tailrec, lambda, inline fun), OOP (data class, singleton, by lazy), dan **Compose mental model GetX**.
		<br/>
		[Buka Catatan Kotlin &rarr;](/kotlin/01-syntax-dasar-dan-fungsi/)
	</Card>
	<Card title="☁️ Terraform (IaC)" icon="seti:terraform">
		5 Perintah wajib alur kerja Terraform: `init` &rarr; `validate` &rarr; `plan` &rarr; `apply` &rarr; `destroy`.
		<br/>
		[Buka Catatan Terraform &rarr;](/terraform/01-commands-dan-workflow/)
	</Card>
</CardGrid>
