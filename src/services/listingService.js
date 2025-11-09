import apiClient from '../api/axios.js';
import { createAdminAuthHeader, getActiveCredentials } from '../utils/authUtils.js';

// Costante base API (usando Vite env) - FIXED process.env issue
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8081';

// Helper per creare header auth (aggiornato)
export function makeAuthHeader(username, password) {
  if (!username || !password) return null;
  return 'Basic ' + btoa(`${username}:${password}`);
}

// Helper per creare header Basic Auth (mantenuto per compatibilità)
const basicAuthHeader = (username, password) => {
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
        headers: basicAuthHeader(credentials.username, credentials.password)
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
        headers: basicAuthHeader(credentials.username, credentials.password)
      });
      
      console.log('✅ Immobile creato con successo:', response.data);
      const createdListing = response.data;

      // Step 2: Upload foto se presenti
      if (files.length > 0) {
        console.log('📸 Step 2: Upload foto per immobile creato:', createdListing.id);
        const updatedListing = await this.uploadPhotos(createdListing.id, files, credentials.username, credentials.password);
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
        headers: basicAuthHeader(credentials.username, credentials.password)
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
   * Carica foto per un immobile esistente (admin) - OPZIONE A: Upload separato
   * @param {string|number} id - ID dell'immobile
   * @param {Array} files - Array di file immagini
   * @param {string} username - Username admin (opzionale)
   * @param {string} password - Password admin (opzionale)
   * @returns {Promise<Object>} Immobile aggiornato con photoUrls
   */
  async uploadPhotos(id, files = [], username, password) {
    try {
      if (files.length === 0) {
        console.log('📸 Nessuna foto da caricare');
        return null;
      }

      // Usa credenziali predefinite se non specificate
      const credentials = username && password ? 
        { username, password } : 
        getActiveCredentials();

      console.log('🔄 Step 2: Upload foto separato');
      console.log('📸 File da caricare:', files.length);

      // Crea FormData per le foto
      const formData = new FormData();
      files.forEach((file, index) => {
        console.log(`📸 Aggiungendo file ${index + 1}:`, file.name || `file-${index + 1}`);
        formData.append('photos', file); // Nome 'photos' come richiesto dal backend
      });

      const response = await apiClient.post(`/api/admin/listings/${id}/photos`, formData, {
        headers: {
          'Authorization': `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`
          // NON impostare Content-Type - axios gestisce automaticamente multipart/form-data
        }
      });
      
      console.log('✅ Foto caricate con successo:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Errore nel caricamento foto per immobile ${id}:`, error);
      console.error('📋 Status:', error.response?.status);
      console.error('📋 Response data:', error.response?.data);
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
      // Usa credenziali predefinite se non specificate
      const credentials = username && password ? 
        { username, password } : 
        getActiveCredentials();

      const response = await apiClient.delete(`/api/admin/listings/${id}`, {
        headers: basicAuthHeader(credentials.username, credentials.password)
      });
    } catch (error) {
      console.error(`Errore nell'eliminazione dell'immobile ${id}:`, error);
      throw new Error(
        error.response?.data?.message || 
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
      const fd = new FormData();
      for (const f of files) {
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
  }
};

export default listingService;