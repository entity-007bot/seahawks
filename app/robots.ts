import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/private/*'],
      },
      {
        userAgent: [
          'Googlebot',
          'Bingbot',
          'Slurp',
          'DuckDuckBot',
          'Baiduspider',
          'YandexBot',
          'facebookexternalhit',
          'twitterbot',
          'Applebot'
        ],
        allow: '/',
        crawlDelay: 1,
      },
    ],
    sitemap: 'https://national-association-of-privateers.org/sitemap.xml',
    host: 'https://national-association-of-privateers.org',
  };
}
