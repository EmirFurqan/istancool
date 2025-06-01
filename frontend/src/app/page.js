import Image from 'next/image';
import Link from 'next/link';
import Map from '@/components/Map';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
export default function Home() {
  const istanbulLocations = [
    {
      id: 1,
      name: 'Ayasofya',
      description: 'Bizans döneminden kalma tarihi cami',
      lat: 41.0086,
      lng: 28.9802,
      image: '/images/ayasofya.jpg'
    },
    {
      id: 2,
      name: 'Topkapı Sarayı',
      description: 'Osmanlı İmparatorluğu\'nun yönetim merkezi',
      lat: 41.0116,
      lng: 28.9833,
      image: '/images/topkapi.jpg'
    },
    {
      id: 3,
      name: 'Galata Kulesi',
      description: 'İstanbul\'un simgelerinden biri',
      lat: 41.0256,
      lng: 28.9744,
      image: '/images/galata.jpg'
    },
    {
      id: 4,
      name: 'Sultanahmet Camii',
      description: 'Mavi Camii olarak da bilinir',
      lat: 41.0053,
      lng: 28.9768,
      image: '/images/sultanahmet.jpg'
    },
    {
      id: 5,
      name: 'Kapalıçarşı',
      description: 'Dünyanın en büyük kapalı çarşılarından biri',
      lat: 41.0104,
      lng: 28.9685,
      image: '/images/kapalicarsi.jpg'
    }
  ];

  const featuredPosts = [
    {
      id: 1,
      title: 'Ayasofya\'nın Gizli Tarihi',
      excerpt: '1500 yıllık tarihi ile Ayasofya\'nın bilinmeyen hikayeleri',
      image: '/images/ayasofya.jpg',
      date: '23 Mart 2024',
      readTime: '5 dk',
      category: 'Tarih'
    },
    {
      id: 2,
      title: 'Topkapı Sarayı\'nda Bir Gün',
      excerpt: 'Osmanlı\'nın kalbinde unutulmaz bir gezi deneyimi',
      image: '/images/topkapi.jpg',
      date: '20 Mart 2024',
      readTime: '7 dk',
      category: 'Tarih'
    },
    {
      id: 3,
      title: 'Galata Kulesi\'nden İstanbul Manzarası',
      excerpt: 'İstanbul\'un en güzel manzarasını sunan tarihi kule',
      image: '/images/galata.jpg',
      date: '18 Mart 2024',
      readTime: '6 dk',
      category: 'Gezi'
    }
  ];

  return (
    <main className="min-h-screen">
      <Header />
        
      {/* Hero Section with Map */}
      <section className="relative h-[90vh] w-full">
        <div className="absolute inset-0">
          <Map locations={istanbulLocations} />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        
      </section>

      {/* Featured Posts Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-12 text-3xl font-bold">Öne Çıkan Yazılar</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredPosts.map((post) => (
            <article key={post.id} className="group overflow-hidden rounded-lg shadow-lg">
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
                <h3 className="mb-3 text-xl font-bold">
                  <Link href={`/blog/${post.id}`} className="hover:text-blue-600">
                    {post.title}
                  </Link>
                </h3>
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
      </section>

      {/* Categories Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-3xl font-bold">Kategoriler</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {['Tarih', 'Gezi', 'Kültür', 'Yemek'].map((category) => (
              <Link
                key={category}
                href={`/category/${category.toLowerCase()}`}
                className="group rounded-lg bg-white p-6 text-center shadow-md transition hover:shadow-lg"
              >
                <h3 className="text-xl font-semibold">{category}</h3>
                <p className="mt-2 text-gray-600">
                  {category} ile ilgili tüm yazılarımızı keşfedin
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
} 