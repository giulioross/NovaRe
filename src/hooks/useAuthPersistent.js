import { useState, useEffect, useCallback } from 'react';

const AUTH_KEY = 'novaRe_unified_auth';
const AUTH_EXPIRY_HOURS = 24; // 24 ore di sessione

/**
 * Hook unificato per gestire l'autenticazione con persistenza
 * Combina i due sistemi esistenti in uno unico e robusto
 */
export const useAuthPersistent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Funzione per salvare i dati di autenticazione
  const saveAuthData = useCallback((userData) => {
    const authData = {
      user: userData,
      timestamp: Date.now(),
      expires: Date.now() + (AUTH_EXPIRY_HOURS * 60 * 60 * 1000)
    };
    
    localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
    
    // Salva anche nei formati legacy per compatibilità
    localStorage.setItem('companyAuth', 'true');
    localStorage.setItem('companyUserInfo', JSON.stringify(userData));
    
    console.log('💾 Dati autenticazione salvati:', authData);
    return authData;
  }, []);

  // Funzione per caricare i dati di autenticazione
  const loadAuthData = useCallback(() => {
    try {
      const authData = localStorage.getItem(AUTH_KEY);
      if (!authData) {
        console.log('🔍 Nessun dato di autenticazione trovato');
        return null;
      }

      const parsed = JSON.parse(authData);
      
      // Verifica se la sessione è scaduta
      if (parsed.expires && parsed.expires < Date.now()) {
        console.log('⏰ Sessione scaduta, rimuovo i dati');
        clearAuthData();
        return null;
      }

      console.log('✅ Dati autenticazione caricati:', parsed);
      return parsed;
      
    } catch (error) {
      console.error('❌ Errore nel caricamento dati auth:', error);
      clearAuthData();
      return null;
    }
  }, []);

  // Funzione per pulire i dati di autenticazione
  const clearAuthData = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem('companyAuth');
    localStorage.removeItem('companyUserInfo');
    localStorage.removeItem('registeredUsers');
    console.log('🧹 Dati autenticazione rimossi');
  }, []);

  // Carica i dati all'inizializzazione
  useEffect(() => {
    console.log('🔄 Inizializzazione hook autenticazione...');
    
    const authData = loadAuthData();
    if (authData && authData.user) {
      setUser(authData.user);
      setIsAuthenticated(true);
      console.log('✅ Utente riconnesso automaticamente:', authData.user.username);
    } else {
      console.log('❌ Nessuna sessione valida trovata');
    }
    
    setLoading(false);
  }, [loadAuthData]);

  // Funzione di login
  const login = useCallback(async (username, password, companyCode) => {
    try {
      console.log('🔐 Tentativo login:', { username });
      
      // Verifica credenziali admin
      if (username === 'admin' && password === 'ddd' && 
          (companyCode === 'NOVARE2025' || companyCode === 'NUOVARE-SECRET-2025')) {
        
        const userData = {
          id: 'admin-001',
          username,
          companyCode,
          fullName: 'Amministratore NovaRe',
          email: 'admin@novare.com',
          role: 'admin',
          permissions: {
            create: true,
            edit: true,
            delete: true,
            publish: true,
            viewAll: true,
            adminPanel: true
          },
          loginTime: new Date().toISOString()
        };

        // Salva i dati
        saveAuthData(userData);
        setUser(userData);
        setIsAuthenticated(true);
        
        console.log('✅ Login admin riuscito');
        return { success: true, user: userData };
      }

      // Qui potresti aggiungere altre verifiche per utenti registrati
      // const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      // ... verifica user registrati

      console.log('❌ Credenziali non valide');
      return { success: false, error: 'Credenziali non valide' };
      
    } catch (error) {
      console.error('❌ Errore durante login:', error);
      return { success: false, error: 'Errore durante l\'autenticazione' };
    }
  }, [saveAuthData]);

  // Funzione di logout
  const logout = useCallback(() => {
    console.log('🚪 Logout utente:', user?.username);
    clearAuthData();
    setUser(null);
    setIsAuthenticated(false);
  }, [user, clearAuthData]);

  // Funzione per verificare permessi
  const hasPermission = useCallback((permission) => {
    return user?.permissions?.[permission] === true;
  }, [user]);

  // Funzione per estendere la sessione
  const extendSession = useCallback(() => {
    if (isAuthenticated && user) {
      console.log('⏰ Estensione sessione per:', user.username);
      saveAuthData(user);
    }
  }, [isAuthenticated, user, saveAuthData]);

  // Auto-estendi sessione ogni 30 minuti se l'utente è attivo
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      extendSession();
    }, 30 * 60 * 1000); // 30 minuti

    return () => clearInterval(interval);
  }, [isAuthenticated, extendSession]);

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    hasPermission,
    extendSession
  };
};

export default useAuthPersistent;