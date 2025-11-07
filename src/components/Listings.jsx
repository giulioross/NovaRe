import React, { useState } from 'react';
import { useListings } from '../hooks/useListings.js';
import LoadingSpinner from './LoadingSpinner.jsx';
import PlaceholderImage from './PlaceholderImage.jsx';

/**
 * Componente per visualizzare la lista degli immobili pubblici
 * @param {boolean} adminMode - Se true, mostra controlli admin
 * @param {string} adminUsername - Username admin per operazioni
 * @param {string} adminPassword - Password admin per operazioni  
 * @param {Function} onEdit - Callback per modificare un immobile
 * @param {Function} onDelete - Callback per eliminare un immobile
 */
const Listings = ({ adminMode = false, adminUsername, adminPassword, onEdit, onDelete }) => {
  const { listings, loading, error, refetch } = useListings();

  // Componente per messaggio di caricamento
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '300px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)'
      }}>
        <LoadingSpinner 
          size="60px" 
          color="#007bff" 
          text="Caricamento immobili..." 
        />
      </div>
    );
  }

  // Componente per messaggio di errore
  if (error) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px 20px',
        background: 'rgba(220,53,69,0.1)',
        border: '2px dashed #dc3545',
        borderRadius: '20px'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⚠️</div>
        <h3 style={{ color: '#dc3545', marginBottom: '15px' }}>
          Errore nel caricamento
        </h3>
        <p style={{ color: '#666', marginBottom: '25px' }}>
          {error}
        </p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            background: '#007bff',
            color: 'white',
            padding: '12px 25px',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Riprova
        </button>
      </div>
    );
  }

  // Messaggio se non ci sono immobili
  if (!listings || listings.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px 20px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🏠</div>
        <h3 style={{ color: '#007bff', marginBottom: '15px' }}>
          Nessun immobile disponibile
        </h3>
        <p style={{ color: '#666' }}>
          Al momento non ci sono immobili nel nostro database.
        </p>
      </div>
    );
  }

  // Funzione per formattare il prezzo
  const formatPrice = (price) => {
    if (!price) return 'Prezzo da concordare';
    return `€${price.toLocaleString('it-IT')}`;
  };

  // Componente per singolo immobile
  const ListingCard = ({ listing }) => {
    const [imageError, setImageError] = useState(false);
    
    return (
    <div style={{
      background: 'white',
      borderRadius: '15px',
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s, box-shadow 0.3s',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
    }}
    >
      {/* Immagine dell'immobile */}
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        {listing.imageUrl && !imageError ? (
          <img 
            src={listing.imageUrl}
            alt={listing.title || 'Immobile'}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover' 
            }}
            onError={() => setImageError(true)}
          />
        ) : (
          <PlaceholderImage 
            width="100%" 
            height="200px" 
            text="Immagine non disponibile"
          />
        )}
        {listing.type && (
          <div style={{
            position: 'absolute',
            top: '15px',
            left: '15px',
            background: listing.type === 'VENDITA' ? '#28a745' : '#ffc107',
            color: listing.type === 'VENDITA' ? 'white' : '#333',
            padding: '5px 15px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            {listing.type === 'VENDITA' ? 'Vendita' : 'Affitto'}
          </div>
        )}
      </div>
      
      {/* Contenuto della card */}
      <div style={{ padding: '20px' }}>
        {/* Titolo */}
        <h3 style={{ 
          color: '#007bff', 
          fontSize: '1.2rem', 
          marginBottom: '10px',
          fontWeight: '600'
        }}>
          {listing.title || 'Immobile senza titolo'}
        </h3>
        
        {/* Indirizzo */}
        {listing.address && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: '#666', 
            marginBottom: '15px', 
            fontSize: '0.9rem' 
          }}>
            <span>📍</span>
            <span>{listing.address}</span>
          </div>
        )}
        
        {/* Dettagli (stanze, bagni, ecc.) */}
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          marginBottom: '15px', 
          fontSize: '0.9rem', 
          color: '#666',
          flexWrap: 'wrap'
        }}>
          {listing.bedrooms && (
            <span>🛏️ {listing.bedrooms} camere</span>
          )}
          {listing.bathrooms && (
            <span>🚿 {listing.bathrooms} bagni</span>
          )}
          {listing.size && (
            <span>📐 {listing.size} mq</span>
          )}
        </div>
        
        {/* Descrizione */}
        {listing.description && (
          <p style={{ 
            color: '#666', 
            fontSize: '0.9rem', 
            lineHeight: '1.5',
            marginBottom: '15px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {listing.description}
          </p>
        )}
        
        {/* Prezzo e azioni */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: '20px',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ 
            fontSize: '1.3rem', 
            fontWeight: '700', 
            color: '#007bff' 
          }}>
            {formatPrice(listing.price)}
          </div>
          
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {/* Pulsanti admin */}
            {adminMode && (
              <>
                <button 
                  onClick={() => onEdit && onEdit(listing)}
                  style={{
                    background: '#28a745',
                    color: 'white',
                    padding: '6px 12px',
                    border: 'none',
                    borderRadius: '15px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#218838';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#28a745';
                  }}
                >
                  ✏️ Modifica
                </button>
                
                <button 
                  onClick={() => {
                    if (window.confirm(`Sei sicuro di voler eliminare l'immobile "${listing.title}"?`)) {
                      onDelete && onDelete(listing);
                    }
                  }}
                  style={{
                    background: '#dc3545',
                    color: 'white',
                    padding: '6px 12px',
                    border: 'none',
                    borderRadius: '15px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#c82333';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#dc3545';
                  }}
                >
                  🗑️ Elimina
                </button>
              </>
            )}
            
            <button 
              onClick={() => {
                // Qui potresti aprire un modal o navigare alla pagina di dettaglio
                console.log('Visualizza dettagli immobile:', listing.id);
              }}
              style={{
                background: 'linear-gradient(45deg, #007bff, #0056b3)',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            >
              Dettagli
            </button>
          </div>
        </div>
      </div>
    </div>
    );
  };

  // Render della lista
  return (
    <div>
      {/* Header della sezione */}
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h2 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          color: '#333',
          marginBottom: '10px'
        }}>
          Immobili Disponibili
        </h2>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>
          {listings.length} {listings.length === 1 ? 'immobile trovato' : 'immobili trovati'}
        </p>
      </div>

      {/* Griglia degli immobili */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '30px'
      }}>
        {listings.map((listing, index) => (
          <ListingCard 
            key={listing.id || index} 
            listing={listing} 
          />
        ))}
      </div>
    </div>
  );
};

export default Listings;