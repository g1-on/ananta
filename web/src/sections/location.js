import mapboxgl from 'mapbox-gl';

export function initMap() {
  const mapEl = document.getElementById('map');
  if (!mapEl) return;

  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';
  if (!mapboxgl.accessToken) {
    mapEl.textContent = 'Map unavailable (missing token)';
    mapEl.classList.add('text-center', 'py-20');
    return;
  }

  const map = new mapboxgl.Map({
    container: mapEl,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [80.9462, 26.8467], // Lucknow
    zoom: 12,
  });

  new mapboxgl.Marker().setLngLat([80.9462, 26.8467]).addTo(map);
}
