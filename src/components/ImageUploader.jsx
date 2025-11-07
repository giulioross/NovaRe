import React, { useState, useRef } from 'react';

/**
 * Componente per l'upload e gestione delle immagini con riordinamento
 * @param {Array} images - Array di URL immagini esistenti
 * @param {Function} onImagesChange - Callback quando le immagini cambiano
 * @param {number} maxImages - Numero massimo di immagini (default: illimitato)
 */
const ImageUploader = ({ images = [], onImagesChange, maxImages = null }) => {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const fileInputRef = useRef(null);

  // Converte file in base64 per preview e storage
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // Gestisce la selezione di nuovi file
  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    
    if (files.length === 0) return;

    // Nessun limite massimo di immagini

    try {
      const newImages = await Promise.all(
        files.map(async (file) => {
          // Valida il tipo di file
          if (!file.type.startsWith('image/')) {
            throw new Error(`${file.name} non è un'immagine valida`);
          }

          // Valida la dimensione (max 5MB)
          if (file.size > 5 * 1024 * 1024) {
            throw new Error(`${file.name} è troppo grande (max 5MB)`);
          }

          return await fileToBase64(file);
        })
      );

      // Aggiunge le nuove immagini a quelle esistenti
      const updatedImages = [...images, ...newImages];
      onImagesChange(updatedImages);

      // Reset dell'input file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      alert(`Errore nel caricamento: ${error.message}`);
    }
  };

  // Rimuove un'immagine
  const handleRemoveImage = (indexToRemove) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove);
    onImagesChange(updatedImages);
  };

  // Gestisce l'inizio del drag
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Gestisce il drag over
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Gestisce il drop per riordinare
  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    
    // Rimuove l'immagine dalla posizione originale
    newImages.splice(draggedIndex, 1);
    
    // Inserisce l'immagine nella nuova posizione
    newImages.splice(dropIndex, 0, draggedImage);
    
    onImagesChange(newImages);
    setDraggedIndex(null);
  };

  // Sposta un'immagine su/giù con i pulsanti
  const moveImage = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    
    onImagesChange(newImages);
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Pulsante di upload */}
      <div style={{ marginBottom: '20px' }}>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            background: 'linear-gradient(45deg, #28a745, #20c997)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '25px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            margin: '0 auto',
            transition: 'all 0.3s'
          }}
        >
          📷 {images.length === 0 ? 'Aggiungi Immagini' : 'Aggiungi Altre Immagini'}
          <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>
            ({images.length})
          </span>
        </button>
        
        <p style={{ 
          textAlign: 'center', 
          color: '#666', 
          fontSize: '0.85rem', 
          marginTop: '8px',
          margin: 0 
        }}>
          Trascina le immagini per riordinarle • Max 5MB per immagine
        </p>
      </div>

      {/* Griglia delle immagini */}
      {images.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '15px',
          marginTop: '20px'
        }}>
          {images.map((image, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              style={{
                position: 'relative',
                borderRadius: '10px',
                overflow: 'hidden',
                border: draggedIndex === index ? '3px solid #007bff' : '2px solid #e1e5e9',
                cursor: 'grab',
                transition: 'all 0.3s',
                transform: draggedIndex === index ? 'rotate(5deg) scale(1.05)' : 'none',
                opacity: draggedIndex === index ? 0.8 : 1
              }}
              onMouseEnter={(e) => {
                if (draggedIndex === null) {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (draggedIndex === null) {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {/* Immagine */}
              <img
                src={image}
                alt={`Immagine ${index + 1}`}
                style={{
                  width: '100%',
                  height: '120px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              
              {/* Overlay con controlli */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.7)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '8px',
                opacity: 0,
                transition: 'opacity 0.3s'
              }} 
              className="image-overlay"
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = 1;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = 0;
              }}
              >
                {/* Numero posizione e badge principale */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{
                    background: '#007bff',
                    color: 'white',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}>
                    {index + 1}
                  </div>
                  
                  {index === 0 && (
                    <div style={{
                      background: '#ffc107',
                      color: '#000',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: '600'
                    }}>
                      PRINCIPALE
                    </div>
                  )}
                </div>

                {/* Controlli di posizione e rimozione */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {/* Sposta su */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveImage(index, index - 1);
                      }}
                      disabled={index === 0}
                      style={{
                        background: index === 0 ? '#666' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        width: '24px',
                        height: '24px',
                        cursor: index === 0 ? 'not-allowed' : 'pointer',
                        fontSize: '0.7rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Sposta verso sinistra"
                    >
                      ←
                    </button>
                    
                    {/* Sposta giù */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveImage(index, index + 1);
                      }}
                      disabled={index === images.length - 1}
                      style={{
                        background: index === images.length - 1 ? '#666' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        width: '24px',
                        height: '24px',
                        cursor: index === images.length - 1 ? 'not-allowed' : 'pointer',
                        fontSize: '0.7rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Sposta verso destra"
                    >
                      →
                    </button>
                  </div>

                  {/* Pulsante rimozione */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Rimuovere questa immagine?')) {
                        handleRemoveImage(index);
                      }
                    }}
                    style={{
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      width: '24px',
                      height: '24px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Rimuovi immagine"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Messaggio quando non ci sono immagini */}
      {images.length === 0 && (
        <div style={{
          border: '2px dashed #ccc',
          borderRadius: '10px',
          padding: '40px 20px',
          textAlign: 'center',
          color: '#666',
          marginTop: '20px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📷</div>
          <p style={{ margin: 0, fontWeight: '500' }}>
            Nessuna immagine caricata
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem' }}>
            Clicca il pulsante sopra per aggiungere immagini
          </p>
        </div>
      )}

      {/* CSS per l'overlay hover */}
      <style>{`
        .image-overlay:hover {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

export default ImageUploader;