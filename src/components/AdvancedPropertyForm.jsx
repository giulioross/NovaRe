import React, { useState, useCallback } from 'react';
import {
  PROPERTY_TYPES,
  PROPERTY_TYPE_LABELS,
  CONTRACT_TYPES,
  CONTRACT_TYPE_LABELS,
  PROPERTY_CONDITIONS,
  PROPERTY_CONDITION_LABELS,
  ENERGY_CLASSES,
  EXPOSURES,
  EXPOSURE_LABELS,
  PROPERTY_SCHEMA,
  validateProperty
} from '../models/PropertyModel';
import ImageUploader from './ImageUploader';
import '../styles/AdvancedPropertyForm.css';

// Componente FormField stabilizzato (fuori dal render del componente principale)
const FormField = React.memo(({ 
  label, 
  path, 
  type = 'text', 
  required = false, 
  placeholder = '', 
  options = null,
  multiline = false,
  min = null,
  max = null,
  step = null,
  value,
  error,
  onChange
}) => {
  // Assicurati che il valore non sia mai null o undefined
  const safeValue = value === null || value === undefined ? '' : value;
  
  const handleChange = React.useCallback((e) => {
    if (!onChange || typeof onChange !== 'function') {
      console.warn(`FormField '${path}': onChange non è una funzione valida`);
      return;
    }
    
    let newValue = e.target.value;
    
    // Conversioni per tipi specifici
    if (type === 'number') {
      newValue = newValue === '' ? 0 : parseFloat(newValue);
    } else if (type === 'checkbox') {
      newValue = e.target.checked;
    }
    
    onChange(path, newValue);
  }, [onChange, path, type]);

  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ 
        display: 'block', 
        marginBottom: '8px', 
        fontWeight: '600',
        color: required ? '#dc3545' : '#333'
      }}>
        {label} {required && '*'}
      </label>
      
      {options ? (
        <select
          value={safeValue}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '12px',
            border: error ? '2px solid #dc3545' : '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '1rem'
          }}
        >
          <option value="">Seleziona...</option>
          {Object.entries(options).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      ) : multiline ? (
        <textarea
          value={safeValue}
          onChange={handleChange}
          placeholder={placeholder}
          rows={4}
          style={{
            width: '100%',
            padding: '12px',
            border: error ? '2px solid #dc3545' : '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '1rem',
            resize: 'vertical'
          }}
        />
      ) : (
        <input
          type={type}
          value={safeValue}
          onChange={handleChange}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          style={{
            width: '100%',
            padding: '12px',
            border: error ? '2px solid #dc3545' : '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '1rem'
          }}
        />
      )}
      
      {error && (
        <div style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '5px' }}>
          {error}
        </div>
      )}
    </div>
  );
});

/**
 * Form avanzato per creazione/modifica annunci immobiliari
 * Implementa il modello dati professionale completo
 */
