'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    avatar: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }
    // Kullanıcı verilerini getir
    axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setUserData({
          name: res.data.first_name + ' ' + res.data.last_name,
          email: res.data.email,
          avatar: '',
        });
        setEditedData({
          name: res.data.first_name + ' ' + res.data.last_name,
          email: res.data.email,
        });
      })
      .catch(() => {
        Cookies.remove('token');
        router.push('/login');
      });
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        router.push('/login');
        return;
      }
      const [firstName, ...lastNameArr] = editedData.name.trim().split(' ');
      const lastName = lastNameArr.join(' ');
      await axios.put(`${API_URL}/auth/me`, {
        first_name: firstName,
        last_name: lastName,
        email: editedData.email,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData({ ...userData, ...editedData });
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  const handleCancel = () => {
    setEditedData({
      name: userData.name,
      email: userData.email,
    });
    setIsEditing(false);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl mx-auto">
          <div className="bg-white shadow-2xl rounded-3xl p-8 sm:p-10 flex flex-col items-center">
            {/* Avatar Alanı */}
            <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center mb-6 shadow-md">
              {userData.avatar ? (
                <img src={userData.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-indigo-600">
                  {userData.name ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase() : '?'}
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Profil Bilgileri</h3>
            <p className="text-gray-500 mb-6">Kişisel bilgilerinizi görüntüleyin ve güncelleyin.</p>
            <div className="w-full">
              {!isEditing ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
                    <div className="mt-1 text-lg text-gray-900 font-semibold">{userData.name}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">E-posta</label>
                    <div className="mt-1 text-lg text-gray-900 font-semibold">{userData.email}</div>
                  </div>
                  <button
                    onClick={handleEdit}
                    className="w-full mt-4 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow transition-all"
                  >
                    Düzenle
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                      value={editedData.name}
                      onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">E-posta</label>
                    <input
                      type="email"
                      className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                      value={editedData.email}
                      onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                    />
                  </div>
                  <div className="flex space-x-4 mt-4">
                    <button
                      onClick={handleSave}
                      className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-green-600 hover:bg-green-700 shadow transition-all"
                    >
                      Kaydet
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 shadow transition-all"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 