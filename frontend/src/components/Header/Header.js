'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Cookies from 'js-cookie';
import axios from 'axios';
import NavDropdown from '../NavDropdown/NavDropdown';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      setIsLoggedIn(true);
      axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          setUserName(res.data.first_name + ' ' + res.data.last_name);
        })
        .catch(() => {
          setIsLoggedIn(false);
          setUserName('');
        });
    } else {
      setIsLoggedIn(false);
      setUserName('');
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen, isMobileMenuOpen]);

  const handleLogout = () => {
    Cookies.remove('token');
    window.location.href = '/login';
  };

  // Avatar için baş harf
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase();
  };

  const navigationItems = {
    keşfet: [
      { label: 'Popüler Mekanlar', href: '/places/popular' },
      { label: 'Yeni Eklenenler', href: '/places/new' },
      { label: 'Kategoriler', href: '/categories' },
    ],
    etkinlikler: [
      { label: 'Yaklaşan Etkinlikler', href: '/events/upcoming' },
      { label: 'Geçmiş Etkinlikler', href: '/events/past' },
      { label: 'Etkinlik Oluştur', href: '/events/create' },
    ],
    topluluk: [
      { label: 'Forum', href: '/forum' },
      { label: 'Blog', href: '/blog' },
      { label: 'İpuçları', href: '/tips' },
    ],
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      <nav className="flex items-center justify-between h-20 px-4 relative container mx-auto">
        
        <Link
          href="/"
          className="text-2xl font-bold transition-transform duration-300 hover:scale-110"
          legacyBehavior>
          <Image src="/logo.png" alt="İstanCool Logo" width={100} height={150} className='h-auto w-auto' />
        </Link>

        {/* Mobil Menü Butonu */}
        {mounted && (
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        {/* Desktop Menü */}
        <div className="hidden lg:flex items-center gap-5">
          <Link href="/" className="text-gray-700 font-bold hover:text-secondary transition-colors duration-200">
            Ana Sayfa
          </Link>
          <NavDropdown title="Keşfet" items={navigationItems.keşfet} />
          <NavDropdown title="Etkinlikler" items={navigationItems.etkinlikler} />
          <NavDropdown title="Topluluk" items={navigationItems.topluluk} />
          <Link href="/contact" className="text-gray-700 font-bold hover:text-secondary transition-colors duration-200">
            İletişim
          </Link>
        </div>

        {/* Desktop Kullanıcı Menüsü */}
        <div className="hidden lg:flex justify-end items-center">
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none group"
              >
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-white text-lg group-hover:ring-2 group-hover:ring-indigo-300 transition">
                  {getInitials(userName)}
                </div>
                <span className="font-semibold text-secondary max-w-[120px] truncate">{userName}</span>
                <svg className={`w-4 h-4 ml-1 text-secondary transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg py-2 z-50 animate-fade-in border border-gray-100">
                  <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition rounded-t-xl">Profil</Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition rounded-b-xl"
                  >
                    Çıkış Yap
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-secondary hover:text-secondary/80 hover:bg-secondary/10 font-medium transition border border-secondary rounded-xl px-4 py-2">Giriş Yap</Link>
              <Link href="/register" className="text-white hover:text-white/80 font-medium transition bg-secondary rounded-xl px-4 py-2">Kayıt Ol</Link>  
            </div>
          )}
        </div>

        {/* Mobil Sidebar */}
        <div
          ref={mobileMenuRef}
          className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-4 border-b">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-4">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 font-bold hover:text-secondary transition-colors duration-200">
                Ana Sayfa
              </Link>
              <div className="space-y-2">
                <div className="font-bold text-gray-700">Keşfet</div>
                {navigationItems.keşfet.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="block pl-4 text-gray-600 hover:text-secondary"
                    legacyBehavior>
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="space-y-2">
                <div className="font-bold text-gray-700">Etkinlikler</div>
                {navigationItems.etkinlikler.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="block pl-4 text-gray-600 hover:text-secondary"
                    legacyBehavior>
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="space-y-2">
                <div className="font-bold text-gray-700">Topluluk</div>
                {navigationItems.topluluk.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="block pl-4 text-gray-600 hover:text-secondary"
                    legacyBehavior>
                    {item.label}
                  </Link>
                ))}
              </div>
              <Link href="/contact" className="text-gray-700 font-bold hover:text-secondary transition-colors duration-200">
                İletişim
              </Link>
            </div>

            <div className="mt-8 pt-4 border-t">
              {isLoggedIn ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-bold text-white text-sm">
                      {getInitials(userName)}
                    </div>
                    <span className="font-semibold text-secondary">{userName}</span>
                  </div>
                  <Link href="/profile" className="block text-gray-700 hover:text-secondary">Profil</Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-red-600 hover:text-red-700"
                  >
                    Çıkış Yap
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link href="/login" className="block w-full text-center text-secondary hover:text-secondary/80 hover:bg-secondary/10 font-medium transition border border-secondary rounded-xl px-4 py-2">Giriş Yap</Link>
                  <Link href="/register" className="block w-full text-center text-white hover:text-white/80 font-medium transition bg-secondary rounded-xl px-4 py-2">Kayıt Ol</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobil Menü Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/40 bg-opacity-50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </nav>
    </header>
  );
}

export default Header;