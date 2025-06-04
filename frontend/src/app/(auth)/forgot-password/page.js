'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API çağrısı yapılacak
      setIsSubmitted(true);
    } catch (error) {
      console.error('Password reset error:', error);
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
            Şifre Sıfırlama
          </h2>
          <p className="mt-2 text-center text-sm text-white/70">
            E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim
          </p>
        </div>

        {!isSubmitted ? (
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-bold text-secondary bg-primary duration-300 hover:bg-primary/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition ease-in-out"
              >
                Şifre Sıfırlama Bağlantısı Gönder
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center p-4 bg-green-50/10 rounded-lg">
            <p className="text-green-400">
              Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.
            </p>
          </div>
        )}

        <div className="text-center mt-6">
          <p className="text-sm text-white/90">
            <Link href="/login" className="font-medium text-primary hover:text-primary/80 transition duration-150 ease-in-out">
              Giriş sayfasına dön
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 