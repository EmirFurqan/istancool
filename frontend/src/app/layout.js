import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'İstanCool - Seyahat ve Gezi Blogu',
  description: 'Türkiye ve dünyanın en güzel yerlerini keşfedin',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <div className="">{children}</div>
      </body>
    </html>
  );
} 