import type { Metadata } from 'next';
import { Inter, Cinzel } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'National Association of Privateers | Great Niger Delta Chapter Portal',
  description: 'Official Digital Portal & Sovereign Maritime Guild of the National Association of Privateers (Great Niger Delta Chapter). Verified Room Suites, Member Management, Directives, and Meeting Links.',
  keywords: [
    'National Association of Privateers',
    'Great Niger Delta Chapter',
    'Privateers Corsairs Portal',
    'Maritime Guild Nigeria',
    'Room Suites',
    'Brass Suite',
    'Crawling Index',
    'Creeping Index',
    'Robotic Indexing',
    'Waiting Index',
    'Corsairs Digital Portal',
    'Maritime Security & Service'
  ],
  authors: [{ name: 'Admiralty Command Council' }],
  creator: 'National Association of Privateers',
  publisher: 'National Association of Privateers',
  metadataBase: new URL('https://national-association-of-privateers.org'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'National Association of Privateers | Official Sovereign Portal',
    description: 'Official Portal of the Great Niger Delta Chapter. Verified Room Suites, Member Ledger, Directives, and Official Meeting Links.',
    url: 'https://national-association-of-privateers.org',
    siteName: 'National Association of Privateers',
    images: [
      {
        url: '/assets/og-image.png',
        width: 1200,
        height: 630,
        alt: 'National Association of Privateers Seal',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'National Association of Privateers',
    description: 'Official Sovereign Digital Portal of the Great Niger Delta Privateers & Corsairs.',
  },
  other: {
    'crawling-index': 'active',
    'creeping-index': 'enabled',
    'robotic-indexing': 'allow-all',
    'waiting-index': 'standby-verified',
    'google-site-verification': 'google_search_console_verified_instant_index',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'National Association of Privateers',
    alternateName: 'Great Niger Delta Corsairs',
    url: 'https://national-association-of-privateers.org',
    logo: 'https://national-association-of-privateers.org/assets/seal.png',
    description: 'Official Sovereign Guild & Digital Portal of the National Association of Privateers (Great Niger Delta Chapter).',
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Delta / Rivers State',
      addressCountry: 'NG',
    },
    sameAs: [],
  };

  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased text-slate-100 bg-[#020617] selection:bg-amber-500 selection:text-slate-950" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

