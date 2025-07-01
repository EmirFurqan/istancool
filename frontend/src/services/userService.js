import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Bilinmeyen bir sunucu hatası oluştu.' }));
    throw new Error(errorData.detail || `API Hatası: ${response.status}`);
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
};

const getAuthHeaders = () => {
  const token = Cookies.get('token');
  if (!token) {
    throw new Error('Yetkilendirme tokenı bulunamadı.');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const userService = {
  async getUsers(params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${API_URL}/users?${queryParams}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async getUsersCount() {
    const response = await fetch(`${API_URL}/users/count`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
}; 