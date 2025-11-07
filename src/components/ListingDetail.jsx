import React, { useState, useEffect } from 'react';
import { useListing } from '../hooks/useListings.js';
import LoadingSpinner from './LoadingSpinner.jsx';
import PlaceholderImage from './PlaceholderImage.jsx';
import { formatPrice, formatAddress } from '../utils/listingMapper.js';

/**
 * Pagina dettaglio annuncio completa
 * @param {string|number} listingId - ID dell'annuncio da visualizzare
 * @param {Function} onBack - Callback per tornare indietro
 * @param {Object} mockListing - Dati mockati per i test (opzionale)
 */
const ListingDetail = ({ listingId, onBack, mockListing }) => {
  // Usa dati mockati se forniti, altrimenti usa l'hook
  const hookResult = useListing(mockListing ? null : listingId);
  const { listing, loading, error } = mockListing ? 
    { listing: mockListing, loading: false, error: null } : 
    hookResult;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  // Se non c'è un ID, mostra errore
  if (!listingId) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Annuncio non trovato</h2>
        <button onClick={onBack} style={{ marginTop: '20px', padding: '10px 20px' }}>
          Torna indietro
        </button>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <LoadingSpinner size="60px" text="Caricamento dettagli annuncio..." />
        {onBack && (
          <button 
            onClick={onBack}
            style={{
              background: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '25px',
              cursor: 'pointer'
            }}
          >
            ← Torna indietro
          </button>
        )}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh',
        padding: '40px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: '#f8d7da',
          border: '2px solid #f5c6cb',
          borderRadius: '10px',
          padding: '30px',
          maxWidth: '500px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>❌</div>
          <h2 style={{ color: '#721c24', marginBottom: '15px' }}>
            Errore nel caricamento
          </h2>
          <p style={{ color: '#721c24', marginBottom: '20px' }}>
            {error}
          </p>
          {onBack && (
            <button 
              onClick={onBack}
              style={{
                background: '#007bff',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              ← Torna alla lista
            </button>
          )}
        </div>
      </div>
    );
  }

  // Se non trova l'annuncio
  if (!listing) {
    return (
      <div style={{ 
        minHeight: '100vh',
        padding: '40px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h2>Annuncio non trovato</h2>
        <p>L'annuncio richiesto potrebbe essere stato rimosso o non esistere.</p>
        {onBack && (
          <button 
            onClick={onBack}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: '600',
              marginTop: '20px'
            }}
          >
            ← Torna alla lista
          </button>
        )}
      </div>
    );
  }

  // Prepara le immagini (placeholder se non presenti)
  const images = listing.images && listing.images.length > 0 
    ? listing.images 
    : listing.imageUrl 
      ? [listing.imageUrl]
      : [];

  // Formatta il prezzo usando l'utility
  const displayPrice = formatPrice(listing.price, listing.contractType);

  // Gestisce il cambio immagine
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Gestisce il modal delle immagini
  const openImageModal = (index) => {
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Header con torna indietro */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderBottom: '1px solid #e1e5e9',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '20px' }}>
          {onBack && (
            <button 
              onClick={onBack}
              style={{
                background: 'transparent',
                border: '2px solid #007bff',
                color: '#007bff',
                padding: '8px 16px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#007bff';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#007bff';
              }}
            >
              ← Torna alla lista
            </button>
          )}
          <h1 style={{ 
            color: '#333', 
            fontSize: '1.5rem', 
            fontWeight: '600',
            margin: 0,
            flex: 1
          }}>
            Dettagli Annuncio
          </h1>
        </div>
      </div>

      {/* Contenuto principale */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          
          {/* Colonna sinistra - Immagini */}
          <div>
            {/* Immagine principale */}
            <div style={{ marginBottom: '20px' }}>
              {images.length > 0 ? (
                <div style={{ position: 'relative', borderRadius: '15px', overflow: 'hidden' }}>
                  <img
                    src={images[currentImageIndex]}
                    alt={listing.title}
                    style={{
                      width: '100%',
                      height: '400px',
                      objectFit: 'cover',
                      cursor: 'pointer'
                    }}
                    onClick={() => openImageModal(currentImageIndex)}
                  />
                  
                  {/* Controlli immagine */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        style={{
                          position: 'absolute',
                          left: '15px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '40px',
                          height: '40px',
                          cursor: 'pointer',
                          fontSize: '1.2rem'
                        }}
                      >
                        ←
                      </button>
                      <button
                        onClick={nextImage}
                        style={{
                          position: 'absolute',
                          right: '15px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '40px',
                          height: '40px',
                          cursor: 'pointer',
                          fontSize: '1.2rem'
                        }}
                      >
                        →
                      </button>
                    </>
                  )}

                  {/* Indicatore immagine */}
                  {images.length > 1 && (
                    <div style={{
                      position: 'absolute',
                      bottom: '15px',
                      right: '15px',
                      background: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      padding: '5px 10px',
                      borderRadius: '15px',
                      fontSize: '0.9rem'
                    }}>
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  )}
                </div>
              ) : (
                <PlaceholderImage width="100%" height="400px" text="Nessuna immagine disponibile" />
              )}
            </div>

            {/* Thumbnail immagini */}
            {images.length > 1 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
                gap: '10px'
              }}>
                {images.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    style={{
                      borderRadius: '8px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: index === currentImageIndex ? '3px solid #007bff' : '2px solid #e1e5e9',
                      transition: 'all 0.3s'
                    }}
                  >
                    <img
                      src={image}
                      alt={`Immagine ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '60px',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Colonna destra - Dettagli */}
          <div>
            <div style={{
              background: 'white',
              borderRadius: '15px',
              padding: '30px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
              
              {/* Titolo e prezzo */}
              <div style={{ marginBottom: '25px' }}>
                <h1 style={{ 
                  fontSize: '2rem', 
                  fontWeight: '700', 
                  color: '#333',
                  marginBottom: '10px',
                  lineHeight: '1.2'
                }}>
                  {listing.title}
                </h1>
                <div style={{ 
                  fontSize: '1.8rem', 
                  fontWeight: '700', 
                  color: '#007bff',
                  marginBottom: '15px'
                }}>
                  {displayPrice}
                </div>
              </div>

              {/* Indirizzo */}
              <div style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem' }}>📍</span>
                <span style={{ fontSize: '1.1rem', color: '#666' }}>
                  {formatAddress(listing.address, listing.city)}
                </span>
              </div>

              {/* Caratteristiche */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                gap: '15px',
                marginBottom: '30px'
              }}>
                {listing.bedrooms > 0 && (
                  <div style={{ textAlign: 'center', padding: '15px', background: '#f8f9fa', borderRadius: '10px' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>🛏️</div>
                    <div style={{ fontWeight: '600', color: '#333' }}>{listing.bedrooms}</div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>Camere</div>
                  </div>
                )}
                
                {listing.bathrooms > 0 && (
                  <div style={{ textAlign: 'center', padding: '15px', background: '#f8f9fa', borderRadius: '10px' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>🚿</div>
                    <div style={{ fontWeight: '600', color: '#333' }}>{listing.bathrooms}</div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>Bagni</div>
                  </div>
                )}

                {listing.size && (
                  <div style={{ textAlign: 'center', padding: '15px', background: '#f8f9fa', borderRadius: '10px' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>📐</div>
                    <div style={{ fontWeight: '600', color: '#333' }}>{listing.size}</div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>m²</div>
                  </div>
                )}
              </div>

              {/* Descrizione */}
              {listing.description && (
                <div style={{ marginBottom: '30px' }}>
                  <h3 style={{ color: '#333', marginBottom: '15px', fontSize: '1.3rem' }}>
                    Descrizione
                  </h3>
                  <p style={{ 
                    color: '#666', 
                    lineHeight: '1.6',
                    fontSize: '1rem',
                    whiteSpace: 'pre-line'
                  }}>
                    {listing.description}
                  </p>
                </div>
              )}

              {/* Pulsanti azione */}
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    const message = `Salve, sono interessato all'immobile "${listing.title}" a ${displayPrice}. Vorrei ricevere maggiori informazioni. Grazie.`;
                    const phone = "+39 345 345 4186"; // Numero Nova RE
                    const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                  style={{
                    background: '#25d366',
                    color: 'white',
                    border: 'none',
                    padding: '15px 25px',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    flex: 1,
                    justifyContent: 'center',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#128c7e';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#25d366';
                  }}
                >
                  💬 Contatta su WhatsApp
                </button>
                
                <button
                  onClick={() => {
                    const subject = `Richiesta informazioni: ${listing.title}`;
                    const body = `Salve,\n\nsono interessato all'immobile "${listing.title}" a ${displayPrice}.\n\nVorrei ricevere maggiori informazioni.\n\nGrazie.`;
                    const mailtoUrl = `mailto:info@novareimmobiliare.it?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    window.location.href = mailtoUrl;
                  }}
                  style={{
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '15px 25px',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    flex: 1,
                    justifyContent: 'center',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#0056b3';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#007bff';
                  }}
                >
                  ✉️ Invia Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal per visualizzazione immagini a schermo intero */}
      {showImageModal && images.length > 0 && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.9)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowImageModal(false)}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <img
              src={images[currentImageIndex]}
              alt={listing.title}
              style={{
                maxWidth: '100%',
                maxHeight: '90vh',
                objectFit: 'contain'
              }}
              onClick={(e) => e.stopPropagation()}
            />
            
            {/* Pulsante chiudi */}
            <button
              onClick={() => setShowImageModal(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                fontSize: '1.5rem'
              }}
            >
              ×
            </button>

            {/* Controlli navigazione nel modal */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    fontSize: '1.2rem'
                  }}
                >
                  ←
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    fontSize: '1.2rem'
                  }}
                >
                  →
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingDetail;