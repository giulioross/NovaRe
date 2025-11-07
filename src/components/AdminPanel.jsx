import React, { useState } from 'react';
import AdminLogin from './AdminLogin.jsx';
import AdminCreateListing from './AdminCreateListing.jsx';
import Listings from './Listings.jsx';

/**
 * Pannello di amministrazione completo
 */
const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [activeTab, setActiveTab] = useState('view'); // 'view' o 'create'
  const [refreshListings, setRefreshListings] = useState(0);

  const handleLogin = async (username, password) => {
    try {
      // Qui potresti fare una chiamata di test per verificare le credenziali
      // Per ora assumiamo che il login sia sempre valido se username e password sono forniti
      if (username && password) {
        setCredentials({ username, password });
        setIsAuthenticated(true);
      } else {
        throw new Error('Credenziali non valide');
      }
    } catch (error) {
      alert('Errore nel login: ' + error.message);
      throw error;
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCredentials({ username: '', password: '' });
    setActiveTab('view');
  };

  const handleListingCreated = (newListing) => {
    console.log('Nuovo immobile creato:', newListing);
    // Aggiorna la lista degli immobili
    setRefreshListings(prev => prev + 1);
    // Torna alla tab di visualizzazione
    setActiveTab('view');
  };

  // Se non autenticato, mostra il form di login
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <AdminLogin onLogin={handleLogin} />
      </div>
    );
  }

  // Pannello admin autenticato
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8f9fa',
      padding: '20px'
    }}>
      {/* Header del pannello */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '20px 30px',
        marginBottom: '30px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ 
            color: '#333', 
            fontSize: '1.8rem', 
            marginBottom: '5px',
            fontWeight: '600'
          }}>
            🛠️ Pannello Amministrazione Nova RE
          </h1>
          <p style={{ color: '#666', margin: 0 }}>
            Benvenuto, <strong>{credentials.username}</strong>
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#c82333';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#dc3545';
          }}
        >
          🚪 Logout
        </button>
      </div>

      {/* Navigazione tabs */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '30px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => setActiveTab('view')}
            style={{
              background: activeTab === 'view' ? '#007bff' : 'transparent',
              color: activeTab === 'view' ? 'white' : '#007bff',
              border: '2px solid #007bff',
              padding: '12px 24px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            👁️ Visualizza Immobili
          </button>
          <button
            onClick={() => setActiveTab('create')}
            style={{
              background: activeTab === 'create' ? '#28a745' : 'transparent',
              color: activeTab === 'create' ? 'white' : '#28a745',
              border: '2px solid #28a745',
              padding: '12px 24px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            ➕ Crea Immobile
          </button>
        </div>
      </div>

      {/* Contenuto delle tabs */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
        minHeight: '500px'
      }}>
        {activeTab === 'view' && (
          <div>
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              <button
                onClick={() => setRefreshListings(prev => prev + 1)}
                style={{
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  margin: '0 auto'
                }}
              >
                🔄 Aggiorna Lista
              </button>
            </div>
            <Listings key={refreshListings} />
          </div>
        )}

        {activeTab === 'create' && (
          <AdminCreateListing
            username={credentials.username}
            password={credentials.password}
            onSuccess={handleListingCreated}
          />
        )}
      </div>

      {/* Footer del pannello */}
      <div style={{
        textAlign: 'center',
        marginTop: '30px',
        color: '#666',
        fontSize: '0.9rem'
      }}>
        <p>© 2025 Nova RE - Pannello Amministrazione</p>
      </div>
    </div>
  );
};

export default AdminPanel;