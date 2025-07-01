'use client';

import { useState, useEffect, useMemo } from 'react';
import { categoryService } from '@/services/category';
import Modal from '@/components/Admin/Modal';
import IconPicker from '@/components/Admin/IconPicker';
import { icons, Smile } from 'lucide-react';

const initialCategoryState = {
  name: '',
  color: '#000000',
  icon: null,
  is_active: true,
  show_on_homepage: false,
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(initialCategoryState);
  const [isEditing, setIsEditing] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAllCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      console.error("Kategoriler getirilirken hata oluştu:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openModalForAdd = () => {
    setIsEditing(false);
    setCurrentCategory(initialCategoryState);
    setIsModalOpen(true);
  };

  const openModalForEdit = (category) => {
    setIsEditing(true);
    setCurrentCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategory(prev => ({ ...prev, [name]: value }));
  };

  const handleIconSelect = (iconName) => {
    setCurrentCategory(prev => ({ ...prev, icon: iconName }));
    setIsIconPickerOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentCategory.name.trim()) return;

    try {
      if (isEditing) {
        await categoryService.updateCategory(currentCategory.id, currentCategory);
      } else {
        await categoryService.createCategory(currentCategory);
      }
      fetchCategories(); // Re-fetch all categories to show the latest data
      closeModal();
    } catch (err) {
      console.error("Kategori işlenirken hata:", err);
      setError(err.response?.data?.detail || err.message);
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
        try {
            await categoryService.deleteCategory(id);
            fetchCategories(); // Refresh list
        } catch (err) {
            console.error("Kategori silinirken hata:", err);
            setError(err.response?.data?.detail || err.message);
        }
    }
  };

  const handleToggleHomepage = async (id) => {
    try {
      await categoryService.toggleHomepageStatus(id);
      fetchCategories(); // Listeyi yenile
    } catch (err) {
      console.error("Anasayfa durumu güncellenirken hata:", err);
      setError(err.response?.data?.detail || err.message);
    }
  };

  const filteredCategories = useMemo(() => 
    categories.filter(category => 
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [categories, searchTerm]);

  const renderIcon = (iconName) => {
    const IconComponent = icons[iconName] || Smile;
    return <IconComponent className="h-6 w-6" />;
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Kategori Yönetimi</h1>
        <button 
          onClick={openModalForAdd}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          + Yeni Kategori Ekle
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
          <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
             <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Kapat</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
          </button>
        </div>
      )}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Kategori ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İkon</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adı</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Renk</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Anasayfada Göster</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="5" className="text-center py-4">Yükleniyor...</td></tr>
            ) : filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{renderIcon(category.icon)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span style={{ backgroundColor: category.color }} className="px-2 inline-block h-6 w-16 border rounded-md"></span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                      onClick={() => handleToggleHomepage(category.id)}
                      className={`p-2 rounded-full transition-colors ${
                        category.show_on_homepage 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                      title={category.show_on_homepage ? "Anasayfadan kaldır" : "Anasayfada göster"}
                    >
                      {category.show_on_homepage ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.88071 14.8807C3.02871 13.0287 2.00002 10.6337 2.00002 8.00001C2.00002 4.6863 4.6863 2.00001 8.00002 2.00001C10.6337 2.00001 13.0287 3.02871 14.8807 4.88071M17.1193 9.1193C18.9713 10.9713 20 13.3663 20 16C20 19.3137 17.3137 22 14 22C11.3663 22 8.97133 20.9713 7.11933 19.1193" />
                          <path d="M2 2L22 22" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button onClick={() => openModalForEdit(category)} className="text-indigo-600 hover:text-indigo-900 transition-colors">Düzenle</button>
                    <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-900 transition-colors">Sil</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-sm text-gray-500">
                  {searchTerm ? 'Arama sonucuyla eşleşen kategori bulunamadı.' : 'Hiç kategori bulunamadı.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          title={isEditing ? 'Kategoriyi Düzenle' : 'Yeni Kategori Ekle'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">Kategori Adı</label>
              <input
                type="text"
                id="categoryName"
                name="name"
                value={currentCategory.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Örn: Gezi Rehberleri"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="categoryColor" className="block text-sm font-medium text-gray-700 mb-1">Renk</label>
                <input
                  type="color"
                  id="categoryColor"
                  name="color"
                  value={currentCategory.color}
                  onChange={handleInputChange}
                  className="w-full h-10 px-1 py-1 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">İkon</label>
                <button
                  type="button"
                  onClick={() => setIsIconPickerOpen(true)}
                  className="w-full h-10 flex items-center justify-center border border-gray-300 rounded-md bg-white hover:bg-gray-50"
                >
                  {currentCategory.icon ? renderIcon(currentCategory.icon) : 'İkon Seç'}
                </button>
              </div>
            </div>
            <div className="flex items-center">
                <input
                  id="show_on_homepage"
                  name="show_on_homepage"
                  type="checkbox"
                  checked={currentCategory.show_on_homepage}
                  onChange={(e) => setCurrentCategory(prev => ({ ...prev, show_on_homepage: e.target.checked }))}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="show_on_homepage" className="ml-2 block text-sm text-gray-900">
                  Anasayfada göster
                </label>
              </div>
            <div className="flex justify-end pt-4">
              <button 
                type="button" 
                onClick={closeModal}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 mr-2"
              >
                İptal
              </button>
              <button 
                type="submit" 
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                {isEditing ? 'Kaydet' : 'Ekle'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {isIconPickerOpen && (
        <IconPicker 
          onSelect={handleIconSelect}
          onClose={() => setIsIconPickerOpen(false)}
        />
      )}
    </div>
  );
} 