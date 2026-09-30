// Astro's settings file. Read once, when you run `npm run dev` or `npm run build`.
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // The live address. Used to build full URLs for canonical links,
  // social previews and the sitemap.
  site: 'https://maureenmuturi.com',

  // Writes sitemap-index.xml on every build, so it can never go stale
  // the way the hand-written one could.
  integrations: [sitemap()],

  // Tailwind plugs into Vite, the tool Astro uses under the hood to bundle files.
  vite: {
    plugins: [tailwindcss()],
  },
});
