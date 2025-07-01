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
        
        // Özel marker ikonları oluştur
        const createCustomIcon = (color) => {
          return L.divIcon({
            className: 'custom-marker',
            html: `<div style="
              background-color: ${color};
              width: 12px;
              height: 12px;
              border-radius: 50%;
              border: 1px solid white;
              box-shadow: 0 2px 5px rgba(0,0,0,0.2);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
            "></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });
        };

        // Haritayı oluştur
        if (!mapInstanceRef.current) {
          mapInstanceRef.current = L.map(mapRef.current).setView([41.085, 28.9784], 9.8);
          
          // OpenStreetMap tile layer ekle
          L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            maxZoom: 19
          }).addTo(mapInstanceRef.current);
        }

        // Marker'ları ekle
        locations.forEach((location) => {
          const marker = L.marker([location.lat, location.lng], {
            icon: createCustomIcon(location.color)
          })
            .addTo(mapInstanceRef.current)
            .bindPopup(location.popupContent);
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