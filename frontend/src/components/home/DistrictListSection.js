"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function slugify(name) {
  return name
    .toLocaleLowerCase('tr-TR')
    .replace(/ /g, '-')
    .replace(/[çÇ]/g, 'c')
    .replace(/[ğĞ]/g, 'g')
    .replace(/[ıİ]/g, 'i')
    .replace(/[öÖ]/g, 'o')
    .replace(/[şŞ]/g, 's')
    .replace(/[üÜ]/g, 'u')
    .replace(/[^a-z0-9-]/g, '');
}

const DistrictListSection = () => {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('europe');

  useEffect(() => {
    fetch(`${API_URL}/districts`)
      .then(res => res.json())
      .then(data => {
        setDistricts(data);
        setLoading(false);
      });
  }, []);

  // Avrupa ve Asya ilçelerini ayır
  const europeDistricts = districts.filter(
    d => d.region === 'europe' || d.region === 'EUROPE'
  );
  const asiaDistricts = districts.filter(
    d => d.region === 'asia' || d.region === 'ASIA'
  );
  const selectedDistricts = selectedRegion === 'europe' ? europeDistricts : asiaDistricts;

  if (loading) {
    return <div className="text-center py-10">İlçeler yükleniyor...</div>;
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">İstanbul İlçeleri</h2>
        <div className="flex justify-center mb-8 gap-4">
          <button
            className={`px-6 py-2 rounded-lg font-semibold text-sm transition-colors duration-150 border-2 ${selectedRegion === 'europe' ? 'bg-blue-700 text-white border-blue-700 shadow' : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'}`}
            onClick={() => setSelectedRegion('europe')}
          >
            Avrupa Yakası
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-semibold text-sm transition-colors duration-150 border-2 ${selectedRegion === 'asia' ? 'bg-orange-600 text-white border-orange-600 shadow' : 'bg-white text-orange-600 border-orange-200 hover:bg-orange-50'}`}
            onClick={() => setSelectedRegion('asia')}
          >
            Asya Yakası
          </button>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={selectedRegion}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -32 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
          >
            {selectedDistricts.map((district) => (
              <Link
                key={district.id}
                href={`/blog?district=${slugify(district.name)}`}
                className="block bg-gray-100 hover:bg-blue-100 rounded-lg p-4 text-center font-semibold text-gray-700 transition"
              >
                {district.name}
              </Link>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default DistrictListSection; 