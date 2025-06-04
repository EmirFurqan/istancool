'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const BLOCK_TYPES = [
  { type: 'h1', label: 'Başlık (H1)' },
  { type: 'h2', label: 'Alt Başlık (H2)' },
  { type: 'paragraph', label: 'Paragraf' },
  { type: 'image', label: 'Resim' },
  { type: 'list', label: 'Liste' },
];

const initialPostData = {
  title: '',
  slug: '',
  cover_image: '',
  category_id: '',
  content: '',
};

export default function AddPostPage() {
  const [blocks, setBlocks] = useState([]);
  const [postData, setPostData] = useState(initialPostData);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const coverImageRef = useRef(null);
  const blockImageRefs = useRef({});
  const router = useRouter();

  const handlePostDataChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  // Blok ekle
  const addBlock = (type) => {
    let newBlock;
    if (type === 'list') {
      newBlock = { type, items: [''] };
    } else if (type === 'image') {
      newBlock = { type, src: '' };
    } else {
      newBlock = { type, content: '' };
    }
    setBlocks([...blocks, newBlock]);
  };

  // Blok sil
  const removeBlock = (idx) => {
    setBlocks(blocks.filter((_, i) => i !== idx));
  };

  // Blok içeriğini güncelle
  const updateBlock = (idx, data) => {
    setBlocks(blocks.map((block, i) => (i === idx ? { ...block, ...data } : block)));
  };

  // Liste maddesi güncelle
  const updateListItem = (blockIdx, itemIdx, value) => {
    setBlocks(blocks.map((block, i) => {
      if (i !== blockIdx) return block;
      const newItems = [...block.items];
      newItems[itemIdx] = value;
      return { ...block, items: newItems };
    }));
  };

  // Listeye madde ekle
  const addListItem = (blockIdx) => {
    setBlocks(blocks.map((block, i) => {
      if (i !== blockIdx) return block;
      return { ...block, items: [...block.items, ''] };
    }));
  };

  // Liste maddesi sil
  const removeListItem = (blockIdx, itemIdx) => {
    setBlocks(blocks.map((block, i) => {
      if (i !== blockIdx) return block;
      return { ...block, items: block.items.filter((_, j) => j !== itemIdx) };
    }));
  };

  // Blok yukarı/aşağı taşı
  const moveBlock = (idx, direction) => {
    const newBlocks = [...blocks];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= newBlocks.length) return;
    [newBlocks[idx], newBlocks[targetIdx]] = [newBlocks[targetIdx], newBlocks[idx]];
    setBlocks(newBlocks);
  };

  // Resim seçme işleyicisi
  const handleImageSelect = (e, blockIndex) => {
    const file = e.target.files[0];
    if (!file) return;

    // Resmi geçici olarak göster
    const url = URL.createObjectURL(file);
    const newBlocks = [...blocks];
    newBlocks[blockIndex] = {
      ...newBlocks[blockIndex],
      type: 'image',
      content: url,
      file: file, // Dosyayı sakla
      alt: 'Blog görseli'
    };
    setBlocks(newBlocks);
  };

  // Kapak resmi seçme işleyicisi
  const handleCoverImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Resmi geçici olarak göster
    const url = URL.createObjectURL(file);
    setPostData({ 
      ...postData, 
      cover_image: url,
      cover_image_file: file // Dosyayı sakla
    });
  };

  // Kaydet
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', postData.title);
      formData.append('slug', postData.slug);
      formData.append('content', postData.content);
      formData.append('category_id', postData.category_id);
      formData.append('blocks', JSON.stringify(blocks));

      // Kapak resmini ekle
      if (postData.cover_image_file) {
        formData.append('cover_image', postData.cover_image_file);
      }

      // Blok resimlerini ekle
      blocks.forEach((block, index) => {
        if (block.type === 'image' && block.file) {
          formData.append(`block_image_${index}`, block.file);
        }
      });

      const response = await axios.post(`${API_URL}/posts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${Cookies.get('token')}`
        }
      });

      if (response.status === 200) {
        setSuccess(true);
        // Formu temizle
        setPostData(initialPostData);
        setBlocks([]);
        // Başarılı mesajını göster
        setTimeout(() => {
          setSuccess(false);
          router.push('/blog');
        }, 2000);
      }
    } catch (err) {
      console.error('Post oluşturma hatası:', err);
      setError(err.response?.data?.detail || 'Post oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold text-center">Brick Editor ile Blog Tasarla</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-8">
          {/* Ana Post Bilgileri */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Başlık</label>
              <input type="text" name="title" value={postData.title} onChange={handlePostDataChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary" required />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Slug</label>
              <input type="text" name="slug" value={postData.slug} onChange={handlePostDataChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary" required />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Kapak Görseli</label>
              <div className="flex flex-col gap-2">
                {postData.cover_image && (
                  <Image src={postData.cover_image} alt="Kapak Görseli" width={400} height={250} className="rounded-lg object-cover max-h-64" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageSelect}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Kategori ID</label>
              <input type="number" name="category_id" value={postData.category_id} onChange={handlePostDataChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary" required />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 font-medium text-gray-700">Kısa İçerik (Opsiyonel - Blocks'tan da üretilir)</label>
              <textarea name="content" value={postData.content} onChange={handlePostDataChange} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"></textarea>
            </div>
          </div>

          {/* Blok Ekleme Butonları */}
          <div className="mb-6 flex flex-wrap gap-2 justify-center border-t pt-6">
            <h2 className="w-full text-center text-xl font-semibold mb-3">İçerik Blokları Ekle</h2>
            {BLOCK_TYPES.map((b) => (
              <button
                type="button"
                key={b.type}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition text-sm"
                onClick={() => addBlock(b.type)}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* Bloklar */}
          <div className="space-y-8">
            {blocks.map((block, idx) => (
              <div key={idx} className="relative group bg-gray-100 rounded-xl p-4 border border-gray-200">
                <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button type="button" onClick={() => moveBlock(idx, 'up')} disabled={idx === 0} className="text-xs bg-gray-200 hover:bg-gray-300 p-1 rounded">↑</button>
                  <button type="button" onClick={() => moveBlock(idx, 'down')} disabled={idx === blocks.length - 1} className="text-xs bg-gray-200 hover:bg-gray-300 p-1 rounded">↓</button>
                  <button type="button" onClick={() => removeBlock(idx)} className="text-xs bg-red-500 text-white hover:bg-red-600 p-1 rounded">✕</button>
                </div>
                <span className="text-xs text-gray-500 font-medium mb-1 block">{BLOCK_TYPES.find(bt => bt.type === block.type)?.label}</span>
                {block.type === 'h1' && (
                  <input type="text" value={block.content} onChange={e => updateBlock(idx, { content: e.target.value })} className="w-full text-3xl font-bold outline-none bg-transparent" placeholder="Başlık (H1)" />
                )}
                {block.type === 'h2' && (
                  <input type="text" value={block.content} onChange={e => updateBlock(idx, { content: e.target.value })} className="w-full text-2xl font-semibold outline-none bg-transparent" placeholder="Alt Başlık (H2)" />
                )}
                {block.type === 'paragraph' && (
                  <textarea value={block.content} onChange={e => updateBlock(idx, { content: e.target.value })} className="w-full text-base outline-none bg-transparent resize-none" placeholder="Paragraf metni..." rows={3} />
                )}
                {block.type === 'image' && (
                  <div className="flex flex-col items-center gap-2">
                    {block.content && (
                      <div className="relative w-full h-64">
                        <Image
                          src={block.content}
                          alt="Blog görseli"
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageSelect(e, idx)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-2"
                    />
                  </div>
                )}
                {block.type === 'list' && (
                  <div className="space-y-2">
                    {block.items.map((item, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <input type="text" value={item} onChange={e => updateListItem(idx, i, e.target.value)} className="w-full border-b border-gray-200 focus:border-secondary outline-none bg-transparent" placeholder={`Madde ${i + 1}`} />
                        <button type="button" onClick={() => removeListItem(idx, i)} className="text-red-400 hover:text-red-600 text-xs">Sil</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addListItem(idx)} className="text-secondary hover:underline text-sm">+ Madde Ekle</button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Kaydet Butonu ve Mesajlar */}
          <div className="mt-8 text-center">
            <button type="submit" className="bg-secondary text-white font-semibold py-3 px-8 rounded-lg hover:bg-secondary/90 transition" disabled={loading}>
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
            {success && <div className="text-green-600 font-semibold mt-4">Yazı başarıyla eklendi!</div>}
            {error && <div className="text-red-600 font-semibold mt-4">{error}</div>}
          </div>
        </form>

        {/* Canlı Önizleme */}
        <div className="mt-16">
          <h2 className="text-xl font-bold mb-6 text-center">Canlı Önizleme</h2>
          <article className="prose prose-lg max-w-none mx-auto bg-white rounded-2xl shadow p-8">
            {postData.cover_image && (
              <div className="relative w-full h-96 mb-8">
                <Image
                  src={postData.cover_image}
                  alt={postData.title || "Kapak Görseli"}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            )}
            <h1 className='text-3xl font-bold mb-2 outline-none'>{postData.title}</h1>
            {blocks.map((block, idx) => {
              if (block.type === 'h1') return <h1 className='text-3xl font-bold mb-2 outline-none' key={idx}>{block.content}</h1>;
              if (block.type === 'h2') return <h2 className='text-2xl font-semibold mb-2 outline-none' key={idx}>{block.content}</h2>;
              if (block.type === 'paragraph') return <p className='text-base mb-2 outline-none' key={idx}>{block.content}</p>;
              if (block.type === 'image' && block.content) return (
                <div key={idx} className="relative w-full h-96 my-8">
                  <Image
                    src={block.content}
                    alt={block.alt || "Blog görseli"}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
              );
              if (block.type === 'list') return (
                <ul className='list-disc list-inside' key={idx}>
                  {block.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              );
              return null;
            })}
          </article>
        </div>
      </div>
    </main>
  );
} 