"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { categoryService } from "@/services/category";
import { icons, Smile } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    categoryService.getAllCategories()
      .then(setCategories)
      .catch(() => setError("Kategoriler yüklenemedi."))
      .finally(() => setLoading(false));
  }, []);

  const renderIcon = (iconName, color) => {
    const IconComponent = icons[iconName] || Smile;
    return <IconComponent className="h-8 w-8" style={{ color: color || "#3B82F6" }} />;
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 text-4xl font-bold text-center">Kategoriler</h1>
        {loading ? (
          <div className="text-center text-gray-500 py-20">Yükleniyor...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-20">{error}</div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/blog?category=${cat.slug}`}
                className="group flex flex-col items-center bg-white rounded-xl shadow hover:shadow-lg p-6 transition-all border border-gray-100 hover:-translate-y-1"
              >
                <div className="mb-3">
                  {renderIcon(cat.icon, cat.color)}
                </div>
                <div className="text-lg font-semibold mb-1 group-hover:text-blue-600 text-center">{cat.name}</div>
                <div className="w-8 h-1 rounded-full" style={{ backgroundColor: cat.color || "#3B82F6" }} />
                {cat.description && (
                  <div className="mt-2 text-gray-500 text-sm text-center line-clamp-2">{cat.description}</div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 