/**
 * Modello dati completo per annunci immobiliari
 * Basato su standard professionali del settore immobiliare italiano
 */

// Enum per tipologie immobile
export const PROPERTY_TYPES = {
  APARTMENT: 'apartment',
  PENTHOUSE: 'penthouse',
  VILLA: 'villa',
  TOWNHOUSE: 'townhouse',
  LOFT: 'loft',
  STUDIO: 'studio',
  TWO_ROOM: 'two_room',
  THREE_ROOM: 'three_room',
  FOUR_ROOM: 'four_room',
  OFFICE: 'office',
  SHOP: 'shop',
  WAREHOUSE: 'warehouse',
  LAND: 'land',
  GARAGE: 'garage',
  BOX: 'box'
};

export const PROPERTY_TYPE_LABELS = {
  [PROPERTY_TYPES.APARTMENT]: 'Appartamento',
  [PROPERTY_TYPES.PENTHOUSE]: 'Attico',
  [PROPERTY_TYPES.VILLA]: 'Villa',
  [PROPERTY_TYPES.TOWNHOUSE]: 'Villino',
  [PROPERTY_TYPES.LOFT]: 'Loft',
  [PROPERTY_TYPES.STUDIO]: 'Monolocale',
  [PROPERTY_TYPES.TWO_ROOM]: 'Bilocale',
  [PROPERTY_TYPES.THREE_ROOM]: 'Trilocale',
  [PROPERTY_TYPES.FOUR_ROOM]: 'Quadrilocale',
  [PROPERTY_TYPES.OFFICE]: 'Ufficio',
  [PROPERTY_TYPES.SHOP]: 'Negozio',
  [PROPERTY_TYPES.WAREHOUSE]: 'Capannone',
  [PROPERTY_TYPES.LAND]: 'Terreno',
  [PROPERTY_TYPES.GARAGE]: 'Garage',
  [PROPERTY_TYPES.BOX]: 'Box'
};

// Enum per contratti
export const CONTRACT_TYPES = {
  SALE: 'sale',
  RENT: 'rent',
  SHORT_RENT: 'short_rent'
};

export const CONTRACT_TYPE_LABELS = {
  [CONTRACT_TYPES.SALE]: 'Vendita',
  [CONTRACT_TYPES.RENT]: 'Affitto',
  [CONTRACT_TYPES.SHORT_RENT]: 'Affitto Breve'
};

// Enum per stato immobile
export const PROPERTY_CONDITIONS = {
  NEW: 'new',
  RENOVATED: 'renovated',
  EXCELLENT: 'excellent',
  GOOD: 'good',
  TO_RENOVATE: 'to_renovate'
};

export const PROPERTY_CONDITION_LABELS = {
  [PROPERTY_CONDITIONS.NEW]: 'Nuovo',
  [PROPERTY_CONDITIONS.RENOVATED]: 'Ristrutturato',
  [PROPERTY_CONDITIONS.EXCELLENT]: 'Ottimo',
  [PROPERTY_CONDITIONS.GOOD]: 'Buono',
  [PROPERTY_CONDITIONS.TO_RENOVATE]: 'Da Ristrutturare'
};

// Classi energetiche
export const ENERGY_CLASSES = ['A4', 'A3', 'A2', 'A1', 'B', 'C', 'D', 'E', 'F', 'G'];

// Enum per esposizioni
export const EXPOSURES = {
  NORTH: 'north',
  SOUTH: 'south',
  EAST: 'east',
  WEST: 'west',
  DOUBLE: 'double',
  TRIPLE: 'triple'
};

export const EXPOSURE_LABELS = {
  [EXPOSURES.NORTH]: 'Nord',
  [EXPOSURES.SOUTH]: 'Sud',
  [EXPOSURES.EAST]: 'Est',
  [EXPOSURES.WEST]: 'Ovest',
  [EXPOSURES.DOUBLE]: 'Doppia',
  [EXPOSURES.TRIPLE]: 'Tripla'
};

/**
 * Schema completo per annuncio immobiliare
 */
