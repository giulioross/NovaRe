import React, { useState } from 'react';
import CompanyLogin from './CompanyLogin';
import CompanyRegister from './CompanyRegister';

/**
 * Componente che gestisce sia login che registrazione
 * con transizione tra le due modalità
 */
const AuthManager = ({ onLogin, loginError }) => {
  const [currentView, setCurrentView] = useState('login'); // 'login' | 'register'
  const [successMessage, setSuccessMessage] = useState('');

  const handleShowRegister = () => {
    setCurrentView('register');
    setSuccessMessage('');
  };

  const handleBackToLogin = () => {
    setCurrentView('login');
    setSuccessMessage('');
  };

  const handleRegisterSuccess = (userData) => {
    console.log('✅ Registrazione completata:', userData);
    setSuccessMessage(`Registrazione completata! Benvenuto ${userData.fullName}.`);
    setCurrentView('login');
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
      {currentView === 'login' ? (
        <div>
          {/* Messaggio di successo registrazione */}
          {successMessage && (
            <div style={{
              background: '#d4edda',
              color: '#155724',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              ✅ {successMessage}
            </div>
          )}
          
          <CompanyLogin 
            onLogin={onLogin}
            error={loginError}
            onShowRegister={handleShowRegister}
          />
        </div>
      ) : (
        <CompanyRegister
          onRegisterSuccess={handleRegisterSuccess}
          onBackToLogin={handleBackToLogin}
        />
      )}
    </div>
  );
};

export default AuthManager;