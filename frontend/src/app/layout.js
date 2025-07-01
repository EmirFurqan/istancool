import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://istan.cool'),
  title: 'İstancool - İstanbul\'un En Güzel Yerlerini Keşfedin',
  description: 'İstanbul\'un tarihi, kültürel ve turistik yerlerini keşfedin. En iyi restoranlar, kafeler, müzeler ve gezilecek yerler hakkında detaylı bilgiler.',
  keywords: 'İstanbul, gezi, seyahat, turizm, tarihi yerler, kültür, yemek, kafe, müze, gezilecek yerler',
  authors: [{ name: 'İstanCool' }],
  creator: 'İstanCool',
  publisher: 'İstanCool',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'İstancool - İstanbul\'un En Güzel Yerlerini Keşfedin',
    description: 'İstanbul\'un tarihi, kültürel ve turistik yerlerini keşfedin. En iyi restoranlar, kafeler, müzeler ve gezilecek yerler hakkında detaylı bilgiler.',
    url: 'https://istan.cool',
    siteName: 'İstanCool',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'İstanCool - İstanbul Rehberi',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'İstanCool - İstanbul\'un En Güzel Yerlerini Keşfedin',
    description: 'İstanbul\'un tarihi, kültürel ve turistik yerlerini keşfedin.',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        <link rel="canonical" href="https://istan.cool" />
        <meta name="theme-color" content="#002084" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={inter.className}>
        <div className="">{children}</div>
      </body>
    </html>
  );
} 