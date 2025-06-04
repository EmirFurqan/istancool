'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Check } from 'lucide-react';
import { authService } from '../../../services/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const checkPasswordRequirements = (password) => {
    setPasswordValidation({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[@$!%*?&]/.test(password)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const allRequirementsMet = Object.values(passwordValidation).every(value => value === true);

    if (!allRequirementsMet) {
      setError('Lütfen tüm şifre gereksinimlerini karşılayın.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    setLoading(true);

    try {
      await authService.register(
        `${formData.firstName} ${formData.lastName}`,
        formData.email,
        formData.password
      );
      router.push('/login');
    } catch (error) {
      setError(error.message || 'Kayıt olurken bir hata oluştu');
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
            Yeni Hesap Oluştur
          </h2>
          <p className="mt-2 text-center text-sm text-white/70">
            İstanbul Cool'a katılın
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-primary mb-1">
                  Ad
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-150 ease-in-out"
                  placeholder="Ad"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-primary mb-1">
                  Soyad
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-150 ease-in-out"
                  placeholder="Soyad"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>
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
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-150 ease-in-out"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    checkPasswordRequirements(e.target.value);
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex items-center text-xs">
                  <span className={`mr-2 ${passwordValidation.length ? 'text-green-500' : 'text-white/70'}`}>
                    {passwordValidation.length ? <Check size={14} /> : '•'}
                  </span>
                  <span className={passwordValidation.length ? 'text-green-500' : 'text-white/70'}>En az 8 karakter</span>
                </div>
                <div className="flex items-center text-xs">
                  <span className={`mr-2 ${passwordValidation.uppercase ? 'text-green-500' : 'text-white/70'}`}>
                    {passwordValidation.uppercase ? <Check size={14} /> : '•'}
                  </span>
                  <span className={passwordValidation.uppercase ? 'text-green-500' : 'text-white/70'}>En az 1 büyük harf</span>
                </div>
                <div className="flex items-center text-xs">
                  <span className={`mr-2 ${passwordValidation.lowercase ? 'text-green-500' : 'text-white/70'}`}>
                    {passwordValidation.lowercase ? <Check size={14} /> : '•'}
                  </span>
                  <span className={passwordValidation.lowercase ? 'text-green-500' : 'text-white/70'}>En az 1 küçük harf</span>
                </div>
                <div className="flex items-center text-xs">
                  <span className={`mr-2 ${passwordValidation.number ? 'text-green-500' : 'text-white/70'}`}>
                    {passwordValidation.number ? <Check size={14} /> : '•'}
                  </span>
                  <span className={passwordValidation.number ? 'text-green-500' : 'text-white/70'}>En az 1 sayı</span>
                </div>
                <div className="flex items-center text-xs">
                  <span className={`mr-2 ${passwordValidation.special ? 'text-green-500' : 'text-white/70'}`}>
                    {passwordValidation.special ? <Check size={14} /> : '•'}
                  </span>
                  <span className={passwordValidation.special ? 'text-green-500' : 'text-white/70'}>En az 1 özel karakter</span>
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-primary mb-1">
                Şifre Tekrar
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-150 ease-in-out"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-bold text-secondary bg-primary duration-300 hover:bg-primary/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-white/90">
            Zaten hesabınız var mı?{' '}
            <Link href="/login" className="font-medium text-primary hover:text-primary/80 transition duration-150 ease-in-out">
              Giriş yapın
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 