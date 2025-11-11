import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

  const handleBack = () => {
    console.log('🔙 handleBack chiamato');
    try {
      navigate(-1); // Torna alla pagina precedente
    } catch (error) {
      console.error('❌ Errore navigate:', error);
      // Fallback: vai alla home
      navigate('/');
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