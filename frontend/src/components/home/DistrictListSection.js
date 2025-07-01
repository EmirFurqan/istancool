"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

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

  useEffect(() => {
    fetch(`${API_URL}/districts`)
      .then(res => res.json())
      .then(data => {
        setDistricts(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-10">İlçeler yükleniyor...</div>;
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">İstanbul İlçeleri</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {districts.map((district) => (
            <Link
              key={district.id}
              href={`/blog?district=${slugify(district.name)}`}
              className="block bg-gray-100 hover:bg-blue-100 rounded-lg p-4 text-center font-semibold text-gray-700 transition"
            >
              {district.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DistrictListSection; 