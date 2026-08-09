import { type Locale, getSiteConfig } from './config';
import { getRssPages } from './seo';

const xmlEscape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

export const createRssResponse = (locale: Locale, site: URL | undefined) => {
  const siteConfig = getSiteConfig(locale);
  const base = site ?? new URL(siteConfig.fallbackUrl);
  const channelPath = locale === 'en' ? '/en/' : '/';
  const channelUrl = new URL(channelPath, base);
  const timeZoneOffset = locale === 'ko' ? '+09:00' : '+00:00';
  const items = getRssPages(locale)
    .map((page) => {
      const url = new URL(page.path, base).href;
      const pubDate = new Date(`${page.updated}T12:00:00${timeZoneOffset}`).toUTCString();

      return [
        '<item>',
        `<title>${xmlEscape(page.title)}</title>`,
        `<link>${xmlEscape(url)}</link>`,
        `<description>${xmlEscape(page.rssDescription ?? page.description)}</description>`,
        `<pubDate>${pubDate}</pubDate>`,
        `<guid isPermaLink="true">${xmlEscape(url)}</guid>`,
        '</item>'
      ].join('');
    })
    .join('');

  return new Response(
    [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<rss version="2.0">',
      '<channel>',
      `<title>${xmlEscape(siteConfig.name)}</title>`,
      `<link>${xmlEscape(channelUrl.href)}</link>`,
      `<description>${xmlEscape(siteConfig.description)}</description>`,
      `<language>${xmlEscape(siteConfig.language)}</language>`,
      `<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
      items,
      '</channel>',
      '</rss>'
    ].join(''),
    {
      headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' }
    }
  );
};
