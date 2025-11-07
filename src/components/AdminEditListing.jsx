import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import listingService from '../services/listingService';
import ImageUploader from './ImageUploader.jsx';
import { mapListingToBackend } from '../utils/listingMapper.js';

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
        bedrooms: listing.bedrooms?.toString() || '',
        bathrooms: listing.bathrooms?.toString() || '',
        price: listing.price?.toString() || '',
        type: listing.type || 'VENDITA',
        published: listing.published ?? true,
        size: listing.size?.toString() || '',
        images: listing.images || (listing.imageUrl ? [{ base64: listing.imageUrl, name: 'Immagine esistente', position: 1 }] : [])
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
      console.log('🔐 DEBUG EDIT - Credenziali ricevute:');
      console.log('  Username:', username);
      console.log('  Password:', password);
      console.log('📝 DEBUG EDIT - Dati da aggiornare:', formData);
      
      // Prepara i dati per l'invio usando il mapper
      const listingData = mapListingToBackend(formData);

      // Chiama il servizio per aggiornare l'immobile
      const updatedListing = await listingService.updateListing(
        listing.id,
        listingData, 
        username, 
        password
      );

      // Successo
      setMessage({
        type: 'success',
        text: '✅ Immobile aggiornato con successo!'
      });

      // Chiama il callback di successo
      if (onSuccess) {
        onSuccess(updatedListing);
      }

      // Dopo 2 secondi, chiudi il form
      setTimeout(() => {
        onCancel();
      }, 2000);

    } catch (error) {
      console.error('Errore nell\'aggiornamento dell\'immobile:', error);
      
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
            </label>
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