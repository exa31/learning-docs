import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Dev Cheatsheets 📖',
      description: 'Catatan & cheatsheet sintaks praktis pribadi',
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
          label: '🟣 Kotlin & Compose',
          items: [{ autogenerate: { directory: 'kotlin' } }],
        },
        {
          label: '☁️ Terraform (IaC)',
          items: [{ autogenerate: { directory: 'terraform' } }],
        },
      ],
    }),
  ],
});
