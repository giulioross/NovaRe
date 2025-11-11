import React, { useEffect, useRef } from 'react';

const About = () => {
  const statsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    statsRef.current.forEach(el => {
      if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  const teamMembers = [
    {
      name: "Sharon Abate",
      role: "Amministratore delegato",
      phone: "+39 345 345 4186",
      image: "https://www.novareimmobiliare.it/Sharon2.png"
    },
    {
      name: "Sara Incipini",
      role: "Coordinatrice delle sedi di Malatesta e Torre Maura",
      phone: "+39 328 593 8181",
      image: "https://www.novareimmobiliare.it/SaraPC.png"
    },
    {
      name: "Chiara Turco",
      role: "Coordinatrice della sede di Ponte di Nona",
      phone: "+39 389 961 5663",
      image: "https://www.novareimmobiliare.it/Chiara2.png"
    }
  ];

  const stats = [
    { number: "15+", text: "Anni di esperienza\nnel settore immobiliare" },
    { number: "500+", text: "Clienti soddisfatti\ne proprietà vendute" },
    { number: "3", text: "Sedi operative\na Roma e provincia" },
    { number: "24/7", text: "Assistenza clienti\ne consulenza gratuita" }
  ];

  return (
    <section className="section about about-blue" id="chi-siamo">
      <div className="container">
        <h2 className="section-title">Chi siamo</h2>
        <p className="section-subtitle">
          Nova RE nasce dalla volontà di innovare il settore immobiliare, 
          integrando digitalizzazione, trasparenza, empatia ed esperienza.
        </p>
        
        <div className="about-content">
          <div className="about-text">
            <div className="about-highlight">
              <h3>MISSION & VISION</h3>
              <div className="highlight-bar"></div>
            </div>
            
            <div className="about-description">
              <p>
                <strong>Nova RE</strong> nasce dalla volontà di innovare il settore immobiliare, 
                integrando <em>digitalizzazione, trasparenza, empatia ed esperienza</em>. 
                Il nostro obiettivo è rendere il processo di compravendita e affitto 
                <strong> semplice, veloce e trasparente</strong>, mettendo sempre il cliente al centro.
              </p>
              
              <p>
                Ci distinguiamo per l'utilizzo di <strong>tecnologie all'avanguardia</strong> 
                e per consulenze gratuite con assistenza continua. Grazie a un 
                <strong> team esperto e qualificato</strong>, garantiamo 
                <strong> risultati concreti</strong> e un servizio personalizzato.
              </p>
              
              <div className="about-quote">
                <div className="quote-icon">"</div>
                <div className="quote-text">
                  In Nova RE crediamo in un futuro immobiliare costruito sulla fiducia, 
                  sull'ascolto e su relazioni autentiche. Un futuro in cui ogni cliente 
                  viene guidato, non semplicemente gestito.
                </div>
              </div>

              <div className="about-features">
                <div className="feature-item">
                  <div className="feature-icon">🏆</div>
                  <div className="feature-text">
                    <strong>Esperienza consolidata</strong>
                    <span>Oltre 15 anni nel settore immobiliare romano</span>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">💼</div>
                  <div className="feature-text">
                    <strong>Consulenza professionale</strong>
                    <span>Team di esperti qualificati e certificati</span>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🤝</div>
                  <div className="feature-text">
                    <strong>Trasparenza totale</strong>
                    <span>Processo chiaro e onesto in ogni fase</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="about-visual">
            <div className="about-image-container">
              <img 
                src="https://www.novareimmobiliare.it/Ufficio1_Esterno.png" 
                alt="Sede Nova RE - Ufficio esterno" 
                className="about-main-image"
              />
              <div className="image-overlay">
                <div className="overlay-content">
                  <h4>La nostra sede</h4>
                  <p>Roma - Zona Malatesta</p>
                </div>
              </div>
            </div>
            
            <div className="about-highlights">
              <div className="highlight-item">
                <div className="highlight-number">15+</div>
                <div className="highlight-label">Anni di esperienza</div>
              </div>
              <div className="highlight-item">
                <div className="highlight-number">3</div>
                <div className="highlight-label">Sedi operative</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="stat-card" 
              ref={el => statsRef.current[index] = el}
            >
              <div className="stat-number">{stat.number}</div>
              <div className="stat-text">{stat.text}</div>
            </div>
          ))}
        </div>

        {/* Team */}
        <div className="team">
          <h2 className="section-title">Il Nostro Team</h2>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="team-card"
                ref={el => statsRef.current[stats.length + index] = el}
              >
                <div className="team-photo">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="team-info">
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p className="team-contact">📞 {member.phone}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;