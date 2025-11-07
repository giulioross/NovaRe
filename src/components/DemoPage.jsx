import React, { useState } from 'react';
import AdminPanel from './AdminPanel.jsx';
import Listings from './Listings.jsx';

/**
 * Pagina demo per testare le funzionalità admin e public
 */
const DemoPage = () => {
  const [currentView, setCurrentView] = useState('public'); // 'public' o 'admin'

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Barra di navigazione demo */}
      <div style={{
        background: 'linear-gradient(45deg, #007bff, #0056b3)',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          color: 'white', 
          margin: '0 0 20px 0',
          fontSize: '2rem',
          fontWeight: '700'
        }}>
          🏠 Nova RE - Demo API Integration
        </h1>
        
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.3)',
              padding: '12px 24px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.9)';
              e.target.style.color = '#007bff';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.2)';
              e.target.style.color = 'white';
            }}
          >
            🏠 Torna alla Home
          </button>
          <button
            onClick={() => setCurrentView('public')}
            style={{
              background: currentView === 'public' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)',
              color: currentView === 'public' ? '#007bff' : 'white',
              border: '2px solid rgba(255,255,255,0.3)',
              padding: '12px 24px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s'
            }}
          >
            👥 Vista Pubblica
          </button>
          
          <button
            onClick={() => setCurrentView('admin')}
            style={{
              background: currentView === 'admin' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)',
              color: currentView === 'admin' ? '#007bff' : 'white',
              border: '2px solid rgba(255,255,255,0.3)',
              padding: '12px 24px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s'
            }}
          >
            🛠️ Pannello Admin
          </button>
        </div>

        <p style={{ 
          color: 'rgba(255,255,255,0.8)', 
          margin: '15px 0 0 0',
          fontSize: '0.9rem'
        }}>
          Testa le API pubbliche e le funzionalità amministrative
        </p>
      </div>

      {/* Contenuto dinamico */}
      {currentView === 'public' && (
        <div style={{ 
          padding: '40px 20px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{ 
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <Listings />
          </div>
        </div>
      )}

      {currentView === 'admin' && (
        <AdminPanel />
      )}

      {/* Info tecnica */}
      <div style={{
        background: '#f8f9fa',
        padding: '30px',
        textAlign: 'center',
        borderTop: '1px solid #e1e5e9'
      }}>
        <h3 style={{ color: '#333', marginBottom: '15px' }}>
          🔧 Informazioni Tecniche
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '15px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
          }}>
            <h4 style={{ color: '#007bff', marginBottom: '10px' }}>
              📡 API Pubbliche
            </h4>
            <ul style={{ textAlign: 'left', color: '#666', fontSize: '0.9rem' }}>
              <li>GET /api/public/listings</li>
              <li>GET /api/public/listings/{`{id}`}</li>
            </ul>
          </div>
          
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '15px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
          }}>
            <h4 style={{ color: '#28a745', marginBottom: '10px' }}>
              🔐 API Admin (Basic Auth)
            </h4>
            <ul style={{ textAlign: 'left', color: '#666', fontSize: '0.9rem' }}>
              <li>GET /api/admin/listings</li>
              <li>POST /api/admin/listings</li>
              <li>PUT /api/admin/listings/{`{id}`}</li>
              <li>DELETE /api/admin/listings/{`{id}`}</li>
            </ul>
          </div>
        </div>
        
        <div style={{ marginTop: '20px', color: '#666' }}>
          <p>Backend atteso su: <code>http://localhost:8081</code></p>
          <p>Frontend in esecuzione su: <code>http://localhost:5174</code></p>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;