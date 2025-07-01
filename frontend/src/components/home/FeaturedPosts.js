import Image from 'next/image';
import Link from 'next/link';

const FeaturedPosts = ({ posts, loading }) => {
  if (loading) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">Öne Çıkan Yazılar</h2>
          <p className="text-lg text-gray-600">İstanbul'un en güzel yerlerini keşfedin</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="group flex transform flex-col overflow-hidden rounded-xl bg-white shadow-lg transition duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl">
              <Link href={`/blog/${post.slug}`} className="block h-full">
                  <div className="relative h-64 w-full">
                    <Image
                      src={post.cover_image || '/images/default-cover.jpg'}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 "
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span 
                        className="rounded-full px-3 py-1 text-sm font-medium text-white"
                        style={{ backgroundColor: post.category?.color || '#3B82F6' }}
                      >
                        {post.category?.name || 'Genel'}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="mb-3 text-xl font-bold text-gray-900 group-hover:text-blue-600">
                        {post.title}
                    </h3>
                    <p className="mb-4 flex-grow text-gray-600 line-clamp-3">
                      {post.summary || 'Bu yazı için özet bulunmuyor.'}
                    </p>
                    <div className="mt-auto flex items-center text-sm font-semibold text-blue-600 group-hover:text-blue-800">
                      <span>Devamını Oku</span>
                      <svg className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPosts; 