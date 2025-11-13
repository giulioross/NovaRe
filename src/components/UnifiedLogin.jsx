import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthPersistent } from '../hooks/useAuthPersistent';

/**
 * Componente di login semplificato che usa il nuovo sistema di autenticazione unificato
 */
const UnifiedLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    companyCode: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuthPersistent();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Rimuovi errore quando l'utente inizia a digitare
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.username, formData.password, formData.companyCode);
      
      if (result.success) {
        console.log('✅ Login riuscito, reindirizzamento...');
        navigate('/dashboard');
      } else {
        setError(result.error || 'Credenziali non valide');
      }
    } catch (err) {
      console.error('❌ Errore login:', err);
      setError('Errore durante l\'autenticazione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            color: 'var(--color-primary)', 
            marginBottom: '0.5rem',
            fontSize: '1.8rem'
          }}>
            🏢 NovaRe Admin
          </h1>
          <p style={{ color: '#666', margin: 0 }}>
            Accedi al pannello di amministrazione
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fee',
            color: '#c33',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '1rem',
            textAlign: 'center',
            fontSize: '0.9rem'
          }}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#333'
            }}>
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#333'
            }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#333'
            }}>
              Codice Azienda
            </label>
            <input
              type="text"
              name="companyCode"
              value={formData.companyCode}
              onChange={handleChange}
              required
              placeholder="NOVARE2025"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? '#ccc' : 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s ease'
            }}
          >
            {loading ? '🔄 Accesso in corso...' : '🔑 Accedi'}
          </button>
        </form>
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
    </div>
  );
};

export default UnifiedLogin;