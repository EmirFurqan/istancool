'use client';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Admin Paneline Hoş Geldiniz</h1>
      <p className="text-lg text-gray-600">
        Bu paneli kullanarak içerikleri yönetebilir, yeni yazılar ekleyebilir ve site ayarlarını düzenleyebilirsiniz.
      </p>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Yazı Yönetimi</h2>
          <p className="text-gray-700">Yeni yazılar oluşturun, mevcutları düzenleyin veya silin.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Kategori Yönetimi</h2>
          <p className="text-gray-700">Yazılarınız için yeni kategoriler ekleyin ve yönetin.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Kullanıcılar</h2>
          <p className="text-gray-700">Kayıtlı kullanıcıları ve yetkilerini görüntüleyin.</p>
        </div>
      </div>
    </div>
  );
}