const AdvancedPropertyForm = ({ 
  initialData = null, 
  onSubmit, 
  onCancel, 
  isEditing = false 
}) => {
  // Inizializza form data con schema completo
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return { ...PROPERTY_SCHEMA, ...initialData };
    }
    return {
      ...PROPERTY_SCHEMA,
      // Valori default sensati
      contract: CONTRACT_TYPES.SALE,
      type: PROPERTY_TYPES.APARTMENT,
      financials: {
        ...PROPERTY_SCHEMA.financials,
        price_currency: 'EUR'
      },
      address: {
        ...PROPERTY_SCHEMA.address,
        show_exact: true
      },
      building: {
        ...PROPERTY_SCHEMA.building,
        type: 'condominio'
      },
      condition: PROPERTY_CONDITIONS.GOOD,
      energy: {
        ...PROPERTY_SCHEMA.energy,
        ape_class: 'D',
        heating: {
          type: 'autonomo',
          generator: 'caldaia_gas'
        }
      },
      features: {
        ...PROPERTY_SCHEMA.features,
        kitchen: 'abitabile',
        furnished: 'non_arredato',
        finishings: [],
        exposure: []
      },
      financials: {
        ...PROPERTY_SCHEMA.financials,
        hoa_fees_includes: []
      },
      agent: {
        ...PROPERTY_SCHEMA.agent,
        agency_name: 'NovaRe'
      },
      metadata: {
        ...PROPERTY_SCHEMA.metadata,
        published: true // Pubblica automaticamente gli immobili creati dall'admin
      }
    };
  });

  const [currentStep, setCurrentStep] = useState(1); // Step del wizard
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Steps del wizard
  const STEPS = [
    { id: 1, title: 'Dati Base', icon: '🏠' },
    { id: 2, title: 'Localizzazione', icon: '📍' },
    { id: 3, title: 'Caratteristiche', icon: '📏' },
    { id: 4, title: 'Finiture', icon: '✨' },
    { id: 5, title: 'Energia & Impianti', icon: '⚡' },
    { id: 6, title: 'Media', icon: '📷' },
    { id: 7, title: 'Contatti & SEO', icon: '📞' }
  ];

  // Helper per aggiornare campi annidati (memorizzato per evitare re-render)
  const updateNestedField = useCallback((path, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  }, []);

  // Helper per ottenere valore campo annidato (memorizzato per evitare re-render)
  const getNestedValue = useCallback((path) => {
    const keys = path.split('.');
    let current = formData;
    
    for (const key of keys) {
      if (current?.[key] === undefined || current?.[key] === null) {
        // Per array fields, ritorna array vuoto invece di stringa vuota
        if (path.includes('finishings') || path.includes('exposure') || path.includes('plants_conformity') || path.includes('hoa_fees_includes')) {
          return [];
        }
        return '';
      }
      current = current[key];
    }
    
    // Assicurati che non sia mai null o undefined
    if (current === null || current === undefined) {
      // Per array fields, ritorna array vuoto
      if (path.includes('finishings') || path.includes('exposure') || path.includes('plants_conformity') || path.includes('hoa_fees_includes')) {
        return [];
      }
      return '';
    }
    
    return current;
  }, [formData]);



  // Gestore change semplificato (simile al form di contatto che funziona)
  const handleFieldChange = useCallback((path, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  }, []);

  // Render step corrente
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: // Dati Base
        return (
          <div>
            <h3>📝 Dati Base dell'Annuncio</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600',
                color: '#333'
              }}>
                Titolo Annuncio *
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="es. Trilocale con terrazzo in Prati - Roma"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: errors.title ? '2px solid #dc3545' : '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
              {errors.title && (
                <div style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '5px' }}>
                  {errors.title}
                </div>
              )}
            </div>
            
            <div className="form-grid-2" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '20px' 
            }}>
              <FormField
                label="Tipo Contratto"
                path="contract"
                required={true}
                options={CONTRACT_TYPE_LABELS}
                value={getNestedValue('contract')}
                error={errors['contract']}
                onChange={handleFieldChange}
              />
              
              <FormField
                label="Tipologia Immobile"
                path="type"
                required={true}
                options={PROPERTY_TYPE_LABELS}
                value={getNestedValue('type')}
                error={errors['type']}
                onChange={handleFieldChange}
              />
            </div>
            
            <div className="form-grid-2" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '20px' 
            }}>
              <FormField
                label="Prezzo (€)"
                path="financials.price"
                type="number"
                required={true}
                min={0}
                value={getNestedValue('financials.price')}
                error={errors['financials.price']}
                onChange={handleFieldChange}
              />
              
              <FormField
                label="Superficie Commerciale (mq)"
                path="size.commercial_sqm"
                type="number"
                required={true}
                min={1}
                value={getNestedValue('size.commercial_sqm')}
                error={errors['size.commercial_sqm']}
                onChange={handleFieldChange}
              />
            </div>
            
            <div className="form-grid-3" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
              gap: '15px' 
            }}>
              <FormField
                label="Locali Totali"
                path="size.rooms_total"
                type="number"
                required={true}
                min={1}
                value={getNestedValue('size.rooms_total')}
                error={errors['size.rooms_total']}
                onChange={handleFieldChange}
              />
              
              <FormField
                label="Camere da Letto"
                path="size.bedrooms"
                type="number"
                min={0}
                value={getNestedValue('size.bedrooms')}
                error={errors['size.bedrooms']}
                onChange={handleFieldChange}
              />
              
              <FormField
                label="Bagni"
                path="size.bathrooms"
                type="number"
                required={true}
                min={1}
                value={getNestedValue('size.bathrooms')}
                error={errors['size.bathrooms']}
                onChange={handleFieldChange}
              />
            </div>
            
            <FormField
              label="Stato Immobile"
              path="condition"
              options={PROPERTY_CONDITION_LABELS}
              value={getNestedValue('condition')}
              error={errors['condition']}
              onChange={handleFieldChange}
            />
            
            <FormField
              label="Descrizione"
              path="description"
              multiline
              placeholder="Descrizione dettagliata dell'immobile..."
              value={getNestedValue('description')}
              error={errors['description']}
              onChange={handleFieldChange}
            />
          </div>
        );
        
      case 2: // Localizzazione
        return (
          <div>
            <h3>📍 Localizzazione</h3>
            
            <FormField
              label="Indirizzo"
              path="address.street"
              required={true}
              placeholder="Via/Piazza e numero civico"
              value={getNestedValue('address.street')}
              error={errors['address.street']}
              onChange={handleFieldChange}
            />
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '20px' 
            }}>
              <FormField
                label="Quartiere/Zona"
                path="address.district"
                placeholder="es. Prati, Trastevere, Centro Storico"
                value={getNestedValue('address.district')}
                error={errors['address.district']}
                onChange={handleFieldChange}
              />
              
              <FormField
                label="Città"
                path="address.city"
                required={true}
                placeholder="es. Roma"
                value={getNestedValue('address.city')}
                error={errors['address.city']}
                onChange={handleFieldChange}
              />
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
              gap: '15px' 
            }}>
              <FormField
                label="Provincia"
                path="address.province"
                placeholder="es. RM"
                value={getNestedValue('address.province')}
                error={errors['address.province']}
                onChange={handleFieldChange}
              />
              
              <FormField
                label="Regione"
                path="address.region"
                placeholder="es. Lazio"
                value={getNestedValue('address.region')}
                error={errors['address.region']}
                onChange={handleFieldChange}
              />
              
              <FormField
                label="CAP"
                path="address.postal_code"
                placeholder="es. 00192"
                value={getNestedValue('address.postal_code')}
                error={errors['address.postal_code']}
                onChange={handleFieldChange}
              />
            </div>
            
            <div style={{ 
              background: '#f8f9fa', 
              padding: '15px', 
              borderRadius: '8px',
              marginTop: '20px'
            }}>
              <FormField
                label="Mostra indirizzo esatto negli annunci"
                path="address.show_exact"
                type="checkbox"
              />
              <small style={{ color: '#6c757d' }}>
                Se disabilitato, verrà mostrata solo la zona generale
              </small>
            </div>
          </div>
        );
        
      case 3: // Caratteristiche
        return (
          <div>
            <h3>📏 Caratteristiche Immobile</h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '20px' 
            }}>
              <FormField
                label="Piano"
                path="floor.level"
                type="number"
                placeholder="0 = Piano terra, -1 = Seminterrato"
              />
              
              <FormField
                label="Totale piani edificio"
                path="building.floors"
                type="number"
                min={1}
              />
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
              gap: '15px' 
            }}>
              <FormField
                label="Ultimo piano"
                path="floor.top_floor"
                type="checkbox"
              />
              
              <FormField
                label="Ascensore"
                path="floor.elevator"
                type="checkbox"
                value={getNestedValue('floor.elevator')}
                error={errors['floor.elevator']}
                onChange={handleFieldChange}
              />
              
              <FormField
                label="Portineria"
                path="building.porter"
                type="checkbox"
                value={getNestedValue('building.porter')}
                error={errors['building.porter']}
                onChange={handleFieldChange}
              />
            </div>
            
            <FormField
              label="Anno di costruzione"
              path="building.construction_year"
              type="number"
              min={1800}
              value={getNestedValue('building.construction_year')}
              error={errors['building.construction_year']}
              onChange={handleFieldChange}
              max={new Date().getFullYear()}
            />
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '20px' 
            }}>
              <FormField
                label="Superficie calpestabile (mq)"
                path="size.walkable_sqm"
                type="number"
                min={0}
              />
              
              <FormField
                label="Altezza soffitti (m)"
                path="size.ceilings_height_m"
                type="number"
                min={2}
                max={6}
                step={0.1}
                value={getNestedValue('size.ceilings_height_m')}
                error={errors['size.ceilings_height_m']}
                onChange={handleFieldChange}
              />
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', 
              gap: '15px' 
            }}>
              <FormField
                label="Balconi (n.)"
                path="features.external.balconies"
                type="number"
                min={0}
                value={getNestedValue('features.external.balconies')}
                error={errors['features.external.balconies']}
                onChange={handleFieldChange}
              />
              
              <FormField
                label="Terrazzi (mq)"
                path="features.external.terraces_sqm"
                type="number"
                min={0}
                value={getNestedValue('features.external.terraces_sqm')}
                error={errors['features.external.terraces_sqm']}
                onChange={handleFieldChange}
              />
              
              <FormField
                label="Giardino (mq)"
                path="features.external.garden_sqm"
                type="number"
                min={0}
                value={getNestedValue('features.external.garden_sqm')}
                error={errors['features.external.garden_sqm']}
                onChange={handleFieldChange}
              />
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', 
              gap: '15px' 
            }}>
              <FormField
                label="Box auto (n.)"
                path="features.parking.box"
                type="number"
                min={0}
              />
              
              <FormField
                label="Posti auto (n.)"
                path="features.parking.parking_spot"
                type="number"
                min={0}
                value={getNestedValue('features.parking.parking_spot')}
                error={errors['features.parking.parking_spot']}
                onChange={handleFieldChange}
              />
              
              <FormField
                label="Cantina"
                path="features.cellar"
                type="checkbox"
                value={getNestedValue('features.cellar')}
                error={errors['features.cellar']}
                onChange={handleFieldChange}
              />
            </div>
          </div>
        );
        
      case 4: // Finiture
        return (
          <div>
            <h3>✨ Finiture e Comfort</h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '20px' 
            }}>
              <FormField
                label="Tipo Cucina"
                path="features.kitchen"
                options={{
                  'abitabile': 'Abitabile',
                  'angolo_cottura': 'Angolo cottura',
                  'separata': 'Separata'
                }}
                value={getNestedValue('features.kitchen')}
                error={errors['features.kitchen']}
                onChange={handleFieldChange}
              />
              
              <FormField
                label="Arredamento"
                path="features.furnished"
                options={{
                  'non_arredato': 'Non arredato',  
                  'arredato': 'Arredato',
                  'parziale': 'Parzialmente arredato'
                }}
                value={getNestedValue('features.furnished')}
                error={errors['features.furnished']}
                onChange={handleFieldChange}
              />
            </div>
            
            <div style={{ 
              background: '#f8f9fa', 
              padding: '15px', 
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <h4>Finiture (seleziona tutte quelle presenti)</h4>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
                gap: '10px' 
              }}>
                {[
                  { key: 'parquet', label: 'Parquet' },
                  { key: 'marmo', label: 'Marmo' },
                  { key: 'gres', label: 'Gres porcellanato' },
                  { key: 'doppi_vetri', label: 'Doppi vetri' },
                  { key: 'porta_blindata', label: 'Porta blindata' },
                  { key: 'aria_condizionata', label: 'Aria condizionata' }
                ].map(finish => (
                  <label key={finish.key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={(getNestedValue('features.finishings') || []).includes(finish.key)}
                      onChange={(e) => {
                        const current = getNestedValue('features.finishings') || [];
                        if (e.target.checked) {
                          updateNestedField('features.finishings', [...current, finish.key]);
                        } else {
                          updateNestedField('features.finishings', current.filter(f => f !== finish.key));
                        }
                      }}
                    />
                    {finish.label}
                  </label>
                ))}
              </div>
            </div>
            
            <div style={{ 
              background: '#f8f9fa', 
              padding: '15px', 
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <h4>Esposizione (seleziona tutte quelle presenti)</h4>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', 
                gap: '10px' 
              }}>
                {Object.entries(EXPOSURE_LABELS).map(([key, label]) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={(getNestedValue('features.exposure') || []).includes(key)}
                      onChange={(e) => {
                        const current = getNestedValue('features.exposure') || [];
                        if (e.target.checked) {
                          updateNestedField('features.exposure', [...current, key]);
                        } else {
                          updateNestedField('features.exposure', current.filter(f => f !== key));
                        }
                      }}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '20px' 
            }}>
              <FormField
                label="Smart Home / Domotica"
                path="features.smart_home"
                type="checkbox"
                value={getNestedValue('features.smart_home')}
                error={errors['features.smart_home']}
                onChange={handleFieldChange}
              />
              
              <FormField
                label="Senza barriere architettoniche"
                path="features.accessibility.step_free"
                type="checkbox"
                value={getNestedValue('features.accessibility.step_free')}
                error={errors['features.accessibility.step_free']}
                onChange={handleFieldChange}
              />
            </div>
          </div>
        );
        
      case 5: // Energia & Impianti
        return (
          <div>
            <h3>⚡ Energia e Impianti</h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '20px' 
            }}>
              <FormField
                label="Classe Energetica"
                path="energy.ape_class"
                required={true}
                options={ENERGY_CLASSES.reduce((acc, cls) => ({ ...acc, [cls]: cls }), {})}
                value={getNestedValue('energy.ape_class')}
                error={errors['energy.ape_class']}
                onChange={handleFieldChange}
              />
              
              <FormField
                label="IPE (kWh/m²anno)"
                path="energy.ipe_kwh_m2y"
                type="number"
                min={0}
                step={0.1}
                value={getNestedValue('energy.ipe_kwh_m2y')}
                error={errors['energy.ipe_kwh_m2y']}
                onChange={handleFieldChange}
              />
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '20px' 
            }}>
              <FormField
                label="Tipo riscaldamento"
                path="energy.heating.type"
                options={{
                  'autonomo': 'Autonomo',
                  'centralizzato': 'Centralizzato'
                }}
                value={getNestedValue('energy.heating.type')}
                error={errors['energy.heating.type']}
                onChange={handleFieldChange}
              />
              
              <FormField
                label="Generatore di calore"
                path="energy.heating.generator"
                options={{
                  'caldaia_gas': 'Caldaia a gas',
                  'pompa_calore': 'Pompa di calore',
                  'teleriscaldamento': 'Teleriscaldamento'
                }}
                value={getNestedValue('energy.heating.generator')}
                error={errors['energy.heating.generator']}
                onChange={handleFieldChange}
              />
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '20px' 
            }}>
              <FormField
                label="Tipo raffrescamento"
                path="energy.cooling.type"
                options={{
                  '': 'Nessuno',
                  'split': 'Split/Condizionatori',
                  'canalizzato': 'Canalizzato'
                }}
                value={getNestedValue('energy.cooling.type')}
                error={errors['energy.cooling.type']}
                onChange={handleFieldChange}
              />
              
              <FormField
                label="Zone climatizzate"
                path="energy.cooling.zones"
                type="number"
                min={0}
                value={getNestedValue('energy.cooling.zones')}
                error={errors['energy.cooling.zones']}
                onChange={handleFieldChange}
              />
            </div>
            
            <FormField
              label="Spese condominiali mensili (€)"
              path="financials.hoa_fees_monthly"
              type="number"
              min={0}
              value={getNestedValue('financials.hoa_fees_monthly')}
              error={errors['financials.hoa_fees_monthly']}
              onChange={handleFieldChange}
            />
            
            <div style={{ 
              background: '#f8f9fa', 
              padding: '15px', 
              borderRadius: '8px'
            }}>
              <h4>Cosa includono le spese condominiali?</h4>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                gap: '10px' 
              }}>
                {[
                  { key: 'pulizia_scale', label: 'Pulizia scale' },
                  { key: 'ascensore', label: 'Ascensore' },
                  { key: 'portierato', label: 'Portierato' },
                  { key: 'riscaldamento', label: 'Riscaldamento' },
                  { key: 'acqua_calda', label: 'Acqua calda' },
                  { key: 'illuminazione', label: 'Illuminazione comune' }
                ].map(item => (
                  <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={(getNestedValue('financials.hoa_fees_includes') || []).includes(item.key)}
                      onChange={(e) => {
                        const current = getNestedValue('financials.hoa_fees_includes') || [];
                        if (e.target.checked) {
                          updateNestedField('financials.hoa_fees_includes', [...current, item.key]);
                        } else {
                          updateNestedField('financials.hoa_fees_includes', current.filter(f => f !== item.key));
                        }
                      }}
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 6: // Media
        return (
          <div>
            <h3>📷 Foto e Media</h3>
            
            <div style={{ marginBottom: '30px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '10px', 
                fontWeight: '600' 
              }}>
                Foto Immobile *
              </label>
              <ImageUploader
                images={getNestedValue('media.images') || []}
                onImagesChange={(images) => updateNestedField('media.images', images)}
              />
              <small style={{ color: '#6c757d' }}>
                La prima immagine sarà quella di copertina dell'annuncio
              </small>
            </div>
            
            <FormField
              label="URL Video (YouTube, Vimeo, etc.)"
              path="media.video_url"
              placeholder="https://youtu.be/xxxxx"
              value={getNestedValue('media.video_url')}
              error={errors['media.video_url']}
              onChange={handleFieldChange}
            />
            
            <FormField
              label="URL Tour Virtuale 360°"
              path="media.virtual_tour_url"
              placeholder="https://my.matterport.com/show/?m=xxxxx"
              value={getNestedValue('media.virtual_tour_url')}
              error={errors['media.virtual_tour_url']}
              onChange={handleFieldChange}
            />
            
            <div style={{ 
              background: '#e3f2fd', 
              padding: '15px', 
              borderRadius: '8px',
              marginTop: '20px'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>💡 Consigli per le foto</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#424242' }}>
                <li>Usa luce naturale quando possibile</li>
                <li>Tieni la fotocamera orizzontale</li>
                <li>Evita specchi e riflessi</li>
                <li>Ordine logico: esterni → soggiorno → cucina → camere → bagni → pertinenze</li>
                <li>Rimuovi oggetti personali dalle inquadrature</li>
              </ul>
            </div>
          </div>
        );
        
      case 7: // Contatti & SEO
        return (
          <div>
            <h3>📞 Contatti e Pubblicazione</h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '20px' 
            }}>
              <FormField
                label="Nome Agenzia"
                path="agent.agency_name"
                required={true}
                placeholder="es. NovaRe Immobiliare"
                value={getNestedValue('agent.agency_name')}
                error={errors['agent.agency_name']}
                onChange={handleFieldChange}
              />
              
              <FormField
                label="Nome Agente"
                path="agent.agent_name"
                placeholder="es. Mario Rossi"
                value={getNestedValue('agent.agent_name')}
                error={errors['agent.agent_name']}
                onChange={handleFieldChange}
              />
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '20px' 
            }}>
              <FormField
                label="Telefono"
                path="agent.phone"
                required={true}
                placeholder="es. +39 06 123456"
                value={getNestedValue('agent.phone')}
                error={errors['agent.phone']}
                onChange={handleFieldChange}
              />
              
              <FormField
                label="WhatsApp"
                path="agent.whatsapp"
                placeholder="es. +39 345 1234567"
                value={getNestedValue('agent.whatsapp')}
                error={errors['agent.whatsapp']}
                onChange={handleFieldChange}
              />
            </div>
            
            <FormField
              label="Email"
              path="agent.email"
              type="email"
              placeholder="es. info@novaimmobiliare.it"
              value={getNestedValue('agent.email')}
              error={errors['agent.email']}
              onChange={handleFieldChange}
            />
            
            <hr style={{ margin: '30px 0', border: '1px solid #eee' }} />
            
            <h4>🔍 SEO e URL</h4>
            
            <FormField
              label="Slug URL"
              path="seo.slug"
              placeholder="es. vendita-appartamento-trilocale-prati-roma-123mq"
              value={getNestedValue('seo.slug')}
              error={errors['seo.slug']}
              onChange={handleFieldChange}
            />
            
            <FormField
              label="Meta Title (max 60 caratteri)"
              path="seo.meta_title"
              placeholder="es. Trilocale con terrazzo a Prati - 123 mq - Roma | NovaRe"
              value={getNestedValue('seo.meta_title')}
              error={errors['seo.meta_title']}
              onChange={handleFieldChange}
            />
            
            <FormField
              label="Meta Description (max 160 caratteri)"
              path="seo.meta_description"
              multiline
              placeholder="Prati: trilocale ristrutturato con terrazzo, 123 mq, doppia esposizione. Classe energetica D, ascensore, portineria. Prezzo interessante!"
              value={getNestedValue('seo.meta_description')}
              error={errors['seo.meta_description']}
              onChange={handleFieldChange}
            />
            
            <hr style={{ margin: '30px 0', border: '1px solid #eee' }} />
            
            <h4>📋 Pubblicazione</h4>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '20px' 
            }}>
              <FormField
                label="Pubblica immediatamente"
                path="metadata.published"
                type="checkbox"
                value={getNestedValue('metadata.published')}
                error={errors['metadata.published']}
                onChange={handleFieldChange}
              />
              
              <FormField
                label="Annuncio in evidenza"
                path="metadata.featured"
                type="checkbox"
              />
            </div>
            
            <div style={{ 
              background: '#f8f9fa', 
              padding: '15px', 
              borderRadius: '8px',
              marginTop: '20px'
            }}>
              <small style={{ color: '#6c757d' }}>
                <strong>Note legali:</strong> Le informazioni fornite non costituiscono elemento contrattuale. 
                Tutti i dati sono da considerarsi puramente indicativi e dovranno essere verificati in fase di trattativa.
              </small>
            </div>
          </div>
        );
        
      default:
        return <div>Step {currentStep} non trovato</div>;
    }
  };

  // Navigation
  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Validazione
    const validation = validateProperty(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Errore invio form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div key="advanced-property-form" className="advanced-property-form">
      {/* Progress bar */}
      <div style={{ marginBottom: '30px' }}>
        <div className="progress-steps">
          {STEPS.map(step => (
            <div
              key={step.id}
              className="progress-step"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                opacity: step.id === currentStep ? 1 : 0.6,
                cursor: 'pointer'
              }}
              onClick={() => setCurrentStep(step.id)}
            >
              <div className="progress-step-circle" style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: step.id <= currentStep ? 'var(--color-primary)' : '#ddd',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                marginBottom: '5px'
              }}>
                {step.icon}
              </div>
              <small className="progress-step-title" style={{ textAlign: 'center', fontSize: '0.8rem' }}>
                {step.title}
              </small>
            </div>
          ))}
        </div>
        
        <div style={{ 
          width: '100%', 
          height: '4px', 
          background: '#e9ecef', 
          borderRadius: '2px' 
        }}>
          <div style={{
            width: `${(currentStep / STEPS.length) * 100}%`,
            height: '100%',
            background: 'var(--color-primary)',
            borderRadius: '2px',
            transition: 'width 0.3s'
          }} />
        </div>
      </div>

      {/* Form step corrente */}
      <div key={`form-step-${currentStep}`} className="form-step-container">
        {renderCurrentStep()}
      </div>

      {/* Navigation buttons */}
      <div className="navigation-buttons">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="nav-button"
          style={{
            padding: '12px 24px',
            background: currentStep === 1 ? '#ddd' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: currentStep === 1 ? 'not-allowed' : 'pointer'
          }}
        >
          ← Precedente
        </button>

        <button
          onClick={onCancel}
          className="nav-button cancel"
          style={{
            padding: '12px 24px',
            background: 'transparent',
            color: '#6c757d',
            border: '2px solid #6c757d',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Annulla
        </button>

        {currentStep === STEPS.length ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="nav-button primary"
            style={{
              padding: '12px 24px',
              background: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting ? 'Pubblicando...' : (isEditing ? 'Aggiorna Annuncio' : 'Pubblica Annuncio')}
          </button>
        ) : (
          <button
            onClick={nextStep}
            className="nav-button primary"
            style={{
              padding: '12px 24px',
              background: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Successivo →
          </button>
        )}
      </div>
    </div>
  );
};

export default AdvancedPropertyForm;
