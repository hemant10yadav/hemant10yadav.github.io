'use client';

import { useEffect, useRef } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface MapPoint {
  lat: number;
  lon: number;
  count: number;
  location: string;
}

export default function VisitorMap({ points }: { points: MapPoint[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    if (!containerRef.current || points.length === 0) return;
    let cancelled = false;

    const init = async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !containerRef.current) return;

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      const map = L.map(containerRef.current, {
        worldCopyJump: true,
        scrollWheelZoom: true,
      });
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      const maxCount = Math.max(...points.map((p) => p.count));

      points.forEach((p) => {
        const size = 24 + (p.count / maxCount) * 16;
        const icon = L.divIcon({
          className: '',
          html: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 1px 3px rgba(0,0,0,0.5));">
            <path d="M12 0C7.03 0 3 4.03 3 9c0 6.25 8.25 14.5 8.6 14.85a.5.5 0 0 0 .8 0C12.75 23.5 21 15.25 21 9c0-4.97-4.03-9-9-9z" fill="#22d3ee" fill-opacity="0.9"/>
            <circle cx="12" cy="9" r="3.5" fill="#0b1120"/>
          </svg>`,
          iconSize: [size, size],
          iconAnchor: [size / 2, size],
        });

        L.marker([p.lat, p.lon], { icon })
          .addTo(map)
          .bindTooltip(`${p.location} · ${p.count} visit${p.count === 1 ? '' : 's'}`);
      });

      const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lon]));
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 6 });
    };

    init();
    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [points]);

  if (points.length === 0) return null;

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '560px',
        borderRadius: '8px',
        border: '1px solid var(--border-2)',
        marginBottom: '2rem',
        background: '#0b1120',
      }}
    />
  );
}
