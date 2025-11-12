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



  // Debug: stampa tutto il listing per vedere cosa contiene
  console.log('🔍 LISTING COMPLETO in ListingDetail:', listing);
  console.log('🔍 CAMPI DISPONIBILI nel listing:', Object.keys(listing));
  console.log('🔍 NUMERO DI CAMPI:', Object.keys(listing).length);
  
  // Debug specifico per i campi principali
  console.log('📋 DATI PRINCIPALI:');
  console.log('- Title:', listing.title);
  console.log('- Bedrooms:', listing.bedrooms);
  console.log('- Bathrooms:', listing.bathrooms);
  console.log('- Description:', listing.description);
  console.log('- Price:', listing.price);
  console.log('- Address:', listing.address);
  console.log('- City:', listing.city);
  console.log('- Energy Class:', listing.energy_class);
  console.log('- Surface:', listing.commercial_sqm);
  console.log('- Property Type:', listing.property_type);
  
  // Prepara le immagini (controlla tutti i possibili campi)
  const images = [];
  
  // Controlla diversi possibili campi per le immagini
  if (listing.images && Array.isArray(listing.images) && listing.images.length > 0) {
    console.log('✅ Trovate immagini in listing.images:', listing.images);
    images.push(...listing.images);
  }
  if (listing.photoUrls && Array.isArray(listing.photoUrls) && listing.photoUrls.length > 0) {
    console.log('✅ Trovate immagini in listing.photoUrls:', listing.photoUrls);
    images.push(...listing.photoUrls);
  }
  if (listing.photos && Array.isArray(listing.photos) && listing.photos.length > 0) {
    console.log('✅ Trovate immagini in listing.photos:', listing.photos);
    images.push(...listing.photos);
  }
  if (listing.imageUrl && !images.includes(listing.imageUrl)) {
    console.log('✅ Trovata immagine in listing.imageUrl:', listing.imageUrl);
    images.push(listing.imageUrl);
  }
  if (listing.immaginePrincipale && !images.includes(listing.immaginePrincipale)) {
    console.log('✅ Trovata immagine in listing.immaginePrincipale:', listing.immaginePrincipale);
    images.push(listing.immaginePrincipale);
  }
  
  console.log('📸 IMMAGINI FINALI trovate:', images);



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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}>
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
{formatAddress(listing.address, listing.city)}
          </p>
        </div>
      </div>

      {/* Contenuto principale */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '40px 20px',
        position: 'relative',
        zIndex: 1
      }}>
        
        {/* Layout principale - 2 colonne responsive */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr',
          gap: '20px',
          alignItems: 'start'
        }}
        className="listing-detail-layout"
        >
          <style>
            {`
              @media (min-width: 769px) {
                .listing-detail-layout {
                  grid-template-columns: 2fr 1fr !important;
                  gap: 40px !important;
                }
              }
            `}
          </style>
          
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

            {/* Sezione Dettagli Completi */}
            <div style={{
              background: 'white',
              borderRadius: '15px',
              padding: '30px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              marginTop: '20px'
            }}>
              <h2 style={{ 
                color: 'var(--color-primary)', 
                marginBottom: '30px', 
                fontSize: '1.8rem',
                fontWeight: '700'
              }}>
                📋 Dettagli Completi
              </h2>
              
              {/* Grid di dettagli */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '20px'
              }}
              className="details-grid"
              >
                <style>
                  {`
                    @media (max-width: 768px) {
                      .details-grid {
                        grid-template-columns: 1fr !important;
                        gap: 15px !important;
                      }
                    }
                  `}
                </style>
                
                {/* Informazioni Generali */}
                <div style={{
                  background: '#f8f9fa',
                  padding: '25px',
                  borderRadius: '12px',
                  border: '1px solid #e9ecef'
                }}>
                  <h3 style={{ 
                    color: 'var(--color-primary)', 
                    marginBottom: '20px', 
                    fontSize: '1.4rem',
                    fontWeight: '700',
                    borderBottom: '3px solid var(--color-primary)',
                    paddingBottom: '10px'
                  }}>
                    DATI GENERALI IMMOBILE
                  </h3>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                    gap: '12px' 
                  }}>
                    {listing.property_type && (
                      <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <strong>Tipologia:</strong> {listing.property_type}
                      </div>
                    )}
                    {listing.contract_type && (
                      <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <strong>Contratto:</strong> {listing.contract_type}
                      </div>
                    )}
                    {listing.condition && (
                      <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <strong>Stato immobile:</strong> {listing.condition}
                      </div>
                    )}
                    {listing.commercial_sqm && (
                      <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <strong>Superficie commerciale:</strong> {listing.commercial_sqm} m²
                      </div>
                    )}
                    {listing.walkable_sqm && (
                      <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <strong>Superficie calpestabile:</strong> {listing.walkable_sqm} m²
                      </div>
                    )}
                    {listing.rooms_total && (
                      <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <strong>Vani totali:</strong> {listing.rooms_total}
                      </div>
                    )}
                    {listing.bedrooms && (
                      <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <strong>Camere da letto:</strong> {listing.bedrooms}
                      </div>
                    )}
                    {listing.bathrooms && (
                      <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <strong>Bagni:</strong> {listing.bathrooms}
                      </div>
                    )}
                    {listing.floor_level !== undefined && listing.floor_level !== null && (
                      <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <strong>Piano:</strong> {listing.floor_level === 0 ? 'Piano terra' : 
                                              listing.floor_level < 0 ? `${Math.abs(listing.floor_level)}° interrato` : 
                                              `${listing.floor_level}° piano`}
                      </div>
                    )}
                    {listing.total_floors && (
                      <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <strong>Piani edificio:</strong> {listing.total_floors}
                      </div>
                    )}
                    {listing.construction_year && (
                      <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <strong>Anno costruzione:</strong> {listing.construction_year}
                      </div>
                    )}
                    {listing.elevator !== undefined && (
                      <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <strong>Ascensore:</strong> {listing.elevator ? 'Presente' : 'Assente'}
                      </div>
                    )}
                    {listing.top_floor !== undefined && (
                      <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <strong>Ultimo piano:</strong> {listing.top_floor ? 'Sì' : 'No'}
                      </div>
                    )}
                    {listing.building_type && (
                      <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <strong>Tipo edificio:</strong> {listing.building_type}
                      </div>
                    )}
                    {listing.region && (
                      <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <strong>Regione:</strong> {listing.region}
                      </div>
                    )}
                  </div>
                </div>

                {/* Localizzazione Dettagliata */}
                <div style={{
                  background: '#e3f2fd',
                  padding: '25px',
                  borderRadius: '12px',
                  border: '1px solid #bbdefb'
                }}>
                  <h3 style={{ 
                    color: '#1976d2', 
                    marginBottom: '20px', 
                    fontSize: '1.4rem',
                    fontWeight: '700',
                    borderBottom: '3px solid #1976d2',
                    paddingBottom: '10px'
                  }}>
                    LOCALIZZAZIONE
                  </h3>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '12px' 
                  }}>
                    {listing.address && (
                      <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <strong>Indirizzo:</strong> {listing.address}
                      </div>
                    )}
                    {listing.city && (
                      <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <strong>Città:</strong> {listing.city}
                      </div>
                    )}
                    {listing.district && (
                      <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <strong>Zona/Quartiere:</strong> {listing.district}
                      </div>
                    )}
                    {listing.province && (
                      <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <strong>Provincia:</strong> {listing.province}
                      </div>
                    )}
                    {listing.postal_code && (
                      <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <strong>CAP:</strong> {listing.postal_code}
                      </div>
                    )}
                  </div>
                </div>

                {/* Efficienza Energetica */}
                <div style={{
                  background: '#e8f5e8',
                  padding: '25px',
                  borderRadius: '12px',
                  border: '1px solid #c8e6c9'
                }}>
                  <h3 style={{ 
                    color: '#2e7d32', 
                    marginBottom: '20px', 
                    fontSize: '1.4rem',
                    fontWeight: '700',
                    borderBottom: '3px solid #2e7d32',
                    paddingBottom: '10px'
                  }}>
                    EFFICIENZA ENERGETICA E IMPIANTI
                  </h3>
                  
                  {/* Debug: mostra sempre se ci sono dati energetici */}
                  {process.env.NODE_ENV === 'development' && (
                    <div style={{ background: 'yellow', padding: '10px', marginBottom: '10px', fontSize: '12px' }}>
                      <strong>DEBUG Efficienza Energetica:</strong><br/>
                      energy object: {JSON.stringify(listing.energy)}<br/>
                      ape_class: {listing.energy?.ape_class || 'null'}<br/>
                      ipe_kwh_m2y: {listing.energy?.ipe_kwh_m2y || 'null'}<br/>
                      heating_type: {listing.energy?.heating_type || 'null'}<br/>
                      cooling_type: {listing.energy?.cooling_type || 'null'}<br/>
                      heating_generator: {listing.energy?.heating_generator || 'null'}<br/>
                      cooling_zones: {listing.energy?.cooling_zones || 'null'}
                    </div>
                  )}
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '12px' 
                  }}>
                    {listing.energy?.ape_class && (
                      <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <strong>Classe energetica:</strong> 
                        <span style={{
                          background: '#4caf50',
                          color: 'white',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          marginLeft: '8px'
                        }}>{listing.energy.ape_class}</span>
                      </div>
                    )}
                    {listing.energy?.heating_type && (
                      <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <strong>Tipo riscaldamento:</strong> {listing.energy.heating_type}
                      </div>
                    )}
                    {listing.energy?.cooling_type && (
                      <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <strong>Raffrescamento:</strong> {listing.energy.cooling_type}
                      </div>
                    )}
                    {listing.energy?.ipe_kwh_m2y && (
                      <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <strong>IPE:</strong> {listing.energy.ipe_kwh_m2y} kWh/m²anno
                      </div>
                    )}
                    {listing.energy?.heating_generator && (
                      <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <strong>Generatore di calore:</strong> {listing.energy.heating_generator}
                      </div>
                    )}
                    {listing.energy?.cooling_zones && listing.energy.cooling_zones > 0 && (
                      <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <strong>Zone climatizzate:</strong> {listing.energy.cooling_zones}
                      </div>
                    )}
                  </div>
                </div>

                {/* Informazioni Finanziarie */}
                <div style={{
                  background: '#fff3e0',
                  padding: '25px',
                  borderRadius: '12px',
                  border: '1px solid #ffcc02'
                }}>
                  <h3 style={{ 
                    color: '#ef6c00', 
                    marginBottom: '20px', 
                    fontSize: '1.4rem',
                    fontWeight: '700',
                    borderBottom: '3px solid #ef6c00',
                    paddingBottom: '10px'
                  }}>
                    INFORMAZIONI ECONOMICHE
                  </h3>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '12px' 
                  }}>
                    <div style={{ 
                      padding: '12px', 
                      background: 'white', 
                      borderRadius: '6px',
                      fontSize: '1.1rem',
                      fontWeight: '600'
                    }}>
                      <strong>Prezzo:</strong> {displayPrice}
                    </div>
                    {listing.price_per_sqm && (
                      <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <strong>Prezzo al m²:</strong> €{Math.round(listing.price / listing.commercial_sqm)}/m²
                      </div>
                    )}
                    {listing.hoa_fees && listing.hoa_fees > 0 && (
                      <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <strong>Spese condominiali:</strong> €{listing.hoa_fees}/mese
                      </div>
                    )}
                    {listing.price_currency && (
                      <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <strong>Valuta:</strong> {listing.price_currency}
                      </div>
                    )}
                  </div>
                </div>

                {/* Spazi Esterni e Parcheggi */}
                {(listing.balconies || listing.terraces_sqm || listing.garden_sqm || listing.parking_spots || listing.garage_spots) && (
                  <div style={{
                    background: '#f1f8e9',
                    padding: '25px',
                    borderRadius: '12px',
                    border: '1px solid #c8e6c9'
                  }}>
                    <h3 style={{ 
                      color: '#388e3c', 
                      marginBottom: '20px', 
                      fontSize: '1.4rem',
                      fontWeight: '700',
                      borderBottom: '3px solid #388e3c',
                      paddingBottom: '10px'
                    }}>
                      SPAZI ESTERNI E PARCHEGGI
                    </h3>
                    
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                      gap: '12px' 
                    }}>
                      {listing.balconies && listing.balconies > 0 && (
                        <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                          <strong>Balconi:</strong> {listing.balconies}
                        </div>
                      )}
                      {listing.terraces_sqm && listing.terraces_sqm > 0 && (
                        <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                          <strong>Terrazzi:</strong> {listing.terraces_sqm} m²
                        </div>
                      )}
                      {listing.garden_sqm && listing.garden_sqm > 0 && (
                        <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                          <strong>Giardino:</strong> {listing.garden_sqm} m²
                        </div>
                      )}
                      {listing.parking_spots && listing.parking_spots > 0 && (
                        <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                          <strong>Posti auto:</strong> {listing.parking_spots}
                        </div>
                      )}
                      {listing.garage_spots && listing.garage_spots > 0 && (
                        <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                          <strong>Box auto:</strong> {listing.garage_spots}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Dotazioni e Comfort */}
                <div style={{
                  background: '#fce4ec',
                  padding: '25px',
                  borderRadius: '12px',
                  border: '1px solid #f8bbd9'
                }}>
                  <h3 style={{ 
                    color: '#c2185b', 
                    marginBottom: '20px', 
                    fontSize: '1.4rem',
                    fontWeight: '700',
                    borderBottom: '3px solid #c2185b',
                    paddingBottom: '10px'
                  }}>
                    DOTAZIONI E COMFORT
                  </h3>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '12px' 
                  }}>
                    {listing.kitchen_type && (
                      <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <strong>Cucina:</strong> {listing.kitchen_type}
                      </div>
                    )}
                    {listing.furnished && (
                      <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <strong>Arredamento:</strong> {listing.furnished}
                      </div>
                    )}
                    {listing.air_conditioning !== undefined && (
                      <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <strong>Aria condizionata:</strong> {listing.air_conditioning ? 'Presente' : 'Assente'}
                      </div>
                    )}
                    {listing.porter !== undefined && (
                      <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <strong>Portineria:</strong> {listing.porter ? 'Presente' : 'Assente'}
                      </div>
                    )}
                    {listing.cellar !== undefined && (
                      <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <strong>Cantina:</strong> {listing.cellar ? 'Presente' : 'Assente'}
                      </div>
                    )}
                    {listing.ceiling_height && (
                      <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <strong>Altezza soffitti:</strong> {listing.ceiling_height} m
                      </div>
                    )}
                    {listing.smart_home !== undefined && (
                      <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <strong>Smart Home/Domotica:</strong> {listing.smart_home ? 'Presente' : 'Assente'}
                      </div>
                    )}
                    {listing.step_free !== undefined && (
                      <div style={{ padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <strong>Senza barriere architettoniche:</strong> {listing.step_free ? 'Sì' : 'No'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Video e Tour Virtuali */}
                {(listing.video_url || listing.virtual_tour_url) && (
                  <div style={{
                    background: '#f3e5f5',
                    padding: '25px',
                    borderRadius: '12px',
                    border: '1px solid #ce93d8'
                  }}>
                    <h3 style={{ 
                      color: '#7b1fa2', 
                      marginBottom: '20px', 
                      fontSize: '1.4rem',
                      fontWeight: '700',
                      borderBottom: '3px solid #7b1fa2',
                      paddingBottom: '10px'
                    }}>
                      MULTIMEDIA
                    </h3>
                    
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                      gap: '15px' 
                    }}>
                      {listing.video_url && (
                        <div style={{ padding: '12px', background: 'white', borderRadius: '8px' }}>
                          <strong>Video:</strong><br/>
                          <a 
                            href={listing.video_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: '#7b1fa2', textDecoration: 'none', fontSize: '0.9rem' }}
                          >
                            {listing.video_url}
                          </a>
                        </div>
                      )}
                      {listing.virtual_tour_url && (
                        <div style={{ padding: '12px', background: 'white', borderRadius: '8px' }}>
                          <strong>Tour Virtuale 360°:</strong><br/>
                          <a 
                            href={listing.virtual_tour_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: '#7b1fa2', textDecoration: 'none', fontSize: '0.9rem' }}
                          >
                            {listing.virtual_tour_url}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Caratteristiche Aggiuntive */}
                {(listing.features && typeof listing.features === 'string') && (
                  <div style={{
                    background: '#f3e5f5',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid #ce93d8'
                  }}>
                    <h3 style={{ 
                      color: '#7b1fa2', 
                      marginBottom: '20px', 
                      fontSize: '1.4rem',
                      fontWeight: '700',
                      borderBottom: '3px solid #7b1fa2',
                      paddingBottom: '10px'
                    }}>
                      CARATTERISTICHE SPECIFICHE
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {(() => {
                        try {
                          // Mappa di traduzioni per le chiavi
                          const translations = {
                            'kitchen': 'Cucina',
                            'furnished': 'Arredamento',
                            'parking': 'Parcheggio',
                            'external': 'Esterni',
                            'building_info': 'Informazioni Edificio',
                            'box': 'Box auto',
                            'parking_spot': 'Posto auto',
                            'balconies': 'Balconi',
                            'terraces_sqm': 'Terrazze mq',
                            'garden_sqm': 'Giardino mq',
                            'abitabile': 'Abitabile',
                            'non_arredato': 'Non arredato',
                            'arredato': 'Arredato',
                            'semi_arredato': 'Semi arredato'
                          };
                          
                          // Funzione per tradurre le chiavi
                          const translateKey = (key) => {
                            return translations[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                          };
                          
                          // Funzione per tradurre i valori
                          const translateValue = (value) => {
                            if (typeof value === 'string') {
                              return translations[value] || value;
                            }
                            return value;
                          };
                          
                          const features = JSON.parse(listing.features);
                          return Object.entries(features).map(([key, value]) => {
                            if (!value) return null;
                            
                            // Gestisci diversi tipi di valori
                            let displayValue;
                            if (typeof value === 'object' && value !== null) {
                              if (Array.isArray(value)) {
                                displayValue = value.map(v => translateValue(v)).join(', ');
                              } else {
                                // Per oggetti, mostra le coppie chiave-valore tradotte
                                displayValue = Object.entries(value)
                                  .filter(([k, v]) => v)
                                  .map(([k, v]) => `${translateKey(k)}: ${translateValue(v)}`)
                                  .join(', ');
                              }
                            } else {
                              displayValue = translateValue(value);
                            }
                            
                            return displayValue ? (
                              <div key={key}>
                                <strong>{translateKey(key)}:</strong> {displayValue}
                              </div>
                            ) : null;
                          });
                        } catch (e) {
                          return <div>{listing.features}</div>;
                        }
                      })()}
                    </div>
                  </div>
                )}

                {/* Informazioni Edificio */}
                {(listing.building_info && typeof listing.building_info === 'string') && (
                  <div style={{
                    background: '#e3f2fd',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid #90caf9'
                  }}>
                    <h3 style={{ 
                      color: '#1565c0', 
                      marginBottom: '20px', 
                      fontSize: '1.4rem',
                      fontWeight: '700',
                      borderBottom: '3px solid #1565c0',
                      paddingBottom: '10px'
                    }}>
                      INFORMAZIONI EDIFICIO
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {(() => {
                        try {
                          const buildingInfo = JSON.parse(listing.building_info);
                          return Object.entries(buildingInfo).map(([key, value]) => {
                            if (!value) return null;
                            
                            // Gestisci diversi tipi di valori
                            let displayValue;
                            if (typeof value === 'object' && value !== null) {
                              if (Array.isArray(value)) {
                                displayValue = value.join(', ');
                              } else {
                                // Per oggetti, mostra le coppie chiave-valore
                                displayValue = Object.entries(value)
                                  .filter(([k, v]) => v)
                                  .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`)
                                  .join(', ');
                              }
                            } else {
                              displayValue = String(value);
                            }
                            
                            return displayValue ? (
                              <div key={key}>
                                <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {displayValue}
                              </div>
                            ) : null;
                          });
                        } catch (e) {
                          return <div>{listing.building_info}</div>;
                        }
                      })()}
                    </div>
                  </div>
                )}

                {/* Agente/Agenzia */}
                {(listing.agent_name || listing.agent_phone || listing.agent_email) && (
                  <div style={{
                    background: '#fafafa',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid #e0e0e0'
                  }}>
                    <h3 style={{ 
                      color: '#424242', 
                      marginBottom: '15px', 
                      fontSize: '1.2rem',
                      fontWeight: '600'
                    }}>
                      👤 Contatti Agente
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {listing.agent_name && (
                        <div><strong>Nome:</strong> {listing.agent_name}</div>
                      )}
                      {listing.agent_phone && (
                        <div><strong>Telefono:</strong> <a href={`tel:${listing.agent_phone}`} style={{color: 'var(--color-primary)'}}>{listing.agent_phone}</a></div>
                      )}
                      {listing.agent_email && (
                        <div><strong>Email:</strong> <a href={`mailto:${listing.agent_email}`} style={{color: 'var(--color-primary)'}}>{listing.agent_email}</a></div>
                      )}
                    </div>
                  </div>
                )}
              </div>
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
                  CHIAMA ORA
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
Tel: +39 345 345 4186
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