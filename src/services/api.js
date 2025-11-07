const API_BASE = 'http://localhost:8081/api';

// Servizio per gestire le chiamate API relative agli immobili
export const propertyService = {
  // Recupera tutti gli immobili
  async getAll() {
    try {
      const response = await fetch(`${API_BASE}/immobili`);
      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Errore nel caricamento degli immobili:', error);
      throw error;
    }
  },

  // Recupera un singolo immobile per ID
  async getById(id) {
    try {
      const response = await fetch(`${API_BASE}/immobili/${id}`);
      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Errore nel caricamento dell\'immobile:', error);
      throw error;
    }
  },

  // Filtra immobili per tipo contratto
  async getByType(type) {
    try {
      const properties = await this.getAll();
      return properties.filter(property => 
        property.tipoContratto?.toLowerCase() === type.toLowerCase()
      );
    } catch (error) {
      console.error('Errore nel filtraggio degli immobili:', error);
      throw error;
    }
  }
};

// Servizio per gestire le chiamate API relative ai contatti
export const contactService = {
  // Invia un form di contatto
  async send(formData) {
    try {
      const response = await fetch(`${API_BASE}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Errore nell\'invio del form:', error);
      throw error;
    }
  }
};

// Servizio per testare la connessione al backend
export const healthService = {
  // Testa la connessione al backend
  async check() {
    try {
      const response = await fetch(`${API_BASE}/health`);
      return response.ok;
    } catch (error) {
      console.log('Backend non raggiungibile');
      return false;
    }
  }
};

// Utility functions
export const utils = {
  // Formatta il prezzo in base al tipo di contratto
  formatPrice(price, contractType) {
    if (!price) return 'Prezzo da concordare';
    
    const formattedPrice = price.toLocaleString('it-IT');
    return contractType === 'VENDITA' 
      ? `€${formattedPrice}` 
      : `€${formattedPrice}/mese`;
  },

  // Escape HTML per sicurezza
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  // Normalizza URL immagini
  normalizeImageUrl(url) {
    if (!url) return null; // Ritorna null invece di placeholder esterno
    
    // Se l'URL è già completo, ritornalo così com'è
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Se è un path relativo, aggiungilo al dominio base
    return `https://www.novareimmobiliare.it/${url}`;
  },

  // Smooth scroll verso una sezione
  scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  },

  // Debounce function per ottimizzare le performance
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};