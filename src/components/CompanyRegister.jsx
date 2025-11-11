import React, { useState } from 'react';

/**
 * Componente per la registrazione di nuovi utenti aziendali
 * Richiede codice agenzia valido per l'accesso
 */
const CompanyRegister = ({ onRegisterSuccess, onBackToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    companyCode: '',
    fullName: '',
    email: '',
    phone: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Codici agenzia validi (in produzione verranno dal backend)
  const VALID_COMPANY_CODES = [
    'NOVARE2025',
    'AGENCY001',
    'REALESTATE2025',
    'IMMOBILIARE2025'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Rimuovi errore quando l'utente inizia a digitare
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username richiesto';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username deve essere almeno 3 caratteri';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password richiesta';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password deve essere almeno 6 caratteri';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Le password non coincidono';
    }

    // Company code validation
    if (!formData.companyCode.trim()) {
      newErrors.companyCode = 'Codice agenzia richiesto';
    } else if (!VALID_COMPANY_CODES.includes(formData.companyCode.trim().toUpperCase())) {
      newErrors.companyCode = 'Codice agenzia non valido';
    }

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nome completo richiesto';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email richiesta';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email non valida';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Simula chiamata API per registrazione (in produzione sarà una vera chiamata)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simula registrazione riuscita
      const userData = {
        username: formData.username,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        companyCode: formData.companyCode.toUpperCase(),
        role: 'agent', // Ruolo base per nuovi utenti
        registeredAt: new Date().toISOString()
      };

      // Salva i dati utente nel localStorage (in produzione sarà nel database)
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      existingUsers.push(userData);
      localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

      console.log('✅ Registrazione completata:', userData);
      
      // Chiama callback di successo
      if (onRegisterSuccess) {
        onRegisterSuccess(userData);
      }

    } catch (error) {
      console.error('❌ Errore registrazione:', error);
      setErrors({ submit: 'Errore durante la registrazione. Riprova.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      maxWidth: '500px',
      margin: '0 auto',
      padding: '30px',
      background: 'white',
      borderRadius: '15px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ 
          color: '#2c3e50',
          marginBottom: '10px',
          fontSize: '1.8rem'
        }}>
          🏢 Registrazione Agenzia
        </h2>
        <p style={{ color: '#6c757d', margin: 0 }}>
          Crea il tuo account professionale
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Nome completo */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600',
            color: '#333'
          }}>
            Nome Completo *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="es. Mario Rossi"
            style={{
              width: '100%',
              padding: '12px',
              border: errors.fullName ? '2px solid #dc3545' : '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
          {errors.fullName && (
            <div style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '5px' }}>
              {errors.fullName}
            </div>
          )}
        </div>

        {/* Email */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600',
            color: '#333'
          }}>
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="mario.rossi@agenzia.it"
            style={{
              width: '100%',
              padding: '12px',
              border: errors.email ? '2px solid #dc3545' : '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
          {errors.email && (
            <div style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '5px' }}>
              {errors.email}
            </div>
          )}
        </div>

        {/* Telefono */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600',
            color: '#333'
          }}>
            Telefono
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+39 333 123 4567"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
        </div>

        {/* Username */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600',
            color: '#333'
          }}>
            Username *
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="username"
            style={{
              width: '100%',
              padding: '12px',
              border: errors.username ? '2px solid #dc3545' : '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
          {errors.username && (
            <div style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '5px' }}>
              {errors.username}
            </div>
          )}
        </div>

        {/* Password */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600',
            color: '#333'
          }}>
            Password *
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password (min 6 caratteri)"
            style={{
              width: '100%',
              padding: '12px',
              border: errors.password ? '2px solid #dc3545' : '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
          {errors.password && (
            <div style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '5px' }}>
              {errors.password}
            </div>
          )}
        </div>

        {/* Conferma Password */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600',
            color: '#333'
          }}>
            Conferma Password *
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Ripeti la password"
            style={{
              width: '100%',
              padding: '12px',
              border: errors.confirmPassword ? '2px solid #dc3545' : '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
          {errors.confirmPassword && (
            <div style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '5px' }}>
              {errors.confirmPassword}
            </div>
          )}
        </div>

        {/* Codice Agenzia */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600',
            color: '#333'
          }}>
            Codice Agenzia *
          </label>
          <input
            type="text"
            name="companyCode"
            value={formData.companyCode}
            onChange={handleInputChange}
            placeholder="Inserisci il codice fornito dall'agenzia"
            style={{
              width: '100%',
              padding: '12px',
              border: errors.companyCode ? '2px solid #dc3545' : '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem',
              textTransform: 'uppercase'
            }}
          />
          {errors.companyCode && (
            <div style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '5px' }}>
              {errors.companyCode}
            </div>
          )}
          <small style={{ color: '#6c757d', fontSize: '0.85rem' }}>
            Solo chi possiede un codice agenzia valido può registrarsi
          </small>
        </div>

        {/* Errore generale */}
        {errors.submit && (
          <div style={{
            background: '#f8d7da',
            color: '#721c24',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '0.9rem'
          }}>
            {errors.submit}
          </div>
        )}

        {/* Pulsanti */}
        <div style={{ display: 'flex', gap: '15px' }}>
          <button
            type="button"
            onClick={onBackToLogin}
            style={{
              flex: '1',
              padding: '12px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            ← Torna al Login
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              flex: '2',
              padding: '12px',
              background: isSubmitting ? '#ccc' : 'linear-gradient(45deg, var(--color-primary), var(--color-secondary))',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontWeight: '600'
            }}
          >
            {isSubmitting ? '⏳ Registrazione...' : '✅ Registrati'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyRegister;