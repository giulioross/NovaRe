/**
 * Esempi di utilizzo delle nuove API per listing con foto
 * Questo file mostra i pattern di utilizzo per sviluppatori
 */

import { listingService } from '../services/listingService.js';
import { convertImagesToFiles, prepareListing } from '../utils/fileUtils.js';

// ========== ESEMPI DI UTILIZZO ==========

/**
 * OPZIONE A: Creazione con processo separato (JSON + foto)
 * Più affidabile, debug più semplice
 */
export const createListingOptionA = async (formData) => {
  try {
    console.log('📝 OPZIONE A: Creazione con processo separato');
    
    // 1. Prepara i dati
    const listingData = prepareListing(formData);
    const files = convertImagesToFiles(formData.images);
    
    // 2. Usa il metodo che gestisce il processo a due fasi
    const result = await listingService.createListing(listingData, files);
    
    console.log('✅ Immobile creato (Opzione A):', result);
    return result;
    
  } catch (error) {
    console.error('❌ Errore creazione Opzione A:', error);
    throw error;
  }
};

/**
 * OPZIONE B: Aggiornamento con multipart completo
 * Tutto in una sola chiamata
 */
export const updateListingOptionB = async (listingId, formData) => {
  try {
    console.log('📝 OPZIONE B: Aggiornamento con multipart completo');
    
    // 1. Prepara i dati
    const listingData = prepareListing(formData);
    const files = convertImagesToFiles(formData.images);
    
    // 2. Usa il metodo multipart completo
    const result = await listingService.updateListingWithMultipart(
      listingId, 
      listingData, 
      files
    );
    
    console.log('✅ Immobile aggiornato (Opzione B):', result);
    return result;
    
  } catch (error) {
    console.error('❌ Errore aggiornamento Opzione B:', error);
    throw error;
  }
};

/**
 * UPLOAD FOTO SEPARATO
 * Utile quando si vogliono aggiungere foto a un immobile esistente
 */
export const uploadPhotosOnly = async (listingId, newPhotos) => {
  try {
    console.log('📸 Upload foto separato per immobile:', listingId);
    
    // Converte le immagini in file se necessario
    const files = Array.isArray(newPhotos) ? 
      convertImagesToFiles(newPhotos) : 
      newPhotos;
    
    const result = await listingService.uploadPhotos(listingId, files);
    
    console.log('✅ Foto caricate:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Errore upload foto:', error);
    throw error;
  }
};

/**
 * ESEMPIO: Componente che mostra entrambe le opzioni
 */
export const ExampleUsageComponent = () => {
  const handleCreateListing = async (formData) => {
    try {
      // Usa l'opzione più semplice (A)
      const result = await createListingOptionA(formData);
      alert('Immobile creato con successo!');
      return result;
    } catch (error) {
      alert('Errore nella creazione: ' + error.message);
    }
  };

  const handleUpdateListing = async (listingId, formData, useMultipart = false) => {
    try {
      let result;
      
      if (useMultipart) {
        // Opzione B: Tutto insieme
        result = await updateListingOptionB(listingId, formData);
      } else {
        // Opzione A: Processo separato (default)
        const listingData = prepareListing(formData);
        const files = convertImagesToFiles(formData.images);
        
        // Step 1: Aggiorna dati
        result = await listingService.updateListing(listingId, listingData);
        
        // Step 2: Upload foto se presenti
        if (files.length > 0) {
          const withPhotos = await listingService.uploadPhotos(listingId, files);
          result = withPhotos || result;
        }
      }
      
      alert('Immobile aggiornato con successo!');
      return result;
    } catch (error) {
      alert('Errore nell\'aggiornamento: ' + error.message);
    }
  };

  const handleAddPhotos = async (listingId, newPhotos) => {
    try {
      const result = await uploadPhotosOnly(listingId, newPhotos);
      alert(`${newPhotos.length} foto aggiunte con successo!`);
      return result;
    } catch (error) {
      alert('Errore nell\'upload foto: ' + error.message);
    }
  };

  return {
    handleCreateListing,
    handleUpdateListing,
    handleAddPhotos
  };
};

// ========== PATTERN DI DEBUG ==========

/**
 * Helper per debug delle chiamate API
 */
export const debugApiCall = async (apiCall, operationName) => {
  console.group(`🔍 DEBUG: ${operationName}`);
  console.time(operationName);
  
  try {
    const result = await apiCall();
    console.log('✅ Successo:', result);
    return result;
  } catch (error) {
    console.error('❌ Errore:', error);
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    throw error;
  } finally {
    console.timeEnd(operationName);
    console.groupEnd();
  }
};

// ========== ESEMPI DI FORM DATA ==========

export const SAMPLE_LISTING_DATA = {
  title: 'Appartamento Centro Storico',
  description: 'Bellissimo appartamento nel cuore della città',
  address: 'Via Roma 123',
  city: 'Milano',
  bedrooms: '2',
  bathrooms: '1',
  price: '350000',
  type: 'VENDITA',
  size: '85',
  images: [] // Array di base64 string o File objects
};

export const SAMPLE_FORM_DATA_USAGE = {
  // Per creazione
  create: () => createListingOptionA(SAMPLE_LISTING_DATA),
  
  // Per aggiornamento (Opzione A)
  updateSeparate: (id) => {
    const listingData = prepareListing(SAMPLE_LISTING_DATA);
    return listingService.updateListing(id, listingData);
  },
  
  // Per aggiornamento (Opzione B)
  updateMultipart: (id) => updateListingOptionB(id, SAMPLE_LISTING_DATA),
  
  // Per upload solo foto
  uploadPhotos: (id, files) => uploadPhotosOnly(id, files)
};