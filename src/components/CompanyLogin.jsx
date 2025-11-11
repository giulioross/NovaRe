import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook per gestire l'autenticazione con codice azienda
 */
export const useCompanyAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Controlla se l'utente è già autenticato (localStorage)
    const savedAuth = localStorage.getItem('novaRe_auth');
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        if (authData.expires > Date.now()) {
          setUser(authData.user);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('novaRe_auth');
        }
      } catch (error) {
        localStorage.removeItem('novaRe_auth');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password, companyCode) => {
    try {
      // Simula chiamata API per autenticazione
      // In produzione, questo andrà al backend per verificare credenziali + codice azienda
      
      console.log('🔐 Tentativo login:', { username, companyCode });
      
      // Controlla prima l'admin predefinito
      if (username === 'admin' && password === 'ddd' && (companyCode === 'NOVARE2025' || companyCode === 'NUOVARE-SECRET-2025')) {
        const userData = {
          username,
          companyCode,
          permissions: {
            create: true,
            edit: true,
            delete: true,
            publish: true,
            viewAll: true
          },
          company: 'NovaRe Immobiliare',
          role: 'admin'
        };

        const authData = {
          user: userData,
          expires: Date.now() + (24 * 60 * 60 * 1000) // 24 ore
        };

        localStorage.setItem('novaRe_auth', JSON.stringify(authData));
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true, user: userData };
      }

      // Controlla gli utenti registrati
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const foundUser = registeredUsers.find(user => 
        user.username === username && 
        user.companyCode === companyCode.toUpperCase()
      );

      if (foundUser) {
        // In produzione, qui dovresti verificare la password con hash
        // Per ora simuliamo che la password sia corretta (sostituire con vera verifica)
        const userData = {
          username: foundUser.username,
          companyCode: foundUser.companyCode,
          fullName: foundUser.fullName,
          email: foundUser.email,
          phone: foundUser.phone,
          permissions: {
            create: true,
            edit: true,
            delete: false, // Gli agenti non possono eliminare
            publish: true,
            viewAll: false // Gli agenti vedono solo i propri annunci
          },
          company: foundUser.companyCode,
          role: foundUser.role || 'agent'
        };

        const authData = {
          user: userData,
          expires: Date.now() + (24 * 60 * 60 * 1000) // 24 ore
        };

        localStorage.setItem('novaRe_auth', JSON.stringify(authData));
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true, user: userData };
      } else {
        return { 
          success: false, 
          error: 'Credenziali o codice azienda non validi' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Errore durante l\'autenticazione' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('novaRe_auth');
    setUser(null);
    setIsAuthenticated(false);
  };

  const hasPermission = (permission) => {
    return user?.permissions?.[permission] || false;
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    hasPermission
  };
};

/**
 * Componente di login con codice azienda
 */
const CompanyLogin = ({ onLogin = null, error, onShowRegister }) => {
  const { login } = useCompanyAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    companyCode: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const result = await login(formData.username, formData.password, formData.companyCode);
      if (result && result.success) {
        console.log('✅ Login riuscito:', result.user);
        
        // Naviga al pannello amministrativo
        navigate('/dashboard');
        
        // Opzionalmente, chiama onLogin se è stata passata come prop
        if (onLogin && typeof onLogin === 'function') {
          onLogin(result.user);
        }
      }
    } catch (error) {
      console.error('❌ Errore durante il login:', error);
    }
    
    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ 
            color: 'var(--color-primary)', 
            margin: '0 0 10px 0',
            fontSize: '2rem',
            fontWeight: '700'
          }}>
            🏢 NovaRe
          </h1>
          <p style={{ 
            color: '#6c757d', 
            margin: 0,
            fontSize: '1rem'
          }}>
            Admin Professionale
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
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
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
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
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
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
              placeholder="Codice Azienda"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
            />
          </div>

          {error && (
            <div style={{
              background: '#f8d7da',
              border: '1px solid #f5c6cb',
              color: '#721c24',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              background: isSubmitting ? '#6c757d' : 'linear-gradient(45deg, var(--color-primary), var(--color-secondary))',
              color: 'white',
              border: 'none',
              padding: '15px',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              marginBottom: '15px'
            }}
          >
            {isSubmitting ? 'Accesso...' : '🔐 Accedi'}
          </button>

          {/* Pulsante registrazione */}
          <button
            type="button"
            onClick={onShowRegister}
            style={{
              width: '100%',
              background: 'transparent',
              color: 'var(--color-primary)',
              border: '2px solid var(--color-primary)',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'var(--color-primary)';
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = 'var(--color-primary)';
            }}
          >
            👤 Non hai un account? Registrati
          </button>
        </form>

        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: '#fff3cd',
          borderRadius: '8px',
          fontSize: '0.85rem',
          color: '#856404',
          textAlign: 'center'
        }}>
          <strong>🏢 Accesso Riservato</strong><br/>
          Solo agenti autorizzati con codice agenzia valido
        </div>
      </div>
    </div>
  );
};

export default CompanyLogin;