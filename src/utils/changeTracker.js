/**
 * Utility per tracciare le modifiche nei form e creare payload di aggiornamento parziale
 */

/**
 * Confronta due oggetti in modo deep e restituisce solo i campi modificati
 * @param {Object} original - Dati originali
 * @param {Object} current - Dati attuali
 * @param {string} path - Percorso per oggetti nidificati (interno)
 * @returns {Object} - Solo i campi modificati
 */
export function getChangedFields(original, current, path = '') {
  const changes = {};
  
  // Se uno dei due è null/undefined, considera tutto come cambiato
  if (original == null || current == null) {
    return original !== current ? current : {};
  }
  
  // Se sono dello stesso tipo primitivo, confronta direttamente
  if (typeof original !== 'object' || typeof current !== 'object') {
    return original !== current ? current : {};
  }
  
  // Se sono entrambi array
  if (Array.isArray(original) && Array.isArray(current)) {
    // Per gli array, se sono diversi in lunghezza o contenuto, considera tutto l'array come cambiato
    if (JSON.stringify(original) !== JSON.stringify(current)) {
      return current;
    }
    return {};
  }
  
  // Se uno è array e l'altro no, considera come cambiato
  if (Array.isArray(original) !== Array.isArray(current)) {
    return current;
  }
  
  // Per oggetti, controlla ogni proprietà
  const allKeys = new Set([...Object.keys(original), ...Object.keys(current)]);
  
  for (const key of allKeys) {
    const originalValue = original[key];
    const currentValue = current[key];
    
    // Se è un oggetto nidificato, ricorsivamente controlla i cambiamenti
    if (typeof originalValue === 'object' && typeof currentValue === 'object' && 
        originalValue !== null && currentValue !== null &&
        !Array.isArray(originalValue) && !Array.isArray(currentValue)) {
      
      const nestedChanges = getChangedFields(originalValue, currentValue, `${path}${key}.`);
      if (Object.keys(nestedChanges).length > 0) {
        changes[key] = nestedChanges;
      }
    } else {
      // Per valori primitivi, array o quando uno è null
      if (originalValue !== currentValue) {
        changes[key] = currentValue;
      }
    }
  }
  
  return changes;
}

/**
 * Converte un oggetto con modifiche nidificate in un payload flat per l'API
 * @param {Object} changes - Oggetto con modifiche nidificate
 * @param {string} prefix - Prefisso per chiavi flat (interno)
 * @returns {Object} - Payload flat per l'API
 */
export function flattenChanges(changes, prefix = '') {
  const flattened = {};
  
  for (const [key, value] of Object.entries(changes)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      // Ricorsivamente appiattisci oggetti nidificati
      Object.assign(flattened, flattenChanges(value, fullKey));
    } else {
      // Per valori primitivi e array, usa la chiave flat
      flattened[fullKey] = value;
    }
  }
  
  return flattened;
}

/**
 * Crea un payload di aggiornamento ottimizzato con solo i campi modificati
 * @param {Object} originalData - Dati originali del listing
 * @param {Object} currentData - Dati attuali del form
 * @param {boolean} useFlat - Se true, restituisce un oggetto flat, altrimenti nidificato
 * @returns {Object} - Payload per l'aggiornamento parziale
 */
export function createUpdatePayload(originalData, currentData, useFlat = false) {
  console.log('🔍 ChangeTracker - Confronto dati:');
  console.log('📋 Originali:', originalData);
  console.log('📝 Attuali:', currentData);
  
  const changes = getChangedFields(originalData, currentData);
  console.log('📊 Modifiche rilevate:', changes);
  
  if (Object.keys(changes).length === 0) {
    console.log('✅ Nessuna modifica rilevata');
    return {};
  }
  
  const payload = useFlat ? flattenChanges(changes) : changes;
  console.log('📦 Payload finale:', payload);
  
  return payload;
}

/**
 * Hook React per tracciare le modifiche in un form
 * @param {Object} initialData - Dati iniziali del form
 * @returns {Object} - Funzioni e stato per il tracking
 */
export function useChangeTracker(initialData) {
  const [originalData] = React.useState(() => JSON.parse(JSON.stringify(initialData || {})));
  const [hasChanges, setHasChanges] = React.useState(false);
  
  const checkForChanges = React.useCallback((currentData) => {
    const changes = getChangedFields(originalData, currentData);
    const hasChanged = Object.keys(changes).length > 0;
    setHasChanges(hasChanged);
    return { hasChanges: hasChanged, changes };
  }, [originalData]);
  
  const getUpdatePayload = React.useCallback((currentData, useFlat = false) => {
    return createUpdatePayload(originalData, currentData, useFlat);
  }, [originalData]);
  
  const resetTracking = React.useCallback((newOriginalData) => {
    // Aggiorna i dati originali dopo un salvataggio riuscito
    Object.assign(originalData, newOriginalData);
    setHasChanges(false);
  }, [originalData]);
  
  return {
    hasChanges,
    checkForChanges,
    getUpdatePayload,
    resetTracking,
    originalData
  };
}