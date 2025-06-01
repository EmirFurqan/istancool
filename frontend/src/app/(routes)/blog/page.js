import Image from 'next/image';
import Link from 'next/link';

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: 'Ayasofya\'nın Gizli Tarihi',
      excerpt: '1500 yıllık tarihi ile Ayasofya\'nın bilinmeyen hikayeleri ve mimari detayları',
      image: '/images/ayasofya.jpg',
      date: '23 Mart 2024',
      readTime: '5 dk',
      category: 'Tarih'
    },
    {
      id: 2,
      title: 'Topkapı Sarayı\'nda Bir Gün',
      excerpt: 'Osmanlı\'nın kalbinde unutulmaz bir gezi deneyimi ve sarayın gizli köşeleri',
      image: '/images/topkapi.jpg',
      date: '20 Mart 2024',
      readTime: '7 dk',
      category: 'Tarih'
    },
    {
      id: 3,
      title: 'Galata Kulesi\'nden İstanbul Manzarası',
      excerpt: 'İstanbul\'un en güzel manzarasını sunan tarihi kulenin hikayesi ve ziyaret rehberi',
      image: '/images/galata.jpg',
      date: '18 Mart 2024',
      readTime: '6 dk',
      category: 'Gezi'
    },
    {
      id: 4,
      title: 'Sultanahmet Camii\'nin İhtişamı',
      excerpt: 'Mavi Camii olarak bilinen Sultanahmet Camii\'nin mimari detayları ve tarihi',
      image: '/images/sultanahmet.jpg',
      date: '15 Mart 2024',
      readTime: '8 dk',
      category: 'Tarih'
    },
    {
      id: 5,
      title: 'Kapalıçarşı\'da Alışveriş Rehberi',
      excerpt: 'Dünyanın en büyük kapalı çarşılarından birinde alışveriş yapmanın püf noktaları',
      image: '/images/kapalicarsi.jpg',
      date: '12 Mart 2024',
      readTime: '4 dk',
      category: 'Gezi'
    },
    {
      id: 6,
      title: 'İstanbul\'un En İyi Kahvaltı Mekanları',
      excerpt: 'Geleneksel Türk kahvaltısının en iyi sunulduğu mekanlar ve öneriler',
      image: '/images/ayasofya.jpg',
      date: '10 Mart 2024',
      readTime: '5 dk',
      category: 'Yemek'
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Blog</h1>
          <p className="text-lg text-gray-600">
            İstanbul'un en güzel yerlerini ve hikayelerini keşfedin
          </p>
        </div>
        
        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4">
          <button className="rounded-full bg-blue-600 px-6 py-2 text-white">
            Tümü
          </button>
          <button className="rounded-full bg-white px-6 py-2 shadow-md hover:bg-gray-50">
            Tarih
          </button>
          <button className="rounded-full bg-white px-6 py-2 shadow-md hover:bg-gray-50">
            Gezi
          </button>
          <button className="rounded-full bg-white px-6 py-2 shadow-md hover:bg-gray-50">
            Kültür
          </button>
          <button className="rounded-full bg-white px-6 py-2 shadow-md hover:bg-gray-50">
            Yemek
          </button>
        </div>

        {/* Posts Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="group overflow-hidden rounded-lg bg-white shadow-lg">
              <div className="relative h-64">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="rounded-full bg-blue-600 px-3 py-1 text-sm text-white">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime} okuma</span>
                </div>
                <h2 className="mb-3 text-xl font-bold">
                  <Link href={`/blog/${post.id}`} className="hover:text-blue-600">
                    {post.title}
                  </Link>
                </h2>
                <p className="mb-4 text-gray-600">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Devamını Oku →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-12 flex justify-center">
          <nav className="flex items-center gap-2">
            <button className="rounded-lg border px-4 py-2 hover:bg-gray-50">
              Önceki
            </button>
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-white">
              1
            </button>
            <button className="rounded-lg border px-4 py-2 hover:bg-gray-50">
              2
            </button>
            <button className="rounded-lg border px-4 py-2 hover:bg-gray-50">
              3
            </button>
            <button className="rounded-lg border px-4 py-2 hover:bg-gray-50">
              Sonraki
            </button>
          </nav>
        </div>
      </div>
    </main>
  );
} 