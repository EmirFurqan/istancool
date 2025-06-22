'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/posts`)
      .then(res => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Blog yazıları yüklenemedi.');
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Blog</h1>
          <p className="text-lg text-gray-600">
            İstanbul&apos;un en güzel yerlerini ve hikayelerini keşfedin
          </p>
        </div>
        {/* Filters (dummy, ileride dinamik yapılabilir) */}
        <div className="mb-8 flex flex-wrap gap-4">
          <button className="rounded-full bg-secondary px-6 py-2 text-white">Tümü</button>
          <button className="rounded-full bg-white px-6 py-2 shadow-md hover:bg-gray-50">Tarih</button>
          <button className="rounded-full bg-white px-6 py-2 shadow-md hover:bg-gray-50">Gezi</button>
          <button className="rounded-full bg-white px-6 py-2 shadow-md hover:bg-gray-50">Kültür</button>
          <button className="rounded-full bg-white px-6 py-2 shadow-md hover:bg-gray-50">Yemek</button>
        </div>
        {/* Posts Grid */}
        {loading ? (
          <div className="text-center text-gray-500 py-20">Yükleniyor...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-20">{error}</div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post.id} className="group overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-100 hover:shadow-2xl transition">
                <div className="relative h-64">
                  <Image
                    src={post.cover_image || '/images/ayasofya.jpg'}
                    alt={post.title}
                    fill
                    className="object-cover transition group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="rounded-full bg-secondary px-3 py-1 text-sm text-white shadow">
                      {post.category?.name}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-4 flex items-center gap-4 text-sm text-gray-500">
                    <span>{new Date(post.created_at).toLocaleDateString('tr-TR')}</span>
                    <span>•</span>
                    <span>{post.author?.first_name} {post.author?.last_name}</span>
                  </div>
                  <h2 className="text-xl font-semibold mb-2">
                    {post.title}
                  </h2>
                  <p className="mb-4 text-gray-600">
                    {post.short_content ? (
                      post.short_content.length > 150 ? post.short_content.slice(0, 150) + '...' : post.short_content
                    ) : post.content ? (
                      post.content.length > 150 ? post.content.slice(0, 150) + '...' : post.content
                    ) : (
                      post.blocks?.find(block => block.type === 'paragraph')?.content?.slice(0, 150) + '...' || 'İçerik bulunamadı'
                    )}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-block bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90 transition"
                  >
                    Devamını Oku
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
        {/* Pagination (dummy) */}
        <div className="mt-12 flex justify-center">
          <nav className="flex items-center gap-2">
            <button className="rounded-lg border px-4 py-2 hover:bg-gray-50">Önceki</button>
            <button className="rounded-lg bg-secondary px-4 py-2 text-white">1</button>
            <button className="rounded-lg border px-4 py-2 hover:bg-gray-50">2</button>
            <button className="rounded-lg border px-4 py-2 hover:bg-gray-50">3</button>
            <button className="rounded-lg border px-4 py-2 hover:bg-gray-50">Sonraki</button>
          </nav>
        </div>
      </div>
    </main>
  );
} 