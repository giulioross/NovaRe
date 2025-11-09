/**
 * Utility per mappare i dati dal backend al formato atteso dal frontend
 */

/**
 * Mappa i dati di un annuncio dal formato backend a quello frontend
 * @param {Object} backendListing - Dati annuncio dal backend
 * @returns {Object} Dati annuncio formato frontend
 */
export const mapListingFromBackend = (backendListing) => {
  if (!backendListing) return null;

  // Log dettagliato della mappatura delle immagini
  console.log(`🔄 listingMapper - Mappatura immobile ID: ${backendListing.id}`, {
    original: {
      immaginePrincipale: backendListing.immaginePrincipale,
      imageUrl: backendListing.imageUrl,
      immagini: backendListing.immagini,
      images: backendListing.images,
      photoUrls: backendListing.photoUrls,
      photos: backendListing.photos
    }
  });

  const mapped = {
    // Campi base
    id: backendListing.id,
    title: backendListing.titolo || backendListing.title || '',
    description: backendListing.descrizione || backendListing.description || '',
    price: backendListing.prezzo || backendListing.price || 0,
    address: backendListing.indirizzo || backendListing.address || '',
    city: backendListing.citta || backendListing.city || '',
    
    // Caratteristiche
    bedrooms: backendListing.vani || backendListing.bedrooms || 0,
    bathrooms: backendListing.bagni || backendListing.bathrooms || 0,
    size: backendListing.superficie || backendListing.size || null,
    
    // Tipo contratto
    contractType: backendListing.tipoContratto || backendListing.contractType || 'VENDITA',
    
    // Immagini
    imageUrl: backendListing.immaginePrincipale || backendListing.imageUrl || null,
    images: backendListing.immagini || backendListing.images || [],
    
    // Se non ci sono immagini multiple ma c'è l'immagine principale, la aggiungiamo
    ...((!backendListing.immagini && !backendListing.images) && backendListing.immaginePrincipale ? {
      images: [backendListing.immaginePrincipale]
    } : {}),
    
    // Campi aggiuntivi
    createdAt: backendListing.dataCreazione || backendListing.createdAt,
    updatedAt: backendListing.dataModifica || backendListing.updatedAt,
    
    // Manteniamo i campi originali per compatibilità
    ...backendListing
  };

  // Log del risultato della mappatura
  console.log(`✅ listingMapper - Immobile mappato ID: ${mapped.id}`, {
    mapped: {
      imageUrl: mapped.imageUrl,
      images: mapped.images,
      hasImages: !!(mapped.imageUrl || (mapped.images && mapped.images.length > 0))
    }
  });

  return mapped;
};

/**
 * Mappa un array di annunci dal formato backend a quello frontend
 * @param {Array} backendListings - Array di annunci dal backend
 * @returns {Array} Array di annunci formato frontend
 */
export const mapListingsFromBackend = (backendListings) => {
  if (!Array.isArray(backendListings)) return [];
  
  return backendListings.map(mapListingFromBackend);
};

/**
 * Formatta il prezzo per la visualizzazione
 * @param {number} price - Prezzo
 * @param {string} contractType - Tipo contratto (VENDITA/AFFITTO)
 * @returns {string} Prezzo formattato
 */
export const formatPrice = (price, contractType = 'VENDITA') => {
  if (!price || price === 0) return 'Prezzo da concordare';
  
  const formattedPrice = `€${price.toLocaleString('it-IT')}`;
  
  if (contractType === 'AFFITTO') {
    return `${formattedPrice}/mese`;
  }
  
  return formattedPrice;
};

/**
 * Formatta l'indirizzo completo
 * @param {string} address - Indirizzo
 * @param {string} city - Città
 * @returns {string} Indirizzo formattato
 */
export const formatAddress = (address, city) => {
  const parts = [];
  
  if (address) parts.push(address);
  if (city) parts.push(city);
  
  return parts.join(', ');
};

/**
 * Ottiene il tipo di contratto leggibile
 * @param {string} contractType - Tipo contratto
 * @returns {string} Tipo contratto leggibile
 */
export const getContractTypeLabel = (contractType) => {
  switch (contractType?.toUpperCase()) {
    case 'VENDITA':
      return 'Vendita';
    case 'AFFITTO':
      return 'Affitto';
    default:
      return 'Vendita';
  }
};

/**
 * Mappa i dati di un annuncio dal formato frontend a quello backend
 * @param {Object} frontendListing - Dati annuncio dal frontend
 * @returns {Object} Dati annuncio formato backend
 */
export const mapListingToBackend = (frontendListing) => {
  if (!frontendListing) return null;

  // Estrarre solo l'URL o il base64 dalle immagini per il backend
  const imageUrls = frontendListing.images?.map(img => 
    typeof img === 'string' ? img : img.base64 || img.url
  ).filter(Boolean) || [];

  return {
    // Campi base
    titolo: frontendListing.title || '',
    descrizione: frontendListing.description || '',
    prezzo: parseFloat(frontendListing.price) || 0,
    indirizzo: frontendListing.address || '',
    citta: frontendListing.city || '',
    
    // Caratteristiche  
    vani: parseInt(frontendListing.bedrooms) || 0,
    bagni: parseInt(frontendListing.bathrooms) || 0,
    superficie: parseFloat(frontendListing.size) || null,
    
    // Tipo contratto
    tipoContratto: frontendListing.type || frontendListing.contractType || 'VENDITA',
    
    // Immagini - per ora inviamo solo l'immagine principale
    immaginePrincipale: imageUrls[0] || null,
    // immagini: imageUrls, // Commentato temporaneamente se il backend non supporta ancora array
    
    // Campi aggiuntivi se presenti
    pubblicato: frontendListing.published !== undefined ? frontendListing.published : true
  };
};

export default {
  mapListingFromBackend,
  mapListingsFromBackend,
  mapListingToBackend,
  formatPrice,
  formatAddress,
  getContractTypeLabel
};