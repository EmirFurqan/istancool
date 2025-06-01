import Image from 'next/image';
import Link from 'next/link';

export default function BlogPost({ params }) {
  // Örnek blog yazısı verisi
  const post = {
    id: params.id,
    title: 'Ayasofya\'nın Gizli Tarihi ve Mimari Detayları',
    content: `
      <p>Ayasofya, İstanbul'un en önemli tarihi yapılarından biri olarak, 1500 yıllık geçmişiyle bize eşsiz bir miras bırakıyor. Bu muhteşem yapı, Bizans döneminden Osmanlı'ya, oradan da günümüze uzanan bir köprü görevi görüyor.</p>
      
      <h2>Mimari Özellikler</h2>
      <p>Ayasofya'nın en dikkat çekici özelliklerinden biri, devasa kubbesi ve iç mekanındaki ışık oyunlarıdır. 55.6 metre yüksekliğindeki kubbe, döneminin en büyük kubbesi olarak bilinir. Yapının iç mekanı, gün ışığının farklı açılardan girmesiyle oluşan etkileyici bir atmosfere sahiptir.</p>
      
      <h2>Tarihi Detaylar</h2>
      <p>Yapı, 532-537 yılları arasında Bizans İmparatoru I. Justinianos tarafından inşa ettirilmiştir. İnşaatında 10.000 işçi çalışmış ve yapımı sadece 5 yıl sürmüştür. Bu hızlı inşaat süreci, dönemin teknolojik imkanları düşünüldüğünde oldukça etkileyicidir.</p>
      
      <h2>Görülmesi Gereken Detaylar</h2>
      <ul>
        <li>İmparator Kapısı</li>
        <li>Deesis Mozaiği</li>
        <li>Mihrap ve Minber</li>
        <li>Üst Galeri</li>
        <li>Terleyen Sütun</li>
      </ul>

      <h2>Ziyaret Bilgileri</h2>
      <p>Ayasofya'yı ziyaret etmek için en uygun zaman, sabah erken saatlerdir. Özellikle yaz aylarında yoğun turist akını nedeniyle, sabah 09:00'dan önce gitmenizi öneririz. Giriş ücreti olmamakla birlikte, içeride rehberlik hizmeti alabilirsiniz.</p>
    `,
    image: '/images/ayasofya.jpg',
    date: '23 Mart 2024',
    readTime: '5 dk',
    category: 'Tarih',
    author: {
      name: 'Mehmet Yılmaz',
      avatar: '/images/ayasofya.jpg',
      bio: 'İstanbul Tarihi Araştırmacısı ve Rehber'
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <article className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="relative mb-12 h-[60vh] w-full overflow-hidden rounded-2xl">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <span className="mb-4 inline-block rounded-full bg-blue-600 px-4 py-2">
                {post.category}
              </span>
              <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                {post.title}
              </h1>
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span>{post.author.name}</span>
                </div>
                <span>•</span>
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.readTime} okuma</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-3xl">
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Author Bio */}
          <div className="mt-12 rounded-lg bg-white p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={80}
                height={80}
                className="rounded-full"
              />
              <div>
                <h3 className="text-xl font-bold">{post.author.name}</h3>
                <p className="text-gray-600">{post.author.bio}</p>
              </div>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="mt-8 flex items-center gap-4">
            <span className="font-semibold">Paylaş:</span>
            <button className="rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700">
              Facebook
            </button>
            <button className="rounded-full bg-blue-400 p-2 text-white hover:bg-blue-500">
              Twitter
            </button>
            <button className="rounded-full bg-green-600 p-2 text-white hover:bg-green-700">
              WhatsApp
            </button>
          </div>

          {/* Related Posts */}
          <div className="mt-12">
            <h3 className="mb-6 text-2xl font-bold">İlgili Yazılar</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <Link href="/blog/2" className="group">
                <div className="rounded-lg bg-white p-4 shadow-md transition hover:shadow-lg">
                  <h4 className="mb-2 text-lg font-semibold group-hover:text-blue-600">
                    Topkapı Sarayı'nda Bir Gün
                  </h4>
                  <p className="text-gray-600">Osmanlı'nın kalbinde unutulmaz bir gezi deneyimi</p>
                </div>
              </Link>
              <Link href="/blog/4" className="group">
                <div className="rounded-lg bg-white p-4 shadow-md transition hover:shadow-lg">
                  <h4 className="mb-2 text-lg font-semibold group-hover:text-blue-600">
                    Sultanahmet Camii'nin İhtişamı
                  </h4>
                  <p className="text-gray-600">Mavi Camii'nin mimari detayları ve tarihi</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
} 