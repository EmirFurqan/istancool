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

  logout() {
    Cookies.remove('token');
  },

  getToken() {
    return Cookies.get('token');
  },
}; 