import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const authService = {
  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      console.log('Login response:', response.data);
      if (response.data.access_token) {
        Cookies.set('token', response.data.access_token, { 
          secure: false,
          sameSite: 'lax',
          path: '/'
        });
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data || error.message;
    }
  },

  async register(name, email, password) {
    try {
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || '';

      const response = await axios.post(`${API_URL}/auth/register`, {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getCurrentUser() {
    try {
      const token = Cookies.get('token');
      if (!token) return null;

      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Kullanıcı bilgileri alınamadı:', error);
      return null;
    }
  },

  logout() {
    Cookies.remove('token');
  },

  getToken() {
    return Cookies.get('token');
  },

  getAuthHeaders() {
    const token = this.getToken();
    if (!token) {
      return { 'Content-Type': 'application/json' };
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  },
}; 