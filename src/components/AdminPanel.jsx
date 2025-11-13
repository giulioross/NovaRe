import React, { useState } from 'react';
import AdminLogin from './AdminLogin.jsx';
import AdminCreateListing from './AdminCreateListing.jsx';
import AdminEditListing from './AdminEditListing.jsx';
import AdminRegistration from './AdminRegistration.jsx';
import Listings from './Listings.jsx';
import listingService from '../services/listingService.js';

/**
 * Pannello di amministrazione completo
 */
const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [activeTab, setActiveTab] = useState('view'); // 'view', 'create', 'edit'
  const [refreshListings, setRefreshListings] = useState(0);
  const [editingListing, setEditingListing] = useState(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [searchText, setSearchText] = useState(''); // Stato per la ricerca

  const handleLogin = async (username, password) => {
    try {
      console.log('🔐 DEBUG LOGIN - Credenziali inserite:');
      console.log('  Username:', username);
      console.log('  Password:', password);
      // Ricevo anche companyCode dal form
      const companyCode = arguments[2];
      console.log('  Codice Azienda:', companyCode);
      // Verifica che il codice azienda sia corretto
      if (username && password && companyCode === 'NUOVARE-SECRET-2025') {
        const newCredentials = { username, password, companyCode };
        console.log('🔐 DEBUG LOGIN - Salvando credenziali:', newCredentials);
        setCredentials(newCredentials);
        setIsAuthenticated(true);
      } else {
        throw new Error('Credenziali o codice azienda non validi');
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

  const handleEditListing = (listing) => {
    console.log('Modifica immobile:', listing);
    setEditingListing(listing);
    setActiveTab('edit');
  };

  const handleListingUpdated = (updatedListing) => {
    console.log('🔄 DEBUG - Immobile aggiornato ricevuto:', updatedListing);
    console.log('🖼️ DEBUG - Immagini nel listing aggiornato:', {
      imageUrl: updatedListing?.imageUrl,
      photoUrls: updatedListing?.photoUrls,
      photos: updatedListing?.photos,
      images: updatedListing?.images
    });
    
    // Aggiorna la lista degli immobili
    console.log('🔄 DEBUG - Triggering refresh lista...');
    setRefreshListings(prev => {
      const newValue = prev + 1;
      console.log('🔄 DEBUG - RefreshListings:', prev, '->', newValue);
      return newValue;
    });
    
    // Reset editing state
    setEditingListing(null);
    // Torna alla vista lista con un piccolo delay per far vedere il messaggio di successo
    setTimeout(() => {
      setActiveTab('view');
    }, 1500);
  };

  const handleDeleteListing = async (listing) => {
    try {
      console.log('Eliminazione immobile:', listing);
      await listingService.deleteListing(listing.id, credentials.username, credentials.password);
      console.log('✅ Immobile eliminato con successo');
      // Aggiorna la lista degli immobili
      setRefreshListings(prev => prev + 1);
      alert('✅ Immobile eliminato con successo!');
    } catch (error) {
      console.error('❌ Errore nell\'eliminazione:', error);
      alert(`❌ Errore nell'eliminazione: ${error.message}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingListing(null);
    setActiveTab('view');
  };

  // Se non autenticato, mostra login o registrazione
  if (!isAuthenticated) {
    if (showRegistration) {
      return (
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <AdminRegistration 
            onRegistrationSuccess={(credentials) => {
              console.log('✅ Admin registrato:', credentials.username);
              setShowRegistration(false);
              // Auto-login dopo registrazione
              handleLogin(credentials.username, credentials.password);
            }}
            onCancel={() => setShowRegistration(false)}
          />
        </div>
      );
    }

    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div>
          <AdminLogin onLogin={handleLogin} />
          
          {/* Link per passare alla registrazione */}
          <div style={{
            textAlign: 'center',
            marginTop: '20px'
          }}>
            <button
              onClick={() => setShowRegistration(true)}
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '10px 20px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.1)';
              }}
            >
              👤 Non hai un account? Registrati qui
            </button>
          </div>
        </div>
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
          
          {editingListing && (
            <button
              onClick={() => setActiveTab('edit')}
              style={{
                background: activeTab === 'edit' ? '#ffc107' : 'transparent',
                color: activeTab === 'edit' ? '#000' : '#ffc107',
                border: '2px solid #ffc107',
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
              ✏️ Modifica: {editingListing.title?.slice(0, 20)}...
            </button>
          )}
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
            {/* Barra di ricerca */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600', 
                color: '#333',
                fontSize: '1.1rem'
              }}>
                🔍 Cerca tra i tuoi annunci
              </label>
              <input
                type="text"
                placeholder="Cerca per nome o indirizzo..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{
                  width: '100%',
                  maxWidth: '500px',
                  padding: '12px 15px 12px 40px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' fill=\'%23666\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z\'/%3E%3C/svg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: '12px center',
                  backgroundSize: '16px'
                }}
              />
            </div>

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
            <Listings 
              key={refreshListings}
              adminMode={true}
              adminUsername={credentials.username}
              adminPassword={credentials.password}
              onEdit={handleEditListing}
              onDelete={handleDeleteListing}
              searchFilter={searchText}
              onViewDetail={(listing) => {
                setEditingListing(listing);
                setActiveTab('edit');
              }}
            />
          </div>
        )}

        {activeTab === 'create' && (
          <AdminCreateListing
            username={credentials.username}
            password={credentials.password}
            onSuccess={handleListingCreated}
          />
        )}

        {activeTab === 'edit' && editingListing && (
          <AdminEditListing
            listing={editingListing}
            username={credentials.username}
            password={credentials.password}
            onSuccess={handleListingUpdated}
            onCancel={handleCancelEdit}
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