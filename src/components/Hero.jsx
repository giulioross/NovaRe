import React from "react";
import "./Hero.css"; // <— importa lo stylesheet qui

const Hero = () => {
  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero" id="home" aria-label="Nova RE Hero">
      {/* overlay scuro/vignettatura */}
      <div className="hero__overlay" />

      {/* card effetto vetro */}
      <div className="glass" role="img" aria-label="Logo Nova RE su vetro">
        <img
          className="glass__logo"
          src="https://www.novareimmobiliare.it/novaRe_logoConScrittaVector.png"
          alt="Nova RE - Gruppo Immobiliare"
        />

        {/* cornici decorative */}
        <span className="corner tl" />
        <span className="corner tr" />
        <span className="corner bl" />
        <span className="corner br" />
      </div>

      {/* bottoni sotto la card */}
      <div className="hero-actions" aria-label="Azioni principali" style={{left: "auto"}}>
        <button
          className="hero-action-btn primary"
          onClick={() => scrollToSection("contatti")}
        >
          Contattaci ora
        </button>
        <button
          className="hero-action-btn secondary"
          onClick={() => scrollToSection("immobili")}
        >
          Scopri immobili
        </button>
      </div>
    </section>
  );
};

export default Hero;