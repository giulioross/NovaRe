import apiClient from '../api/axios.js';

/**
 * Servizio per la gestione dell'autenticazione admin
 */
export const authService = {
  
  /**
   * Registra un nuovo admin
   * @param {Object} registrationData - Dati di registrazione
   * @param {string} registrationData.username - Username admin
   * @param {string} registrationData.password - Password admin
   * @param {string} registrationData.companyCode - Codice azienda
   * @returns {Promise<Object>} Dati dell'utente registrato
   */
  async registerAdmin(registrationData) {
    try {
      console.log('🔐 Registrazione admin:', {
        username: registrationData.username,
        companyCode: registrationData.companyCode
      });

      const response = await apiClient.post('/api/admin/register', registrationData);
      
      console.log('✅ Admin registrato con successo:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Errore registrazione admin:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      
      throw error;
    }
  },

  /**
   * Testa la validità delle credenziali admin
   * @param {string} username - Username admin
   * @param {string} password - Password admin
   * @returns {Promise<boolean>} True se le credenziali sono valide
   */
  async testAdminCredentials(username, password) {
    try {
      const credentials = btoa(`${username}:${password}`);
      
      const response = await apiClient.get('/api/admin/listings', {
        headers: {
          'Authorization': `Basic ${credentials}`
        }
      });
      
      console.log('✅ Credenziali admin valide');
      return true;
      
    } catch (error) {
      console.error('❌ Credenziali admin non valide:', error.response?.status);
      return false;
    }
  }
};

export default authService;