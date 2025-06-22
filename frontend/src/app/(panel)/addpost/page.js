'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const BLOCK_TYPES = [
  { type: 'h1', label: 'Başlık (H1)' },
  { type: 'h2', label: 'Alt Başlık (H2)' },
  { type: 'paragraph', label: 'Paragraf' },
  { type: 'image', label: 'Resim' },
  { type: 'list', label: 'Liste' },
  { type: 'grid', label: 'Grid' },
];

const initialPostData = {
  title: '',
  cover_image: '',
  cover_image_file: null,
  category_id: '',
  district_id: '',
  latitude: '',
  longitude: '',
  content: '',
  is_published: false,
};

export default function AddPostPage() {
  const [blocks, setBlocks] = useState([]);
  const [postData, setPostData] = useState(initialPostData);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  // İlçeleri çek
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await axios.get(`${API_URL}/districts`);
        setDistricts(response.data);
      } catch (error) {
        console.error('İlçeler yüklenirken hata oluştu:', error);
      }
    };
    fetchDistricts();
  }, []);

  // Kategorileri çek
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Kategoriler yüklenirken hata oluştu:', error);
      }
    };
    fetchCategories();
  }, []);

  const handlePostDataChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPostData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const addBlock = (type) => {
    const newBlock =
      type === 'list'
        ? { type, items: [''] }
        : type === 'image'
        ? { type, src: '', content: '', file: null }
        : type === 'grid'
        ? { type, columns: 2, blocks: [] }
        : { type, content: '' };

    setBlocks((prev) => [...prev, newBlock]);
  };

  const updateGridColumns = (gridIdx, columns) => {
    setBlocks((prev) =>
      prev.map((block, idx) => {
        if (idx !== gridIdx || block.type !== 'grid') return block;
        return { ...block, columns };
      })
    );
  };

  const addBlockToGrid = (gridIdx, blockType, column) => {
    setBlocks((prev) =>
      prev.map((block, idx) => {
        if (idx !== gridIdx || block.type !== 'grid') return block;
        const newBlock = blockType === 'list' 
          ? { type: 'list', items: [''], column, id: Date.now() }
          : blockType === 'image'
          ? { type: 'image', src: '', content: '', file: null, column, id: Date.now() }
          : { type: blockType, content: '', column, id: Date.now() };
        return {
          ...block,
          blocks: [...block.blocks, newBlock]
        };
      })
    );
  };

  const updateBlockInGrid = (gridIdx, blockId, data) => {
    setBlocks((prev) =>
      prev.map((block, idx) => {
        if (idx !== gridIdx || block.type !== 'grid') return block;
        const newBlocks = block.blocks.map((b) => {
          if (b.id === blockId) {
            return {
              ...b,
              ...(data.content !== undefined ? { content: data.content } : {}),
              ...(data.file !== undefined ? { file: data.file } : {}),
              ...(data.items !== undefined ? { items: data.items } : {})
            };
          }
          return b;
        });
        return { ...block, blocks: newBlocks };
      })
    );
  };

  const removeBlockFromGrid = (gridIdx, blockId) => {
    setBlocks((prev) =>
      prev.map((block, idx) => {
        if (idx !== gridIdx || block.type !== 'grid') return block;
        return {
          ...block,
          blocks: block.blocks.filter((b) => b.id !== blockId)
        };
      })
    );
  };

  const updateBlock = (idx, data) => {
    setBlocks((prev) =>
      prev.map((b, i) => (i === idx ? { ...b, ...data } : b))
    );
  };

  const removeBlock = (idx) => {
    setBlocks((prev) => prev.filter((_, i) => i !== idx));
  };

  const addListItem = (blockIdx) => {
    setBlocks((prev) =>
      prev.map((block, i) =>
        i === blockIdx ? { ...block, items: [...block.items, ''] } : block
      )
    );
  };

  const updateListItem = (blockIdx, itemIdx, value) => {
    setBlocks((prev) =>
      prev.map((block, i) => {
        if (i !== blockIdx) return block;
        const newItems = [...block.items];
        newItems[itemIdx] = value;
        return { ...block, items: newItems };
      })
    );
  };

  const removeListItem = (blockIdx, itemIdx) => {
    setBlocks((prev) =>
      prev.map((block, i) => {
        if (i !== blockIdx) return block;
        return { ...block, items: block.items.filter((_, j) => j !== itemIdx) };
      })
    );
  };

  const handleCoverImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPostData((prev) => ({
      ...prev,
      cover_image: url,
      cover_image_file: file,
    }));
  };

  const handleBlockImageSelect = (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const updated = [...blocks];
    updated[idx] = {
      ...updated[idx],
      content: url, // geçici gösterim
      file,
      src: '', // backend dolduracak
    };
    setBlocks(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', postData.title);
      formData.append('content', postData.content || '');
      formData.append('category_id', postData.category_id);
      formData.append('district_id', postData.district_id);
      formData.append('latitude', postData.latitude);
      formData.append('longitude', postData.longitude);
      formData.append('is_published', postData.is_published);

      if (postData.cover_image_file) {
        formData.append('cover_image', postData.cover_image_file);
      }

      // Grid bloklarındaki resimleri işle
      const processedBlocks = blocks.map((block, idx) => {
        if (block.type === 'image' && block.file) {
          formData.append(`block_image_${idx}`, block.file);
          return {
            type: 'image',
            src: '', // Backend dolduracak
            alt: block.alt || '',
          };
        }
        
        if (block.type === 'grid') {
          // Grid içindeki blokları işle
          const processedGridBlocks = block.blocks.map((gridBlock, gridBlockIdx) => {
            if (gridBlock.type === 'image' && gridBlock.file) {
              formData.append(`grid_${idx}_block_image_${gridBlockIdx}`, gridBlock.file);
              return {
                ...gridBlock,
                content: '', // Backend dolduracak
                file: null,
              };
            }
            return gridBlock;
          });

          return {
            ...block,
            blocks: processedGridBlocks,
          };
        }

        return block;
      });

      formData.append('blocks', JSON.stringify(processedBlocks));

      const res = await axios.post(`${API_URL}/posts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      });

      if (res.status === 200) {
        setSuccess(true);
        setPostData(initialPostData);
        setBlocks([]);
        setTimeout(() => {
          setSuccess(false);
          router.push('/blog');
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Post oluşturulurken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const moveBlock = (idx, direction) => {
    const newBlocks = [...blocks];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= newBlocks.length) return;
    [newBlocks[idx], newBlocks[targetIdx]] = [newBlocks[targetIdx], newBlocks[idx]];
    setBlocks(newBlocks);
  };

  const onDragEnd = (result) => {
    const { source, destination, type } = result;

    // Eğer hedef yoksa veya kaynak ve hedef aynıysa işlem yapma
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }

    // Grid bloğu içindeki sürükleme
    if (source.droppableId.startsWith('grid-') && destination.droppableId.startsWith('grid-')) {
      const gridId = parseInt(source.droppableId.split('-')[1]);
      const sourceIndex = source.index;
      const destIndex = destination.index;

      setBlocks((prev) =>
        prev.map((block, idx) => {
          if (idx !== gridId || block.type !== 'grid') return block;
          const newBlocks = [...block.blocks];
          const [removed] = newBlocks.splice(sourceIndex, 1);
          newBlocks.splice(destIndex, 0, removed);
          return { ...block, blocks: newBlocks };
        })
      );
      return;
    }

    // Ana bloklar arası sürükleme
    if (type === 'block') {
      const newBlocks = [...blocks];
      const [removed] = newBlocks.splice(source.index, 1);
      newBlocks.splice(destination.index, 0, removed);
      setBlocks(newBlocks);
    }
  };

  const renderBlock = (block, idx) => {
    switch (block.type) {
      case 'h1':
        return <h1 key={idx} className="text-4xl font-bold mb-6">{block.content}</h1>;
      case 'h2':
        return <h2 key={idx} className="text-3xl font-semibold mb-4">{block.content}</h2>;
      case 'paragraph':
        return <p key={idx} className="text-lg leading-relaxed mb-6">{block.content}</p>;
      case 'image':
        return block.content && block.content.startsWith('blob:') ? (
          <div key={idx} className="relative aspect-video rounded-lg overflow-hidden my-6">
            <Image
              src={block.content}
              alt="Blog görseli"
              fill
              className="object-cover"
            />
          </div>
        ) : null;
      case 'list':
        return (
          <ul key={idx} className="list-disc pl-6 text-lg mb-6">
            {block.items.map((item, i) => (
              <li key={i} className="mb-2">{item}</li>
            ))}
          </ul>
        );
      case 'grid':
        return (
          <div key={idx} className="space-y-4">
            <div className={`grid grid-cols-1 md:grid-cols-${block.columns} gap-6`}>
              {Array.from({ length: block.columns }).map((_, colIdx) => (
                <div key={`grid-${idx}-col-${colIdx}`} className="space-y-4">
                  {block.blocks
                    .filter((b) => b.column === colIdx)
                    .map((gridBlock) => (
                      <div key={`grid-${idx}-block-${gridBlock.id}`} className="mb-4 last:mb-0">
                        {gridBlock.type === 'paragraph' && (
                          <p className="text-lg leading-relaxed">{gridBlock.content}</p>
                        )}
                        {gridBlock.type === 'image' && gridBlock.content && gridBlock.content.startsWith('blob:') && (
                          <div className="relative aspect-video rounded-lg overflow-hidden">
                            <Image
                              src={gridBlock.content}
                              alt="Grid görseli"
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        {gridBlock.type === 'list' && (
                          <ul className="list-disc pl-6 text-lg">
                            {gridBlock.items.map((item, itemIdx) => (
                              <li key={`grid-${idx}-block-${gridBlock.id}-item-${itemIdx}`} className="mb-2">{item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen">
      <div className="flex h-screen">
        {/* Sol Taraf - Geniş Önizleme */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm mb-4">
                <span>{new Date().toLocaleDateString('tr-TR')}</span>
                <span>•</span>
                <span>Yazar</span>
                <span>•</span>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs text-white">Kategori</span>
              </div>
              {postData.cover_image && (
                <div className="relative">
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white via-white/80 to-white/0 z-10"></div>
                  <Image
                    src={postData.cover_image}
                    alt={postData.title}
                    width={2000}
                    height={200}
                    className="w-full h-[50vh] object-cover"
                  />
                  <h1 className="text-3xl font-bold mb-2 relative z-20 text-black mt-[-50px] px-6 pb-6 text-center">{postData.title || 'Başlık'}</h1>
                </div>
              )}
              {postData.content && (
                <div className="max-w-3xl mx-auto text-center mb-8">
                  <p className="text-lg text-gray-600 italic">{postData.content}</p>
                </div>
              )}
            </div>
            <article className="prose prose-lg max-w-none text-gray-800">
              {blocks.map((block, idx) => renderBlock(block, idx))}
            </article>
          </div>
        </div>

        {/* Sağ Taraf - Sidebar */}
        <div className="w-[480px] bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">İçerik Düzenle</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Post Bilgileri */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <h3 className="font-medium text-gray-900">Temel Bilgiler</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                    <input 
                      name="title" 
                      value={postData.title} 
                      onChange={handlePostDataChange} 
                      placeholder="Başlık" 
                      className="w-full border border-gray-200 p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                    <select
                      name="category_id"
                      value={postData.category_id}
                      onChange={handlePostDataChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="">Kategori Seçin</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">İçerik</label>
                    <textarea 
                      name="content" 
                      value={postData.content} 
                      onChange={handlePostDataChange} 
                      placeholder="İçerik" 
                      className="w-full border border-gray-200 p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                      rows="3" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">İlçe</label>
                    <select
                      name="district_id"
                      value={postData.district_id}
                      onChange={handlePostDataChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">İlçe Seçin</option>
                      {districts.map((district) => (
                        <option key={district.id} value={district.id}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Enlem (Latitude)</label>
                      <input 
                        name="latitude" 
                        value={postData.latitude} 
                        onChange={handlePostDataChange} 
                        placeholder="Örn: 41.0082" 
                        type="text"
                        pattern="^-?([1-8]?[0-9](\.[0-9]+)?|90(\.0+)?)$"
                        className="w-full border border-gray-200 p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Boylam (Longitude)</label>
                      <input 
                        name="longitude" 
                        value={postData.longitude} 
                        onChange={handlePostDataChange} 
                        placeholder="Örn: 28.9784" 
                        type="text"
                        pattern="^-?((1?[0-7]?|[0-9]?)[0-9](\.[0-9]+)?|180(\.0+)?)$"
                        className="w-full border border-gray-200 p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kapak Görseli</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleCoverImageSelect} 
                      className="w-full text-sm border border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                    />
                  </div>
                </div>
              </div>

              {/* Bloklar */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">İçerik Blokları</h3>
                  <div className="flex gap-2">
                    {BLOCK_TYPES.map((b) => (
                      <button 
                        key={b.type} 
                        type="button" 
                        onClick={() => addBlock(b.type)} 
                        className="bg-white hover:bg-gray-100 px-3 py-1 rounded-lg text-sm border border-gray-200 transition-colors"
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="blocks" type="block">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="space-y-3"
                      >
                        {blocks.map((block, idx) => (
                          <Draggable key={idx} draggableId={`block-${idx}`} index={idx}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="bg-white p-4 rounded-lg border border-gray-200 relative group"
                              >
                                <div
                                  {...provided.dragHandleProps}
                                  className="absolute top-2 left-2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="9" cy="12" r="1" />
                                    <circle cx="9" cy="5" r="1" />
                                    <circle cx="9" cy="19" r="1" />
                                    <circle cx="15" cy="12" r="1" />
                                    <circle cx="15" cy="5" r="1" />
                                    <circle cx="15" cy="19" r="1" />
                                  </svg>
                                </div>
                                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    type="button" 
                                    onClick={() => moveBlock(idx, 'up')} 
                                    disabled={idx === 0}
                                    className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="m18 15-6-6-6 6"/>
                                    </svg>
                                  </button>
                                  <button 
                                    type="button" 
                                    onClick={() => moveBlock(idx, 'down')} 
                                    disabled={idx === blocks.length - 1}
                                    className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="m6 9 6 6 6-6"/>
                                    </svg>
                                  </button>
                                  <button 
                                    type="button" 
                                    onClick={() => removeBlock(idx)} 
                                    className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg text-red-500 transition-colors"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <line x1="18" y1="6" x2="6" y2="18"></line>
                                      <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                  </button>
                                </div>

                                <div className="mt-2">
                                  {block.type === 'h1' && (
                                    <input 
                                      type="text" 
                                      value={block.content} 
                                      onChange={(e) => updateBlock(idx, { content: e.target.value })} 
                                      placeholder="Başlık (H1)" 
                                      className="w-full text-sm font-bold border border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                                    />
                                  )}
                                  {block.type === 'h2' && (
                                    <input 
                                      type="text" 
                                      value={block.content} 
                                      onChange={(e) => updateBlock(idx, { content: e.target.value })} 
                                      placeholder="Alt Başlık (H2)" 
                                      className="w-full text-sm font-semibold border border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                                    />
                                  )}
                                  {block.type === 'paragraph' && (
                                    <textarea 
                                      value={block.content} 
                                      onChange={(e) => updateBlock(idx, { content: e.target.value })} 
                                      placeholder="Paragraf metni" 
                                      className="w-full text-sm border border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                                      rows="3" 
                                    />
                                  )}
                                  {block.type === 'image' && (
                                    <div className="space-y-2">
                                      <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={(e) => handleBlockImageSelect(e, idx)} 
                                        className="w-full text-sm border border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                                      />
                                    </div>
                                  )}
                                  {block.type === 'list' && (
                                    <div className="space-y-2">
                                      {block.items.map((item, i) => (
                                        <div key={i} className="flex gap-2 items-center">
                                          <input 
                                            value={item} 
                                            onChange={(e) => updateListItem(idx, i, e.target.value)} 
                                            className="w-full border border-gray-200 p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                                          />
                                          <button 
                                            type="button" 
                                            onClick={() => removeListItem(idx, i)} 
                                            className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg text-red-500 transition-colors"
                                          >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                              <line x1="18" y1="6" x2="6" y2="18"></line>
                                              <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                          </button>
                                        </div>
                                      ))}
                                      <button 
                                        type="button" 
                                        onClick={() => addListItem(idx)} 
                                        className="text-blue-600 text-sm hover:text-blue-700 transition-colors"
                                      >
                                        + Madde Ekle
                                      </button>
                                    </div>
                                  )}
                                  {block.type === 'grid' && (
                                    <div className="space-y-4">
                                      <div className="flex items-center gap-4 mb-4">
                                        <label className="text-sm font-medium text-gray-700">Sütun Sayısı:</label>
                                        <select
                                          value={block.columns}
                                          onChange={(e) => {
                                            const newColumns = parseInt(e.target.value);
                                            const currentBlocks = block.blocks || [];
                                            const updatedBlocks = currentBlocks.slice(0, newColumns);
                                            updateBlock(idx, { columns: newColumns, blocks: updatedBlocks });
                                          }}
                                          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                          <option value="1">1 Sütun</option>
                                          <option value="2">2 Sütun</option>
                                          <option value="3">3 Sütun</option>
                                          <option value="4">4 Sütun</option>
                                        </select>
                                      </div>
                                      <div className="space-y-4">
                                        {Array.from({ length: block.columns }).map((_, colIdx) => (
                                          <div key={`grid-${idx}-col-${colIdx}`} className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="text-sm font-medium text-gray-700 mb-3">{colIdx + 1}. Sütun</h4>
                                            {block.blocks
                                              .filter((b) => b.column === colIdx)
                                              .map((gridBlock) => (
                                                <div key={`grid-${idx}-block-${gridBlock.id}`} className="mb-4 last:mb-0">
                                                  {gridBlock.type === 'paragraph' && (
                                                    <textarea
                                                      value={gridBlock.content}
                                                      onChange={(e) => updateBlockInGrid(idx, gridBlock.id, { content: e.target.value })}
                                                      placeholder="İçerik"
                                                      className="w-full text-sm border border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                      rows="3"
                                                    />
                                                  )}
                                                  {gridBlock.type === 'image' && (
                                                    <div className="space-y-2">
                                                      {gridBlock.content && gridBlock.content.startsWith('blob:') && (
                                                        <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                                                          <Image
                                                            src={gridBlock.content}
                                                            alt="Grid görseli"
                                                            fill
                                                            className="object-cover"
                                                          />
                                                        </div>
                                                      )}
                                                      <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                          const file = e.target.files[0];
                                                          if (!file) return;
                                                          const url = URL.createObjectURL(file);
                                                          updateBlockInGrid(idx, gridBlock.id, { 
                                                            content: url,
                                                            file: file
                                                          });
                                                        }}
                                                        className="w-full text-sm border border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                      />
                                                    </div>
                                                  )}
                                                  {gridBlock.type === 'list' && (
                                                    <div className="space-y-2">
                                                      {gridBlock.items.map((item, itemIdx) => (
                                                        <div key={`grid-${idx}-block-${gridBlock.id}-item-${itemIdx}`} className="flex gap-2 items-center">
                                                          <input
                                                            value={item}
                                                            onChange={(e) => {
                                                              const newItems = [...gridBlock.items];
                                                              newItems[itemIdx] = e.target.value;
                                                              updateBlockInGrid(idx, gridBlock.id, { items: newItems });
                                                            }}
                                                            className="w-full border border-gray-200 p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                          />
                                                          <button
                                                            type="button"
                                                            onClick={() => {
                                                              const newItems = gridBlock.items.filter((_, j) => j !== itemIdx);
                                                              updateBlockInGrid(idx, gridBlock.id, { items: newItems });
                                                            }}
                                                            className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg text-red-500 transition-colors"
                                                          >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                              <line x1="18" y1="6" x2="6" y2="18"></line>
                                                              <line x1="6" y1="6" x2="18" y2="18"></line>
                                                            </svg>
                                                          </button>
                                                        </div>
                                                      ))}
                                                      <button
                                                        type="button"
                                                        onClick={() => {
                                                          const newItems = [...gridBlock.items, ''];
                                                          updateBlockInGrid(idx, gridBlock.id, { items: newItems });
                                                        }}
                                                        className="text-blue-600 text-sm hover:text-blue-700 transition-colors"
                                                      >
                                                        + Madde Ekle
                                                      </button>
                                                    </div>
                                                  )}
                                                  <button
                                                    type="button"
                                                    onClick={() => removeBlockFromGrid(idx, gridBlock.id)}
                                                    className="mt-2 p-1.5 bg-red-50 hover:bg-red-100 rounded-lg text-red-500 transition-colors"
                                                  >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                      <line x1="18" y1="6" x2="6" y2="18"></line>
                                                      <line x1="6" y1="6" x2="18" y2="18"></line>
                                                    </svg>
                                                  </button>
                                                </div>
                                              ))}
                                            {block.blocks.filter((b) => b.column === colIdx).length === 0 && (
                                              <div className="flex flex-wrap gap-2">
                                                {BLOCK_TYPES.filter(b => b.type !== 'grid').map((b) => (
                                                  <button
                                                    key={`grid-${idx}-col-${colIdx}-type-${b.type}`}
                                                    type="button"
                                                    onClick={() => addBlockToGrid(idx, b.type, colIdx)}
                                                    className="bg-white hover:bg-gray-100 px-3 py-1 rounded-lg text-sm border border-gray-200 transition-colors"
                                                  >
                                                    {b.label}
                                                  </button>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>

              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              {success && <div className="text-green-500 text-sm text-center">Blog yazısı başarıyla oluşturuldu!</div>}

              <div className="flex justify-end">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                  {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
