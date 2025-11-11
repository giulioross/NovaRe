import React, { useState, useEffect } from 'react';
import { useListing } from '../hooks/useListings.js';
import LoadingSpinner from './LoadingSpinner.jsx';
import PlaceholderImage from './PlaceholderImage.jsx';
import { formatPrice, formatAddress } from '../utils/listingMapper.js';
import Navbar from './Navbar.jsx';

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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
      {/* Hero Section con breadcrumb */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
        color: 'white',
        padding: '100px 20px 40px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Breadcrumb */}
          <div style={{ marginBottom: '20px', fontSize: '0.9rem', opacity: 0.9 }}>
            <span>Home</span> / <span>Immobili</span> / <span>Dettagli</span>
          </div>
          
          {/* Torna indietro */}
          {onBack && (
            <button 
              onClick={onBack}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '2px solid rgba(255,255,255,0.3)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: '600',
                marginBottom: '20px',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.2)';
              }}
            >
              ← Torna alla lista
            </button>
          )}
          
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700',
            margin: '0 0 10px 0',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            {listing.title || 'Dettagli Immobile'}
          </h1>
          
          <p style={{ 
            fontSize: '1.2rem', 
            opacity: 0.9,
            margin: 0
          }}>
            📍 {formatAddress(listing.address, listing.city)}
          </p>
        </div>
      </div>

      {/* Contenuto principale */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* Layout principale - 2 colonne */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr', 
          gap: '40px',
          alignItems: 'start'
        }}>
          
          {/* Colonna sinistra - Immagini e Descrizione */}
          <div>
            {/* Gallery immagini */}
            <div style={{ 
              background: 'white',
              borderRadius: '15px',
              padding: '20px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              marginBottom: '30px'
            }}>
              {/* Immagine principale */}
              {images.length > 0 ? (
                <div style={{ position: 'relative', borderRadius: '15px', overflow: 'hidden', marginBottom: '20px' }}>
                  <img
                    src={images[currentImageIndex]}
                    alt={listing.title}
                    style={{
                      width: '100%',
                      height: '450px',
                      objectFit: 'cover',
                      cursor: 'pointer'
                    }}
                    onClick={() => openImageModal(currentImageIndex)}
                  />
                  
                  {/* Badge tipo contratto */}
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    background: listing.contractType === 'VENDITA' ? '#28a745' : '#007bff',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    {listing.contractType === 'VENDITA' ? 'In Vendita' : 'In Affitto'}
                  </div>
                  
                  {/* Controlli navigazione immagini */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        style={{
                          position: 'absolute',
                          left: '20px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '50px',
                          height: '50px',
                          cursor: 'pointer',
                          fontSize: '1.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        ‹
                      </button>
                      <button
                        onClick={nextImage}
                        style={{
                          position: 'absolute',
                          right: '20px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '50px',
                          height: '50px',
                          cursor: 'pointer',
                          fontSize: '1.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        ›
                      </button>
                    </>
                  )}

                  {/* Contatore immagini */}
                  {images.length > 1 && (
                    <div style={{
                      position: 'absolute',
                      bottom: '20px',
                      right: '20px',
                      background: 'rgba(0,0,0,0.8)',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}>
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  )}
                </div>
              ) : (
                <PlaceholderImage width="100%" height="450px" text="Nessuna immagine disponibile" />
              )}

              {/* Thumbnail grid */}
              {images.length > 1 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                  gap: '10px'
                }}>
                  {images.slice(0, 6).map((image, index) => (
                    <div
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      style={{
                        borderRadius: '10px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: index === currentImageIndex ? '3px solid var(--color-primary)' : '2px solid #e1e5e9',
                        transition: 'all 0.3s',
                        position: 'relative'
                      }}
                    >
                      <img
                        src={image}
                        alt={`Vista ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '80px',
                          objectFit: 'cover'
                        }}
                      />
                      {index === 5 && images.length > 6 && (
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.9rem',
                          fontWeight: '600'
                        }}>
                          +{images.length - 6}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Descrizione */}
            <div style={{
              background: 'white',
              borderRadius: '15px',
              padding: '30px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ 
                color: 'var(--color-primary)', 
                marginBottom: '20px', 
                fontSize: '1.8rem',
                fontWeight: '700'
              }}>
                Descrizione
              </h2>
              
              {listing.description ? (
                <p style={{ 
                  color: '#666', 
                  lineHeight: '1.8',
                  fontSize: '1.1rem',
                  whiteSpace: 'pre-line',
                  margin: 0
                }}>
                  {listing.description}
                </p>
              ) : (
                <p style={{ 
                  color: '#999', 
                  fontStyle: 'italic',
                  fontSize: '1.1rem'
                }}>
                  Nessuna descrizione disponibile per questo immobile.
                </p>
              )}
            </div>
          </div>

          {/* Colonna destra - Info e Contatti */}
          <div style={{ position: 'sticky', top: '20px' }}>
            
            {/* Card Prezzo e Caratteristiche */}
            <div style={{
              background: 'white',
              borderRadius: '15px',
              padding: '30px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              marginBottom: '20px'
            }}>
              
              {/* Prezzo */}
              <div style={{ 
                textAlign: 'center',
                marginBottom: '30px',
                padding: '20px',
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                borderRadius: '15px',
                color: 'white'
              }}>
                <div style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: '700',
                  marginBottom: '5px'
                }}>
                  {displayPrice}
                </div>
                <div style={{ 
                  fontSize: '1rem', 
                  opacity: 0.9
                }}>
                  {listing.contractType === 'VENDITA' ? 'Prezzo di vendita' : 'Canone mensile'}
                </div>
              </div>

              {/* Caratteristiche principali */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: '15px',
                marginBottom: '30px'
              }}>
                {listing.bedrooms > 0 && (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '20px', 
                    background: '#f8f9fa', 
                    borderRadius: '15px',
                    border: '2px solid #e9ecef'
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🛏️</div>
                    <div style={{ fontWeight: '700', color: 'var(--color-primary)', fontSize: '1.3rem' }}>
                      {listing.bedrooms}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>Camere</div>
                  </div>
                )}
                
                {listing.bathrooms > 0 && (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '20px', 
                    background: '#f8f9fa', 
                    borderRadius: '15px',
                    border: '2px solid #e9ecef'
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🚿</div>
                    <div style={{ fontWeight: '700', color: 'var(--color-primary)', fontSize: '1.3rem' }}>
                      {listing.bathrooms}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>Bagni</div>
                  </div>
                )}

                {listing.size && (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '20px', 
                    background: '#f8f9fa', 
                    borderRadius: '15px',
                    border: '2px solid #e9ecef',
                    gridColumn: listing.bedrooms && listing.bathrooms ? 'span 2' : 'span 1'
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📐</div>
                    <div style={{ fontWeight: '700', color: 'var(--color-primary)', fontSize: '1.3rem' }}>
                      {listing.size} m²
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>Superficie</div>
                  </div>
                )}
              </div>

              {/* Pulsanti di contatto */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <button
                  onClick={() => {
                    const message = `Salve, sono interessato all'immobile "${listing.title}" a ${displayPrice}. Vorrei ricevere maggiori informazioni. Grazie.`;
                    const phone = "+393453454186";
                    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                  style={{
                    background: '#25d366',
                    color: 'white',
                    border: 'none',
                    padding: '18px 25px',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    transition: 'all 0.3s',
                    boxShadow: '0 5px 15px rgba(37, 211, 102, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#128c7e';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#25d366';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <span style={{ fontSize: '1.3rem' }}>💬</span>
                  Contatta su WhatsApp
                </button>
                
                <button
                  onClick={() => {
                    const subject = `Richiesta informazioni: ${listing.title}`;
                    const body = `Salve,\n\nsono interessato all'immobile "${listing.title}" a ${displayPrice}.\n\nVorrei ricevere maggiori informazioni.\n\nGrazie.`;
                    const mailtoUrl = `mailto:info@novareimmobiliare.it?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    window.location.href = mailtoUrl;
                  }}
                  style={{
                    background: 'var(--color-primary)',
                    color: 'white',
                    border: 'none',
                    padding: '18px 25px',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    transition: 'all 0.3s',
                    boxShadow: '0 5px 15px rgba(0, 123, 255, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--color-secondary)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'var(--color-primary)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <span style={{ fontSize: '1.3rem' }}>✉️</span>
                  Invia Email
                </button>

                <button
                  onClick={() => {
                    const phone = "+393453454186";
                    window.location.href = `tel:${phone}`;
                  }}
                  style={{
                    background: 'transparent',
                    color: 'var(--color-primary)',
                    border: '2px solid var(--color-primary)',
                    padding: '18px 25px',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--color-primary)';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = 'var(--color-primary)';
                  }}
                >
                  <span style={{ fontSize: '1.3rem' }}>📞</span>
                  Chiama Ora
                </button>
              </div>
            </div>

            {/* Card Info Agenzia */}
            <div style={{
              background: 'white',
              borderRadius: '15px',
              padding: '25px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <img 
                src="https://www.novareimmobiliare.it/NovaRe_LogoCircle.png" 
                alt="Nova RE Logo"
                style={{ 
                  width: '60px', 
                  height: '60px', 
                  marginBottom: '15px',
                  borderRadius: '50%'
                }}
              />
              <h3 style={{ 
                color: 'var(--color-primary)', 
                marginBottom: '10px',
                fontSize: '1.3rem',
                fontWeight: '700'
              }}>
                Nova RE Immobiliare
              </h3>
              <p style={{ 
                color: '#666', 
                fontSize: '0.95rem',
                margin: '0 0 15px 0'
              }}>
                Agenzia immobiliare di fiducia a Roma
              </p>
              <div style={{ 
                color: 'var(--color-primary)', 
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
                📞 +39 345 345 4186
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