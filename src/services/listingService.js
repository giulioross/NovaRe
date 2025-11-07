import apiClient from '../api/axios.js';

// Helper per creare header Basic Auth
const basicAuthHeader = (username, password) => {
  console.log('🔐 DEBUG BASIC AUTH - Input:');
  console.log('  Username:', username);
  console.log('  Password:', password);
  
  const credentials = btoa(`${username}:${password}`);
  console.log('🔐 DEBUG BASIC AUTH - String da codificare:', `${username}:${password}`);
  console.log('🔐 DEBUG BASIC AUTH - Base64 risultato:', credentials);
  
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
   * @param {string} username - Username admin
   * @param {string} password - Password admin
   * @returns {Promise<Array>} Lista completa degli immobili
   */
  async getAllListingsAdmin(username, password) {
    try {
      const response = await apiClient.get('/api/admin/listings', {
        headers: basicAuthHeader(username, password)
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
   * Crea un nuovo immobile (admin)
   * @param {Object} listing - Dati dell'immobile
   * @param {string} username - Username admin
   * @param {string} password - Password admin
   * @returns {Promise<Object>} Immobile creato
   */
  async createListing(listing, username, password) {
    try {
      const response = await apiClient.post('/api/admin/listings', listing, {
        headers: basicAuthHeader(username, password)
      });
      return response.data;
    } catch (error) {
      console.error('Errore nella creazione dell\'immobile:', error);
      // Rilancia l'errore completo per permettere gestione errori 400 nel componente
      throw error;
    }
  },

  /**
   * Aggiorna un immobile esistente (admin)
   * @param {string|number} id - ID dell'immobile
   * @param {Object} listing - Dati aggiornati dell'immobile
   * @param {string} username - Username admin
   * @param {string} password - Password admin
   * @returns {Promise<Object>} Immobile aggiornato
   */
  async updateListing(id, listing, username, password) {
    try {
      const response = await apiClient.put(`/api/admin/listings/${id}`, listing, {
        headers: basicAuthHeader(username, password)
      });
      return response.data;
    } catch (error) {
      console.error(`Errore nell'aggiornamento dell'immobile ${id}:`, error);
      throw new Error(
        error.response?.data?.message || 
        'Errore nell\'aggiornamento dell\'immobile'
      );
    }
  },

  /**
   * Elimina un immobile (admin)
   * @param {string|number} id - ID dell'immobile
   * @param {string} username - Username admin
   * @param {string} password - Password admin
   * @returns {Promise<void>}
   */
  async deleteListing(id, username, password) {
    try {
      await apiClient.delete(`/api/admin/listings/${id}`, {
        headers: basicAuthHeader(username, password)
      });
    } catch (error) {
      console.error(`Errore nell'eliminazione dell'immobile ${id}:`, error);
      throw new Error(
        error.response?.data?.message || 
        'Errore nell\'eliminazione dell\'immobile'
      );
    }
  }
};

export default listingService;