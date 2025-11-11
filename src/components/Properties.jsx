import React from 'react';
import { Link } from 'react-router-dom';

const Properties = () => {
  return (
    <section className="section properties properties-blue" id="immobili">
      <div className="container">
        <h2 className="section-title text-white">Immobili in evidenza</h2>
        <p className="section-subtitle text-white">
          Scopri la nostra selezione di immobili di prestigio a Roma. 
          Ogni proprietà è selezionata per qualità, posizione e valore.
        </p>
        
        {/* Bottoni per navigare agli immobili */}
        <div className="properties-buttons">
          <Link
            to="/immobili"
            className="property-btn primary"
          >
            🏠 Tutti gli Immobili
          </Link>
          
          <Link
            to="/immobili?type=vendita"
            className="property-btn secondary"
          >
            💰 Immobili in Vendita
          </Link>
          
                    <Link
            to="/immobili?type=affitto"
            className="property-btn secondary"
          >
            � Immobili in Affitto
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Properties;
