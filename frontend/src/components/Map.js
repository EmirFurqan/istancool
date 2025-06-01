'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const MapComponent = ({ locations }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Leaflet'i dynamic olarak import et
      import('leaflet').then((L) => {
        import('leaflet/dist/leaflet.css');

        // Leaflet marker ikonlarını düzelt
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: '/images/marker-icon-2x.png',
          iconUrl: '/images/marker-icon.png',
          shadowUrl: '/images/marker-shadow.png',
        });

        // Haritayı oluştur
        if (!mapInstanceRef.current) {
          mapInstanceRef.current = L.map(mapRef.current).setView([41.0082, 28.9784], 13);
          
          // OpenStreetMap tile layer ekle
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(mapInstanceRef.current);
        }

        // Marker'ları ekle
        locations.forEach(location => {
          const marker = L.marker([location.lat, location.lng])
            .addTo(mapInstanceRef.current)
            .bindPopup(`
              <div class="p-2">
                <h3 class="font-bold">${location.name}</h3>
                <p class="text-sm text-gray-600">${location.description}</p>
              </div>
            `);
        });

        // Haritayı yeniden boyutlandır
        mapInstanceRef.current.invalidateSize();
      });
    }

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locations]);

  return (
    <div 
      ref={mapRef} 
      className="h-full w-full"
      style={{ zIndex: 1 }}
    />
  );
};

// Map bileşenini dynamic olarak export et
export default dynamic(() => Promise.resolve(MapComponent), {
  ssr: false // Server-side rendering'i devre dışı bırak
}); 