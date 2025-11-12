import apiClient from '../api/axios.js';
import { createAdminAuthHeader, getActiveCredentials } from '../utils/authUtils.js';

// Costante base API (usando Vite env) - FIXED process.env issue
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8082';

/**
 * Comprimi un'immagine per ridurre la dimensione del file
 * @param {File} file - File immagine originale
 * @param {number} maxWidth - Larghezza massima (default 800)
 * @param {number} quality - Qualità JPEG 0-1 (default 0.6)
 * @returns {Promise<File>} File compresso
 */
async function compressImage(file, maxWidth = 800, quality = 0.6) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calcola le nuove dimensioni mantenendo l'aspect ratio
      let { width, height } = img;
      
      // Ridimensiona se troppo grande
      if (width > maxWidth || height > maxWidth) {
        if (width > height) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        } else {
          width = (width * maxWidth) / height;
          height = maxWidth;
        }
      }
      
      // Imposta le dimensioni del canvas
      canvas.width = width;
      canvas.height = height;
      
      // Disegna l'immagine ridimensionata con migliore qualità
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);
      
      // Converti in blob compresso
      canvas.toBlob((blob) => {
        const compressedFile = new File([blob], file.name, {
          type: 'image/jpeg',
          lastModified: Date.now()
        });
        resolve(compressedFile);
      }, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
}

// Helper per creare header auth (aggiornato)
export function makeAuthHeader(username, password) {
  if (!username || !password) return null;
  return 'Basic ' + btoa(`${username}:${password}`);
}

// Helper per creare header Basic Auth semplificato
export function basicAuthHeader(username, password) {
  return `Basic ${btoa(`${username}:${password}`)}`;
}

// Helper per creare header Basic Auth (formato oggetto, mantenuto per compatibilità)
const createAuthHeaders = (username, password) => {
  console.log('🔐 DEBUG BASIC AUTH - Input:');
  console.log('  Username:', username);
  console.log('  Password:', password);
  
  const credentials = btoa(`${username}:${password}`);
  console.log('🔐 DEBUG BASIC AUTH - String da codificare:', `${username}:${password}`);
  console.log('🔐 DEBUG BASIC AUTH - Base64 result:', credentials);
  
  return {
    'Authorization': `Basic ${credentials}`
  };
};

