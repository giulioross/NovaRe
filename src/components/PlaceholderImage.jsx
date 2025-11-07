import React from 'react';

/**
 * Componente per gestire immagini placeholder senza dipendenze esterne
 * @param {string} width - Larghezza dell'immagine (es. "400px")
 * @param {string} height - Altezza dell'immagine (es. "250px") 
 * @param {string} text - Testo da mostrare nell'immagine
 * @param {string} backgroundColor - Colore di sfondo (opzionale)
 * @param {string} textColor - Colore del testo (opzionale)
 */
const PlaceholderImage = ({ 
  width = "400px", 
  height = "250px", 
  text = "Immagine non disponibile",
  backgroundColor = "#f8f9fa",
  textColor = "#6c757d"
}) => {
  return (
    <div 
      style={{
        width: width,
        height: height,
        backgroundColor: backgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px dashed #dee2e6',
        borderRadius: '10px',
        color: textColor,
        fontSize: '14px',
        fontWeight: '500',
        textAlign: 'center',
        padding: '20px',
        boxSizing: 'border-box'
      }}
    >
      <div>
        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🏠</div>
        <div>{text}</div>
      </div>
    </div>
  );
};

/**
 * Hook per gestire immagini con fallback locale
 */
export const useImageWithFallback = (imageUrl, fallbackText = "Immagine non disponibile") => {
  const [imageSrc, setImageSrc] = React.useState(imageUrl);
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  React.useEffect(() => {
    setImageSrc(imageUrl);
    setImageError(false);
  }, [imageUrl]);

  return {
    imageSrc: imageError ? null : imageSrc,
    imageError,
    handleImageError,
    handleImageLoad,
    PlaceholderComponent: imageError ? 
      <PlaceholderImage text={fallbackText} width="100%" height="200px" /> : 
      null
  };
};

export default PlaceholderImage;