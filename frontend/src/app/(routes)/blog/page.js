'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { postService } from '@/services/postService';

function BlogGrid() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get('category');
  const districtSlug = searchParams.get('district');

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageTitle, setPageTitle] = useState('Tüm Yazılar');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (categorySlug) params.category_slug = categorySlug;
        if (districtSlug) params.district_slug = districtSlug;
        if (categorySlug) {
          const formattedTitle = categorySlug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          setPageTitle(`${formattedTitle} Kategorisindeki Yazılar`);
        } else if (districtSlug) {
          const formattedDistrict = districtSlug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          setPageTitle(`${formattedDistrict} İlçesindeki Yazılar`);
        } else {
          setPageTitle('Tüm Yazılar');
        }
        const data = await postService.getAllPosts(params);
        setPosts(data);
      } catch (err) {
        setError('Blog yazıları yüklenemedi.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [categorySlug, districtSlug]);

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">{pageTitle}</h1>
          <p className="text-lg text-gray-600">
            İstanbul&apos;un en güzel yerlerini ve hikayelerini keşfedin
          </p>
        </div>
        
        {loading ? (
          <div className="text-center text-gray-500 py-20">Yükleniyor...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-20">{error}</div>
        ) : posts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post.id} className="group overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 ease-in-out hover:-translate-y-1">
                 <Link href={`/blog/${post.slug}`} className="block">
                  <div className="relative h-64">
                    <Image
                      src={post.cover_image || '/images/ayasofya.jpg'}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                       <span 
                        className="rounded-full px-3 py-1 text-sm font-medium text-white shadow"
                        style={{ backgroundColor: post.category?.color || '#3B82F6' }}
                      >
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
                    <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600">
                      {post.title}
                    </h2>
                     <p className="mb-4 text-gray-600 line-clamp-3">
                      {post.summary || 'Bu yazı için özet bulunmuyor.'}
                    </p>
                    <div className="inline-flex items-center text-blue-600 group-hover:text-blue-800 font-semibold">
                      Devamını Oku
                      <svg className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
           <div className="text-center text-gray-500 py-20">
              <h2 className="text-2xl font-semibold mb-4">Yazı Bulunamadı</h2>
              <p>Bu kategoride henüz yazı bulunmuyor.</p>
              <Link href="/blog" className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                Tüm Yazıları Gör
              </Link>
           </div>
        )}
      </div>
    </main>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <BlogGrid />
    </Suspense>
  );
} 