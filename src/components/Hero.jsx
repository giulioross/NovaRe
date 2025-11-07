import React from 'react';

const Hero = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero" id="home">
      <div className="hero-container">
        <h1>Nova RE</h1>
        <p>La tua agenzia immobiliare di fiducia a Roma</p>
        <div className="hero-logo">
          <img 
            src="https://www.novareimmobiliare.it/NovaRe_LogoCircle.png" 
            alt="Nova RE Logo" 
          />
        </div>
        <div className="hero-buttons">
          <a 
            href="#contatti" 
            className="btn btn-primary"
            onClick={(e) => { e.preventDefault(); scrollToSection('contatti'); }}
          >
            Contattaci ora
          </a>
          <a 
            href="#immobili" 
            className="btn"
            onClick={(e) => { e.preventDefault(); scrollToSection('immobili'); }}
          >
            Scopri immobili
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;