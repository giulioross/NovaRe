import React from 'react';
import { useListings } from '../hooks/useListings';
import LoadingSpinner from './LoadingSpinner';
import { Link } from 'react-router-dom';

const Listings = () => {
  const { listings, loading, error } = useListings();

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        padding: '100px 20px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
          padding: '40px'
        }}>
          <LoadingSpinner />
          <p style={{ color: 'white', marginTop: '20px', fontSize: '1.2rem' }}>
            Caricamento immobili...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        padding: '100px 20px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
          padding: '40px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>❌</div>
          <h3 style={{ color: '#ff6b6b', marginBottom: '15px', fontSize: '1.5rem' }}>
            Errore nel caricamento
          </h3>
          <p style={{ color: 'white', fontSize: '1.1rem' }}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        padding: '100px 20px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
          padding: '40px'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🏠</div>
          <h3 style={{ color: 'white', marginBottom: '15px', fontSize: '1.8rem' }}>
            Nessun immobile disponibile
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
            Non ci sono ancora immobili pubblicati. Torna presto per nuove opportunità!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      padding: '100px 20px 40px'
    }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
          padding: '40px'
        }}>
          <h2 style={{ 
            textAlign: 'center', 
            color: 'white', 
            marginBottom: '30px',
            fontSize: '2.5rem',
            fontWeight: '700'
          }}>
            🏠 I nostri immobili ({listings.length})
          </h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginTop: '20px'
      }}>
        {listings.map((listing) => {
          // Trova la prima immagine disponibile (stesso logic del ListingDetail)
          const getFirstImage = (listing) => {
            // Debug per vedere tutti i campi disponibili
            console.log(`🔍 Debug immagine per listing ${listing.id}:`, {
              images: listing.images,
              photoUrls: listing.photoUrls,
              photos: listing.photos,
              imageUrl: listing.imageUrl,
              immaginePrincipale: listing.immaginePrincipale
            });

            if (listing.images && Array.isArray(listing.images) && listing.images.length > 0) {
              console.log(`✅ Trovata in images:`, listing.images[0]);
              return listing.images[0];
            }
            if (listing.photoUrls && Array.isArray(listing.photoUrls) && listing.photoUrls.length > 0) {
              console.log(`✅ Trovata in photoUrls:`, listing.photoUrls[0]);
              return listing.photoUrls[0];
            }
            if (listing.photos && Array.isArray(listing.photos) && listing.photos.length > 0) {
              console.log(`✅ Trovata in photos:`, listing.photos[0]);
              return listing.photos[0];
            }
            if (listing.imageUrl) {
              console.log(`✅ Trovata in imageUrl:`, listing.imageUrl);
              return listing.imageUrl;
            }
            if (listing.immaginePrincipale) {
              console.log(`✅ Trovata in immaginePrincipale:`, listing.immaginePrincipale);
              return listing.immaginePrincipale;
            }
            console.log(`❌ Nessuna immagine trovata per listing ${listing.id}`);
            return null;
          };

          const firstImage = getFirstImage(listing);
          
          return (
            <div
              key={listing.id}
              style={{
                background: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease'
              }}
            >
              {/* Immagine */}
              <div style={{
                height: '200px',
                background: firstImage 
                  ? `url(${firstImage})` 
                  : 'linear-gradient(45deg, #007bff, #0056b3)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '3rem'
              }}>
                {!firstImage && '🏠'}
              </div>
            
            {/* Contenuto */}
            <div style={{ padding: '20px' }}>
              <h3 style={{ 
                margin: '0 0 10px 0', 
                color: '#333',
                fontSize: '1.2rem'
              }}>
                {listing.title || 'Immobile senza titolo'}
              </h3>
              
              <p style={{
                color: '#666',
                fontSize: '0.9rem',
                margin: '0 0 15px 0',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {listing.description || 'Nessuna descrizione disponibile'}
              </p>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <span style={{
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  color: '#007bff'
                }}>
                  {listing.price ? `€ ${listing.price.toLocaleString()}` : 'Prezzo da concordare'}
                </span>
                
                <span style={{
                  background: '#e9ecef',
                  color: '#495057',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.8rem'
                }}>
                  {listing.contractType || 'N/A'}
                </span>
              </div>
              
              <Link
                to={`/listing/${listing.id}`}
                state={{ from: '/' }}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  background: '#007bff',
                  color: 'white',
                  padding: '10px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'background 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = '#0056b3'}
                onMouseLeave={(e) => e.target.style.background = '#007bff'}
              >
                👀 Vedi Dettagli
              </Link>
            </div>
          </div>
          );
        })}
      </div>
        </div>
      </div>
    </div>
  );
};

export default Listings;
