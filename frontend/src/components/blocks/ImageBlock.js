import React from 'react';
import Image from 'next/image';

const ImageBlock = ({ src, alt, caption, layout = 'single' }) => {
  if (layout === 'double') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {src.map((image, index) => (
          <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
            <Image
              src={image}
              alt={alt?.[index] || 'Blog görseli'}
              fill
              className="object-cover"
            />
          </div>
        ))}
        {caption && <p className="text-sm text-gray-500 mt-2">{caption}</p>}
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="relative aspect-video rounded-lg overflow-hidden">
        <Image
          src={src}
          alt={alt || 'Blog görseli'}
          fill
          className="object-cover"
        />
      </div>
      {caption && <p className="text-sm text-gray-500 mt-2">{caption}</p>}
    </div>
  );
};

export default ImageBlock; 