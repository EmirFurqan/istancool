'use client';

import { useState, useEffect } from 'react';
import { postService } from '@/services/postService';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical } from 'lucide-react';

export default function FeaturedPostsPage() {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [featured, all] = await Promise.all([
          postService.getFeaturedPosts(),
          postService.getAllPostsForAdmin({ limit: 1000 }) // Fetch all posts for the selector
        ]);
        setFeaturedPosts(featured);
        setAllPosts(all);
        setError(null);
      } catch (err) {
        console.error("Veri yüklenirken hata:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(featuredPosts);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setFeaturedPosts(items);
  };

  const addPostToFeatured = (postId) => {
    const postToAdd = allPosts.find(p => p.id === parseInt(postId));
    if (postToAdd && !featuredPosts.some(p => p.id === postToAdd.id)) {
      setFeaturedPosts([...featuredPosts, postToAdd]);
    }
  };

  const removePostFromFeatured = (postId) => {
    setFeaturedPosts(featuredPosts.filter(p => p.id !== postId));
  };
  
  const handleSaveChanges = async () => {
    setIsSaving(true);
    setError(null);
    try {
        const post_ids = featuredPosts.map(p => p.id);
        await postService.updateFeaturedOrder(post_ids);
        // Optional: show a success message
    } catch (err) {
        console.error("Sıralama kaydedilirken hata:", err);
        setError(err.message);
    } finally {
        setIsSaving(false);
    }
  };

  const filteredAllPosts = allPosts.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center">Yükleniyor...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Hata: {error}</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Öne Çıkanları Yönet</h1>
        <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
        >
            {isSaving ? 'Kaydediliyor...' : 'Sıralamayı Kaydet'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Draggable list of featured posts */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Sıralama</h2>
          <div className="bg-white p-4 rounded-lg shadow-md min-h-[400px]">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="featuredPosts">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                    {featuredPosts.map((post, index) => (
                      <Draggable key={post.id} draggableId={String(post.id)} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`flex items-center justify-between p-3 rounded-lg bg-gray-50 border ${snapshot.isDragging ? 'shadow-lg' : 'shadow-sm'}`}
                          >
                            <div className="flex items-center">
                              <div {...provided.dragHandleProps} className="cursor-grab mr-4">
                                <GripVertical className="text-gray-400" />
                              </div>
                              <span className="font-medium text-gray-800">{post.title}</span>
                            </div>
                            <button
                              onClick={() => removePostFromFeatured(post.id)}
                              className="text-red-500 hover:text-red-700 text-sm font-semibold"
                            >
                              Kaldır
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            {featuredPosts.length === 0 && (
                <div className="text-center text-gray-500 py-16">
                    Öne çıkan yazı yok. Sağdaki listeden ekleyin.
                </div>
            )}
          </div>
        </div>

        {/* Right Side: List of all posts to add from */}
        <div>
            <h2 className="text-xl font-semibold mb-4">Yazı Ekle</h2>
            <div className="bg-white p-4 rounded-lg shadow-md">
                <input
                    type="text"
                    placeholder="Yazı ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md"
                />
                <div className="max-h-[400px] overflow-y-auto">
                    {filteredAllPosts.map(post => (
                        <div key={post.id} className="flex justify-between items-center p-2 border-b last:border-b-0">
                            <span className="text-gray-700">{post.title}</span>
                            <button
                                onClick={() => addPostToFeatured(post.id)}
                                disabled={featuredPosts.some(p => p.id === post.id)}
                                className="text-blue-500 hover:text-blue-700 text-sm font-semibold disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                Ekle
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
} 