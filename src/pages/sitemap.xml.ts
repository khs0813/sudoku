import type { APIRoute } from 'astro';
import { seoPages } from '../seo';

const xmlEscape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL('https://sudokuday.co.kr');
  const urls = seoPages
    .map((page) => {
      const loc = xmlEscape(new URL(page.path, base).href);
      return `<url><loc>${loc}</loc><lastmod>${page.updated}</lastmod></url>`;
    })
    .join('');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
};
