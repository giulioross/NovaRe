import { useState, useEffect } from 'react';
import { listingService } from '../services/listingService.js';
import { mapListingFromBackend, mapListingsFromBackend } from '../utils/listingMapper.js';

/**
 * Hook personalizzato per caricare gli immobili pubblici
 * @returns {Object} Oggetto con listings, loading, error e refetch
 */
export const useListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Funzione per caricare gli immobili
   */
  const loadListings = async () => {
    console.log('🔄 useListings - Inizio caricamento immobili pubblici...');
    setLoading(true);
    setError(null);
    
    try {
      const data = await listingService.getPublicListings();
      console.log('📥 useListings - Dati ricevuti dal backend:', data);
      
      if (data && Array.isArray(data)) {
        console.log(`✅ useListings - Caricati ${data.length} immobili pubblici`);
        
        // Log dettagliato delle immagini per ogni immobile
        data.forEach((listing, index) => {
          console.log(`🏠 useListings - Immobile ${index + 1} (ID: ${listing.id}):`, {
            title: listing.title,
            imageUrl: listing.imageUrl,
            photoUrls: listing.photoUrls,
            photos: listing.photos,
            images: listing.images,
            hasImages: !!(listing.imageUrl || listing.photoUrls || listing.photos || listing.images)
          });
        });
        
        const mappedListings = mapListingsFromBackend(data);
        console.log('🔄 useListings - Immobili mappati:', mappedListings);
        setListings(mappedListings);
      } else {
        console.warn('⚠️ useListings - Dati immobili non validi:', data);
        setListings([]);
      }
      
    } catch (err) {
      console.error('❌ useListings - Errore nel caricamento degli immobili:', err);
      setError(err.message || 'Errore nel caricamento degli immobili');
      setListings([]);
    } finally {
      setLoading(false);
      console.log('🏁 useListings - Caricamento completato');
    }
  };

  // Carica gli immobili all'avvio del componente (solo una volta)
  useEffect(() => {
    console.log('🚀 useListings - Hook montato, inizio caricamento dati');
    let mounted = true;
    
    const loadData = async () => {
      if (mounted) {
        await loadListings();
      }
    };
    
    loadData();
    
    return () => {
      console.log('🔥 useListings - Hook smontato');
      mounted = false;
    };
  }, []); // Array vuoto per eseguire solo al mount

  /**
   * Funzione per ricaricare gli immobili manualmente
   */
  const refetch = () => {
    loadListings();
  };

  return {
    listings,
    loading,
    error,
    refetch
  };
};

/**
 * Hook per caricare un singolo immobile pubblico
 * @param {string|number} id - ID dell'immobile
 * @returns {Object} Oggetto con listing, loading, error e refetch
 */
export const useListing = (id) => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadListing = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log(`🔄 Caricamento immobile ${id}...`);
      const data = await listingService.getPublicListing(id);
      
      console.log(`✅ Caricato immobile ${id}`);
      const mappedListing = mapListingFromBackend(data);
      setListing(mappedListing);
      
    } catch (err) {
      console.error(`❌ Errore nel caricamento dell'immobile ${id}:`, err);
      setError(err.message || 'Errore nel caricamento dell\'immobile');
      setListing(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListing();
  }, [id]);

  const refetch = () => {
    loadListing();
  };

  return {
    listing,
    loading,
    error,
    refetch
  };
};

export default useListings;