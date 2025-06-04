'use client';

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function BlogDetailPage({ params }) {
  const { id } = use(params);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    axios.get(`${API_URL}/posts/${id}`)
      .then(res => {
        setPost(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Yazı bulunamadı.');
        setLoading(false);
      });
  }, [id]);

  const renderBlock = (block) => {
    switch (block.type) {
      case 'paragraph':
        return <p className="mb-4">{block.content}</p>;
      case 'h1':
        return <h1 className="text-3xl font-bold mb-4">{block.content}</h1>;
      case 'h2':
        return <h2 className="text-2xl font-bold mb-4">{block.content}</h2>;
      case 'image':
        return (
          <div className="relative w-full h-96 mb-6 rounded-lg overflow-hidden">
            <Image
              src={block.content}
              alt={block.alt || 'Blog görseli'}
              fill
              className="object-cover"
            />
          </div>
        );
      case 'list':
        return (
          <ul className="list-disc pl-6 mb-4">
            {block.items.map((item, index) => (
              <li key={index} className="mb-2">{item}</li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Yükleniyor...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }
  if (!post) return null;

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8">
          <Link href="/blog" className="text-secondary hover:underline">← Tüm Bloglar</Link>
        </div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm mb-4">
            <span>{new Date(post.created_at).toLocaleDateString('tr-TR')}</span>
            <span>•</span>
            <span>{post.author?.first_name} {post.author?.last_name}</span>
            <span>•</span>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs text-white">{post.category?.name}</span>
          </div>
          {post.cover_image && (
            <div className="relative w-full h-72 rounded-2xl overflow-hidden mb-8 shadow">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
        <article className="prose prose-lg max-w-none text-gray-800 bg-white rounded-2xl shadow p-8">
          {post.blocks && post.blocks.length > 0 ? (
            post.blocks.map((block, index) => (
              <div key={index}>
                {renderBlock(block)}
              </div>
            ))
          ) : (
            <p>{post.content}</p>
          )}
        </article>
      </div>
    </main>
  );
} 