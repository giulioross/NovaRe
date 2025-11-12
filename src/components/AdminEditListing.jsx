import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import listingService, { makeAuthHeader } from '../services/listingService';
import ImageUploader from './ImageUploader.jsx';
import { convertImagesToFiles, prepareListing } from '../utils/fileUtils.js';

/**
 * Componente per modificare un immobile esistente (solo per admin)
 * @param {Object} listing - Immobile da modificare
 * @param {string} username - Username admin
 * @param {string} password - Password admin
 * @param {Function} onSuccess - Callback chiamato quando l'immobile è modificato con successo
 * @param {Function} onCancel - Callback per annullare la modifica
 */
const AdminEditListing = ({ listing, username, password, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    bedrooms: '',
    bathrooms: '',
    price: '',
    type: 'VENDITA',
    published: true,
    size: '',
    images: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [validationErrors, setValidationErrors] = useState({});

  // Carica i dati dell'immobile quando il componente viene montato
  useEffect(() => {
    if (listing) {
      setFormData({
        title: listing.title || '',
        description: listing.description || '',
        address: listing.address || '',
        city: listing.city || '',
        bedrooms: listing.bedrooms?.toString() || '',
        bathrooms: listing.bathrooms?.toString() || '',
        price: listing.price?.toString() || '',
        type: listing.type || listing.contractType || 'VENDITA',
        published: listing.published ?? true,
        size: listing.size?.toString() || '',
        images: (() => {
          // Debug: logga la struttura delle immagini dal backend
          console.log('🔄 DEBUG Edit - Immagini dal backend:', {
            images: listing.images,
            imageUrl: listing.imageUrl,
            photoUrls: listing.photoUrls,
            photos: listing.photos
          });
          
          // Helper per costruire URL assolute delle immagini
          const imgUrlFrom = (photo) => {
            if (!photo) return '';
            return (photo.startsWith('http://') || photo.startsWith('https://')) ? 
              photo : `${import.meta.env.VITE_API_BASE || 'http://localhost:8082'}${photo}`;
          };
          
          // Gestisci diversi formati di immagine dal backend
          let imageUrls = [];
          
          if (listing.images && Array.isArray(listing.images)) {
            imageUrls = listing.images;
          } else if (listing.photoUrls && Array.isArray(listing.photoUrls)) {
            imageUrls = listing.photoUrls;
          } else if (listing.photos && Array.isArray(listing.photos)) {
            imageUrls = listing.photos;
          } else if (listing.imageUrl) {
            imageUrls = [listing.imageUrl];
          }
          
          // Converte le URL in formato assoluto per ImageUploader
          const absoluteUrls = imageUrls
            .filter(url => url && typeof url === 'string')
            .map(url => imgUrlFrom(url));
            
          console.log('✅ DEBUG Edit - Immagini processate per ImageUploader:', absoluteUrls);
          return absoluteUrls;
        })()
      });
    }
  }, [listing]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Gestione del cambio immagini
  const handleImagesChange = (newImages) => {
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  // Helper per mostrare errori di validazione
  const getFieldError = (fieldName) => {
    return validationErrors[fieldName] || null;
  };

  const getFieldStyle = (fieldName) => ({
    width: '100%',
    padding: '12px',
    border: `2px solid ${getFieldError(fieldName) ? '#dc3545' : '#e1e5e9'}`,
    borderRadius: '10px',
    fontSize: '14px'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset errori precedenti
    setValidationErrors({});
    
    // Validazione base
    if (!formData.title || !formData.address || !formData.price) {
      setMessage({
        type: 'error',
        text: 'Per favore compila almeno titolo, indirizzo e prezzo'
      });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      console.log('🔐 DEBUG NEW FLOW - Credenziali ricevute:');
      console.log('  Username:', username);
      console.log('  Password:', password);
      console.log('📝 DEBUG NEW FLOW - Dati da aggiornare:', formData);
      
      // costruisci DTO dai campi del form
      const dto = {
        id: listing.id,
        title: formData.title,
        address: formData.address,
        price: Number(formData.price),
        description: formData.description,
        bedrooms: Number(formData.bedrooms || 0),
        bathrooms: Number(formData.bathrooms || 0),
        size: Number(formData.size || 0),
        contractType: formData.contractType || 'VENDITA',
        published: formData.published !== false,
      };
      const files = convertImagesToFiles(formData.images);
      const authHeader = makeAuthHeader(username, password);
      
      console.log('🔄 DEBUG NEW FLOW - Dati listing per backend:', dto);
      console.log('📸 DEBUG NEW FLOW - File convertiti:', files.length, files);
      console.log('🔐 DEBUG NEW FLOW - Auth header:', authHeader);

      // chiamata combinata: update JSON -> upload photos (se presenti)
      console.log('� SAFE FLOW - Aggiornamento immobile:', { id: listing.id, dto });
      console.log('📸 SAFE FLOW - File da caricare:', files?.length || 0);
      
      const result = await listingService.updateListingWithPhotos(listing.id, dto, files, authHeader);
      console.log('✅ SAFE FLOW - Aggiornamento completato:', result);

      // success: aggiorna UI con result (listing aggiornato)
      let finalListing = result;
      if (files.length > 0) {
        console.log('� Step 2: Upload foto...');
        console.log('📸 DEBUG NEW FLOW - File da caricare:', files);
        console.log('📸 DEBUG NEW FLOW - ID annuncio:', listing.id);
        
        try {
          const listingWithPhotos = await listingService.uploadPhotos(
            listing.id,
            files,
            authHeader
          );
          
          console.log('📸 DEBUG NEW FLOW - Response upload foto:', listingWithPhotos);
          
          if (listingWithPhotos) {
            finalListing = listingWithPhotos;
            console.log('✅ Step 2 completato - Listing finale con foto:', finalListing);
          } else {
            console.warn('⚠️ DEBUG NEW FLOW - Upload foto non ha restituito dati');
          }
        } catch (photoError) {
          console.error('❌ DEBUG NEW FLOW - Errore upload foto:', photoError);
          console.error('📋 DEBUG NEW FLOW - Photo error status:', photoError.response?.status);
          console.error('📋 DEBUG NEW FLOW - Photo error data:', photoError.response?.data);
          // Non bloccare il processo, ma informa l'utente
          setMessage({
            type: 'warning',
            text: `⚠️ Modifiche salvate, ma errore nel caricamento foto: ${photoError.response?.data || photoError.message}`
          });
        }
      } else {
        console.log('📸 Step 2: Nessuna foto da caricare');
      }

      // Successo
      setMessage({
        type: 'success',
        text: `✅ Immobile modificato con successo! ${files?.length > 0 ? `(${files.length} foto caricate)` : ''}`
      });

      // Chiama il callback di successo se fornito
      if (onSuccess) {
        console.log('🔄 SAFE FLOW - Chiamando onSuccess con result:', result);
        onSuccess(result);
      }

      // Dopo 2 secondi, chiudi il form
      setTimeout(() => {
        onCancel();
      }, 2000);

    } catch (error) {
      console.error('❌ Errore nell\'aggiornamento dell\'immobile (NEW FLOW):', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      console.error('Response headers:', error.response?.headers);
      
      // Gestione errori di validazione (400)
      if (error.response?.status === 400 && error.response?.data) {
        const errorData = error.response.data;
        
        // Se è un oggetto con errori per campo
        if (typeof errorData === 'object' && !Array.isArray(errorData)) {
          setValidationErrors(errorData);
          setMessage({
            type: 'error',
            text: '❌ Errori di validazione. Controlla i campi evidenziati.'
          });
        } else {
          // Errore generico
          setMessage({
            type: 'error',
            text: `❌ Errore di validazione: ${errorData.message || errorData}`
          });
        }
      } else if (error.response?.status === 401) {
        setMessage({
          type: 'error',
          text: '❌ Credenziali non autorizzate. Verifica username e password.'
        });
      } else {
        setMessage({
          type: 'error',
          text: `❌ Errore durante l'aggiornamento: ${error.message || 'Errore sconosciuto'}`
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!listing) {
    return <div>Nessun immobile selezionato per la modifica.</div>;
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      padding: '30px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <div style={{ marginBottom: '25px', textAlign: 'center' }}>
        <h2 style={{ 
          color: '#333', 
          fontSize: '1.8rem',
          marginBottom: '10px',
          fontWeight: '600'
        }}>
          ✏️ Modifica Immobile
        </h2>
        <p style={{ color: '#666', margin: 0 }}>
          ID: {listing.id} - Modifica i dettagli dell'immobile
        </p>
      </div>

      {message.text && (
        <div style={{
          padding: '15px',
          borderRadius: '10px',
          marginBottom: '20px',
          background: message.type === 'success' ? '#d4edda' : '#f8d7da',
          border: `2px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
          color: message.type === 'success' ? '#155724' : '#721c24'
        }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Titolo */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#333' 
            }}>
              Titolo *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              style={getFieldStyle('title')}
              placeholder="es. Appartamento in centro storico"
            />
            {getFieldError('title') && (
              <div style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '5px' }}>
                {getFieldError('title')}
              </div>
            )}
          </div>

          {/* Indirizzo */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#333' 
            }}>
              Indirizzo *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              style={getFieldStyle('address')}
              placeholder="es. Via Roma 123, Roma"
            />
            {getFieldError('address') && (
              <div style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '5px' }}>
                {getFieldError('address')}
              </div>
            )}
          </div>

          {/* Città */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#333' 
            }}>
              Città
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              style={getFieldStyle('city')}
              placeholder="es. Milano"
            />
            {getFieldError('city') && (
              <div style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '5px' }}>
                {getFieldError('city')}
              </div>
            )}
          </div>

          {/* Numero di camere e bagni */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600', 
                color: '#333' 
              }}>
                Camere da letto
              </label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
                style={getFieldStyle('bedrooms')}
                min="0"
                placeholder="es. 3"
              />
            </div>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600', 
                color: '#333' 
              }}>
                Bagni
              </label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                style={getFieldStyle('bathrooms')}
                min="0"
                placeholder="es. 2"
              />
            </div>
          </div>

          {/* Prezzo */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#333' 
            }}>
              Prezzo (€) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              style={getFieldStyle('price')}
              min="0"
              step="1000"
              placeholder="es. 250000"
            />
            {getFieldError('price') && (
              <div style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '5px' }}>
                {getFieldError('price')}
              </div>
            )}
          </div>

          {/* Pubblicato */}
          <div>
            <label style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: '600', 
              color: '#333',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleInputChange}
                style={{ transform: 'scale(1.2)' }}
              />
              Immobile pubblicato (visibile al pubblico)
            </label>
          </div>

          {/* Descrizione */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#333' 
            }}>
              Descrizione
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              style={{
                ...getFieldStyle('description'),
                resize: 'vertical',
                minHeight: '100px'
              }}
              placeholder="Descrizione dettagliata dell'immobile..."
            />
          </div>

          {/* Upload Immagini */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Immagini Annuncio
              {formData.images.length > 0 && (
                <span style={{ 
                  fontSize: '0.85rem', 
                  color: '#28a745', 
                  fontWeight: 'normal',
                  marginLeft: '10px'
                }}>
                  ({formData.images.length} immagini caricate)
                </span>
              )}
            </label>
            
            {/* Info helper per gestione immagini esistenti */}
            {formData.images.length > 0 && (
              <div style={{ 
                background: '#f8f9fa', 
                border: '1px solid #dee2e6', 
                borderRadius: '5px', 
                padding: '10px', 
                marginBottom: '15px',
                fontSize: '0.85rem',
                color: '#6c757d'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                  <span>ℹ️</span>
                  <strong>Gestione Immagini:</strong>
                </div>
                <ul style={{ margin: '0', paddingLeft: '20px' }}>
                  <li>🔄 <strong>Riordina:</strong> Trascina le immagini per cambiare la sequenza</li>
                  <li>🗑️ <strong>Elimina:</strong> Clicca la X rossa su ogni immagine</li>
                  <li>➕ <strong>Aggiungi:</strong> Usa il pulsante qui sotto per aggiungere nuove foto</li>
                  <li>🏠 <strong>Prima immagine:</strong> Sarà quella principale dell'annuncio</li>
                </ul>
              </div>
            )}
            
            <ImageUploader
              images={formData.images}
              onImagesChange={handleImagesChange}
            />
          </div>

          {/* Pulsanti azione */}
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            justifyContent: 'center',
            marginTop: '20px' 
          }}>
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              style={{
                background: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '25px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '1rem',
                opacity: isSubmitting ? 0.7 : 1,
                transition: 'all 0.3s'
              }}
            >
              ❌ Annulla
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                background: isSubmitting ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '25px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '1rem',
                opacity: isSubmitting ? 0.7 : 1,
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="20px" color="white" text="" />
                  Aggiornamento...
                </>
              ) : (
                '💾 Salva Modifiche'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminEditListing;