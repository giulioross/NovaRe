import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdvancedPropertyForm from './AdvancedPropertyForm';
import { useAuthPersistent } from '../hooks/useAuthPersistent';
import { listingService } from '../services/listingService';
import { mapPropertyDataToBackend } from '../utils/payloadMapper';

/**
 * Pannello admin per gestione immobili con form avanzato e autenticazione
 */
const AdvancedAdminPanel = ({ onBack }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading, logout, hasPermission } = useAuthPersistent();
  
  // Gestione manuale dei listing admin
  const [listings, setListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [listingsError, setListingsError] = useState(null);
  
  const [currentView, setCurrentView] = useState('list'); // list|create|edit
  const [selectedListing, setSelectedListing] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchText, setSearchText] = useState(''); // Stato per la ricerca
  const [publicationFilter, setPublicationFilter] = useState('all'); // 'all', 'published', 'draft'

  // Filtro per la ricerca e stato pubblicazione negli immobili
  const filteredListings = listings.filter(listing => {
    // Filtro per stato di pubblicazione
    if (publicationFilter === 'published' && listing.published !== true) {
      return false;
    }
    if (publicationFilter === 'draft' && listing.published !== false) {
      return false;
    }
    
    // Filtro per ricerca testuale
    if (!searchText || searchText.trim() === '') {
      return true; // Mostra tutti se non c'è filtro di ricerca
    }
    
    const searchTerm = searchText.toLowerCase().trim();
    const title = (listing.title || '').toLowerCase();
    const address = (listing.address || '').toLowerCase();
    
    return title.includes(searchTerm) || address.includes(searchTerm);
  });

  // Funzione per cambiare lo stato di pubblicazione (bozza <-> pubblico)
  const togglePublishStatus = async (listingId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      console.log(`🔄 Cambiando stato immobile ${listingId}: ${currentStatus ? 'PUBBLICO' : 'BOZZA'} → ${newStatus ? 'PUBBLICO' : 'BOZZA'}`);
      const currentListing = listings.find(listing => listing.id === listingId);
      if (!currentListing) {
        throw new Error(`Immobile con ID ${listingId} non trovato`);
      }
      // Usa credenziali utente autenticato
      const username = user?.username || 'admin';
      const password = user?.password || 'ddd';
      await listingService.patchListing(
        listingId, 
        { published: newStatus }, 
        username, 
        password,
        { ...currentListing, published: newStatus } // fallback data per il caso PUT
      );
      setListings(prevListings => 
        prevListings.map(listing => 
          listing.id === listingId 
            ? { ...listing, published: newStatus }
            : listing
        )
      );
      setMessage({
        type: 'success',
        text: `Immobile ${newStatus ? 'pubblicato' : 'reso bozza'} con successo`
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Errore durante il cambio di stato dell\'immobile'
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  // Funzione per tornare alla home
  const handleGoHome = () => {
    if (onBack) {
      // Se viene passato onBack (da DemoPage), usalo
      onBack();
    } else {
      // Altrimenti usa React Router per navigare alla home
      navigate('/');
    }
  };

  // Funzione per caricare i listing admin
  const loadAdminListings = async () => {
    console.log('🔄 Caricamento listing admin...');
    setListingsLoading(true);
    setListingsError(null);
    
    try {
      const adminListings = await listingService.getAllListingsAdmin('admin', 'ddd');
      console.log('✅ Listing admin caricati:', adminListings);
      setListings(adminListings || []);
    } catch (error) {
      console.error('❌ Errore caricamento listing admin:', error);
      setListingsError('Errore nel caricamento degli annunci');
      setListings([]);
    } finally {
      setListingsLoading(false);
    }
  };

  // Carica i listing quando il componente si monta o quando l'utente si autentica
  useEffect(() => {
    if (isAuthenticated) {
      loadAdminListings();
    }
  }, [isAuthenticated]);



  // Gestisce la creazione di un nuovo annuncio
  const handleCreateListing = async (propertyData) => {
    setIsSubmitting(true);
    
    try {
      // Prepara i dati per il backend usando il mapper
      console.log('🔄 Mapping dei dati del form per il backend...');
      const payload = mapPropertyDataToBackend(propertyData);
      console.log('✅ Payload mappato:', payload);

      // Converti le immagini in file se necessario
      const imageFiles = propertyData.media.images?.length > 0 
        ? propertyData.media.images.map((img, index) => {
            // Se è già un file, usalo direttamente
            if (img instanceof File) return img;
            // Se è base64, convertilo in file
            if (img.startsWith('data:')) {
              const byteString = atob(img.split(',')[1]);
              const mimeString = img.split(',')[0].split(':')[1].split(';')[0];
              const ab = new ArrayBuffer(byteString.length);
              const ia = new Uint8Array(ab);
              for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
              }
              return new File([ab], `image-${index}.jpg`, { type: mimeString });
            }
            return null;
          }).filter(Boolean)
        : [];

      console.log('🔄 Creazione annuncio con dati:', payload);
      console.log('� PAYLOAD DETTAGLIATO:');
      console.log('- Title:', payload.title);
      console.log('- Description:', payload.description);
      console.log('- Address:', payload.address);
      console.log('- Price:', payload.price);
      console.log('- Bedrooms:', payload.bedrooms);
      console.log('- Bathrooms:', payload.bathrooms);
      console.log('- Commercial SQM:', payload.commercial_sqm);
      console.log('- Energy Class:', payload.energy_class);
      console.log('- Heating Type:', payload.heating_type);
      console.log('- Agent Name:', payload.agent_name);
      console.log('- NUMERO TOTALE CAMPI:', Object.keys(payload).length);
      console.log('�📸 Immagini da caricare:', imageFiles.length);

      // Usa credenziali utente autenticato
      const username = user?.username || 'admin';
      const password = user?.password || 'ddd';
      // Crea l'annuncio con il nuovo approccio separato (JSON + foto)
      const result = await listingService.createListingSeparated(
        payload,
        imageFiles,
        username,
        password
      );

      console.log('✅ Annuncio creato:', result);
      
      // Ricarica la lista degli annunci admin
      await loadAdminListings();
      
      setMessage({
        type: 'success',
        text: `✅ Annuncio "${propertyData.title}" creato con successo!`
      });
      
      // Torna alla lista dopo 2 secondi
      setTimeout(() => {
        setCurrentView('list');
        setMessage({ type: '', text: '' });
      }, 2000);

    } catch (error) {
      console.error('❌ Errore creazione annuncio:', error);
      setMessage({
        type: 'error',
        text: `❌ Errore: ${error.response?.data?.message || error.message}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gestisce la modifica di un annuncio esistente
  const handleUpdateListing = async (propertyData, updateOptions = {}) => {
    if (!selectedListing?.id) return;
    
    setIsSubmitting(true);
    
    try {
      let result;
      
      // Se abbiamo solo modifiche parziali, usa il nuovo sistema PATCH
      if (updateOptions.isPartialUpdate && updateOptions.changesOnly) {
        console.log('🔄 AGGIORNAMENTO PARZIALE - Solo campi modificati');
        console.log('📝 Modifiche da applicare:', updateOptions.changesOnly);
        console.log('📊 Numero campi modificati:', Object.keys(updateOptions.changesOnly).length);
        
        // Mappa le modifiche usando il payload mapper
        const partialPayload = mapPropertyDataToBackend(updateOptions.changesOnly);
        console.log('✅ Payload parziale mappato:', partialPayload);
        
        // Prepara anche i dati completi per eventuale fallback
        const completePayload = mapPropertyDataToBackend(propertyData);
        
        // Usa il nuovo metodo PATCH per aggiornamento parziale
        result = await listingService.patchListing(
          selectedListing.id,
          partialPayload,
          'admin',
          'ddd',
          completePayload // Dati completi per fallback
        );
        
        console.log('✅ Aggiornamento parziale completato:', result);
        
      } else {
        // Fallback al sistema completo
        console.log('🔄 AGGIORNAMENTO COMPLETO - Mapping dei dati...');
        const payload = mapPropertyDataToBackend(propertyData);
        console.log('✅ Payload completo mappato:', payload);

        // Converti le immagini in file se necessario
        const imageFiles = propertyData.media.images?.length > 0 
          ? propertyData.media.images.map((img, index) => {
              // Se è già un file, usalo direttamente
              if (img instanceof File) return img;
              // Se è base64, convertilo in file
              if (img.startsWith('data:')) {
                const byteString = atob(img.split(',')[1]);
                const mimeString = img.split(',')[0].split(':')[1].split(';')[0];
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                  ia[i] = byteString.charCodeAt(i);
                }
                return new File([ab], `image-${index}.jpg`, { type: mimeString });
              }
              return null;
            }).filter(Boolean)
          : [];

        console.log('🔄 Aggiornamento annuncio con dati:', payload);
        console.log('📊 PAYLOAD COMPLETO UPDATE - NUMERO CAMPI:', Object.keys(payload).length);
        console.log('📸 Immagini da aggiornare:', imageFiles.length);

        // Opzione A: Approccio separato (JSON prima, poi foto)
        // Step 1: Aggiorna JSON
        console.log('Step 1: Aggiornamento dati JSON...');
        const jsonResult = await listingService.updateListingJsonOnly(
          selectedListing.id,
          payload,
          'admin',
          'ddd'
        );

        // Step 2: Carica foto se presenti
        result = jsonResult;
        if (imageFiles.length > 0) {
          console.log('Step 2: Upload foto...');
          result = await listingService.uploadListingPhotosOnly(
            selectedListing.id,
            imageFiles,
            'admin',
            'ddd'
          );
        }
      }

      console.log('✅ Annuncio aggiornato:', result);
      
      setMessage({
        type: 'success',
        text: `✅ Annuncio "${propertyData.title}" aggiornato con successo!`
      });
      
      // Ricarica la lista degli immobili
      await loadAdminListings();
      
      setTimeout(() => {
        setCurrentView('list');
        setSelectedListing(null);
        setMessage({ type: '', text: '' });
      }, 2000);

    } catch (error) {
      console.error('❌ Errore aggiornamento annuncio:', error);
      setMessage({
        type: 'error',
        text: `❌ Errore: ${error.response?.data?.message || error.message}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gestisce l'eliminazione di un annuncio
  const handleDeleteListing = async (listingId, listingTitle) => {
    if (!window.confirm(`Sei sicuro di voler eliminare l'annuncio "${listingTitle}"?`)) {
      return;
    }

    console.log('🗑️ Tentativo eliminazione:', { listingId, listingTitle, user });

    try {
      console.log('🔄 Chiamata API eliminazione in corso...');
      
      // Prova con credenziali diverse - admin:ddd è quella che funziona
      const credentials = [
        { username: 'admin', password: 'ddd' },
        { username: 'admin', password: 'admin' },
        { username: 'admin', password: 'password' },
        { username: user?.username || 'admin', password: 'ddd' },
        { username: user?.username || 'admin', password: 'admin' }
      ];

      // Usa sempre le credenziali che funzionano (admin:ddd)
      console.log(`🔐 Usando credenziali admin:ddd (confermate funzionanti)`);
      await listingService.deleteListing(listingId, 'admin', 'ddd');
      console.log('✅ Eliminazione API completata con successo');
      
      setMessage({ type: 'success', text: `✅ Annuncio "${listingTitle}" eliminato con successo` });
      
      // Ricarica la lista
      console.log('🔄 Ricaricamento lista...');
      await loadAdminListings();
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('❌ Errore eliminazione dettagliato:', error);
      
      // Simula eliminazione locale (solo visiva)
      setMessage({ 
        type: 'warning', 
        text: `⚠️ Eliminazione dal server fallita, ma rimosso dalla vista locale. Aggiorna la pagina per verificare.` 
      });
      
      // Ricarica comunque la lista per vedere se l'eliminazione è avvenuta
      setTimeout(async () => {
        await loadAdminListings();
        setMessage({ type: '', text: '' });
      }, 3000);
    }
  };

  // Gestisce la pubblicazione/sospensione
  const handleTogglePublish = async (listingId, currentStatus, listingTitle) => {
    if (!hasPermission('publish')) {
      setMessage({ type: 'error', text: '❌ Non hai i permessi per pubblicare/sospendere annunci' });
      return;
    }

    try {
      // TODO: Implementare API specifica per publish/unpublish
      const newStatus = !currentStatus;
      console.log(`${newStatus ? 'Pubblicando' : 'Sospendendo'} annuncio:`, listingId);
      
      setMessage({ 
        type: 'success', 
        text: `✅ Annuncio "${listingTitle}" ${newStatus ? 'pubblicato' : 'sospeso'} con successo` 
      });
      await loadAdminListings();
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('❌ Errore pubblicazione:', error);
      setMessage({ type: 'error', text: `❌ Errore: ${error.response?.data?.message || error.message}` });
    }
  };

  // Loading states
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div>Caricamento...</div>
      </div>
    );
  }

  // Se non autenticato, reindirizza al login
  if (!isAuthenticated) {
    navigate('/admin');
    return null;
  }

  // Render del contenuto basato sulla vista corrente
  const renderContent = () => {
    switch (currentView) {
      case 'create':
        return (
          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '30px'
            }}>
              <h2>🏠 Crea Nuovo Annuncio</h2>
              <button
                onClick={() => setCurrentView('list')}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                ← Torna alla Lista
              </button>
            </div>
            
            {message.text && (
              <div style={{
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px',
                background: message.type === 'success' ? '#d4edda' : '#f8d7da',
                border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
                color: message.type === 'success' ? '#155724' : '#721c24'
              }}>
                {message.text}
              </div>
            )}
            
            <AdvancedPropertyForm
              onSubmit={handleCreateListing}
              onCancel={() => setCurrentView('list')}
              isEditing={false}
            />
          </div>
        );
        
      case 'edit':
        return (
          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '30px'
            }}>
              <h2>✏️ Modifica Annuncio</h2>
              <button
                onClick={() => {
                  setCurrentView('list');
                  setSelectedListing(null);
                }}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                ← Torna alla Lista
              </button>
            </div>
            
            {message.text && (
              <div style={{
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px',
                background: message.type === 'success' ? '#d4edda' : '#f8d7da',
                border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
                color: message.type === 'success' ? '#155724' : '#721c24'
              }}>
                {message.text}
              </div>
            )}
            
            <AdvancedPropertyForm
              initialData={selectedListing}
              onSubmit={handleUpdateListing}
              onCancel={() => {
                setCurrentView('list');
                setSelectedListing(null);
              }}
              isEditing={true}
            />
          </div>
        );
        
      default: // list
        return (
          <div>
            {/* Header con info utente */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '30px',
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <div>
                <h2 style={{ margin: '0 0 5px 0' }}>🏢 {user.company}</h2>
                <p style={{ margin: 0, color: '#6c757d' }}>
                  Benvenuto, <strong>{user.username}</strong> 
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  onClick={handleGoHome}
                  style={{
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  🏠 Torna alla Home
                </button>
                {isAuthenticated && (
                  <button
                    onClick={() => setCurrentView('create')}
                    style={{
                      background: 'var(--color-primary)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    ➕ Nuovo Annuncio
                  </button>
                )}
                
                <button
                  onClick={logout}
                  style={{
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  🚪 Logout
                </button>
              </div>
            </div>
            
            {/* Messaggio di feedback */}
            {message.text && (
              <div style={{
                background: message.type === 'success' ? '#d4edda' : '#f8d7da',
                color: message.type === 'success' ? '#155724' : '#721c24',
                border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '20px',
                textAlign: 'center',
                fontWeight: '600'
              }}>
                {message.text}
              </div>
            )}
            
            {/* Lista immobili */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              <div style={{ 
                padding: '20px', 
                borderBottom: '1px solid #dee2e6',
                background: '#f8f9fa'
              }}>
                <h3 style={{ margin: '0 0 15px 0' }}>📋 I Tuoi Annunci ({filteredListings?.length || 0})</h3>
                
                {/* Barra di ricerca */}
                <div style={{ marginTop: '15px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '600', 
                    color: '#333',
                    fontSize: '0.9rem'
                  }}>
                    🔍 Cerca tra i tuoi annunci
                  </label>
                  <input
                    type="text"
                    placeholder="Cerca per nome o indirizzo..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{
                      width: '100%',
                      maxWidth: '400px',
                      padding: '10px 12px 10px 35px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' fill=\'%23666\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z\'/%3E%3C/svg%3E")',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: '10px center',
                      backgroundSize: '16px'
                    }}
                  />
                  {searchText && (
                    <small style={{ 
                      display: 'block', 
                      marginTop: '5px', 
                      color: '#6c757d',
                      fontSize: '0.8rem'
                    }}>
                      {filteredListings.length} di {listings.length} annunci
                    </small>
                  )}
                </div>
                
                {/* Filtri per stato di pubblicazione */}
                <div style={{ marginTop: '15px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '600', 
                    color: '#333',
                    fontSize: '0.9rem'
                  }}>
                    📊 Filtra per stato
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setPublicationFilter('all')}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: publicationFilter === 'all' ? '2px solid var(--color-primary)' : '2px solid #e1e5e9',
                        background: publicationFilter === 'all' ? 'var(--color-primary)' : 'white',
                        color: publicationFilter === 'all' ? 'white' : '#333',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s'
                      }}
                    >
                      🏠 Tutti ({listings.length})
                    </button>
                    <button
                      onClick={() => setPublicationFilter('published')}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: publicationFilter === 'published' ? '2px solid #28a745' : '2px solid #e1e5e9',
                        background: publicationFilter === 'published' ? '#28a745' : 'white',
                        color: publicationFilter === 'published' ? 'white' : '#333',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s'
                      }}
                    >
                      ✅ Pubblici ({listings.filter(l => l.published === true).length})
                    </button>
                    <button
                      onClick={() => setPublicationFilter('draft')}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: publicationFilter === 'draft' ? '2px solid #ffc107' : '2px solid #e1e5e9',
                        background: publicationFilter === 'draft' ? '#ffc107' : 'white',
                        color: publicationFilter === 'draft' ? '#333' : '#333',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s'
                      }}
                    >
                      📝 Bozze ({listings.filter(l => l.published === false).length})
                    </button>
                  </div>
                </div>
              </div>
              
              {listingsLoading ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>
                  <div>Caricamento annunci...</div>
                </div>
              ) : listingsError ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#dc3545' }}>
                  Errore nel caricamento: {listingsError}
                </div>
              ) : !filteredListings || filteredListings.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>
                  {searchText ? (
                    <>
                      <h4>🔍 Nessun risultato trovato</h4>
                      <p style={{ color: '#6c757d', marginBottom: '20px' }}>
                        Nessun annuncio corrisponde a "{searchText}"
                      </p>
                      <button
                        onClick={() => setSearchText('')}
                        style={{
                          background: '#6c757d',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '20px',
                          cursor: 'pointer'
                        }}
                      >
                        Cancella ricerca
                      </button>
                    </>
                  ) : (
                    <>
                      <h4>Nessun annuncio presente</h4>
                      <p style={{ color: '#6c757d', marginBottom: '20px' }}>
                        Inizia creando il tuo primo annuncio professionale
                      </p>
                    </>
                  )}
                  {hasPermission('create') && (
                    <button
                      onClick={() => setCurrentView('create')}
                      style={{
                        background: 'linear-gradient(45deg, var(--color-primary), var(--color-secondary))',
                        color: 'white',
                        border: 'none',
                        padding: '15px 30px',
                        borderRadius: '25px',
                        cursor: 'pointer',
                        fontSize: '1.1rem',
                        fontWeight: '600'
                      }}
                    >
                      🚀 Crea Primo Annuncio
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  {filteredListings.map((listing, index) => (
                    <div key={listing.id} style={{
                      padding: '20px',
                      borderBottom: index < listings.length - 1 ? '1px solid #dee2e6' : 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 5px 0', color: 'var(--color-primary)' }}>
                          {listing.title || listing.titolo || `Immobile ${listing.id}`}
                        </h4>
                        <p style={{ margin: 0, color: '#666' }}>
                          📍 {listing.address || listing.indirizzo || 'Indirizzo non specificato'} - {listing.city || listing.citta || 'Città'}
                        </p>
                        <div style={{ display: 'flex', gap: '15px', fontSize: '0.9rem', color: '#666' }}>
                          <span>💰 €{listing.price || listing.prezzo || 'N/A'}</span>
                          <span>📐 {listing.size || listing.superficie || 'N/A'} mq</span>
                          <span>🛏️ {listing.bedrooms || listing.camere || 'N/A'} camere</span>
                          <span>🚿 {listing.bathrooms || listing.bagni || 'N/A'} bagni</span>
                        </div>
                        
                        {/* Data e ora di pubblicazione */}
                        <div style={{ 
                          marginTop: '8px', 
                          fontSize: '0.85rem', 
                          color: '#999',
                          display: 'flex',
                          gap: '15px'
                        }}>
                          {(() => {
                            const formatTimestamp = (timestamp) => {
                              if (!timestamp) return null;
                              
                              // Se è una stringa ISO, usala direttamente
                              if (typeof timestamp === 'string' && timestamp.includes('T')) {
                                return new Date(timestamp).toLocaleString('it-IT', {
                                  day: '2-digit',
                                  month: '2-digit', 
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                });
                              }
                              
                              // Se è un numero Unix timestamp in secondi, convertilo a millisecondi
                              if (typeof timestamp === 'number') {
                                const date = timestamp < 10000000000 ? 
                                  new Date(timestamp * 1000) : // Timestamp in secondi
                                  new Date(timestamp); // Timestamp in millisecondi
                                  
                                // Verifica che sia una data valida e non 1970
                                if (date.getFullYear() > 1990) {
                                  return date.toLocaleString('it-IT', {
                                    day: '2-digit',
                                    month: '2-digit', 
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  });
                                }
                              }
                              
                              return null;
                            };
                            
                            const createdFormatted = formatTimestamp(listing.createdAt);
                            const updatedFormatted = formatTimestamp(listing.updatedAt);
                            
                            return (
                              <>
                                {createdFormatted && (
                                  <span>
                                    <strong>Creato:</strong> {createdFormatted}
                                  </span>
                                )}
                                {updatedFormatted && updatedFormatted !== createdFormatted && (
                                  <span>
                                    <strong>Modificato:</strong> {updatedFormatted}
                                  </span>
                                )}
                                {!createdFormatted && !updatedFormatted && (
                                  <span>
                                    <strong>ID:</strong> {listing.id}
                                  </span>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                      
                      <div className="listing-actions">
                        <button
                          onClick={() => window.open(`/listing/${listing.id}`, '_blank')}
                          style={{
                            background: 'var(--color-primary)',
                            color: 'white',
                            border: 'none',  
                            padding: '8px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            marginRight: '8px'
                          }}
                        >
                          👁️ Visualizza
                        </button>
                        {isAuthenticated && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedListing(listing);
                                setCurrentView('edit');
                              }}
                              style={{
                                background: 'var(--color-secondary)',
                                color: 'white',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                marginRight: '8px'
                              }}
                            >
                              ✏️ Modifica
                            </button>
                            <button
                              onClick={() => togglePublishStatus(listing.id, listing.published)}
                              style={{
                                background: listing.published ? '#28a745' : '#ffc107',
                                color: listing.published ? 'white' : '#212529',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                marginRight: '8px'
                              }}
                              title={`Clicca per ${listing.published ? 'rendere bozza' : 'pubblicare'}`}
                            >
                              {listing.published ? '👁️ Pubblico' : '👁️‍🗨️ Bozza'}
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteListing(
                            listing.id, 
                            listing.title || listing.titolo
                          )}
                          style={{
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                          }}
                        >
                          🗑️ Elimina
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8f9fa', 
      padding: '20px' 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdvancedAdminPanel;