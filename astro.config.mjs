import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
const site = process.env.SITE_URL || 'https://sudokuday.co.kr';
export default defineConfig({
  site,
  output: 'static',
  integrations: [sitemap()],
  build: { format: 'directory' },
  vite: { build: { cssMinify: 'esbuild' } }
});
