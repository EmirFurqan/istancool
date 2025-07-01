import { authService } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Bir hata oluştu.');
  }
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return { success: true };
  }
  return response.json();
};

export const categoryService = {
  // Tüm kategorileri getir (admin için)
  async getAllCategories() {
    const response = await fetch(`${API_URL}/categories/`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(response);
  },

  // Anasayfada gösterilecek kategorileri getir
  async getHomepageCategories() {
    try {
      const response = await fetch(`${API_URL}/categories/homepage`);
      if (!response.ok) {
        throw new Error('Kategoriler yüklenemedi');
      }
      return await response.json();
    } catch (error) {
      console.error('Anasayfa kategorilerini çekerken hata:', error);
      throw error;
    }
  },

  // Bir kategorinin anasayfada gösterilme durumunu değiştir
  async toggleHomepageStatus(id) {
    const response = await fetch(`${API_URL}/categories/${id}/toggle-homepage`, {
      method: 'PATCH',
      headers: authService.getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Tek bir kategoriyi getir
  async getCategory(id) {
    try {
      const response = await fetch(`${API_URL}/categories/${id}`);
      return handleResponse(response);
    } catch (error) {
      console.error('Kategori alınamadı:', error);
      return null;
    }
  },

  // Yeni kategori oluştur
  async createCategory(categoryData) {
    try {
      const response = await fetch(`${API_URL}/categories/`, {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(categoryData),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Kategori oluşturulurken hata:', error);
      throw error;
    }
  },

  // Kategoriyi güncelle
  async updateCategory(id, categoryData) {
    try {
      const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'PUT',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(categoryData),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Kategori güncellenirken hata:', error);
      throw error;
    }
  },

  // Kategoriyi sil
  async deleteCategory(id) {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Kategori silinirken bir hata oluştu ve sunucudan detay alınamadı.' }));
      throw new Error(error.detail);
    }
    // For DELETE, often there's no content, handleResponse can be adjusted or bypassed.
    if (response.status === 204) {
      return { success: true };
    }
    return handleResponse(response);
  },

  async getCategories() {
    const response = await fetch(`${API_URL}/categories/`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(response);
  },

  async getCategoriesCount() {
    const response = await fetch(`${API_URL}/categories/count`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(response);
  }
}; 