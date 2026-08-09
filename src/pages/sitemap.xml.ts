import type { APIRoute } from 'astro';
import { getSeoAlternates, getXDefaultPath, seoPages } from '../seo';

const xmlEscape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL('https://sudokuday.co.kr');
  const urls = seoPages
    .map((page) => {
      const loc = xmlEscape(new URL(page.path, base).href);
      const alternates = getSeoAlternates(page.path)
        .map((alternate) => `<xhtml:link rel="alternate" hreflang="${xmlEscape(alternate.hreflang)}" href="${xmlEscape(new URL(alternate.path, base).href)}" />`)
        .join('');
      const xDefault = `<xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(new URL(getXDefaultPath(page.path), base).href)}" />`;
      return `<url><loc>${loc}</loc><lastmod>${page.updated}</lastmod>${alternates}${xDefault}</url>`;
    })
    .join('');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
};
