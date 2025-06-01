import React from 'react'
import Link from 'next/link';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
          <div className="container mx-auto px-4 py-12">
            <div className="grid gap-8 md:grid-cols-4">
              <div>
                <h3 className="mb-4 text-xl font-bold">İstanCool</h3>
                <p className="text-gray-400">
                  Seyahat tutkunları için en iyi gezi rehberi
                </p>
              </div>
              <div>
                <h4 className="mb-4 font-semibold">Hızlı Linkler</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/blog" className="text-gray-400 hover:text-white">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/kategoriler" className="text-gray-400 hover:text-white">
                      Kategoriler
                    </Link>
                  </li>
                  <li>
                    <Link href="/hakkimizda" className="text-gray-400 hover:text-white">
                      Hakkımızda
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 font-semibold">Kategoriler</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/kategori/doga" className="text-gray-400 hover:text-white">
                      Doğa
                    </Link>
                  </li>
                  <li>
                    <Link href="/kategori/sehir" className="text-gray-400 hover:text-white">
                      Şehir
                    </Link>
                  </li>
                  <li>
                    <Link href="/kategori/kultur" className="text-gray-400 hover:text-white">
                      Kültür
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 font-semibold">Bizi Takip Edin</h4>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white">
                    Instagram
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Twitter
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Facebook
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
              <p>&copy; 2024 İstanCool. Tüm hakları saklıdır.</p>
            </div>
          </div>
        </footer>
  )
}

export default Footer