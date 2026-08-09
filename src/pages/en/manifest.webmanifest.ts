import type { APIRoute } from 'astro';
import { getSiteConfig } from '../../config';

export const GET: APIRoute = () => {
  const siteConfig = getSiteConfig('en');
  return new Response(
    JSON.stringify({
      name: siteConfig.name,
      short_name: siteConfig.shortName,
      id: '/en/',
      description: siteConfig.description,
      lang: siteConfig.language,
      start_url: '/en/',
      scope: '/en/',
      display: 'standalone',
      orientation: 'any',
      background_color: '#eaf8f4',
      theme_color: siteConfig.themeColor,
      icons: [
        {
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable'
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ],
      shortcuts: [
        {
          name: 'Today\'s Puzzle',
          short_name: 'Today',
          url: '/en/',
          icons: [
            {
              src: '/icon-192.png',
              sizes: '192x192'
            }
          ]
        }
      ]
    }),
    {
      headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' }
    }
  );
};
