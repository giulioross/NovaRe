import React from 'react';

const LoadingSpinner = ({ size = '40px', color = '#007bff', text = 'Caricamento...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div 
        className="spinner"
        style={{
          width: size,
          height: size,
          border: `3px solid rgba(0, 123, 255, 0.1)`,
          borderTop: `3px solid ${color}`,
          borderRadius: '50%',
          marginBottom: '10px'
        }}
      />
      {text && (
        <p style={{ 
          color: color, 
          fontSize: '0.9rem', 
          margin: 0,
          fontWeight: '500'
        }}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;