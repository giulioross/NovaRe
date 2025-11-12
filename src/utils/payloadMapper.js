/**
 * Converte il payload del form in formato camelCase per il backend
 * @param {Object} propertyData - Dati dal form
 * @returns {Object} Payload in formato camelCase
 */
export function mapPropertyDataToBackend(propertyData) {
  return {
    // Dati base
    title: propertyData.title,
    description: propertyData.description,
    contractType: propertyData.contract,
    propertyType: propertyData.type,
    condition: propertyData.condition,
    
    // Indirizzo completo
    address: propertyData.address?.street,
    city: propertyData.address?.city,
    district: propertyData.address?.district,
    province: propertyData.address?.province,
    postalCode: propertyData.address?.postal_code,
    region: propertyData.address?.region,
    showExactAddress: Boolean(propertyData.address?.show_exact),
    
    // Dimensioni e vani
    commercialSqm: propertyData.size?.commercial_sqm,
    walkableSqm: propertyData.size?.walkable_sqm,
    roomsTotal: propertyData.size?.rooms_total,
    bedrooms: propertyData.size?.bedrooms,
    bathrooms: propertyData.size?.bathrooms,
    ceilingHeight: propertyData.size?.ceilings_height_m,
    
    // Piano e edificio (converti boolean esplicitamente)
    floorLevel: propertyData.floor?.level,
    topFloor: Boolean(propertyData.floor?.top_floor),
    elevator: Boolean(propertyData.floor?.elevator),
    totalFloors: propertyData.building?.floors,
    constructionYear: propertyData.building?.construction_year,
    buildingType: propertyData.building?.type,
    porter: Boolean(propertyData.building?.porter),
    
    // Efficienza energetica
    energyClass: propertyData.energy?.ape_class,
    ipeKwhM2y: propertyData.energy?.ipe_kwh_m2y,
    heatingType: propertyData.energy?.heating?.type,
    heatingGenerator: propertyData.energy?.heating?.generator,
    coolingType: propertyData.energy?.cooling?.type,
    coolingZones: propertyData.energy?.cooling?.zones,
    
    // Finanziarie
    price: propertyData.financials?.price,
    priceCurrency: propertyData.financials?.price_currency,
    hoaFees: propertyData.financials?.hoa_fees_monthly,
    
    // Spazi esterni
    balconies: propertyData.features?.external?.balconies,
    terracesSqm: propertyData.features?.external?.terraces_sqm,
    gardenSqm: propertyData.features?.external?.garden_sqm,
    
    // Parcheggi
    parkingSpots: propertyData.features?.parking?.parking_spot,
    garageSpots: propertyData.features?.parking?.box,
    
    // Comfort e dotazioni (converti esplicitamente a boolean)
    kitchenType: propertyData.features?.kitchen,
    furnished: Boolean(propertyData.features?.furnished),
    airConditioning: Boolean(propertyData.features?.finishings?.includes('aria_condizionata')),
    cellar: Boolean(propertyData.features?.cellar),
    smartHome: Boolean(propertyData.features?.smart_home),
    stepFree: Boolean(propertyData.features?.accessibility?.step_free),
    
    // Dati agente
    agencyName: propertyData.agent?.agency_name,
    agentName: propertyData.agent?.agent_name,
    agentPhone: propertyData.agent?.phone,
    agentEmail: propertyData.agent?.email,
    agentWhatsapp: propertyData.agent?.whatsapp,
    
    // SEO
    seoSlug: propertyData.seo?.slug,
    metaTitle: propertyData.seo?.meta_title,
    metaDescription: propertyData.seo?.meta_description,
    
    // Metadati (converti boolean esplicitamente)
    published: Boolean(propertyData.metadata?.published),
    featured: Boolean(propertyData.metadata?.featured),
    
    // Video e tour virtuali
    videoUrl: propertyData.media?.video_url,
    virtualTourUrl: propertyData.media?.virtual_tour_url,
    
    // Caratteristiche come JSON (per compatibilità)
    features: JSON.stringify({
      finishings: propertyData.features?.finishings,
      exposure: propertyData.features?.exposure,
      kitchen: propertyData.features?.kitchen,
      furnished: propertyData.features?.furnished,
      parking: propertyData.features?.parking,
      external: propertyData.features?.external,
      accessibility: propertyData.features?.accessibility,
      smartHome: propertyData.features?.smart_home,
      cellar: propertyData.features?.cellar
    }),
    
    // Dati edificio come JSON (per compatibilità)
    buildingInfo: JSON.stringify({
      type: propertyData.building?.type,
      floors: propertyData.building?.floors,
      constructionYear: propertyData.building?.construction_year,
      porter: propertyData.building?.porter,
      elevator: propertyData.floor?.elevator
    }),
    
    // Spese condominiali incluse
    hoaFeesIncludes: JSON.stringify(propertyData.financials?.hoa_fees_includes),
    
    // Timestamp (aggiungi sempre per tracking)
    createdAt: propertyData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}