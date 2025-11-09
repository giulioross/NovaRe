/**
 * Utilità per gestire la conversione di file per l'upload
 */

/**
 * Converte una stringa Base64 in un oggetto File
 * @param {string} base64String - Stringa Base64 dell'immagine
 * @param {string} fileName - Nome del file (opzionale)
 * @param {string} mimeType - Tipo MIME del file (default: image/jpeg)
 * @returns {File} Oggetto File
 */
export const base64ToFile = (base64String, fileName = 'image.jpg', mimeType = 'image/jpeg') => {
  // Rimuovi il prefisso data:image/xxx;base64, se presente
  const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
  
  // Converte Base64 in array di byte
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  
  // Crea il File object
  return new File([byteArray], fileName, { type: mimeType });
};

/**
 * Converte un array di immagini dal formato del componente ImageUploader in File objects
 * @param {Array} images - Array di immagini dal componente ImageUploader
 * @returns {Array} Array di File objects
 */
export const convertImagesToFiles = (images = []) => {
  return images.map((image, index) => {
    if (image instanceof File) {
      // Se è già un File, restituiscilo così com'è
      return image;
    } else if (typeof image === 'string') {
      // Se è una stringa (URL o Base64), convertila in File
      if (image.startsWith('data:')) {
        // È Base64
        return base64ToFile(image, `image-${index + 1}.jpg`);
      } else {
        // È un URL - per ora non possiamo convertirlo direttamente in File
        // Dovremmo fare un fetch, ma per ora loggiamo e saltiamo
        console.warn('Cannot convert URL to File:', image);
        return null;
      }
    } else if (image && image.base64) {
      // È un oggetto con proprietà base64
      const fileName = image.name || `image-${index + 1}.jpg`;
      const mimeType = image.type || 'image/jpeg';
      return base64ToFile(image.base64, fileName, mimeType);
    }
    
    console.warn('Unknown image format:', image);
    return null;
  }).filter(file => file !== null); // Rimuovi i null
};

/**
 * Estrai il JSON della listing per l'invio, escludendo le immagini
 * @param {Object} formData - Dati del form
 * @returns {Object} JSON pulito per l'invio al backend
 */
export const prepareListing = (formData) => {
  const { images, ...listingData } = formData;
  
  return {
    ...listingData,
    // Assicurati che i numeri siano convertiti correttamente
    price: parseFloat(listingData.price) || 0,
    bedrooms: parseInt(listingData.bedrooms) || 0,
    bathrooms: parseInt(listingData.bathrooms) || 0,
    size: parseFloat(listingData.size) || null,
    published: listingData.published !== undefined ? listingData.published : true
  };
};

export default {
  base64ToFile,
  convertImagesToFiles,
  prepareListing
};