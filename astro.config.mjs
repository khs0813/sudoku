import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
const site = process.env.SITE_URL || process.env.RENDER_EXTERNAL_URL || 'https://pocket-sudoku.onrender.com';
export default defineConfig({
  site,
  output: 'static',
  integrations: [sitemap()],
  build: { format: 'directory' },
  vite: { build: { cssMinify: 'esbuild' } }
});