// Servizio per gestire gli immobili (listings)
export const listingService = {
  
  // ===== API PUBBLICHE =====
  
  /**
   * Recupera tutti gli immobili pubblici
   * @returns {Promise<Array>} Lista degli immobili
   */
  async getPublicListings() {
    try {
      const response = await apiClient.get('/api/public/listings');
      return response.data;
    } catch (error) {
      console.error('Errore nel caricamento degli immobili pubblici:', error);
      throw new Error(
        error.response?.data?.message || 
        'Errore nel caricamento degli immobili'
      );
    }
  },

  /**
   * Recupera un singolo immobile pubblico per ID
   * @param {string|number} id - ID dell'immobile
   * @returns {Promise<Object>} Dettagli dell'immobile
   */
  async getPublicListing(id) {
    try {
      const response = await apiClient.get(`/api/public/listings/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Errore nel caricamento dell'immobile ${id}:`, error);
      throw new Error(
        error.response?.data?.message || 
        'Errore nel caricamento dell\'immobile'
      );
    }
  },

  // ===== API ADMIN (con Basic Auth) =====

  /**
   * Recupera tutti gli immobili (admin)
   * @param {string} username - Username admin (opzionale, usa credenziali predefinite)
   * @param {string} password - Password admin (opzionale, usa credenziali predefinite)
   * @returns {Promise<Array>} Lista completa degli immobili
   */
  async getAllListingsAdmin(username, password) {
    try {
      // Usa credenziali predefinite se non specificate
      const credentials = username && password ? 
        { username, password } : 
        getActiveCredentials();
      
      const response = await apiClient.get('/api/admin/listings', {
        headers: {
          'Authorization': basicAuthHeader(credentials.username, credentials.password)
        }
      });
      return response.data;
    } catch (error) {
      console.error('Errore nel caricamento degli immobili (admin):', error);
      throw new Error(
        error.response?.data?.message || 
        'Errore di autenticazione o caricamento dati'
      );
    }
  },

  /**
   * Crea un nuovo immobile (admin) - OPZIONE A: JSON + foto separate
   * @param {Object} listing - Dati dell'immobile
   * @param {Array} files - Array di file immagini (opzionale)
   * @param {string} username - Username admin (opzionale)
   * @param {string} password - Password admin (opzionale)
   * @returns {Promise<Object>} Immobile creato
   */
  async createListing(listing, files = [], username, password) {
    try {
      // Usa credenziali predefinite se non specificate
      const credentials = username && password ? 
        { username, password } : 
        getActiveCredentials();

      console.log('🔄 Step 1: Creazione immobile (JSON)');
      console.log('📝 Dati listing:', listing);

      // Step 1: Crea immobile con JSON
      const response = await apiClient.post('/api/admin/listings', listing, {
        headers: {
          'Authorization': basicAuthHeader(credentials.username, credentials.password)
        }
      });
      
      console.log('✅ Immobile creato con successo:', response.data);
      const createdListing = response.data;

      // Step 2: Upload foto se presenti
      if (files.length > 0) {
        console.log('📸 Step 2: Upload foto per immobile creato:', createdListing.id);
        const authHeader = `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`;
        const updatedListing = await this.uploadPhotos(createdListing.id, files, authHeader);
        return updatedListing || createdListing;
      }

      return createdListing;
    } catch (error) {
      console.error('❌ Errore nella creazione dell\'immobile:', error);
      console.error('📋 Status:', error.response?.status);
      console.error('📋 Response data:', error.response?.data);
      throw error;
    }
  },

  /**
   * Aggiorna un immobile esistente (admin) - OPZIONE A: JSON separato
   * @param {string|number} id - ID dell'immobile
   * @param {Object} listing - Dati aggiornati dell'immobile
   * @param {string} username - Username admin (opzionale)
   * @param {string} password - Password admin (opzionale)
   * @returns {Promise<Object>} Immobile aggiornato
   */
  async updateListing(id, listing, username, password) {
    try {
      // Usa credenziali predefinite se non specificate
      const credentials = username && password ? 
        { username, password } : 
        getActiveCredentials();

      console.log('🔄 Step 1: Aggiornamento dati listing (JSON)');
      console.log('📝 Dati listing:', listing);

      const response = await apiClient.put(`/api/admin/listings/${id}`, listing, {
        headers: {
          'Authorization': basicAuthHeader(credentials.username, credentials.password)
        }
      });
      
      console.log('✅ Listing aggiornato con successo:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Errore nell'aggiornamento dell'immobile ${id}:`, error);
      console.error('📋 Status:', error.response?.status);
      console.error('📋 Response data:', error.response?.data);
      throw error; // Rilancia l'errore completo per il debug
    }
  },

  /**
   * Aggiorna un immobile esistente (admin) - OPZIONE B: Multipart completo
   * @param {string|number} id - ID dell'immobile
   * @param {Object} listing - Dati aggiornati dell'immobile
   * @param {Array} files - Array di file immagini (opzionale)
   * @param {string} username - Username admin (opzionale)
   * @param {string} password - Password admin (opzionale)
   * @returns {Promise<Object>} Immobile aggiornato
   */
  async updateListingWithMultipart(id, listing, files = [], username, password) {
    try {
      // Usa credenziali predefinite se non specificate
      const credentials = username && password ? 
        { username, password } : 
        getActiveCredentials();

      console.log('🔄 Aggiornamento immobile con multipart/form-data');
      console.log('📝 Dati listing:', listing);
      console.log('📸 File da caricare:', files.length);

      // Crea FormData
      const formData = new FormData();
      
      // Aggiungi dati listing come stringa JSON
      formData.append('listing', JSON.stringify(listing));
      
      // Aggiungi foto se presenti
      files.forEach((file, index) => {
        console.log(`📸 Aggiungendo file ${index + 1}:`, file.name || `file-${index + 1}`);
        formData.append('photos', file);
      });

      const response = await apiClient.put(`/api/admin/listings/${id}`, formData, {
        headers: {
          'Authorization': `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`
          // NON impostare Content-Type - axios gestisce automaticamente multipart/form-data
        }
      });
      
      console.log('✅ Listing aggiornato con multipart:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Errore nell'aggiornamento multipart dell'immobile ${id}:`, error);
      console.error('📋 Status:', error.response?.status);
      console.error('📋 Response data:', error.response?.data);
      throw error;
    }
  },

  /**
   * Aggiorna parzialmente un immobile (PATCH) - solo i campi modificati
   * @param {string|number} id - ID dell'immobile
   * @param {Object} changes - Solo i campi da aggiornare
   * @param {string} username - Username admin (opzionale)
   * @param {string} password - Password admin (opzionale)
   * @returns {Promise<Object>} Immobile aggiornato
   */
  async patchListing(id, changes, username, password, fallbackData = null) {
    try {
      // Usa credenziali predefinite se non specificate
      const credentials = username && password ? 
        { username, password } : 
        getActiveCredentials();

      console.log('🔄 PATCH: Aggiornamento parziale immobile');
      console.log('📝 Solo campi modificati:', changes);
      console.log('📊 Numero campi da aggiornare:', Object.keys(changes).length);

      // Per gli aggiornamenti parziali, non modificare createdAt ma sempre aggiornare updatedAt
      const updatePayload = { ...changes };
      delete updatePayload.createdAt; // Non modificare la data di creazione
      updatePayload.updatedAt = new Date().toISOString(); // Sempre aggiorna timestamp modifica
      
      console.log('🕒 Payload con timestamp aggiornato:', updatePayload);

      const response = await apiClient.patch(`/api/admin/listings/${id}`, updatePayload, {
        headers: {
          'Authorization': basicAuthHeader(credentials.username, credentials.password),
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Aggiornamento parziale completato:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Errore nell'aggiornamento parziale dell'immobile ${id}:`, error);
      console.error('📋 Status:', error.response?.status);
      console.error('📋 Response data:', error.response?.data);
      
      // Se il backend non supporta PATCH, fallback a PUT
      const isMethodNotSupported = 
        error.response?.status === 405 || 
        error.response?.status === 501 ||
        (error.response?.status === 500 && 
         error.response?.data?.error?.includes('not supported'));
         
      if (isMethodNotSupported) {
        console.log('⚠️ PATCH non supportato dal backend, fallback a PUT completo');
        console.log('📝 Convertendo aggiornamento parziale in aggiornamento completo...');
        
        // Usa i dati completi se forniti, altrimenti le sole modifiche
        const dataToUpdate = fallbackData || changes;
        console.log('📦 Dati per fallback PUT:', dataToUpdate);
        
        return this.updateListing(id, dataToUpdate, username, password);
      }
      
      throw error;
    }
  },

  /**
   * Elimina un immobile (admin)
   * @param {string|number} id - ID dell'immobile
   * @param {string} username - Username admin (opzionale)
   * @param {string} password - Password admin (opzionale)
   * @returns {Promise<void>}
   */
  async deleteListing(id, username, password) {
    try {
      console.log('🗑️ deleteListing chiamata con:', { id, username, hasPassword: !!password });
      
      // Usa credenziali predefinite se non specificate
      const credentials = username && password ? 
        { username, password } : 
        getActiveCredentials();

      console.log('🔐 Credenziali usate:', { username: credentials.username, hasPassword: !!credentials.password });

      const response = await apiClient.delete(`/api/admin/listings/${id}`, {
        headers: {
          'Authorization': basicAuthHeader(credentials.username, credentials.password)
        }
      });
      
      console.log('✅ Eliminazione API completata:', response.status);
      return response.data;
    } catch (error) {
      console.error(`❌ Errore nell'eliminazione dell'immobile ${id}:`, error);
      console.error('❌ Error response status:', error.response?.status);
      console.error('❌ Error response data:', error.response?.data);
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.statusText ||
        'Errore nell\'eliminazione dell\'immobile'
      );
    }
  },

  // ===== NUOVE FUNZIONI PER FLUSSO SEPARATO =====

  /**
   * Aggiorna un immobile con solo dati JSON (senza foto) - VERSIONE AXIOS
   * @param {string|number} id - ID dell'immobile
   * @param {Object} listingDto - Dati dell'immobile
   * @param {string} authHeader - Header di autorizzazione
   * @returns {Promise<Object>} Immobile aggiornato
   */
  async updateListingJson(id, listingDto, authHeader) {
    console.log('📝 listingService - updateListingJson (AXIOS):', { id, listingDto });
    
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (authHeader) headers['Authorization'] = authHeader;
      
      const res = await apiClient.put(`/api/admin/listings/${id}/json`, listingDto, { headers });
      console.log('✅ listingService - updateListingJson success:', res.data);
      return res.data;
    } catch (err) {
      console.error('❌ listingService - updateListingJson error:', err);
      // estrai info utili per UI
      const status = err.response?.status;
      const data = err.response?.data;
      const e = new Error('Update listing failed');
      e.status = status;
      e.data = data;
      throw e;
    }
  },

  /**
   * Carica foto per un immobile (FormData) - VERSIONE AXIOS
   * @param {string|number} listingId - ID dell'immobile
   * @param {File[]} files - Array di file immagine
   * @param {string} authHeader - Header di autorizzazione
   * @returns {Promise<Object>} Immobile aggiornato con foto
   */
  async uploadPhotos(listingId, files, authHeader) {
    console.log('📸 listingService - uploadPhotos (AXIOS):', { listingId, filesCount: files?.length });
    
    try {
      // Comprimi le immagini prima dell'upload
      console.log('🔧 Compressione immagini in corso...');
      const compressedFiles = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`📸 Compressione file ${i + 1}/${files.length}: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
        
        // Comprimi tutte le immagini per assicurarsi che siano sotto la soglia del server
        if (file.type.startsWith('image/')) {
          // Usa compressione più aggressiva se il file è molto grande
          const quality = file.size > 2000000 ? 0.5 : 0.6; // 50% se > 2MB, altrimenti 60%
          const maxWidth = file.size > 5000000 ? 600 : 800; // 600px se > 5MB, altrimenti 800px
          
          const compressed = await compressImage(file, maxWidth, quality);
          console.log(`✅ Compresso: ${file.name} da ${(file.size / 1024 / 1024).toFixed(2)} MB a ${(compressed.size / 1024 / 1024).toFixed(2)} MB`);
          compressedFiles.push(compressed);
        } else {
          compressedFiles.push(file);
        }
      }
      
      // Verifica finale delle dimensioni e conta totale
      const finalFiles = [];
      let totalSize = 0;
      
      for (const f of compressedFiles) {
        if (f.size > 2000000) { // 2MB max per file
          console.warn(`⚠️ File ${f.name} ancora troppo grande: ${(f.size / 1024 / 1024).toFixed(2)} MB`);
          // Prova una compressione ancora più aggressiva
          if (f.type.startsWith('image/')) {
            const superCompressed = await compressImage(f, 500, 0.4);
            console.log(`🔧 Super-compresso: ${f.name} a ${(superCompressed.size / 1024 / 1024).toFixed(2)} MB`);
            finalFiles.push(superCompressed);
            totalSize += superCompressed.size;
          }
        } else {
          finalFiles.push(f);
          totalSize += f.size;
        }
      }
      
      console.log(`📊 Dimensione totale upload: ${(totalSize / 1024 / 1024).toFixed(2)} MB per ${finalFiles.length} file`);
      
      const fd = new FormData();
      for (const f of finalFiles) {
        fd.append('photos', f); // backend aspetta campo 'photos'
      }
      
      const headers = {};
      if (authHeader) headers['Authorization'] = authHeader;
      // NON impostare Content-Type per multipart
      
      const res = await apiClient.post(`/api/admin/listings/${listingId}/photos`, fd, { headers });
      console.log('✅ listingService - uploadPhotos success:', res.data);
      return res.data;
    } catch (err) {
      console.error('❌ listingService - uploadPhotos error:', err);
      const status = err.response?.status;
      const data = err.response?.data;
      const e = new Error('Upload photos failed');
      e.status = status;
      e.data = data;
      throw e;
    }
  },

  /**
   * Aggiorna immobile con dati e foto in sequenza - VERSIONE SICURA
   * @param {string|number} id - ID dell'immobile
   * @param {Object} listingDto - Dati dell'immobile
   * @param {File[]} files - File immagine (opzionale)
   * @param {string} authHeader - Header di autorizzazione
   * @returns {Promise<Object>} Immobile aggiornato finale
   */
  async updateListingWithPhotos(id, listingDto, files, authHeader) {
    console.log('🔄 listingService - updateListingWithPhotos (SAFE):', { id, hasFiles: !!files?.length });
    
    try {
      // 1) aggiornamento JSON
      const updated = await this.updateListingJson(id, listingDto, authHeader);
      
      // 2) upload foto se presenti
      if (files && files.length > 0) {
        const afterPhotos = await this.uploadPhotos(id, files, authHeader);
        console.log('✅ listingService - updateListingWithPhotos complete with photos');
        return afterPhotos; // backend ritorna listing aggiornato
      }
      console.log('✅ listingService - updateListingWithPhotos complete without photos');
      return updated;
    } catch (error) {
      console.error('❌ listingService - updateListingWithPhotos error:', error);
      throw error;
    }
  },

  // ===== NUOVE FUNZIONI PER IL BACKEND AGGIORNATO =====

  /**
   * Aggiorna solo i dati JSON di un immobile (senza foto)
   * @param {string|number} id - ID dell'immobile
   * @param {Object} listingDto - Dati dell'immobile in formato DTO
   * @param {string} username - Username admin
   * @param {string} password - Password admin
   * @returns {Promise<Object>} Immobile aggiornato
   */
  async updateListingJsonOnly(id, listingDto, username, password) {
    try {
      const credentials = username && password ? 
        { username, password } : 
        getActiveCredentials();

      console.log('🔄 Aggiornamento solo JSON per listing:', id);
      console.log('📝 Payload:', listingDto);

      const response = await apiClient.put(`/api/admin/listings/${id}/json`, listingDto, {
        headers: {
          'Authorization': `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`
        }
      });

      console.log('✅ JSON aggiornato con successo:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Errore aggiornamento JSON:', error);
      console.error('📋 Status:', error.response?.status);
      console.error('📋 Response:', error.response?.data);
      throw error;
    }
  },

  /**
   * Carica foto per un immobile esistente
   * @param {string|number} id - ID dell'immobile
   * @param {File[]} files - Array di file immagine
   * @param {string} username - Username admin
   * @param {string} password - Password admin
   * @returns {Promise<Object>} Immobile aggiornato con foto
   */
  async uploadListingPhotosOnly(id, files, username, password) {
    try {
      const credentials = username && password ? 
        { username, password } : 
        getActiveCredentials();

      console.log('📸 Upload foto per listing:', id);
      console.log('📷 Numero file:', files.length);

      // Comprimi le immagini prima dell'upload
      console.log('🔧 Compressione immagini in corso...');
      const compressedFiles = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`📸 Compressione file ${i + 1}/${files.length}: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
        
        if (file.type.startsWith('image/')) {
          // Usa compressione aggressiva per evitare errori di dimensione
          const quality = file.size > 2000000 ? 0.4 : 0.5; // 40% se > 2MB, altrimenti 50%
          const maxWidth = file.size > 5000000 ? 500 : 600; // 500px se > 5MB, altrimenti 600px
          
          const compressed = await compressImage(file, maxWidth, quality);
          console.log(`✅ Compresso: ${file.name} da ${(file.size / 1024 / 1024).toFixed(2)} MB a ${(compressed.size / 1024 / 1024).toFixed(2)} MB`);
          compressedFiles.push(compressed);
        } else {
          compressedFiles.push(file);
        }
      }

      // Controllo finale delle dimensioni
      const finalFiles = [];
      let totalSize = 0;
      const MAX_FILE_SIZE = 1024 * 1024 * 2; // 2MB per file
      const MAX_TOTAL_SIZE = 1024 * 1024 * 10; // 10MB totale
      
      for (const file of compressedFiles) {
        if (file.size > MAX_FILE_SIZE) {
          console.warn(`⚠️ File ${file.name} ancora troppo grande (${(file.size / 1024 / 1024).toFixed(2)} MB), saltato`);
          continue;
        }
        
        if (totalSize + file.size > MAX_TOTAL_SIZE) {
          console.warn(`⚠️ Limite totale raggiunto, file ${file.name} saltato`);
          break;
        }
        
        finalFiles.push(file);
        totalSize += file.size;
      }
      
      console.log(`📊 Upload finale: ${finalFiles.length} file per ${(totalSize / 1024 / 1024).toFixed(2)} MB totali`);

      const formData = new FormData();
      finalFiles.forEach(file => {
        formData.append('photos', file);
        console.log('📎 Aggiunto file finale:', file.name, (file.size / 1024).toFixed(1), 'KB');
      });

      const response = await apiClient.post(`/api/admin/listings/${id}/photos`, formData, {
        headers: {
          'Authorization': `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`
          // NON impostare Content-Type - axios lo fa automaticamente per FormData
        }
      });

      console.log('✅ Foto caricate con successo:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Errore upload foto:', error);
      console.error('📋 Status:', error.response?.status);
      console.error('📋 Response:', error.response?.data);
      throw error;
    }
  },

  /**
   * Aggiorna immobile con approccio multipart (JSON + foto in una chiamata)
   * @param {string|number} id - ID dell'immobile
   * @param {Object} listingDto - Dati dell'immobile
   * @param {File[]} files - Array di file immagine
   * @param {string} username - Username admin
   * @param {string} password - Password admin
   * @returns {Promise<Object>} Immobile aggiornato
   */
  async updateListingMultipart(id, listingDto, files, username, password) {
    try {
      const credentials = username && password ? 
        { username, password } : 
        getActiveCredentials();

      console.log('🔄 Aggiornamento multipart per listing:', id);
      console.log('📝 Payload:', listingDto);
      console.log('📷 Numero file:', files.length);

      const formData = new FormData();
      formData.append('listing', JSON.stringify(listingDto));
      files.forEach(file => {
        formData.append('photos', file);
        console.log('📎 Aggiunto file:', file.name, file.size, 'bytes');
      });

      const response = await apiClient.put(`/api/admin/listings/${id}`, formData, {
        headers: {
          'Authorization': `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`
          // NON impostare Content-Type - axios lo fa automaticamente per FormData
        }
      });

      console.log('✅ Aggiornamento multipart completato:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Errore aggiornamento multipart:', error);
      console.error('📋 Status:', error.response?.status);
      console.error('📋 Response:', error.response?.data);
      throw error;
    }
  },

  /**
   * Crea un nuovo immobile con approccio separato (JSON prima, poi foto)
   * @param {Object} listingDto - Dati dell'immobile
   * @param {File[]} files - Array di file immagine
   * @param {string} username - Username admin
   * @param {string} password - Password admin
   * @returns {Promise<Object>} Immobile creato con foto
   */
  async createListingSeparated(listingDto, files, username, password) {
    try {
      const credentials = username && password ? 
        { username, password } : 
        getActiveCredentials();

      console.log('🔄 Step 1: Creazione immobile (JSON)');
      console.log('📝 Payload:', listingDto);

      // Step 1: Crea immobile con JSON
      const response = await apiClient.post('/api/admin/listings', listingDto, {
        headers: {
          'Authorization': `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`
        }
      });

      console.log('✅ Immobile creato:', response.data);
      const createdListing = response.data;

      // Step 2: Upload foto se presenti
      if (files && files.length > 0) {
        console.log('📸 Step 2: Upload foto per immobile:', createdListing.id);
        const updatedListing = await this.uploadListingPhotosOnly(createdListing.id, files, credentials.username, credentials.password);
        return updatedListing;
      }

      return createdListing;
    } catch (error) {
      console.error('❌ Errore creazione immobile separata:', error);
      throw error;
    }
  }
};

export default listingService;