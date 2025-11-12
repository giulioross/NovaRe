import React from 'react';
import { Link } from 'react-router-dom';
import { useListings } from '../hooks/useListings';

const Properties = () => {
  const { listings, loading } = useListings();
  
  // Mostra i primi 3 immobili come "in evidenza"
  const featuredListings = listings?.slice(0, 3) || [];

  // Funzione per trovare la prima immagine disponibile
  const getFirstImage = (listing) => {
    if (listing.images && Array.isArray(listing.images) && listing.images.length > 0) {
      return listing.images[0];
    }
    if (listing.photoUrls && Array.isArray(listing.photoUrls) && listing.photoUrls.length > 0) {
      return listing.photoUrls[0];
    }
    if (listing.photos && Array.isArray(listing.photos) && listing.photos.length > 0) {
      return listing.photos[0];
    }
    if (listing.imageUrl) {
      return listing.imageUrl;
    }
    if (listing.immaginePrincipale) {
      return listing.immaginePrincipale;
    }
    return null;
  };

  return (
    <section className="section properties properties-blue" id="immobili">
      <div className="container">
        <h2 className="section-title text-white" style={{textAlign: 'center'}}>Immobili in evidenza</h2>
        <p className="section-subtitle text-white" style={{textAlign: 'center'}}>
          Scopri la nostra selezione di immobili di prestigio a Roma. 
          Ogni proprietà è selezionata per qualità, posizione e valore.
        </p>
        
        {/* Mostra alcuni immobili in evidenza se disponibili */}
        {!loading && featuredListings.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            margin: '40px 0',
            maxWidth: '1000px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            {featuredListings.map((listing) => {
              const firstImage = getFirstImage(listing);

              return (
                <div
                  key={listing.id}
                  style={{
                    background: 'rgba(255,255,255,0.95)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                    transition: 'transform 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  {/* Immagine */}
                  <div style={{
                    height: '150px',
                    background: firstImage 
                      ? `url(${firstImage})` 
                      : 'linear-gradient(45deg, #007bff, #0056b3)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '2rem'
                  }}>
                    {!firstImage && '🏠'}
                  </div>
                  
                  {/* Contenuto */}
                  <div style={{ padding: '15px' }}>
                    <h3 style={{ 
                      margin: '0 0 8px 0', 
                      color: '#333',
                      fontSize: '1rem',
                      fontWeight: '600'
                    }}>
                      {listing.title || 'Immobile'}
                    </h3>
                    
                    <p style={{
                      color: '#666',
                      fontSize: '0.85rem',
                      margin: '0 0 10px 0',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: '1.3'
                    }}>
                      {listing.description || 'Immobile disponibile'}
                    </p>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        color: '#007bff'
                      }}>
                        {listing.price ? `€ ${listing.price.toLocaleString()}` : 'Trattativa'}
                      </span>
                      
                      <Link
                        to={`/listing/${listing.id}`}
                        style={{
                          background: '#007bff',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          fontSize: '0.8rem',
                          fontWeight: '600'
                        }}
                      >
                        Dettagli →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Bottoni per navigare agli immobili */}
        <div className="properties-buttons">
          <Link
            to="/immobili"
            className="property-btn primary"
          >
            🏠 Tutti gli Immobili {listings?.length > 0 && `(${listings.length})`}
          </Link>
          
          <Link
            to="/immobili?type=vendita"
            className="property-btn secondary"
          >
            💰 Immobili in Vendita
          </Link>
          
          <Link
            to="/immobili?type=affitto"
            className="property-btn secondary"
          >
            🏘️ Immobili in Affitto
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Properties;
