import React, { useEffect, useRef, useState } from 'react';

const About = () => {
  const statsRef = useRef([]);
  const [currentTeamSlide, setCurrentTeamSlide] = useState(0);
  const [currentOfficeImageSlide, setCurrentOfficeImageSlide] = useState(0);

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

  const officeImages = [
    {
      src: "https://www.novareimmobiliare.it/Ufficio1_Interno2.png",
      alt: "Interno sede Malatesta",
      title: "Sede Malatesta - Interno"
    },
    {
      src: "https://www.novareimmobiliare.it/Ufficio2_Interno.png", 
      alt: "Interno sede Torre Maura",
      title: "Sede Torre Maura - Interno"
    },
    {
      src: "https://www.novareimmobiliare.it/Ufficio3_Esterno.png",
      alt: "Esterno sede Ponte di Nona", 
      title: "Sede Ponte di Nona - Esterno"
    },
    {
      src: "https://www.novareimmobiliare.it/Ufficio3_Interno2.png",
      alt: "Interno sede Ponte di Nona",
      title: "Sede Ponte di Nona - Interno"
    }
  ];

  const nextTeamSlide = () => {
    setCurrentTeamSlide((prev) => (prev + 1) % teamMembers.length);
  };
  
  const prevTeamSlide = () => {
    setCurrentTeamSlide((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  const nextOfficeImageSlide = () => {
    setCurrentOfficeImageSlide((prev) => (prev + 1) % officeImages.length);
  };
  
  const prevOfficeImageSlide = () => {
    setCurrentOfficeImageSlide((prev) => (prev - 1 + officeImages.length) % officeImages.length);
  };

  return (
    <section className="section about about-blue" id="chi-siamo">
      <div className="container">
        <h2 className="section-title text-white" style={{textAlign: 'center !important'}}>Chi siamo</h2>
        <p className="section-subtitle text-white" style={{textAlign: 'center'}}>
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
            {/* Carousel Immagini Sedi al posto dell'immagine statica */}
            <div className="about-image-container" style={{position: 'relative'}}>
              <div className="office-images-carousel" style={{
                position: 'relative',
                borderRadius: '1rem',
                overflow: 'hidden',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)',
                height: '400px'
              }}>
                <div style={{
                  display: 'flex',
                  transition: 'transform 0.5s ease',
                  transform: `translateX(-${currentOfficeImageSlide * 100}%)`,
                  height: '100%'
                }}>
                  {officeImages.map((image, index) => (
                    <div key={index} style={{
                      flex: '0 0 100%',
                      height: '100%',
                      position: 'relative'
                    }}>
                      <img 
                        src={image.src} 
                        alt={image.alt}
                        className="about-main-image"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      <div className="image-overlay">
                        <div className="overlay-content">
                          <h4>{image.title}</h4>
                          <p>Roma - Zona Malatesta, Torre Maura, Ponte di Nona</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation arrows */}
                <button 
                  onClick={prevOfficeImageSlide}
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.9)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '35px',
                    height: '35px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    color: 'var(--nova-blue)',
                    zIndex: 10,
                    transition: 'background-color 0.3s ease'
                  }}
                >
                  ‹
                </button>
                
                <button 
                  onClick={nextOfficeImageSlide}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.9)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '35px', 
                    height: '35px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    color: 'var(--nova-blue)',
                    zIndex: 10,
                    transition: 'background-color 0.3s ease'
                  }}
                >
                  ›
                </button>

                {/* Dots navigation */}
                <div style={{
                  position: 'absolute',
                  bottom: '15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: '0.4rem'
                }}>
                  {officeImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentOfficeImageSlide(index)}
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        border: 'none',
                        background: index === currentOfficeImageSlide ? 'white' : 'rgba(255,255,255,0.5)',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease'
                      }}
                    />
                  ))}
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

        {/* Stats - Stile uguale alla AboutPage */}
        <div className="stats-section" style={{marginTop: '4rem'}}>
          <h2 className="section-title text-white" style={{textAlign: 'center', marginBottom: '3rem'}}>I nostri numeri</h2>
          <div className="stats" style={{display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', maxWidth: '1200px', margin: '0 auto'}}>
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="stat-card" 
                ref={el => statsRef.current[index] = el}
                style={{
                  opacity: 1, 
                  transform: 'translateY(0px)', 
                  transition: 'opacity 0.6s, transform 0.6s', 
                  backgroundColor: 'white', 
                  padding: '2rem', 
                  borderRadius: '1rem', 
                  textAlign: 'center', 
                  minWidth: '250px', 
                  flex: '1'
                }}
              >
                <div className="stat-number" style={{
                  fontSize: '3.5rem', 
                  fontWeight: '900', 
                  color: 'rgb(43, 57, 101)', 
                  marginBottom: '1rem', 
                  letterSpacing: '0.02em'
                }}>
                  {stat.number}
                </div>
                <div className="stat-text" style={{
                  color: '#2d3748', 
                  fontSize: '1.1rem', 
                  lineHeight: '1.4', 
                  fontWeight: '600'
                }}>
                  {stat.text.replace('\n', ' ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="team">
          <h2 className="section-title text-white" style={{textAlign: 'center'}}>Il Nostro Team</h2>
          
          {/* Desktop: 3 card in riga */}
          <div className="team-grid team-grid-desktop">
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

          {/* Mobile: Carousel */}
          <div className="team-carousel-mobile">
            <div className="carousel-container" style={{
              transform: `translateX(-${currentTeamSlide * 280}px)`
            }}>
              {teamMembers.map((member, index) => (
                <div key={index} className="carousel-card team-card">
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
            
            {/* Navigation arrows */}
            <button className="carousel-arrows prev" onClick={prevTeamSlide}>
              ‹
            </button>
            <button className="carousel-arrows next" onClick={nextTeamSlide}>
              ›
            </button>
            
            {/* Dots navigation */}
            <div className="carousel-navigation">
              {teamMembers.map((_, index) => (
                <button
                  key={index}
                  className={`nav-dot ${index === currentTeamSlide ? 'active' : ''}`}
                  onClick={() => setCurrentTeamSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>


      </div>
    </section>
  );
};

export default About;