'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { authService } from '../../../services/auth';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(formData.email, formData.password);
      router.push('/');
    } catch (error) {
      setError(error.message || 'Giriş yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/ayasofya.jpg')",
          filter: "brightness(0.7)"
        }}
      />
      <div className="max-w-md w-full space-y-8 p-10 bg-black/50 backdrop-blur-xs rounded-2xl shadow-lg relative z-10">
        <div className="flex flex-col items-center">
          <div className="mb-8">
            <Image
              src="/logogreen.png"
              alt="İstanbul Cool Logo"
              width={150}
              height={150}
              className=""
            />
          </div>
          <h2 className="text-center text-4xl font-bold text-white/90">
            Giriş Yap
          </h2>
          <p className="mt-2 text-center text-sm text-white/70">
            İstanbul Cool'a giriş yapın
          </p>
        </div>
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary mb-1">
                E-posta
              </label>
              <input
                id="email"
                type="email"
                required
                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-150 ease-in-out"
                placeholder="ornek@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary mb-1">
                Şifre
              </label>
              <input
                id="password"
                type="password"
                required
                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-150 ease-in-out"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-primary hover:text-primary/80 transition duration-150 ease-in-out">
                Şifremi unuttum
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-bold text-secondary bg-primary duration-300 hover:bg-primary/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </div>
        </form>
        <div className="text-center mt-6">
          <p className="text-sm text-white/90">
            Hesabınız yok mu?{' '}
            <Link href="/register" className="font-medium text-primary hover:text-primary/80 transition duration-150 ease-in-out">
              Hemen kayıt olun
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 