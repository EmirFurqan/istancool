import { useEffect, useState } from 'react';
import Link from 'next/link';
import { categoryService } from '../../services/category';
import { icons, Smile } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getHomepageCategories();
        setCategories(data);
      } catch (error) {
        console.error("Kategoriler yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const renderIcon = (iconName, color) => {
    const IconComponent = icons[iconName] || Smile;
    return <IconComponent className="h-10 w-10 transition-transform duration-300 group-hover:scale-110" style={{ color: color }} />;
  };

  if (loading) {
    return (
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <p>Kategoriler yükleniyor...</p>
        </div>
      </section>
    );
  }

  if (!categories.length) {
    return null; // Veya bir mesaj gösterilebilir
  }

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">Kategoriler</h2>
          <p className="text-lg text-gray-600">İstanbul'u farklı kategorilerde keşfedin</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/blog?category=${category.slug}`}
              className="group block rounded-xl p-8 text-center ring-1 ring-gray-200 transition-all duration-300 hover:shadow-xl hover:ring-gray-300 bg-gray-50"
            >
              <div className="flex justify-center items-center mb-4 h-12 w-12 mx-auto">
                {renderIcon(category.icon, category.color)}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600">{category.name}</h3>
              <p className="mt-2 text-gray-600">
                {category.name} ile ilgili yazıları keşfedin.
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories; 