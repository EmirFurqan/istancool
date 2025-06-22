'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { postService } from '@/services/postService';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await postService.getAllPostsForAdmin();
        setPosts(data);
        setError(null);
      } catch (error) {
        console.error("Yazılar getirilirken hata oluştu:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);
  
  const handleDeletePost = async (postId) => {
    if (window.confirm("Bu yazıyı silmek istediğinizden emin misiniz?")) {
      try {
        await postService.deletePost(postId);
        setPosts(posts.filter(post => post.id !== postId));
        setError(null);
      } catch (error) {
        console.error("Yazı silinirken hata:", error);
        setError(error.message);
      }
    }
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Yazı Yönetimi</h1>
        <Link
          href="/addpost"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Yeni Yazı Ekle
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Hata: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">Yükleniyor...</div>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white shadow">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Başlık</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Kategori</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Durum</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <tr key={post.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{post.title}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{post.category?.name || 'N/A'}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            post.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                            post.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                            {post.status}
                        </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                      <Link href={`/admin/posts/edit/${post.slug}`} className="text-indigo-600 hover:text-indigo-900">
                        Düzenle
                      </Link>
                      <button onClick={() => handleDeletePost(post.id)} className="ml-4 text-red-600 hover:text-red-900">
                        Sil
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">Henüz hiç yazı oluşturulmamış.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 