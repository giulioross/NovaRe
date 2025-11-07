import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { useListings } from '../hooks/useListings';
import PlaceholderImage from './PlaceholderImage';

const Properties = ({ onViewDetails }) => {
  const { listings: properties, loading, error, refetch } = useListings();
  const [filter, setFilter] = useState('all');

  // Funzione per filtrare gli immobili
  const filterProperties = (type) => {
    setFilter(type);
  };

  // Funzione per pre-compilare il form di contatto
  const contactForProperty = (title, price) => {
    const messageField = document.getElementById('messaggio');
    if (messageField) {
      messageField.value = `Salve, sono interessato all'immobile "${title}" a ${price}. Vorrei ricevere maggiori informazioni. Grazie.`;
    }
    // Scroll to contact section
    const contactSection = document.getElementById('contatti');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filtra le proprietà in base al filtro selezionato
  const filteredProperties = properties.filter(property => {
    if (filter === 'all') return true;
    return property.contractType?.toLowerCase() === filter;
  });

  // Escape HTML per sicurezza
  const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  // Componente per singola proprietà
  const PropertyCard = ({ property }) => {
    const [imageError, setImageError] = useState(false);
    const price = property.contractType === 'VENDITA' ? 
      `€${property.price?.toLocaleString('it-IT')}` : 
      `€${property.price?.toLocaleString('it-IT')}/mese`;
    
    const typeLabel = property.contractType === 'VENDITA' ? 'Vendita' : 'Affitto';
    const imageUrl = property.imageUrl;
    
    return (
      <div 
        className="property-card" 
        data-type={property.contractType?.toLowerCase()}
        style={{
          background: 'white',
          borderRadius: '15px',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          transition: 'transform 0.3s'
        }}
      >
        <div style={{ position: 'relative', height: '250px', overflow: 'hidden' }}>
          {imageUrl && !imageError ? (
            <img 
              src={imageUrl} 
              alt={property.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={() => setImageError(true)}
            />
          ) : (
            <PlaceholderImage 
              width="100%" 
              height="250px" 
              text="Immagine non disponibile"
            />
          )}
          <div 
            style={{
              position: 'absolute',
              top: '15px',
              left: '15px',
              background: property.contractType === 'VENDITA' ? '#28a745' : '#ffc107',
              color: property.contractType === 'VENDITA' ? 'white' : '#333',
              padding: '5px 15px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600'
            }}
          >
            {typeLabel}
          </div>
        </div>
        
        <div style={{ padding: '25px' }}>
          <h3 style={{ color: '#007bff', fontSize: '1.2rem', marginBottom: '10px' }}>
            {property.title}
          </h3>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: '#666', 
            marginBottom: '15px', 
            fontSize: '0.9rem' 
          }}>
            <span>📍</span>
            <span>{property.address}, {property.city}</span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: '20px', 
            marginBottom: '15px', 
            fontSize: '0.9rem', 
            color: '#666' 
          }}>
            {property.size && <span>🏠 {property.size} mq</span>}
            {property.bedrooms && <span>🚪 {property.bedrooms} vani</span>}
            {property.bathrooms && <span>🚿 {property.bathrooms} bagni</span>}
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginTop: '20px' 
          }}>
            <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#007bff' }}>
              {price}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => property.onViewDetails && property.onViewDetails(property.id)}
                style={{
                  background: 'transparent',
                  color: '#007bff',
                  padding: '8px 16px',
                  border: '2px solid #007bff',
                  borderRadius: '25px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
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
                Dettagli
              </button>
              <button 
                onClick={() => contactForProperty(property.title, price)}
                style={{
                  background: 'linear-gradient(45deg, #007bff, #0056b3)',
                  color: 'white',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '25px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Contatta
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="section properties" id="immobili">
      <div className="container">
        <h2 className="section-title">Immobili in evidenza</h2>
        <p className="section-subtitle">
          Scopri la nostra selezione di immobili di prestigio a Roma. 
          Ogni proprietà è selezionata per qualità, posizione e valore.
        </p>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <button
            onClick={() => {
              refetch();
              console.log('🔄 Ricaricamento immobili richiesto');
            }}
            disabled={loading}
            style={{
              background: loading ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '25px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              margin: '0 auto',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.background = '#218838';
                e.target.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.background = '#28a745';
                e.target.style.transform = 'translateY(0)';
              }
            }}
          >
            {loading ? '🔄 Aggiornamento...' : '🔄 Aggiorna Annunci'}
          </button>
        </div>
        
        {/* Filtri immobili */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '15px', 
          marginBottom: '40px', 
          flexWrap: 'wrap' 
        }}>
          <button 
            className="btn" 
            style={{
              background: filter === 'all' ? '#007bff' : 'white',
              color: filter === 'all' ? 'white' : '#007bff',
              border: '2px solid #007bff'
            }}
            onClick={() => filterProperties('all')}
          >
            Tutti
          </button>
          <button 
            className="btn" 
            style={{
              background: filter === 'vendita' ? '#007bff' : 'white',
              color: filter === 'vendita' ? 'white' : '#007bff',
              border: '2px solid #007bff'
            }}
            onClick={() => filterProperties('vendita')}
          >
            Vendita
          </button>
          <button 
            className="btn" 
            style={{
              background: filter === 'affitto' ? '#007bff' : 'white',
              color: filter === 'affitto' ? 'white' : '#007bff',
              border: '2px solid #007bff'
            }}
            onClick={() => filterProperties('affitto')}
          >
            Affitto
          </button>
        </div>
        
        {/* Container per gli immobili */}
        <div id="properties-container">
          {loading && (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px', 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '20px', 
              backdropFilter: 'blur(10px)' 
            }}>
              <LoadingSpinner 
                size="60px" 
                color="white" 
                text="Caricamento immobili..." 
              />
              <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '20px' }}>
                Connessione al database in corso...
              </p>
            </div>
          )}

          {error && (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px', 
              background: 'rgba(220,53,69,0.1)', 
              border: '2px dashed #dc3545', 
              borderRadius: '20px' 
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⚠️</div>
              <h3 style={{ color: '#dc3545', marginBottom: '15px' }}>
                Impossibile caricare gli immobili
              </h3>
              <p style={{ color: '#666', marginBottom: '25px' }}>
                Il backend non è disponibile. Verifica che il server sia avviato su{' '}
                <strong>http://localhost:8081</strong>
              </p>
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => window.location.reload()}
                  style={{
                    background: '#007bff',
                    color: 'white',
                    padding: '12px 25px',
                    border: 'none',
                    borderRadius: '25px',
                    cursor: 'pointer'
                  }}
                >
                  Riprova
                </button>
                <a 
                  href="http://localhost:8081/admin" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    background: 'white',
                    color: '#007bff',
                    padding: '12px 25px',
                    border: '2px solid #007bff',
                    borderRadius: '25px',
                    textDecoration: 'none'
                  }}
                >
                  Pannello Admin
                </a>
              </div>
            </div>
          )}

          {!loading && !error && properties.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px', 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '20px', 
              backdropFilter: 'blur(10px)' 
            }}>
              <h3 style={{ color: 'white', marginBottom: '15px' }}>
                🏠 Nessun immobile disponibile
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '25px' }}>
                Al momento non ci sono immobili nel nostro database.
              </p>
              <a 
                href="#contatti" 
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  color: '#007bff',
                  padding: '12px 25px',
                  borderRadius: '25px',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
                onClick={(e) => {
                  e.preventDefault();
                  const contactSection = document.getElementById('contatti');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Contattaci per maggiori informazioni
              </a>
            </div>
          )}

          {!loading && !error && filteredProperties.length > 0 && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
              gap: '30px' 
            }}>
              {filteredProperties.map((property, index) => (
                <PropertyCard 
                  key={property.id || index} 
                  property={{...property, onViewDetails}} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Properties;