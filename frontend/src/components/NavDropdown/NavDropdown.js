import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const NavDropdown = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // İlçeleri 5 sütun halinde düzenle
  const renderItems = () => {
    const headers = items.filter(item => item.isHeader);
    const regularItems = items.filter(item => !item.isHeader && !item.disabled);
    
    return (
      <div className="grid grid-cols-5 gap-4">
        {headers.map((header, index) => (
          <div key={`header-${index}`} className="col-span-5">
            <div className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider border-b border-gray-200 mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              {header.label}
            </div>
          </div>
        ))}
        {regularItems.map((item, index) => (
          <div key={index} className={`transition-all duration-200 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`} style={{ transitionDelay: `${index * 20}ms` }}>
            <Link
              href={item.href}
              className="block px-3 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 rounded-lg hover:shadow-sm text-sm font-medium text-center"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          </div>
        ))}
      </div>
    );
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={buttonRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center font-bold space-x-1 px-4 py-2 text-gray-700 hover:text-secondary transition-colors duration-200 cursor-pointer"
      >
        <span>{title}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* Dropdown */}
      <div 
        ref={dropdownRef}
        className={`fixed top-24 left-1/2 transform -translate-x-1/2 w-11/12 max-w-6xl bg-white rounded-3xl shadow-2xl py-6 z-50 border border-gray-100 transition-all duration-300 ease-in-out ${
          isOpen 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'
        }`}
      >        
        <div className="px-6">
          {renderItems()}
        </div>
      </div>
    </div>
  );
};

export default NavDropdown; 