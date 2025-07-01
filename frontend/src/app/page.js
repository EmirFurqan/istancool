'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Map from '../components/Map';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { postService } from '../services/postService';
import FeaturedPosts from '../components/home/FeaturedPosts';
import Categories from '../components/home/Categories';
import DistrictListSection from '@/components/home/DistrictListSection';
import IstanbulMap from '@/components/IstanbulMap';

export default function Home() {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [mapPosts, setMapPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredData, mapData] = await Promise.all([
          postService.getFeaturedPosts(),
          postService.getMapPosts()
        ]);
        setFeaturedPosts(featuredData);
        setMapPosts(mapData);
      } catch (error) {
        console.error('Veriler yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // İçerik özeti oluştur
  const createSummary = (content) => {
    if (!content) return '';
    return content.length > 150 ? content.substring(0, 150) + '...' : content;
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      {/* Hero Section with Map */}
      <section className="relative h-[65vh] w-full">
        <div className="absolute inset-0">
          <Map 
            locations={mapPosts.map(post => ({
              lat: parseFloat(post.latitude),
              lng: parseFloat(post.longitude),
              color: post.category_color || '#FF5733',
              popupContent: `
                <div class="w-[300px] p-4">
                  ${post.cover_image ? `
                    <div class="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                      <img src="${post.cover_image}" alt="${post.title}" class="w-full h-full object-cover" />
                    </div>
                  ` : ''}
                  <div class="space-y-2">
                    <div class="flex items-center gap-2">
                      <span class="px-2 py-1 text-xs font-medium text-white rounded-full" style="background-color: ${post.category_color || '#FF5733'}">
                        ${post.category_name}
                      </span>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900">${post.title}</h3>
                    <p class="text-sm text-gray-600">${createSummary(post.content)}</p>
                    <a href="/blog/${post.id}" class="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
                      Devamını Oku
                      <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              `
            }))} 
          />
          <div className="absolute inset-0 bg-black/30" />
        </div> 
      </section>
      
      <FeaturedPosts posts={featuredPosts} loading={loading} />
      <Categories />
      <DistrictListSection />
      <IstanbulMap />

      <Footer />
    </main>
  );
} 