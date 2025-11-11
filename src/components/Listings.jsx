import React from 'react';

const Listings = () => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '40px 20px',
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '20px',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🏠</div>
      <h3 style={{ color: '#007bff', marginBottom: '15px' }}>
        Immobili in aggiornamento
      </h3>
      <p style={{ color: '#666' }}>
        Stiamo aggiornando la nostra selezione di immobili. Torna presto per nuove opportunità!
      </p>
    </div>
  );
};

export default Listings;
