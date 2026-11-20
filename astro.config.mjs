import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Dev Cheatsheets 📖',
      description: 'Catatan & cheatsheet sintaks praktis pribadi lintas tech-stack',
      favicon: '/favicon.svg?v=2',
      logo: {
        src: './src/assets/logo.svg',
        replacesTitle: false,
      },
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            href: '/favicon.svg?v=2',
            type: 'image/svg+xml',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'alternate icon',
            href: '/favicon.ico?v=2',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'apple-touch-icon',
            href: '/favicon.png?v=2',
          },
        },
      ],
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
          label: '🐘 PHP (Modern 8.x)',
          items: [{ autogenerate: { directory: 'php' } }],
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
          label: '🎯 Dart (Core)',
          items: [{ autogenerate: { directory: 'dart' } }],
        },
        {
          label: '🟣 Kotlin (Core)',
          items: [{ autogenerate: { directory: 'kotlin' } }],
        },
        {
          label: '🍏 Swift (Core)',
          items: [{ autogenerate: { directory: 'swift' } }],
        },
        {
          label: '🎨 Flutter (Cross-Platform)',
          items: [{ autogenerate: { directory: 'flutter' } }],
        },
        {
          label: '📱 Jetpack Compose (Android)',
          items: [{ autogenerate: { directory: 'compose' } }],
        },
        {
          label: '🍎 SwiftUI (iOS & Apple)',
          items: [{ autogenerate: { directory: 'swiftui' } }],
        },
        {
          label: '☁️ Terraform (IaC)',
          items: [{ autogenerate: { directory: 'terraform' } }],
        },
        {
          label: '🐘 PostgreSQL',
          items: [{ autogenerate: { directory: 'postgresql' } }],
        },
        {
          label: '🐬 MySQL',
          items: [{ autogenerate: { directory: 'mysql' } }],
        },
        {
          label: '🔴 Redis',
          items: [{ autogenerate: { directory: 'redis' } }],
        },
        {
          label: '🍃 MongoDB',
          items: [{ autogenerate: { directory: 'mongodb' } }],
        },
        {
          label: '📊 Google BigQuery',
          items: [{ autogenerate: { directory: 'bigquery' } }],
        },
        {
          label: '⚡ Google Cloud Bigtable',
          items: [{ autogenerate: { directory: 'bigtable' } }],
        },
      ],
    }),
  ],
});
