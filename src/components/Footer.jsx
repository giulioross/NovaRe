import React from 'react';

const Footer = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="logo" style={{ marginBottom: '20px' }}>
              <img 
                src="https://www.novareimmobiliare.it/NovaRe_LogoCircle.png" 
                alt="Nova RE Logo" 
                style={{ height: '60px' }}
              />
            </div>
            <p>
              La tua agenzia immobiliare di fiducia a Roma. 
              Professionalità, trasparenza e risultati garantiti.
            </p>
          </div>
          
          <div className="footer-section">
            <h3>Link utili</h3>
            <ul>
              <li>
                <a 
                  href="#home"
                  onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="#chi-siamo"
                  onClick={(e) => { e.preventDefault(); scrollToSection('chi-siamo'); }}
                >
                  Chi siamo
                </a>
              </li>
              <li>
                <a 
                  href="#servizi"
                  onClick={(e) => { e.preventDefault(); scrollToSection('servizi'); }}
                >
                  Servizi
                </a>
              </li>
              <li>
                <a 
                  href="#immobili"
                  onClick={(e) => { e.preventDefault(); scrollToSection('immobili'); }}
                >
                  Immobili
                </a>
              </li>
              <li>
                <a 
                  href="#contatti"
                  onClick={(e) => { e.preventDefault(); scrollToSection('contatti'); }}
                >
                  Contatti
                </a>
              </li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>I nostri servizi</h3>
            <ul>
              <li>Vendita immobili</li>
              <li>Affitti e locazioni</li>
              <li>Investimenti immobiliari</li>
              <li>Valutazioni e perizie</li>
              <li>Consulenza specializzata</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Contatti</h3>
            <ul>
              <li>📞 +39 345 345 4186</li>
              <li>✉️ info@novareimmobiliare.it</li>
              <li>📍 Roma, Italia</li>
              <li>🌐 www.novareimmobiliare.it</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 Nova RE. Tutti i diritti riservati. | P.IVA: 17332741002</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;