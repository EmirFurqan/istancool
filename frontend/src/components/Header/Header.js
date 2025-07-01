'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Cookies from 'js-cookie';
import axios from 'axios';
import DistrictsDropdown from '../DistrictsDropdown/DistrictsDropdown';
import CategoriesDropdown from '../CategoriesDropdown/CategoriesDropdown';
import { categoryService } from '@/services/category';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [categories, setCategories] = useState([]);
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

  // İlçeleri çek
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await axios.get(`${API_URL}/districts`);
        setDistricts(response.data);
      } catch (error) {
        console.error('İlçeler yüklenirken hata oluştu:', error);
      }
    };
    fetchDistricts();
  }, []);

  // Kategorileri çek
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Kategoriler yüklenirken hata oluştu:', error);
      }
    };
    fetchCategories();
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

  const navigationItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Yazılar', href: '/blog' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      <nav className="flex items-center justify-between h-20 px-4 relative container mx-auto">
        
        <Link
          href="/"
          className="text-2xl font-bold transition-transform duration-300 hover:scale-110">
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
          {navigationItems.map((item, idx) => (
            <Link key={idx} href={item.href} className="text-gray-700 font-bold hover:text-secondary transition-colors duration-200">
              {item.label}
            </Link>
          ))}
          <CategoriesDropdown categories={categories} />
          <DistrictsDropdown districts={districts} />
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
              {navigationItems.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="text-gray-700 font-bold hover:text-secondary transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
              {/* Mobil İlçeler */}
              <div className="border-t pt-4">
                <div className="text-sm font-semibold text-gray-500 mb-2">İlçeler</div>
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-400">🌏 Asya İlçeleri</div>
                  {districts.filter(d => d.region === 'asia' || d.region === 'ASIA').map((district, idx) => (
                    <Link
                      key={idx}
                      href={`/blog?district=${district.slug}`}
                      className="block text-gray-700 hover:text-secondary transition-colors duration-200 text-sm ml-2"
                    >
                      {district.name}
                    </Link>
                  ))}
                  <div className="text-xs font-medium text-gray-400 mt-3">🌍 Avrupa İlçeleri</div>
                  {districts.filter(d => d.region === 'europe' || d.region === 'EUROPE').map((district, idx) => (
                    <Link
                      key={idx}
                      href={`/blog?district=${district.slug}`}
                      className="block text-gray-700 hover:text-secondary transition-colors duration-200 text-sm ml-2"
                    >
                      {district.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            {/* Giriş yap ve kayıt ol kaldırıldı */}
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