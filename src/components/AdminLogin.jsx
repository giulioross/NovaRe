import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Componente per il login amministratore
 * @param {Function} onLogin - Callback che riceve (username, password)
 */
const AdminLogin = ({ onLogin }) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    companyCode: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password || !credentials.companyCode) {
      alert('Per favore inserisci username, password e codice azienda');
      return;
    }

    setIsLoading(true);
    
    try {
      // Chiama il callback fornito dal componente padre
      await onLogin(credentials.username, credentials.password);
    } catch (error) {
      console.error('Errore nel login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
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
          🔐
        </div>
        <h2 style={{ 
          color: '#333', 
          marginBottom: '10px',
          fontSize: '1.5rem',
          fontWeight: '600'
        }}>
          🏢 NovaRe Admin
        </h2>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          Accedi al pannello di amministrazione
        </p>
        {/* Bottone Torna alla Home */}
        <button
          type="button"
          onClick={() => navigate('/')}
          style={{
            background: 'transparent',
            border: '1px solid #007bff',
            color: '#007bff',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            marginBottom: '20px',
            width: '100%'
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
          ← Torna alla Home
        </button>
        {/* Banner registrazione */}
        <div style={{ marginTop: '18px', textAlign: 'center' }}>
          <span style={{ color: '#333', fontSize: '0.95rem' }}>Non hai un account?</span>
          <button
            type="button"
            style={{
              marginLeft: '10px',
              background: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              padding: '7px 18px',
              fontWeight: '600',
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
            onClick={() => navigate('/admin/register')}
          >
            Registrati
          </button>
        </div>
      </div>

      {/* Form di login */}
      <form onSubmit={handleSubmit}>
        {/* Username */}
        <div style={{ marginBottom: '20px' }}>
          <label 
            htmlFor="username"
            style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333'
            }}
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={credentials.username}
            onChange={handleInputChange}
            placeholder="Inserisci il tuo username"
            required
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e1e5e9',
              borderRadius: '10px',
              fontSize: '14px',
              transition: 'border-color 0.3s',
              outline: 'none',
              backgroundColor: isLoading ? '#f8f9fa' : 'white'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#007bff';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e1e5e9';
            }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: '20px' }}>
          <label 
            htmlFor="password"
            style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333'
            }}
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleInputChange}
            placeholder="Inserisci la tua password"
            required
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e1e5e9',
              borderRadius: '10px',
              fontSize: '14px',
              transition: 'border-color 0.3s',
              outline: 'none',
              backgroundColor: isLoading ? '#f8f9fa' : 'white'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#007bff';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e1e5e9';
            }}
          />
        </div>

        {/* Codice Azienda */}
        <div style={{ marginBottom: '30px' }}>
          <label 
            htmlFor="companyCode"
            style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333'
            }}
          >
            Codice Azienda
          </label>
          <input
            type="text"
            id="companyCode"
            name="companyCode"
            value={credentials.companyCode}
            onChange={handleInputChange}
            placeholder="Inserisci il codice azienda"
            required
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e1e5e9',
              borderRadius: '10px',
              fontSize: '14px',
              transition: 'border-color 0.3s',
              outline: 'none',
              backgroundColor: isLoading ? '#f8f9fa' : 'white'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#007bff';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e1e5e9';
            }}
          />
        </div>

        {/* Bottone di login */}
        <button
          type="submit"
          disabled={isLoading || !credentials.username || !credentials.password}
          style={{
            width: '100%',
            padding: '14px',
            background: isLoading || !credentials.username || !credentials.password 
              ? '#ccc' 
              : 'linear-gradient(45deg, #007bff, #0056b3)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: isLoading || !credentials.username || !credentials.password 
              ? 'not-allowed' 
              : 'pointer',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
          onMouseEnter={(e) => {
            if (!isLoading && credentials.username && credentials.password) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 5px 15px rgba(0, 123, 255, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          {isLoading ? (
            <>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid transparent',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Accesso in corso...
            </>
          ) : (
            <>
              🚀 Accedi
            </>
          )}
        </button>
      </form>

      {/* Note di sicurezza */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#f8f9fa',
        borderRadius: '10px',
        fontSize: '0.8rem',
        color: '#666',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '5px' }}>🔒 Connessione sicura</div>
        <div>Le tue credenziali sono protette con Basic Authentication</div>
      </div>
    </div>
  );
};

export default AdminLogin;