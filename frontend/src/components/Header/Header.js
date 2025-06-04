'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Cookies from 'js-cookie';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = () => {
    Cookies.remove('token');
    window.location.href = '/login';
  };

  // Avatar için baş harf
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-primary backdrop-blur-md shadow">
      <nav className="flex items-center justify-between h-20 px-4 relative">
        {/* Sol boşluk */}
        <div className="w-1/3 flex items-center"></div>
        {/* Logo Ortada */}
        <div className="w-1/3 flex justify-center">
          <Link href="/" className="text-2xl font-bold transition-transform duration-300 hover:scale-110">
            <Image src="/logo.png" alt="İstanCool Logo" width={100} height={150} />
          </Link>
        </div>
        {/* Sağda kullanıcı kutusu veya butonlar */}
        <div className="w-1/3 flex justify-end items-center">
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none group"
              >
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-white text-lg group-hover:ring-2 group-hover:ring-indigo-300 transition">
                  {getInitials(userName)}
                </div>
                <span className="font-semibold text-white max-w-[120px] truncate hidden sm:block">{userName}</span>
                <svg className={`w-4 h-4 ml-1 text-white transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg py-2 z-50 animate-fade-in border border-gray-100 min-w-[160px] sm:min-w-[180px]">
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
      </nav>
    </header>
  );
}

export default Header;