import { Inter } from 'next/font/google';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';


const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'İstanCool - Seyahat ve Gezi Blogu',
  description: 'Türkiye ve dünyanın en güzel yerlerini keşfedin',
};

export default function RootLayout({ children }) {
  return (
    <div >
        <Header />
        <div className="">{children}</div>
        <Footer />  
    </div>
  );
} 