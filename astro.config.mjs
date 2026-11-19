import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Dev Cheatsheets 📖',
      description: 'Catatan & cheatsheet sintaks praktis pribadi lintas tech-stack',
      sidebar: [
        {
          label: '🟡 JavaScript',
          items: [{ autogenerate: { directory: 'javascript' } }],
        },
        {
          label: '🔷 TypeScript',
          items: [{ autogenerate: { directory: 'typescript' } }],
        },
        {
          label: '🐍 Python',
          items: [{ autogenerate: { directory: 'python' } }],
        },
        {
          label: '🐹 Golang',
          items: [{ autogenerate: { directory: 'golang' } }],
        },
        {
          label: '🦀 Rust',
          items: [{ autogenerate: { directory: 'rust' } }],
        },
        {
          label: '🎯 Dart (Flutter)',
          items: [{ autogenerate: { directory: 'dart' } }],
        },
        {
          label: '🟣 Kotlin & Compose',
          items: [{ autogenerate: { directory: 'kotlin' } }],
        },
        {
          label: '🍏 Swift & SwiftUI',
          items: [{ autogenerate: { directory: 'swift' } }],
        },
        {
          label: '☁️ Terraform (IaC)',
          items: [{ autogenerate: { directory: 'terraform' } }],
        },
      ],
    }),
  ],
});
