import React from 'react'
import Link from 'next/link';

function Header() {
  return (
    <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md">
    <nav className="container mx-auto flex h-20 items-center justify-between px-4">
      <Link href="/" className="text-2xl font-bold">
        İstanCool
      </Link>
      <div className="hidden space-x-8 md:flex">
        <Link href="/blog" className="hover:text-blue-600">
          Blog
        </Link>
        <Link href="/kategoriler" className="hover:text-blue-600">
          Kategoriler
        </Link>
        <Link href="/hakkimizda" className="hover:text-blue-600">
          Hakkımızda
        </Link>
        <Link href="/iletisim" className="hover:text-blue-600">
          İletişim
        </Link>
      </div>
      <button className="rounded-full bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
        Abone Ol
      </button>
    </nav>
  </header>
  )
}

export default Header