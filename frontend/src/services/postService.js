import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Bilinmeyen bir sunucu hatası oluştu.' }));
    throw new Error(errorData.detail || `API Hatası: ${response.status}`);
  }
  // İçerik olmayan yanıtlar için (örn: 204 No Content)
  if (response.status === 204) {
    return null;
  }
  return response.json();
};

const getAuthHeaders = () => {
  const token = Cookies.get('token');
  if (!token) {
    // Bu durumda ideal olarak kullanıcı login sayfasına yönlendirilir.
    // Şimdilik sadece hata fırlatıyoruz.
    throw new Error('Yetkilendirme tokenı bulunamadı.');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};


export const postService = {
  // Öne çıkan yazıları getir
  async getFeaturedPosts() {
    const response = await fetch(`${API_URL}/posts/featured`);
    return handleResponse(response);
  },

  // Herkese açık, onaylanmış yazıları getir
  async getAllPosts(params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${API_URL}/posts?${queryParams}`);
    return handleResponse(response);
  },
  
  // Admin için tüm yazıları getir (onay durumuna göre filtreli)
  async getAllPostsForAdmin(params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${API_URL}/posts/admin/list?${queryParams}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Tek bir yazıyı slug ile getir
  async getPostBySlug(slug) {
    const response = await fetch(`${API_URL}/posts/slug/${slug}`);
    return handleResponse(response);
  },

  // Tek bir yazıyı ID ile getir
  async getPost(postId) {
    const response = await fetch(`${API_URL}/posts/${postId}`);
    return handleResponse(response);
  },

  // Harita yazılarını getir
  async getMapPosts() {
    const response = await fetch(`${API_URL}/posts/map-posts`);
    return handleResponse(response);
  },
  
  // Yazıyı sil
  async deletePost(postId) {
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    // Silme işlemi genelde 204 No Content döner, handleResponse bunu yönetir.
    return handleResponse(response);
  },

  // Yazıların toplam sayısını getir
  async getPostsCount() {
    try {
      const response = await fetch(`${API_URL}/posts/admin/count`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching posts count:', error);
      throw error;
    }
  },

  async updateFeaturedOrder(postIds) {
    const response = await fetch(`${API_URL}/posts/featured/order`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ post_ids: postIds }),
    });
    return handleResponse(response);
  },

  async toggleFeaturedStatus(postId) {
    const response = await fetch(`${API_URL}/posts/${postId}/toggle-featured`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }
}; 