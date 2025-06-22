import React from 'react';
import dynamic from 'next/dynamic';

const IstanbulMap = dynamic(() => import('../IstanbulMap'), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-100 animate-pulse rounded-lg" />
});

const MapBlock = ({ location, title, description }) => {
  return (
    <div className="mb-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="h-[400px] relative">
          <IstanbulMap location={location} />
        </div>
        <div className="p-4">
          {title && <h3 className="text-xl font-semibold mb-2">{title}</h3>}
          {description && <p className="text-gray-600">{description}</p>}
        </div>
      </div>
    </div>
  );
};

export default MapBlock; 