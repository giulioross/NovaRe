import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import { useListings } from '../hooks/useListings';
import PlaceholderImage from './PlaceholderImage';
import { API_BASE } from '../services/listingService.js';

const AllPropertiesPage = () => {
  const { listings: properties, loading, error, refetch } = useListings();
  
  // Filtri state
  const [filters, setFilters] = useState({
    quartiere: 'all',
    tipo: 'all',
    prezzoMin: 0,
    prezzoMax: 2000000,
    localiMin: '',
    localiMax: '',
    bagniMin: '',
    bagniMax: '',
    superficieMin: '',
    superficieMax: '',
    classeEnergetica: 'all',
    caratteristiche: {
      ascensore: false,
      balcone: false,
      giardino: false,
      garage: false,
      postoAuto: false,
      arredato: false
    }
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Helper per costruire URL assolute delle immagini
  const imgUrlFrom = (photo) => {
    if (!photo) return '';
    return (photo.startsWith('http://') || photo.startsWith('https://')) ? 
      photo : `${API_BASE}${photo}`;
  };

  // Filtra le proprietà in base ai filtri selezionati
  const filteredProperties = properties.filter(property => {
    // Filtro quartiere
    if (filters.quartiere !== 'all' && !property.address?.toLowerCase().includes(filters.quartiere.toLowerCase())) {
      return false;
    }
    
    // Filtro tipo
    if (filters.tipo !== 'all' && property.contractType?.toLowerCase() !== filters.tipo) {
      return false;
    }
    
    // Filtro prezzo
    const price = parseFloat(property.price) || 0;
    if (price < filters.prezzoMin || price > filters.prezzoMax) {
      return false;
    }
    
    return true;
  });

  // Reset filtri avanzati
  const resetAdvancedFilters = () => {
    setFilters({
      ...filters,
      localiMin: '',
      localiMax: '',
      bagniMin: '',
      bagniMax: '',
      superficieMin: '',
      superficieMax: '',
      classeEnergetica: 'all',
      caratteristiche: {
        ascensore: false,
        balcone: false,
        giardino: false,
        garage: false,
        postoAuto: false,
        arredato: false
      }
    });
  };

  // Componente per singola proprietà
  const PropertyCard = ({ property }) => {
    const mainPhoto = property.photoUrls && property.photoUrls.length > 0 ? property.photoUrls[0] : null;
    
    return (
      <div 
        style={{
          background: 'white',
          borderRadius: '15px',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
        }}
      >
        <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
          {mainPhoto ? (
            <img 
              src={imgUrlFrom(mainPhoto)} 
              alt={property.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <PlaceholderImage 
            style={{ 
              width: '100%', 
              height: '100%',
              display: mainPhoto ? 'none' : 'flex'
            }} 
          />
          
          <div 
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: property.contractType === 'VENDITA' ? 'var(--color-success)' : 'var(--color-warning)',
              color: 'white',
              padding: '8px 15px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: '600',
              textTransform: 'uppercase'
            }}
          >
            {property.contractType || 'N/A'}
          </div>
        </div>
        
        <div style={{ padding: '25px' }}>
          <h3 style={{ 
            fontSize: '1.4rem', 
            fontWeight: '600', 
            marginBottom: '10px',
            color: '#333'
          }}>
            {property.title || 'Titolo non disponibile'}
          </h3>
          
          <p style={{ 
            color: '#666', 
            marginBottom: '15px',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center'
          }}>
            📍 {property.address || 'Indirizzo non disponibile'}
          </p>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '20px',
            fontSize: '0.9rem',
            color: '#777'
          }}>
            <span>🚪 {property.rooms || 'N/A'} vani</span>
            <span>🚿 {property.bathrooms || 'N/A'} bagni</span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <div style={{ 
              fontSize: '1.8rem', 
              fontWeight: '700', 
              color: 'var(--color-accent)'
            }}>
              €{property.price ? parseFloat(property.price).toLocaleString() : 'N/A'}
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                style={{
                  background: 'var(--color-secondary)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  transition: 'all 0.3s'
                }}
                onClick={() => window.open(`/listing/${property.id}`, '_blank')}
              >
                Dettagli
              </button>
              
              <button
                style={{
                  background: 'var(--color-accent)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  transition: 'all 0.3s'
                }}
                onClick={() => {
                  // Pre-compila form contatti e scrolla
                  const messageField = document.getElementById('messaggio');
                  if (messageField) {
                    messageField.value = `Salve, sono interessato all'immobile "${property.title}" a €${property.price}. Vorrei ricevere maggiori informazioni. Grazie.`;
                  }
                  window.location.href = '/#contatti';
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
    <div style={{ minHeight: '100vh', background: 'var(--color-background)' }}>
      {/* Header con Logo e Navigazione */}
      <header style={{
        background: 'var(--color-primary)',
        color: 'white',
        padding: '20px 0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <img 
                src="https://www.novareimmobiliare.it/NovaRe_LogoCircle.png" 
                alt="Nova RE Logo"
                style={{ height: '50px', width: '50px' }}
              />
              <h1 style={{ fontSize: '1.8rem', fontWeight: '700', margin: 0 }}>Nova RE</h1>
            </div>
            
            <nav style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
              <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Home</Link>
              <Link to="/immobili" style={{ color: 'white', textDecoration: 'none', fontWeight: '600', borderBottom: '2px solid white' }}>Immobili</Link>
              <Link to="/#chi-siamo" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Chi siamo</Link>
              <a href="/brochure" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Brochure</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Contenuto Principale */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#333', marginBottom: '15px' }}>
            Immobili in vendita
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
            Scopri la nostra selezione completa di immobili in vendita a Roma. 
            Ogni proprietà è selezionata per qualità, posizione e valore.
          </p>
        </div>

        {/* Filtri Principali */}
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
          marginBottom: '30px',
          overflow: 'visible',
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div style={{ position: 'relative', zIndex: 5 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                Quartiere
              </label>
              <select
                value={filters.quartiere}
                onChange={(e) => setFilters({...filters, quartiere: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  position: 'relative',
                  zIndex: 10
                }}
              >
                <option value="all">Tutti i quartieri</option>
                <option value="centro">Centro</option>
                <option value="trastevere">Trastevere</option>
                <option value="prati">Prati</option>
                <option value="testaccio">Testaccio</option>
              </select>
            </div>

            <div style={{ position: 'relative', zIndex: 5 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                Tipo
              </label>
              <select
                value={filters.tipo}
                onChange={(e) => setFilters({...filters, tipo: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  position: 'relative',
                  zIndex: 10
                }}
              >
                <option value="all">Tutti i tipi</option>
                <option value="vendita">Vendita</option>
                <option value="affitto">Affitto</option>
              </select>
            </div>

            <div style={{ position: 'relative', zIndex: 5 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                Fascia di prezzo
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.prezzoMin}
                  onChange={(e) => setFilters({...filters, prezzoMin: parseInt(e.target.value) || 0})}
                  style={{
                    flex: 1,
                    minWidth: '80px',
                    maxWidth: '120px',
                    padding: '10px 8px',
                    border: '2px solid #e1e5e9',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
                <span style={{ fontSize: '0.9rem', color: '#666', flexShrink: 0 }}>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.prezzoMax}
                  onChange={(e) => setFilters({...filters, prezzoMax: parseInt(e.target.value) || 2000000})}
                  style={{
                    flex: 1,
                    minWidth: '80px',
                    maxWidth: '120px',
                    padding: '10px 8px',
                    border: '2px solid #e1e5e9',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                €{filters.prezzoMin.toLocaleString()} - €{filters.prezzoMax.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Toggle Filtri Avanzati */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            style={{
              background: 'var(--color-primary)',
              border: 'none',
              color: 'white',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '12px 20px',
              borderRadius: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--color-secondary)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'var(--color-primary)';
            }}
          >
            {showAdvancedFilters ? '▲' : '▼'} {showAdvancedFilters ? 'Nascondi' : 'Mostra'} filtri avanzati
          </button>

          {/* Filtri Avanzati */}
          {showAdvancedFilters && (
            <div style={{
              marginTop: '20px',
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '10px'
            }}>
              <h3 style={{ marginBottom: '20px', color: '#333' }}>Filtri Avanzati</h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '20px',
                marginBottom: '20px'
              }}>
                {/* Locali */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                    Locali
                  </label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.localiMin}
                      onChange={(e) => setFilters({...filters, localiMin: e.target.value})}
                      style={{
                        flex: 1,
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '5px'
                      }}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.localiMax}
                      onChange={(e) => setFilters({...filters, localiMax: e.target.value})}
                      style={{
                        flex: 1,
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '5px'
                      }}
                    />
                  </div>
                </div>

                {/* Bagni */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                    Bagni
                  </label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.bagniMin}
                      onChange={(e) => setFilters({...filters, bagniMin: e.target.value})}
                      style={{
                        flex: 1,
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '5px'
                      }}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.bagniMax}
                      onChange={(e) => setFilters({...filters, bagniMax: e.target.value})}
                      style={{
                        flex: 1,
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '5px'
                      }}
                    />
                  </div>
                </div>

                {/* Superficie */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                    Superficie (mq)
                  </label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.superficieMin}
                      onChange={(e) => setFilters({...filters, superficieMin: e.target.value})}
                      style={{
                        flex: 1,
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '5px'
                      }}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.superficieMax}
                      onChange={(e) => setFilters({...filters, superficieMax: e.target.value})}
                      style={{
                        flex: 1,
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '5px'
                      }}
                    />
                  </div>
                </div>

                {/* Classe Energetica */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                    Classe Energetica
                  </label>
                  <select
                    value={filters.classeEnergetica}
                    onChange={(e) => setFilters({...filters, classeEnergetica: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '5px'
                    }}
                  >
                    <option value="all">Tutte</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                    <option value="G">G</option>
                  </select>
                </div>
              </div>

              {/* Caratteristiche */}
              <div>
                <label style={{ display: 'block', marginBottom: '15px', fontWeight: '600', color: '#333' }}>
                  Caratteristiche
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '15px'
                }}>
                  {Object.entries({
                    ascensore: 'Ascensore',
                    balcone: 'Balcone',
                    giardino: 'Giardino',
                    garage: 'Garage',
                    postoAuto: 'Posto auto',
                    arredato: 'Arredato'
                  }).map(([key, label]) => (
                    <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={filters.caratteristiche[key]}
                        onChange={(e) => setFilters({
                          ...filters,
                          caratteristiche: {
                            ...filters.caratteristiche,
                            [key]: e.target.checked
                          }
                        })}
                        style={{ transform: 'scale(1.2)' }}
                      />
                      <span style={{ fontSize: '0.9rem', color: '#555' }}>{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={resetAdvancedFilters}
                style={{
                  marginTop: '20px',
                  background: 'var(--color-error)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}
              >
                Resetta filtri avanzati
              </button>
            </div>
          )}
        </div>

        {/* Risultati */}
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h2 style={{ color: '#333', fontSize: '1.5rem' }}>
            {filteredProperties.length} immobili trovati
          </h2>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <LoadingSpinner text="Caricamento immobili..." />
            <p style={{ marginTop: '15px', color: '#666' }}>Attendere prego</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(220,53,69,0.1)', 
            border: '2px dashed #dc3545', 
            borderRadius: '15px',
            padding: '40px',
            textAlign: 'center',
            margin: '40px 0'
          }}>
            <h3 style={{ color: '#dc3545', marginBottom: '15px' }}>
              ⚠️ Errore di connessione
            </h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Non è possibile caricare gli immobili al momento. Verifica la connessione al backend.
            </p>
            <button
              onClick={refetch}
              style={{
                background: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '12px 25px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              🔄 Riprova
            </button>
          </div>
        )}

        {/* Griglia Immobili */}
        {!loading && !error && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '30px'
          }}>
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        {/* Nessun risultato */}
        {!loading && !error && filteredProperties.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px',
            color: '#666'
          }}>
            <h3 style={{ marginBottom: '15px' }}>Nessun immobile trovato</h3>
            <p>Prova a modificare i filtri di ricerca</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AllPropertiesPage;