import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ListingDetail from './ListingDetail';
import Navbar from './Navbar';

/**
 * Wrapper per ListingDetail che gestisce i parametri della URL
 * Include la navbar come nel sito NovaRe originale
 * Rotta: /listing/:id
 */
const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasNavigationHistory, setHasNavigationHistory] = useState(false);

  useEffect(() => {
    // Controlla se c'è una storia di navigazione
    console.log('📍 Location state:', location.state);
    console.log('📍 Window history length:', window.history.length);
    
    // Se c'è uno state o la history ha più di una entry, probabilmente c'è una pagina precedente
    setHasNavigationHistory(location.state?.from || window.history.length > 1);
  }, [location]);

  const handleBack = () => {
    console.log('🔙 handleBack chiamato');
    console.log('🔙 hasNavigationHistory:', hasNavigationHistory);
    
    try {
      if (hasNavigationHistory) {
        console.log('🔙 Usando navigate(-1)');
        navigate(-1);
      } else {
        console.log('🔙 Nessuna storia, vado alla lista immobili');
        navigate('/immobili');
      }
    } catch (error) {
      console.error('❌ Errore navigate:', error);
      // Fallback finale: vai alla lista immobili
      navigate('/immobili');
    }
  };

  return (
    <div>
      <Navbar />
      <ListingDetail
        listingId={id}
        onBack={handleBack}
      />
    </div>
  );
};

export default ListingDetailPage;