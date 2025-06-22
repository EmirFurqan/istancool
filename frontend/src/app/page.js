'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Map from '../components/Map';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { postService } from '../services/postService';

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
      {/* Featured Posts Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">Öne Çıkan Yazılar</h2>
          <p className="text-lg text-gray-600">İstanbul'un en güzel yerlerini keşfedin</p>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredPosts.map((post) => (
              <article key={post.id} className="group overflow-hidden rounded-xl bg-white shadow-lg transition hover:shadow-xl">
                <div className="relative h-64">
                  <Image
                    src={post.cover_image || '/images/default-cover.jpg'}
                    alt={post.title}
                    fill
                    sizes='100'
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="rounded-full bg-blue-600 px-3 py-1 text-sm font-medium text-white">
                      {post.category?.name || 'Genel'}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="mb-3 text-xl font-bold text-gray-900">
                    <Link href={`/blog/${post.id}`} className="hover:text-blue-600" legacyBehavior>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mb-4 text-gray-600 line-clamp-3">
                    {post.summary || 'Bu yazı için özet bulunmuyor.'}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    legacyBehavior>
                    Devamını Oku
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      {/* Categories Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">Kategoriler</h2>
            <p className="text-lg text-gray-600">İstanbul'u farklı kategorilerde keşfedin</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {['Tarih', 'Gezi', 'Kültür', 'Yemek'].map((category) => (
              <Link
                key={category}
                href={`/category/${category.toLowerCase()}`}
                className="group rounded-xl bg-gray-50 p-6 text-center shadow-md transition hover:shadow-lg"
                legacyBehavior>
                <h3 className="text-xl font-semibold text-gray-900">{category}</h3>
                <p className="mt-2 text-gray-600">
                  {category} ile ilgili tüm yazılarımızı keşfedin
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
} 