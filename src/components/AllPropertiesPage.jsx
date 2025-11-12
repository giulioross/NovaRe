import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import { useListings } from '../hooks/useListings';
import PlaceholderImage from './PlaceholderImage';
import { API_BASE } from '../services/listingService.js';

const AllPropertiesPage = () => {
  const { listings: properties, loading, error, refetch } = useListings();
  const navigate = useNavigate();
  
  // Debug: controlla quanti immobili vengono caricati
  useEffect(() => {
    console.log('🏠 AllPropertiesPage - Immobili caricati:', properties.length);
    console.log('🏠 Lista completa immobili:', properties);
    if (properties.length > 0) {
      console.log('🏠 STRUTTURA PRIMO IMMOBILE:', properties[0]);
      console.log('🏠 Campi disponibili:', Object.keys(properties[0]));
    }
  }, [properties]);
  
  // Filtri state
  const [filters, setFilters] = useState({
    quartiere: 'all',
    tipo: 'all',
    prezzoMin: 0,
    prezzoMax: 999999999, // Prezzo massimo molto alto per non escludere nulla
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

  // Ottieni quartieri unici dagli immobili disponibili
  const getUniqueQuartieri = () => {
    const quartieri = new Set();
    properties.forEach(property => {
      if (property.address) {
        // Estrai il quartiere dall'indirizzo (assumiamo che sia la prima parte)
        const parts = property.address.split(',');
        if (parts.length > 0) {
          quartieri.add(parts[0].trim());
        }
      }
      if (property.district) {
        quartieri.add(property.district);
      }
      if (property.city) {
        quartieri.add(property.city);
      }
      if (property.zone) {
        quartieri.add(property.zone);
      }
    });
    return Array.from(quartieri).filter(q => q && q.length > 0).sort();
  };

  // Ottieni tipi unici dagli immobili disponibili
  const getUniqueTypes = () => {
    const types = new Set();
    properties.forEach(property => {
      if (property.propertyType) {
        types.add(property.propertyType);
      }
      if (property.type) {
        types.add(property.type);
      }
      if (property.category) {
        types.add(property.category);
      }
    });
    return Array.from(types).filter(t => t && t.length > 0).sort();
  };

  // Ottieni classi energetiche realmente disponibili
  const getUniqueEnergyClasses = () => {
    const classes = new Set();
    properties.forEach(property => {
      if (property.energy?.ape_class) {
        classes.add(property.energy.ape_class);
      }
    });
    return Array.from(classes).sort();
  };

  // Helper per costruire URL assolute delle immagini
  const imgUrlFrom = (photo) => {
    if (!photo) return '';
    return (photo.startsWith('http://') || photo.startsWith('https://')) ? 
      photo : `${API_BASE}${photo}`;
  };

  // Filtra le proprietà in base ai filtri selezionati
  const filteredProperties = properties.filter((property, index) => {
    console.log(`🔍 ===== FILTRAGGIO IMMOBILE [${index}] =====`);
    console.log('🔍 Titolo:', property.title || 'Senza titolo');
    console.log('🔍 ID:', property.id);
    console.log('🔍 Filtri attivi:', filters);
    
    // Filtro quartiere
    if (filters.quartiere !== 'all' && filters.quartiere.trim() !== '') {
      const quartiere = filters.quartiere.toLowerCase().trim();
      
      console.log('🔍 DEBUG FILTRO QUARTIERE per:', property.title);
      console.log('🔍 Cercando:', quartiere);
      console.log('🔍 TUTTI I CAMPI DISPONIBILI:', Object.keys(property));
      console.log('🔍 address:', property.address);
      console.log('🔍 district:', property.district);
      console.log('🔍 city:', property.city);
      console.log('🔍 zone:', property.zone);
      console.log('🔍 indirizzo:', property.indirizzo);
      console.log('🔍 quartiere_prop:', property.quartiere);
      console.log('🔍 zona:', property.zona);
      console.log('🔍 citta:', property.citta);
      
      const inAddress = property.address?.toLowerCase().includes(quartiere);
      const inDistrict = property.district?.toLowerCase().includes(quartiere);
      const inCity = property.city?.toLowerCase().includes(quartiere);
      const inZone = property.zone?.toLowerCase().includes(quartiere);
      
      // Controlli aggiuntivi per campi italiani
      const inIndirizzo = property.indirizzo?.toLowerCase().includes(quartiere);
      const inQuartiere = property.quartiere?.toLowerCase().includes(quartiere);
      const inZona = property.zona?.toLowerCase().includes(quartiere);
      const inCitta = property.citta?.toLowerCase().includes(quartiere);
      
      console.log('🔍 Match results EN - inAddress:', inAddress, 'inDistrict:', inDistrict, 'inCity:', inCity, 'inZone:', inZone);
      console.log('🔍 Match results IT - inIndirizzo:', inIndirizzo, 'inQuartiere:', inQuartiere, 'inZona:', inZona, 'inCitta:', inCitta);
      
      // Cerca anche corrispondenze parziali nei nomi dei quartieri famosi
      const matchesFamousDistrict = ['centro', 'trastevere', 'prati', 'testaccio', 'san lorenzo', 
        'monti', 'campo de fiori', 'aventino', 'celio', 'esquilino', 'flaminio', 
        'parioli', 'eur', 'ostiense', 'garbatella', 'san giovanni', 're di roma', 
        'ponte milvio', 'trieste', 'nomentano'].some(famous => 
          famous.includes(quartiere) || quartiere.includes(famous)
        );
      
      console.log('🔍 Famous district match:', matchesFamousDistrict);
      
      const shouldInclude = inAddress || inDistrict || inCity || inZone || 
                          inIndirizzo || inQuartiere || inZona || inCitta || 
                          matchesFamousDistrict;
      console.log('🔍 Final decision - shouldInclude:', shouldInclude);
      
      if (!shouldInclude) {
        console.log('❌ Immobile escluso per quartiere:', property.title, 'Cercato:', quartiere);
        return false;
      } else {
        console.log('✅ Immobile incluso per quartiere:', property.title);
      }
    }
    
    // Filtro tipo (affitto/vendita)
    if (filters.tipo !== 'all') {
      const tipo = filters.tipo.toLowerCase();
      console.log('🔍 DEBUG FILTRO TIPO per:', property.title);
      console.log('🔍 Cercando tipo:', tipo);
      console.log('🔍 contractType:', property.contractType);
      console.log('🔍 listingType:', property.listingType);
      console.log('🔍 saleType:', property.saleType);
      console.log('🔍 transactionType:', property.transactionType);
      
      let matches = false;
      
      if (tipo === 'affitto') {
        // Cerca indicatori di affitto
        matches = property.contractType?.toLowerCase().includes('affitto') ||
                  property.contractType?.toLowerCase().includes('rent') ||
                  property.listingType?.toLowerCase().includes('affitto') ||
                  property.listingType?.toLowerCase().includes('rent') ||
                  property.saleType?.toLowerCase().includes('affitto') ||
                  property.saleType?.toLowerCase().includes('rent') ||
                  property.transactionType?.toLowerCase().includes('affitto') ||
                  property.transactionType?.toLowerCase().includes('rent');
      } else if (tipo === 'vendita') {
        // Cerca indicatori di vendita
        matches = property.contractType?.toLowerCase().includes('vendita') ||
                  property.contractType?.toLowerCase().includes('sale') ||
                  property.contractType?.toLowerCase().includes('sell') ||
                  property.listingType?.toLowerCase().includes('vendita') ||
                  property.listingType?.toLowerCase().includes('sale') ||
                  property.saleType?.toLowerCase().includes('vendita') ||
                  property.saleType?.toLowerCase().includes('sale') ||
                  property.transactionType?.toLowerCase().includes('vendita') ||
                  property.transactionType?.toLowerCase().includes('sale');
      }
      
      console.log('🔍 Match result for tipo:', matches);
      
      if (!matches) {
        console.log('❌ Immobile escluso per tipo:', property.title, 'Cercato:', tipo);
        return false;
      } else {
        console.log('✅ Immobile incluso per tipo:', property.title);
      }
    }
    
    // Filtro prezzo
    const price = parseFloat(property.price) || 0;
    if (filters.prezzoMin > 0 && price < filters.prezzoMin) {
      console.log('❌ Immobile escluso per prezzo minimo:', property.title, 'Prezzo:', price, 'Minimo:', filters.prezzoMin);
      return false;
    }
    if (filters.prezzoMax < 999999999 && price > filters.prezzoMax) {
      console.log('❌ Immobile escluso per prezzo massimo:', property.title, 'Prezzo:', price, 'Massimo:', filters.prezzoMax);
      return false;
    }
    
    // Filtro locali
    const locali = parseInt(property.rooms) || parseInt(property.bedrooms) || 0;
    if (filters.localiMin && locali < parseInt(filters.localiMin)) {
      console.log('❌ Immobile escluso per locali minimi:', property.title, 'Locali:', locali, 'Minimo:', filters.localiMin);
      return false;
    }
    if (filters.localiMax && locali > parseInt(filters.localiMax)) {
      console.log('❌ Immobile escluso per locali massimi:', property.title, 'Locali:', locali, 'Massimo:', filters.localiMax);
      return false;
    }
    
    // Filtro bagni
    const bagni = parseInt(property.bathrooms) || 0;
    if (filters.bagniMin && bagni < parseInt(filters.bagniMin)) {
      return false;
    }
    if (filters.bagniMax && bagni > parseInt(filters.bagniMax)) {
      return false;
    }
    
    // Filtro superficie
    const superficie = parseFloat(property.size) || parseFloat(property.surface) || parseFloat(property.sqm) || parseFloat(property.commercial_sqm) || 0;
    if (filters.superficieMin && superficie < parseFloat(filters.superficieMin)) {
      console.log('❌ Immobile escluso per superficie minima:', property.title, 'Superficie:', superficie, 'Minimo:', filters.superficieMin);
      return false;
    }
    if (filters.superficieMax && superficie > parseFloat(filters.superficieMax)) {
      console.log('❌ Immobile escluso per superficie massima:', property.title, 'Superficie:', superficie, 'Massimo:', filters.superficieMax);
      return false;
    }
    
    // Filtro classe energetica
    if (filters.classeEnergetica !== 'all' && property.energy?.ape_class !== filters.classeEnergetica) {
      return false;
    }
    
    // Filtro caratteristiche
    if (filters.caratteristiche.ascensore && 
        !property.features?.elevator && 
        !property.elevator && 
        !property.lift &&
        property.elevator !== true) {
      console.log('❌ Immobile escluso per mancanza ascensore:', property.title);
      return false;
    }
    if (filters.caratteristiche.balcone && 
        !property.features?.balcony && 
        !property.balcony &&
        property.balcony !== true) {
      console.log('❌ Immobile escluso per mancanza balcone:', property.title);
      return false;
    }
    if (filters.caratteristiche.giardino && 
        !property.features?.garden && 
        !property.garden &&
        property.garden !== true) {
      console.log('❌ Immobile escluso per mancanza giardino:', property.title);
      return false;
    }
    if (filters.caratteristiche.garage && 
        !property.features?.garage && 
        !property.garage &&
        property.garage !== true) {
      console.log('❌ Immobile escluso per mancanza garage:', property.title);
      return false;
    }
    if (filters.caratteristiche.postoAuto && 
        !property.features?.parking && 
        !property.parking &&
        property.parking !== true) {
      console.log('❌ Immobile escluso per mancanza posto auto:', property.title);
      return false;
    }
    if (filters.caratteristiche.arredato && 
        property.furnished !== 'arredato' && 
        property.furnished !== true &&
        !property.furnished) {
      console.log('❌ Immobile escluso per arredamento:', property.title, 'Furnished:', property.furnished);
      return false;
    }
    
    return true;
  });

  // Debug: controlla quanti immobili passano i filtri
  useEffect(() => {
    console.log('🔍 Immobili dopo filtri:', filteredProperties.length);
    console.log('🔍 Filtri applicati:', filters);
    console.log('🔍 Immobili filtrati:', filteredProperties);
    
    // Debug: mostra perché gli immobili vengono esclusi
    if (properties.length > 0 && filteredProperties.length < properties.length) {
      console.log('❌ Immobili esclusi dai filtri:');
      properties.forEach((property, index) => {
        if (!filteredProperties.includes(property)) {
          console.log(`❌ [${index}] ${property.title || 'Senza titolo'}`);
        }
      });
    }
  }, [filteredProperties, filters, properties]);

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

  // Funzione per resettare tutti i filtri
  const handleResetFilters = () => {
    setFilters({
      tipo: 'all',
      quartiere: 'all',
      prezzoMin: 0,
      prezzoMax: 999999999,
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
    console.log('🔄 Filtri resettati');
  };

  // Componente per singola proprietà
  const PropertyCard = ({ property, navigate }) => {
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
                onClick={() => navigate(`/listing/${property.id}`, { 
                  state: { from: '/immobili' } 
                })}
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
              <input
                type="text"
                list="quartieri-list"
                placeholder="Cerca quartiere o seleziona..."
                value={filters.quartiere === 'all' ? '' : filters.quartiere}
                onChange={(e) => setFilters({...filters, quartiere: e.target.value || 'all'})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  position: 'relative',
                  zIndex: 10
                }}
              />
              <datalist id="quartieri-list">
                <option value="all">Tutti i quartieri</option>
                {/* Quartieri più gettonati di Roma */}
                <option value="Centro">Centro Storico</option>
                <option value="Trastevere">Trastevere</option>
                <option value="Prati">Prati</option>
                <option value="Testaccio">Testaccio</option>
                <option value="San Lorenzo">San Lorenzo</option>
                <option value="Monti">Monti</option>
                <option value="Campo de' Fiori">Campo de' Fiori</option>
                <option value="Aventino">Aventino</option>
                <option value="Celio">Celio</option>
                <option value="Esquilino">Esquilino</option>
                <option value="Flaminio">Flaminio</option>
                <option value="Parioli">Parioli</option>
                <option value="EUR">EUR</option>
                <option value="Ostiense">Ostiense</option>
                <option value="Garbatella">Garbatella</option>
                <option value="San Giovanni">San Giovanni</option>
                <option value="Re di Roma">Re di Roma</option>
                <option value="Ponte Milvio">Ponte Milvio</option>
                <option value="Trieste">Trieste</option>
                <option value="Nomentano">Nomentano</option>
                {/* Quartieri dai dati reali */}
                {getUniqueQuartieri().map(quartiere => (
                  <option key={quartiere} value={quartiere}>{quartiere}</option>
                ))}
              </datalist>
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
                <option value="all">Tutti gli annunci</option>
                <option value="affitto">Affitto</option>
                <option value="vendita">Vendita</option>
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
                  value={filters.prezzoMax === 999999999 ? '' : filters.prezzoMax}
                  onChange={(e) => setFilters({...filters, prezzoMax: parseInt(e.target.value) || 999999999})}
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
                    {getUniqueEnergyClasses().map(classe => (
                      <option key={classe} value={classe}>Classe {classe}</option>
                    ))}
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

              <div style={{ display: 'flex', gap: '15px', marginTop: '20px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    // I filtri si applicano automaticamente, questo pulsante può essere usato per refresh
                    console.log('Applicando filtri...', filters);
                  }}
                  style={{
                    background: 'var(--nova-blue)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    transition: 'background 0.3s'
                  }}
                >
                  🔍 Cerca Immobili
                </button>
                
                <button
                  onClick={resetAdvancedFilters}
                  style={{
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
            </div>
          )}
        </div>

        {/* Risultati */}
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h2 style={{ color: '#333', fontSize: '1.5rem' }}>
            {filteredProperties.length} immobili trovati
            {properties.length > 0 && filteredProperties.length < properties.length && (
              <span style={{ fontSize: '1rem', color: '#666', fontWeight: 'normal' }}>
                {' '}su {properties.length} totali
              </span>
            )}
          </h2>
          
          {/* Mostra filtri attivi */}
          {(filters.quartiere !== 'all' || filters.tipo !== 'all' || filters.prezzoMin > 0 || filters.prezzoMax < 999999999) && (
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '8px', 
              justifyContent: 'center',
              marginTop: '15px'
            }}>
              {filters.quartiere !== 'all' && filters.quartiere.trim() && (
                <span style={{
                  background: 'var(--nova-blue)',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '500'
                }}>
                  📍 {filters.quartiere}
                </span>
              )}
              {filters.tipo !== 'all' && (
                <span style={{
                  background: 'var(--color-secondary)',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '500'
                }}>
                  🏠 {filters.tipo}
                </span>
              )}
              {(filters.prezzoMin > 0 || filters.prezzoMax < 999999999) && (
                <span style={{
                  background: 'var(--color-accent)',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '500'
                }}>
                  💰 {filters.prezzoMin > 0 ? `€${filters.prezzoMin.toLocaleString()}` : '€0'} - {filters.prezzoMax < 999999999 ? `€${filters.prezzoMax.toLocaleString()}` : '∞'}
                </span>
              )}
              <button
                onClick={handleResetFilters}
                style={{
                  background: '#f8f9fa',
                  color: '#666',
                  border: '1px solid #ddd',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#e9ecef';
                  e.target.style.color = '#333';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#f8f9fa';
                  e.target.style.color = '#666';
                }}
              >
                🔄 Reset filtri
              </button>
            </div>
          )}
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
              <PropertyCard key={property.id} property={property} navigate={navigate} />
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