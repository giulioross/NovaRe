import { useState, useEffect } from 'react';
import { propertyService } from '../services/api';

export const useProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProperties = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Caricamento immobili dal backend...');
      const data = await propertyService.getAll();
      
      if (data && data.length > 0) {
        console.log(`✅ Caricati ${data.length} immobili dal backend`);
        setProperties(data);
      } else {
        setProperties([]);
      }
    } catch (err) {
      console.error('❌ Errore nel caricamento degli immobili:', err);
      setError(err.message);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const refetch = () => {
    loadProperties();
  };

  return {
    properties,
    loading,
    error,
    refetch
  };
};

export const useFilteredProperties = (properties, filter) => {
  const [filteredProperties, setFilteredProperties] = useState([]);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredProperties(properties);
    } else {
      const filtered = properties.filter(property => 
        property.tipoContratto?.toLowerCase() === filter
      );
      setFilteredProperties(filtered);
    }
  }, [properties, filter]);

  return filteredProperties;
};