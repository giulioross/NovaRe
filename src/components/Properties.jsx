import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useListings } from '../hooks/useListings';

const Properties = () => {
  const { listings, loading } = useListings();
  const [currentPropertySlide, setCurrentPropertySlide] = useState(0);
  
  // Mostra i primi 3 immobili come "in evidenza"
  const featuredListings = listings?.slice(0, 3) || [];

  // Funzioni per il carosello mobile
  const nextPropertySlide = () => {
    setCurrentPropertySlide((prev) => (prev + 1) % featuredListings.length);
  };
  
  const prevPropertySlide = () => {
    setCurrentPropertySlide((prev) => (prev - 1 + featuredListings.length) % featuredListings.length);
  };

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
        
        {/* Desktop: Griglia 3 colonne */}
        <div className="properties-grid-desktop" style={{display: 'none'}}>
          {!loading && featuredListings.length > 0 && featuredListings.map((listing) => {
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
                onMouseEnter={(e) => e.target.closest('div').style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.target.closest('div').style.transform = 'translateY(0)'}
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
                    fontSize: '1.1rem',
                    color: '#1f2937',
                    fontWeight: 'bold'
                  }}>
                    {listing.title || listing.titolo || 'Immobile'}
                  </h3>
                  <p style={{ 
                    margin: '0 0 10px 0', 
                    color: '#6b7280',
                    fontSize: '0.9rem'
                  }}>
                    📍 {listing.location || listing.zona || 'Roma'}
                  </p>
                  <div style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: 'bold', 
                    color: '#007bff',
                    marginBottom: '10px'
                  }}>
                    €{listing.price?.toLocaleString() || listing.prezzo?.toLocaleString() || 'N/A'}
                  </div>
                  <Link 
                    to={`/listing/${listing.id}`}
                    state={{ from: '/' }}
                    style={{
                      display: 'inline-block',
                      background: 'linear-gradient(45deg, #007bff, #0056b3)',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Scopri di più
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile: Carosello */}
        <div className="properties-carousel-mobile" style={{display: 'block'}}>
          {!loading && featuredListings.length > 0 && (
            <div style={{ position: 'relative', maxWidth: '320px', margin: '0 auto' }}>
              <div style={{ 
                overflow: 'hidden',
                borderRadius: '12px'
              }}>
                <div style={{
                  display: 'flex',
                  transform: `translateX(-${currentPropertySlide * 100}%)`,
                  transition: 'transform 0.3s ease'
                }}>
                  {featuredListings.map((listing) => {
                    const firstImage = getFirstImage(listing);
                    return (
                      <div
                        key={listing.id}
                        style={{
                          minWidth: '100%',
                          background: 'rgba(255,255,255,0.95)',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
                        }}
                      >
                        {/* Immagine */}
                        <div style={{
                          height: '180px',
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
                        <div style={{ padding: '20px' }}>
                          <h3 style={{ 
                            margin: '0 0 10px 0', 
                            fontSize: '1.2rem',
                            color: '#1f2937',
                            fontWeight: 'bold',
                            textAlign: 'center'
                          }}>
                            {listing.title || listing.titolo || 'Immobile'}
                          </h3>
                          <p style={{ 
                            margin: '0 0 15px 0', 
                            color: '#6b7280',
                            fontSize: '1rem',
                            textAlign: 'center'
                          }}>
                            📍 {listing.location || listing.zona || 'Roma'}
                          </p>
                          <div style={{ 
                            fontSize: '1.4rem', 
                            fontWeight: 'bold', 
                            color: '#007bff',
                            marginBottom: '15px',
                            textAlign: 'center'
                          }}>
                            €{listing.price?.toLocaleString() || listing.prezzo?.toLocaleString() || 'N/A'}
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <Link 
                              to={`/listing/${listing.id}`}
                              state={{ from: '/' }}
                              style={{
                                display: 'inline-block',
                                background: 'linear-gradient(45deg, #007bff, #0056b3)',
                                color: 'white',
                                padding: '10px 20px',
                                borderRadius: '25px',
                                textDecoration: 'none',
                                fontSize: '1rem',
                                fontWeight: '500',
                                transition: 'all 0.3s ease'
                              }}
                            >
                              Scopri di più
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Controlli carosello */}
              {featuredListings.length > 1 && (
                <>
                  <button
                    onClick={prevPropertySlide}
                    style={{
                      position: 'absolute',
                      left: '-15px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(255,255,255,0.9)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                      fontSize: '16px',
                      color: '#007bff'
                    }}
                  >
                    ←
                  </button>
                  <button
                    onClick={nextPropertySlide}
                    style={{
                      position: 'absolute',
                      right: '-15px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(255,255,255,0.9)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                      fontSize: '16px',
                      color: '#007bff'
                    }}
                  >
                    →
                  </button>
                </>
              )}

              {/* Indicatori */}
              {featuredListings.length > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '15px'
                }}>
                  {featuredListings.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPropertySlide(index)}
                      style={{
                        width: '12px',
                        height: '12px',
                        minWidth: '12px',
                        minHeight: '12px',
                        borderRadius: '50%',
                        border: 'none',
                        background: index === currentPropertySlide ? '#007bff' : 'rgba(255,255,255,0.5)',
                        cursor: 'pointer',
                        aspectRatio: '1',
                        flexShrink: 0,
                        transition: 'background 0.3s ease'
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>


        
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
