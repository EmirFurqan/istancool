'use client';

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import ParagraphBlock from '../../../../components/blocks/ParagraphBlock';
import HeadingBlock from '../../../../components/blocks/HeadingBlock';
import ImageBlock from '../../../../components/blocks/ImageBlock';
import MapBlock from '../../../../components/blocks/MapBlock';
import CodeBlock from '../../../../components/blocks/CodeBlock';
import NumberedListBlock from '../../../../components/blocks/NumberedListBlock';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function BlogDetailPage({ params }) {
  const { slug } = use(params);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    axios.get(`${API_URL}/posts/slug/${slug}`)
      .then(res => {
        setPost(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Yazı bulunamadı.');
        setLoading(false);
      });
  }, [slug]);

  const renderBlock = (block) => {
    switch (block.type) {
      case 'paragraph':
        return <ParagraphBlock content={block.content} />;
      case 'heading':
        return <HeadingBlock content={block.content} level={block.level || 1} />;
      case 'image':
        return (
          <ImageBlock
            src={block.src}
            alt={block.alt || 'Blog görseli'}
            caption={block.caption}
            layout={block.layout || 'single'}
          />
        );
      case 'map':
        return (
          <MapBlock
            location={block.location}
            title={block.title}
            description={block.description}
          />
        );
      case 'code':
        return (
          <CodeBlock
            code={block.content}
            language={block.language || 'javascript'}
            title={block.title}
          />
        );
      case 'numbered_list':
        return (
          <NumberedListBlock
            items={block.items}
            numberColor={block.numberColor}
          />
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
    <main className="min-h-screen bg-white py-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm mb-4">
            <span>{new Date(post.created_at).toLocaleDateString('tr-TR')}</span>
            <span>•</span>
            <span>{post.author?.first_name} {post.author?.last_name}</span>
            <span>•</span>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs text-white">{post.category?.name}</span>
          </div>
          {post.cover_image && (
            <div className="relative">
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white via-white/80 to-white/0 z-10"></div>
              <Image
                src={post.cover_image}
                alt={post.title}
                width={2000}
                height={2000}
                className="w-full h-[40vh] object-cover"
              />
              <h1 className="text-3xl font-bold mb-2 relative z-20 text-black mt-[-50px] px-6 pb-6 text-center">{post.title}</h1>
            </div>
          )}
        </div>
        <article className="prose prose-lg max-w-none text-gray-800">
          {post.blocks && post.blocks.length > 0 ? (
            post.blocks.map((block, index) => (
              <div key={index}>
                {renderBlock(block)}
              </div>
            ))
          ) : (
            <ParagraphBlock content={post.content} />
          )}
        </article>
      </div>
    </main>
  );
} 