export const PROPERTY_SCHEMA = {
  // Dati base obbligatori
  id: '', // ID interno annuncio
  title: '', // max 70 caratteri
  contract: '', // sale|rent|short_rent
  type: '', // apartment|villa|office etc.
  subtype: '', // trilocale, quadrilocale, etc.
  
  // Indirizzo e localizzazione
  address: {
    street: '', // Via/Piazza + numero civico
    district: '', // Quartiere/Zona
    city: '', // Comune
    province: '', // Provincia (RM, MI, etc.)
    region: '', // Regione
    postal_code: '', // CAP
    show_exact: true, // Mostra indirizzo esatto o solo zona
    geo: { // Geolocalizzazione
      lat: null,
      lng: null
    }
  },
  
  // Dati finanziari
  financials: {
    price: 0, // Prezzo vendita o canone mensile
    price_currency: 'EUR',
    hoa_fees_monthly: 0, // Spese condominiali mensili
    hoa_fees_includes: [], // Array di cosa includono le spese
    tax_notes: '', // Note su IVA, imposte, etc.
    deposit_months: 0, // Solo per affitti - cauzione in mensilità
    cedolare_secca: false, // Solo per affitti
    expenses_included: false // Spese incluse nel canone
  },
  
  // Dimensioni e layout
  size: {
    commercial_sqm: 0, // Superficie commerciale
    walkable_sqm: 0, // Superficie calpestabile
    rooms_total: 0, // Totale locali
    bedrooms: 0, // Camere da letto
    bathrooms: 0, // Bagni
    ceilings_height_m: 0 // Altezza soffitti
  },
  
  // Piano e edificio
  floor: {
    level: 0, // Piano (0=terra, -1=seminterrato)
    level_label: '', // "Piano terra", "Primo piano", etc.
    top_floor: false, // Ultimo piano
    elevator: false // Ascensore presente
  },
  
  // Edificio
  building: {
    type: '', // condominio|palazzina|villa
    floors: 0, // Numero piani edificio
    construction_year: null, // Anno costruzione
    porter: false, // Portineria
    accessibility: false // Senza barriere architettoniche
  },
  
  // Stato e disponibilità
  condition: '', // new|renovated|excellent|good|to_renovate
  availability: {
    status: '', // libero|occupato|locato
    date: null // Data disponibilità
  },
  
  // Efficienza energetica
  energy: {
    ape_class: '', // A4, A3, A2, A1, B, C, D, E, F, G
    ipe_kwh_m2y: null, // Indice prestazione energetica
    heating: {
      type: '', // autonomo|centralizzato
      generator: '' // caldaia_gas|pompa_calore|teleriscaldamento
    },
    cooling: {
      type: '', // split|canalizzato|nessuno
      zones: 0 // Numero zone climatizzate
    }
  },
  
  // Caratteristiche interne/esterne
  features: {
    // Interni
    kitchen: '', // abitabile|angolo_cottura|separata
    finishings: [], // Array: parquet|marmo|gres|doppi_vetri|porta_blindata
    furnished: '', // arredato|non_arredato|parziale
    exposure: [], // Array: north|south|east|west
    smart_home: false,
    
    // Esterni
    external: {
      balconies: 0, // Numero balconi
      terraces_sqm: 0, // Superficie terrazzi
      garden_sqm: 0 // Superficie giardino
    },
    
    // Pertinenze
    parking: {
      box: 0, // Numero box
      parking_spot: 0, // Posti auto
      motorbike: 0 // Posti moto
    },
    cellar: false, // Cantina
    attic: false, // Soffitta
    
    // Accessibilità
    accessibility: {
      step_free: false, // Senza barriere
      door_width_ok: false // Larghezza porte a norma
    }
  },
  
  // Conformità e documenti
  compliance: {
    urban_planning: '', // conforme|non_conforme|in_corso
    habitability: '', // presente|non_presente|in_corso
    plants_conformity: [], // Array: elettrico|gas|idraulico
    cadastral: {
      category: '', // A/2, A/3, etc.
      rendita: 0 // Rendita catastale
    },
    provenance: '' // compravendita|successione|nuova_costruzione
  },
  
  // Specifici per affitto
  rental: {
    contract_type: '', // 4+4|3+2|transitorio|studenti
    min_term_months: 0, // Durata minima mesi
    pet_policy: false, // Animali ammessi
    guarantees_required: [] // Array: busta_paga|fideiussione|garante
  },
  
  // Media
  media: {
    cover_image: '', // URL immagine copertina
    images: [], // Array URL immagini
    floorplans: [], // Array URL planimetrie
    video_url: '', // URL video
    virtual_tour_url: '' // URL tour virtuale
  },
  
  // Descrizione
  description: '', // Testo lungo strutturato
  
  // Contesto e vicinanze
  nearby: {
    transport: [], // Array: "Metro A - Lepanto 400m"
    services: [], // Array: "supermercato 200m"
    poi: [] // Array: punti interesse
  },
  
  // Agente
  agent: {
    agency_name: '',
    agent_name: '',
    phone: '',
    whatsapp: '',
    email: ''
  },
  
  // SEO
  seo: {
    slug: '', // URL-friendly
    meta_title: '',
    meta_description: ''
  },
  
  // Metadati
  metadata: {
    created_at: null,
    updated_at: null,
    published: false,
    featured: false,
    views: 0
  },
  
  // Note legali
  notes_legal: 'Le informazioni non costituiscono elemento contrattuale.'
};

/**
 * Funzione di validazione del modello
 */
export const validateProperty = (property) => {
  const errors = {};
  
  // Campi obbligatori
  if (!property.title?.trim()) {
    errors.title = 'Titolo obbligatorio';
  } else if (property.title.length > 70) {
    errors.title = 'Titolo massimo 70 caratteri';
  }
  
  if (!property.contract) {
    errors.contract = 'Tipo contratto obbligatorio';
  }
  
  if (!property.type) {
    errors.type = 'Tipologia immobile obbligatoria';
  }
  
  if (!property.address?.city?.trim()) {
    errors['address.city'] = 'Città obbligatoria';
  }
  
  if (!property.financials?.price || property.financials.price <= 0) {
    errors['financials.price'] = 'Prezzo obbligatorio e maggiore di 0';
  }
  
  if (!property.size?.commercial_sqm || property.size.commercial_sqm <= 0) {
    errors['size.commercial_sqm'] = 'Superficie obbligatoria e maggiore di 0';
  }
  
  if (!property.size?.rooms_total || property.size.rooms_total <= 0) {
    errors['size.rooms_total'] = 'Numero locali obbligatorio';
  }
  
  if (!property.size?.bathrooms || property.size.bathrooms <= 0) {
    errors['size.bathrooms'] = 'Numero bagni obbligatorio';
  }
  
  if (!property.energy?.ape_class) {
    errors['energy.ape_class'] = 'Classe energetica obbligatoria';
  }
  
  if (!property.agent?.agency_name?.trim()) {
    errors['agent.agency_name'] = 'Nome agenzia obbligatorio';
  }
  
  if (!property.agent?.phone?.trim()) {
    errors['agent.phone'] = 'Telefono agente obbligatorio';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};