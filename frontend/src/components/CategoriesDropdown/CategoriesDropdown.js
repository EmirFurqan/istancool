import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { categoryService } from '@/services/category';
import { icons, Smile } from 'lucide-react';

const CategoriesDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
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
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderIcon = (iconName) => {
    const IconComponent = icons[iconName] || Smile;
    return <IconComponent className="h-5 w-5" />;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Butonu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-2 text-gray-700 font-bold hover:text-secondary transition-colors duration-200 rounded-lg hover:bg-gray-50"
      >
        Kategoriler
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />
      {/* Dropdown Panel */}
      <div className={`fixed left-1/2 top-20 z-50 mt-0 w-[1200px] max-w-[98vw] -translate-x-1/2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex transition-all duration-300 ease-out ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-8 pointer-events-none'}`}>
        {/* Kategoriler */}
        <div className="flex-1 p-6 flex flex-col h-full">
          <div className="text-xs font-bold uppercase text-gray-500 border-b border-gray-200 pb-2 mb-3 tracking-wider">
            Tüm Kategoriler
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-5 gap-3 py-4">
              {categories.map((cat, index) => (
                <Link
                  key={cat.id || index}
                  href={`/blog?category=${cat.slug}`}
                  onClick={() => setIsOpen(false)}
                  className={`w-full h-20 flex flex-col items-center justify-center rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-all duration-300 text-center border border-gray-100 shadow-sm hover:shadow-md
                    ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
                  `}
                  style={{ transitionDelay: `${isOpen ? index * 40 : 0}ms` }}
                >
                  <div className="flex items-center justify-center mb-1">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
                      style={{ backgroundColor: cat.color }}
                    >
                      <div className="text-white">
                        {renderIcon(cat.icon)}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-medium">{cat.name}</span>
                </Link>
              ))}
              {categories.length === 0 && (
                <div className="text-gray-400 text-sm py-6 text-center col-span-5">Hiç kategori bulunamadı.</div>
              )}
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200 text-xs text-gray-400 text-center">
            Toplam {categories.length} kategori
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesDropdown; 