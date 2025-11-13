/**
 * Utilità per la gestione dell'autenticazione
 */

// Credenziali predefinite admin
export const DEFAULT_ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'ddd'
};

// Company code per la registrazione
export const COMPANY_CODE = 'NUOVARE-SECRET-2025';

/**
 * Crea header Basic Auth
 * @param {string} username 
 * @param {string} password 
 * @returns {Object} Headers con Authorization
 */
export const createBasicAuthHeader = (username, password) => {
  console.log('🔐 Creating Basic Auth header for:', username);
  
  const credentials = btoa(`${username}:${password}`);
  console.log('🔐 Base64 credentials:', credentials);
  
  return {
    'Authorization': `Basic ${credentials}`
  };
};

/**
 * Crea header Basic Auth con credenziali admin predefinite
 * @returns {Object} Headers con Authorization per admin
 */
export const createAdminAuthHeader = () => {
  return createBasicAuthHeader(
    DEFAULT_ADMIN_CREDENTIALS.username, 
    DEFAULT_ADMIN_CREDENTIALS.password
  );
};

/**
 * Salva credenziali utente nel localStorage (opzionale)
 * @param {string} username 
 * @param {string} password 
 */
export const saveCredentials = (username, password) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('admin_username', username);
    localStorage.setItem('admin_password', password);
    // Salva anche companyUserInfo per compatibilità con useAuthPersistent
    localStorage.setItem('companyUserInfo', JSON.stringify({ username, password }));
  }
};

/**
 * Recupera credenziali salvate dal localStorage
 * @returns {Object|null} Credenziali salvate o null
 */
export const getSavedCredentials = () => {
  if (typeof window !== 'undefined') {
    // Prova a recuperare da companyUserInfo (preferito)
    const userInfo = localStorage.getItem('companyUserInfo');
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        if (parsed.username && parsed.password) {
          return { username: parsed.username, password: parsed.password };
        }
      } catch (e) {}
    }
    // Fallback su admin_username/admin_password
    const username = localStorage.getItem('admin_username');
    const password = localStorage.getItem('admin_password');
    if (username && password) {
      return { username, password };
    }
  }
  return null;
};

/**
 * Rimuove credenziali salvate (logout)
 */
export const clearCredentials = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_username');
    localStorage.removeItem('admin_password');
    localStorage.removeItem('companyUserInfo');
  }
};

/**
 * Ottiene le credenziali da usare (salvate o predefinite)
 * @returns {Object} Credenziali da usare
 */
export const getActiveCredentials = () => {
  const saved = getSavedCredentials();
  return saved || DEFAULT_ADMIN_CREDENTIALS;
};