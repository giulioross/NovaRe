import { useState, useEffect } from 'react';
import { listingService } from '../services/listingService.js';

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
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Caricamento immobili pubblici...');
      const data = await listingService.getPublicListings();
      
      if (data && Array.isArray(data)) {
        console.log(`✅ Caricati ${data.length} immobili pubblici`);
        setListings(data);
      } else {
        console.warn('⚠️ Dati immobili non validi:', data);
        setListings([]);
      }
      
    } catch (err) {
      console.error('❌ Errore nel caricamento degli immobili:', err);
      setError(err.message || 'Errore nel caricamento degli immobili');
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  // Carica gli immobili all'avvio del componente
  useEffect(() => {
    loadListings();
  }, []);

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
      setListing(data);
      
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