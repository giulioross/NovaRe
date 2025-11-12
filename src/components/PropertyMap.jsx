import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix per i marcatori di Leaflet con Vite
// Crea icona personalizzata con fallback
const createCustomIcon = () => {
  try {
    return new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  } catch (error) {
    console.warn('Fallback per icona marker:', error);
    return L.divIcon({
      className: 'custom-div-icon',
      html: '<div style="background-color: red; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  }
};

// Applica la configurazione delle icone
const customIcon = createCustomIcon();

/**
 * Componente per mostrare la mappa della proprietà
 * @param {Object} listing - Dati dell'immobile
 * @param {number} height - Altezza della mappa (default 400px)
 */
const PropertyMap = ({ listing, height = 400 }) => {
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Geocoding dell'indirizzo per ottenere le coordinate
  useEffect(() => {
    const geocodeAddress = async () => {
      if (!listing.address) {
        setError('Indirizzo non disponibile');
        setLoading(false);
        return;
      }

      try {
        // Se l'immobile ha già coordinate, usale
        if (listing.latitude && listing.longitude) {
          setCoordinates({
            lat: parseFloat(listing.latitude),
            lng: parseFloat(listing.longitude)
          });
          setLoading(false);
          return;
        }

        // Altrimenti, usa Nominatim (OpenStreetMap) per il geocoding
        const address = `${listing.address}, ${listing.city || 'Roma'}, Italia`;
        const encodedAddress = encodeURIComponent(address);
        
        console.log('🗺️ Geocoding indirizzo:', address);
        
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`
        );
        
        if (!response.ok) {
          throw new Error('Errore nella geocodifica');
        }
        
        const data = await response.json();
        
        if (data && data.length > 0) {
          const coords = {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon)
          };
          
          console.log('✅ Coordinate trovate:', coords);
          setCoordinates(coords);
        } else {
          // Fallback: coordinate di Roma centro
          console.log('⚠️ Indirizzo non trovato, uso coordinate di Roma centro');
          setCoordinates({
            lat: 41.9028,
            lng: 12.4964
          });
        }
        
      } catch (err) {
        console.error('❌ Errore geocoding:', err);
        setError('Errore nel caricamento della mappa');
        // Fallback: coordinate di Roma centro
        setCoordinates({
          lat: 41.9028,
          lng: 12.4964
        });
      } finally {
        setLoading(false);
      }
    };

    geocodeAddress();
  }, [listing.address, listing.city, listing.latitude, listing.longitude]);

  if (loading) {
    return (
      <div style={{
        height: `${height}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5',
        borderRadius: '12px'
      }}>
        <div>Caricamento mappa...</div>
      </div>
    );
  }

  if (error && !coordinates) {
    return (
      <div style={{
        height: `${height}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5',
        borderRadius: '12px',
        color: '#666'
      }}>
        <div>
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>🗺️</div>
          <div>Mappa non disponibile</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      height: `${height}px`, 
      borderRadius: '12px', 
      overflow: 'hidden',
      border: '1px solid #e1e5e9'
    }}>
      <MapContainer
        center={[coordinates.lat, coordinates.lng]}
        zoom={16}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[coordinates.lat, coordinates.lng]} icon={customIcon}>
          <Popup>
            <div style={{ textAlign: 'center' }}>
              <strong>{listing.title}</strong><br />
              <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                {listing.address}
              </div>
              {listing.price && (
                <div style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: 'bold', 
                  color: '#2e7d32',
                  marginTop: '8px' 
                }}>
                  €{listing.price.toLocaleString()}
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default PropertyMap;