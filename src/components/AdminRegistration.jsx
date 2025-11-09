import React, { useState } from 'react';
import { COMPANY_CODE, saveCredentials } from '../utils/authUtils.js';
import authService from '../services/authService.js';

const AdminRegistration = ({ onRegistrationSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    companyCode: ''
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
    
    // Rimuovi errore di validazione per questo campo
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });
    setValidationErrors({});

    try {
      console.log('🔐 Tentativo registrazione admin:', {
        username: formData.username,
        companyCode: formData.companyCode
      });

      const result = await authService.registerAdmin({
        username: formData.username,
        password: formData.password,
        companyCode: formData.companyCode
      });

      console.log('✅ Registrazione completata:', result);
      
      // Salva le credenziali nel localStorage
      saveCredentials(formData.username, formData.password);

      setMessage({
        type: 'success',
        text: '✅ Registrazione completata con successo! Ora puoi accedere come admin.'
      });

      // Chiama callback di successo dopo 2 secondi
      setTimeout(() => {
        if (onRegistrationSuccess) {
          onRegistrationSuccess({
            username: formData.username,
            password: formData.password
          });
        }
      }, 2000);

    } catch (error) {
      console.error('❌ Errore registrazione:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);

      if (error.response?.status === 400) {
        const errorData = error.response.data;
        
        if (typeof errorData === 'object' && errorData.errors) {
          setValidationErrors(errorData.errors);
          setMessage({
            type: 'error',
            text: '❌ Errori di validazione. Controlla i campi evidenziati.'
          });
        } else {
          setMessage({
            type: 'error',
            text: `❌ ${errorData.message || 'Dati non validi per la registrazione'}`
          });
        }
      } else if (error.response?.status === 409) {
        setMessage({
          type: 'error',
          text: '❌ Username già esistente. Scegli un username diverso.'
        });
      } else {
        setMessage({
          type: 'error',
          text: `❌ Errore durante la registrazione: ${error.response?.data?.message || error.message}`
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      maxWidth: '500px',
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
          👤
        </div>
        <h2 style={{ 
          color: '#333',
          fontWeight: '600',
          fontSize: '28px',
          margin: '0 0 10px 0'
        }}>
          Registrazione Admin
        </h2>
        <p style={{ 
          color: '#666',
          fontSize: '16px',
          margin: 0
        }}>
          Crea un account amministratore per NovaRE
        </p>
      </div>

      {/* Messaggio di stato */}
      {message.text && (
        <div style={{
          padding: '15px',
          marginBottom: '20px',
          borderRadius: '8px',
          backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#155724' : '#721c24',
          border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
          fontSize: '14px'
        }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Username */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: '#333',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Username Admin *
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: validationErrors.username ? '2px solid #dc3545' : '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            placeholder="Inserisci username amministratore"
          />
          {validationErrors.username && (
            <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
              {validationErrors.username}
            </div>
          )}
        </div>

        {/* Password */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: '#333',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Password *
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: validationErrors.password ? '2px solid #dc3545' : '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            placeholder="Inserisci password sicura"
          />
          {validationErrors.password && (
            <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
              {validationErrors.password}
            </div>
          )}
        </div>

        {/* Company Code */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: '#333',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Codice Azienda *
          </label>
          <input
            type="text"
            name="companyCode"
            value={formData.companyCode}
            onChange={handleInputChange}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: validationErrors.companyCode ? '2px solid #dc3545' : '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            placeholder={`Inserisci il codice azienda (es. ${COMPANY_CODE})`}
          />
          {validationErrors.companyCode && (
            <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
              {validationErrors.companyCode}
            </div>
          )}
          <div style={{ 
            fontSize: '12px', 
            color: '#666', 
            marginTop: '5px' 
          }}>
            Il codice azienda è necessario per creare account amministratore
          </div>
        </div>

        {/* Pulsanti */}
        <div style={{ 
          display: 'flex', 
          gap: '15px',
          justifyContent: 'center'
        }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            style={{
              padding: '12px 25px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.6 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            Annulla
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '12px 25px',
              backgroundColor: isSubmitting ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.6 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            {isSubmitting ? '⏳ Registrazione...' : '✅ Registra Admin'}
          </button>
        </div>
      </form>

      {/* Info note */}
      <div style={{
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        fontSize: '13px',
        color: '#666'
      }}>
        <strong>📋 Nota:</strong> Una volta registrato, l'account admin sarà abilitato automaticamente 
        e potrai accedere immediatamente alle funzioni di amministrazione.
      </div>
    </div>
  );
};

export default AdminRegistration;