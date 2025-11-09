import React, { useState } from 'react';
import { listingService } from '../services/listingService.js';
import ImageUploader from './ImageUploader.jsx';
import { convertImagesToFiles, prepareListing } from '../utils/fileUtils.js';

/**
 * Componente per creare un nuovo immobile (solo per admin)
 * @param {string} username - Username admin
 * @param {string} password - Password admin
 * @param {Function} onSuccess - Callback chiamato quando l'immobile è creato con successo
 */
const AdminCreateListing = ({ username, password, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    bedrooms: '',
    bathrooms: '',
    price: '',
    type: 'VENDITA', // VENDITA o AFFITTO
    size: '',
    images: [] // Array di immagini invece di imageUrl singola
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    return validationErrors[fieldName];
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
      console.log('🔐 DEBUG - Credenziali ricevute:');
      console.log('  Username:', username);
      console.log('  Password:', password);
      console.log('  Username tipo:', typeof username);
      console.log('  Password tipo:', typeof password);
      
      // Prepara i dati per l'invio multipart
      const listingData = prepareListing(formData);
      const files = convertImagesToFiles(formData.images);
      
      console.log('🔄 DEBUG - Dati listing per backend:', listingData);
      console.log('📸 DEBUG - File convertiti:', files.length, files);

      // Chiama il servizio per creare l'immobile con supporto multipart
      const createdListing = await listingService.createListing(
        listingData,
        files
      );

      // Successo
      setMessage({
        type: 'success',
        text: '✅ Immobile creato con successo!'
      });

      // Reset del form
      setFormData({
        title: '',
        description: '',
        address: '',
        bedrooms: '',
        bathrooms: '',
        price: '',
        type: 'VENDITA',
        size: '',
        images: [],
        city: ''
      });

      // Chiama il callback di successo se fornito
      if (onSuccess) {
        onSuccess(createdListing);
      }

    } catch (error) {
      console.error('Errore nella creazione dell\'immobile:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      console.error('Response headers:', error.response?.headers);
      
      // Gestione errori di validazione (400)
      if (error.response && error.response.status === 400) {
        const backendErrors = error.response.data?.errors || {};
        setValidationErrors(backendErrors);
        setMessage({
          type: 'error',
          text: '❌ Errori di validazione. Controlla i campi evidenziati.'
        });
      } else {
        setValidationErrors({});
        setMessage({
          type: 'error',
          text: `❌ ${error.message || 'Errore nella creazione dell\'immobile'}`
        });
      }
    } finally {
      setIsSubmitting(false);
      
      // Nascondi il messaggio dopo 5 secondi
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
    }
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px',
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ 
          fontSize: '3rem', 
          marginBottom: '15px',
          color: '#007bff'
        }}>
          🏠
        </div>
        <h2 style={{ 
          color: '#333', 
          marginBottom: '10px',
          fontSize: '1.8rem',
          fontWeight: '600'
        }}>
          Crea Nuovo Immobile
        </h2>
        <p style={{ color: '#666', fontSize: '1rem' }}>
          Compila i dettagli dell'immobile da aggiungere al database
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Titolo e Tipo */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr', 
          gap: '20px', 
          marginBottom: '20px' 
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Titolo *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="es. Appartamento in centro storico"
              required
              style={getFieldStyle('title')}
            />
            {getFieldError('title') && (
              <div style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '5px' }}>
                {getFieldError('title')}
              </div>
            )}
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Tipo Contratto *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e1e5e9',
                borderRadius: '10px',
                fontSize: '14px'
              }}
            >
              <option value="VENDITA">Vendita</option>
              <option value="AFFITTO">Affitto</option>
            </select>
          </div>
        </div>

        {/* Indirizzo */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            Indirizzo *
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="es. Via Roma 123, Roma"
            required
            style={getFieldStyle('address')}
          />
          {getFieldError('address') && (
            <div style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '5px' }}>
              {getFieldError('address')}
            </div>
          )}
        </div>

        {/* Città */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            Città
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="es. Milano"
            style={getFieldStyle('city')}
          />
          {getFieldError('city') && (
            <div style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '5px' }}>
              {getFieldError('city')}
            </div>
          )}
        </div>

        {/* Dettagli numerici */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '20px', 
          marginBottom: '20px' 
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Camere
            </label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleInputChange}
              placeholder="es. 3"
              min="0"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e1e5e9',
                borderRadius: '10px',
                fontSize: '14px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Bagni
            </label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleInputChange}
              placeholder="es. 2"
              min="0"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e1e5e9',
                borderRadius: '10px',
                fontSize: '14px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Superficie (mq)
            </label>
            <input
              type="number"
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              placeholder="es. 85"
              min="0"
              step="0.1"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e1e5e9',
                borderRadius: '10px',
                fontSize: '14px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Prezzo (€) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="es. 250000"
              required
              min="0"
              step="0.01"
              style={getFieldStyle('price')}
            />
            {getFieldError('price') && (
              <div style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '5px' }}>
                {getFieldError('price')}
              </div>
            )}
          </div>
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

        {/* Descrizione */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            Descrizione
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Descrizione dettagliata dell'immobile..."
            rows="4"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e1e5e9',
              borderRadius: '10px',
              fontSize: '14px',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Bottone di invio */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '16px',
            background: isSubmitting 
              ? '#ccc' 
              : 'linear-gradient(45deg, #007bff, #0056b3)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
        >
          {isSubmitting ? (
            <>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid transparent',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Creazione in corso...
            </>
          ) : (
            <>
              🏠 Crea Immobile
            </>
          )}
        </button>

        {/* Messaggio di risposta */}
        {message.text && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            borderRadius: '10px',
            textAlign: 'center',
            background: message.type === 'success' 
              ? 'rgba(40, 167, 69, 0.1)' 
              : 'rgba(220, 53, 69, 0.1)',
            color: message.type === 'success' ? '#28a745' : '#dc3545',
            border: `1px solid ${message.type === 'success' ? '#28a745' : '#dc3545'}`
          }}>
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
};

export default AdminCreateListing;