'use client';

import React from 'react';
import ParagraphBlock from '../../../components/blocks/ParagraphBlock';
import HeadingBlock from '../../../components/blocks/HeadingBlock';
import ImageBlock from '../../../components/blocks/ImageBlock';
import MapBlock from '../../../components/blocks/MapBlock';
import CodeBlock from '../../../components/blocks/CodeBlock';
import NumberedListBlock from '../../../components/blocks/NumberedListBlock';

export default function BlogBlocksPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <HeadingBlock content="Blog Blok Örnekleri" level={1} />
        
        <HeadingBlock content="Paragraf Bloğu" level={2} />
        <ParagraphBlock content="Bu bir örnek paragraf bloğudur. İstanbul'un tarihi ve kültürel zenginliğini anlatan içerikler burada yer alabilir. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
        
        <HeadingBlock content="Çiftli Resim Bloğu" level={2} />
        <ImageBlock
          layout="single"
          src={'/images/ayasofya.jpg'}
          alt={['Ayasofya', 'Topkapı Sarayı']}
          caption="İstanbul'un en önemli tarihi yapılarından ikisi"
        />
        
        <HeadingBlock content="Harita Bloğu" level={2} />
        <MapBlock
          location={{ lat: 41.0082, lng: 28.9784 }}
          title="Ayasofya"
          description="İstanbul'un en önemli tarihi yapılarından biri olan Ayasofya'nın konumu"
        />
        
        <HeadingBlock content="Sayılı Liste Bloğu" level={2} />
        <NumberedListBlock
          items={[
            "İstanbul'un en eski semtlerinden biri olan Sultanahmet'te gezilecek yerler",
            "Topkapı Sarayı'nın tarihi ve mimari özellikleri",
            "Ayasofya'nın Bizans ve Osmanlı dönemindeki önemi",
            "Kapalıçarşı'da alışveriş yaparken dikkat edilmesi gerekenler"
          ]}
          numberColor="red"
        />
      </div>
    </main>
  );
} 