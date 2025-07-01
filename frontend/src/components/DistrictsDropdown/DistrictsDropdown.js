import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

const DistrictsDropdown = ({ districts }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('europe'); // Başta Avrupa seçili
  const dropdownRef = useRef(null);

  // İlçeleri Asya ve Avrupa olarak ayır
  const asiaDistricts = districts.filter(district => 
    district.region === 'asia' || district.region === 'ASIA'
  );
  const europeDistricts = districts.filter(district => 
    district.region === 'europe' || district.region === 'EUROPE'
  );

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

  // Seçili bölgeye göre ilçeleri getir
  const selectedDistricts = selectedRegion === 'europe' ? europeDistricts : asiaDistricts;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Butonu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-2 text-gray-700 font-bold hover:text-secondary transition-colors duration-200 rounded-lg hover:bg-gray-50"
      >
        İlçeler
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
      <div className={`fixed left-1/2 top-20 z-50 mt-0 w-[1200px] max-w-[98vw] h- -translate-x-1/2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex transition-all duration-300 ease-out ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-8 pointer-events-none'}`}>
        {/* Sol Menü */}
        <div className="w-40 border-r border-gray-200 bg-gray-50 flex flex-col py-6 px-2">
          <button
            className={`text-left px-4 py-2 rounded-lg mb-2 font-semibold text-sm transition-colors duration-150 ${selectedRegion === 'europe' ? 'bg-white shadow text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setSelectedRegion('europe')}
          >
            🌍 Avrupa
          </button>
          <button
            className={`text-left px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-150 ${selectedRegion === 'asia' ? 'bg-white shadow text-orange-700' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setSelectedRegion('asia')}
          >
            🌏 Asya
          </button>
        </div>
        {/* Sağda ilçeler */}
        <div className="flex-1 p-6 flex flex-col h-full">
          <div className="text-xs font-bold uppercase text-gray-500 border-b border-gray-200 pb-2 mb-3 tracking-wider">
            {selectedRegion === 'europe' ? 'Avrupa İlçeleri' : 'Asya İlçeleri'}
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-5 gap-2 py-4">
              {selectedDistricts.map((district, index) => (
                <Link
                  key={district.id || index}
                  href={`/blog?district=${district.slug}`}
                  onClick={() => setIsOpen(false)}
                  className={`w-full h-16 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition-all duration-300 text-center border border-gray-100 shadow-sm
                    ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
                  `}
                  style={{ transitionDelay: `${isOpen ? index * 40 : 0}ms` }}
                >
                  {district.name}
                </Link>
              ))}
              {selectedDistricts.length === 0 && (
                <div className="text-gray-400 text-sm py-6 text-center col-span-5">Hiç ilçe bulunamadı.</div>
              )}
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200 text-xs text-gray-400 text-center">
            Toplam {selectedDistricts.length} ilçe
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistrictsDropdown; 