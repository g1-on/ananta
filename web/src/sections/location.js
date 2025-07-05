import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export function initMap() {
  const mapEl = document.getElementById('map');
  if (!mapEl) return;


  const map = L.map(mapEl).setView([26.8467, 80.9462], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  L.marker([26.8467, 80.9462]).addTo(map);
}
