import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    scrollToSection('contatti');
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="nav-container">
        <div className="logo">
          <img 
            src="https://www.novareimmobiliare.it/NovaRe_LogoCircle.png" 
            alt="Nova RE Logo"
            onClick={() => scrollToSection('home')}
            style={{ cursor: 'pointer' }}
          />
        </div>
        <ul className="nav-menu">
          <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a></li>
          <li><a href="#chi-siamo" onClick={(e) => { e.preventDefault(); scrollToSection('chi-siamo'); }}>Chi siamo</a></li>
          <li><a href="#servizi" onClick={(e) => { e.preventDefault(); scrollToSection('servizi'); }}>Servizi</a></li>
          <li><a href="#immobili" onClick={(e) => { e.preventDefault(); scrollToSection('immobili'); }}>Immobili</a></li>
          <li><a href="#contatti" onClick={(e) => { e.preventDefault(); scrollToSection('contatti'); }}>Contatti</a></li>
        </ul>
        <button className="contact-btn" onClick={scrollToContact}>
          Contattaci
        </button>
      </div>
    </nav>
  );
};

export default Navbar;