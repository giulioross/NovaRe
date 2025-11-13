
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import './AboutPage.css';

const AboutPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPartnerSlide, setCurrentPartnerSlide] = useState(0);
  const [currentOfficeImageSlide, setCurrentOfficeImageSlide] = useState(0);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
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
  
  const partners = [
    {
      name: "EUROANSA",
      description: "SOCIETÀ DI MEDIAZIONE CREDITIZIA",
      image: "https://www.novareimmobiliare.it/Euroansa.jpg"
    },
    {
      name: "KIRON",
      description: "SOCIETÀ DI MEDIAZIONE CREDITIZIA", 
      image: "https://www.novareimmobiliare.it/Kiron.jpg"
    },
    {
      name: "AVVERA",
      description: "SOCIETÀ DI CREDITO",
      image: "https://www.novareimmobiliare.it/Avvera.webp"
    },
    {
      name: "REA COMPANY",
      description: "AGENZIA DI MARKETING",
      image: "https://www.novareimmobiliare.it/Rea_Company.png"
    }
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
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % teamMembers.length);
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };
  
  const nextPartnerSlide = () => {
    setCurrentPartnerSlide((prev) => (prev + 1) % partners.length);
  };
  
  const prevPartnerSlide = () => {
    setCurrentPartnerSlide((prev) => (prev - 1 + partners.length) % partners.length);
  };

  const nextOfficeImageSlide = () => {
    setCurrentOfficeImageSlide((prev) => (prev + 1) % officeImages.length);
  };
  
  const prevOfficeImageSlide = () => {
    setCurrentOfficeImageSlide((prev) => (prev - 1 + officeImages.length) % officeImages.length);
  };
  return (
    <div className="page-container" style={{backgroundColor: 'rgb(43, 57, 101)'}}>
      <Navbar />

      {/* Hero Section */}
      <section className="about-hero section--dark" style={{backgroundColor: 'rgb(43, 57, 101)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px'}}>
        <div className="container" style={{textAlign: 'center', maxWidth: '900px', margin: '0 auto', padding: '0 2rem'}}>
          <h1 className="display text-invert" style={{fontSize: '4rem', marginBottom: '2.5rem', color: 'white', fontWeight: 'bold', lineHeight: '1.2'}}>
            Chi siamo</h1>
          <p className="lead" style={{fontSize: '1.35rem', lineHeight: '1.7', marginBottom: '2rem', color: '#e5e7eb', maxWidth: '700px', margin: '0 auto 2rem auto'}}>
            Nova RE nasce dalla volontà di innovare il settore immobiliare, integrando digitalizzazione, trasparenza, empatia ed esperienza. Il nostro obiettivo è rendere il processo di compravendita e affitto semplice, veloce e trasparente, mettendo sempre il cliente al centro.
          </p>
          <p className="lead" style={{fontSize: '1.35rem', lineHeight: '1.7', color: '#e5e7eb', maxWidth: '700px', margin: '0 auto'}}>
            Ci distinguiamo per l'utilizzo di nuove forme di comunicazione accessibili e per consulenze gratuite con assistenza continua. Grazie a un team esperto e qualificato, garantiamo risultati concreti e un servizio su misura.
          </p>
        </div>
      </section>

      {/* Mission & Vision con Carousel Uffici */}
      <section className="values section--dark" style={{backgroundColor: 'rgb(43, 57, 101)', padding: '1.5rem 0'}}>
        <div className="container">
          <h2 className="section-title text-invert" style={{color: 'white', textAlign: 'center', marginBottom: '2rem'}}>I nostri valori</h2>
          
          <div className="values-grid-responsive" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', maxWidth: '1200px', margin: '0 auto', alignItems: 'center'}}>
            
            {/* Colonna sinistra: Mission & Vision */}
            <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
              <article className="value-card" style={{backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'}}>
                <h3 style={{color: '#1f2937', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'bold'}}>La nostra missione</h3>
                <p style={{color: '#4b5563', lineHeight: '1.6', fontSize: '1rem'}}>
                  Nova RE nasce dalla volontà di innovare il settore immobiliare, integrando digitalizzazione, trasparenza, empatia ed esperienza. Il nostro obiettivo è rendere il processo di compravendita e affitto semplice, veloce e trasparente, mettendo sempre il cliente al centro.
                </p>
              </article>
              
              <article className="value-card" style={{backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'}}>
                <h3 style={{color: '#1f2937', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'bold'}}>La nostra visione</h3>
                <p style={{color: '#4b5563', lineHeight: '1.6', fontSize: '1rem'}}>
                  Ci distinguiamo per l'utilizzo di tecnologie all'avanguardia e per consulenze gratuite con assistenza continua. Grazie a un team esperto e qualificato, garantiamo risultati concreti e un servizio personalizzato.
                </p>
              </article>
            </div>

            {/* Colonna destra: Carousel Uffici */}
            <div className="office-carousel-container" style={{position: 'relative'}}>
              <div style={{textAlign: 'center', marginBottom: '1.5rem'}}>
                <h3 style={{color: 'white', fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>Le nostre sedi</h3>
                <p style={{color: '#e5e7eb', fontSize: '1rem'}}>Roma - Zone Malatesta, Torre Maura, Ponte di Nona</p>
              </div>
              
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
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                        color: 'white',
                        padding: '1rem',
                        textAlign: 'center'
                      }}>
                        <h4 style={{margin: 0, fontSize: '1.1rem', fontWeight: '600'}}>{image.title}</h4>
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
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    color: 'rgb(43, 57, 101)',
                    zIndex: 10,
                    transition: 'background-color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'white'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.9)'}
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
                    width: '40px', 
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    color: 'rgb(43, 57, 101)',
                    zIndex: 10,
                    transition: 'background-color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'white'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.9)'}
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
                  gap: '0.5rem'
                }}>
                  {officeImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentOfficeImageSlide(index)}
                      style={{
                        width: '10px',
                        height: '10px',
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
          </div>
        </div>
      </section>

      {/* I nostri numeri: 4 card in riga */}
      <section className="numbers section--dark" style={{backgroundColor: 'rgb(43, 57, 101)', paddingTop: '2.5rem', paddingBottom: '1.5rem'}}>
        <div className="container">
          <h2 className="section-title text-invert" style={{color: 'white', textAlign: 'center', marginBottom: '3rem'}}>I nostri numeri</h2>
          <div className="stats" style={{display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', maxWidth: '1200px', margin: '0 auto'}}>
            <div className="stat-card" style={{opacity: 1, transform: 'translateY(0px)', transition: 'opacity 0.6s, transform 0.6s', backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', textAlign: 'center', minWidth: '250px', flex: '1'}}>
              <div className="stat-number" style={{fontSize: '3.5rem', fontWeight: '900', color: 'rgb(43, 57, 101)', marginBottom: '1rem', letterSpacing: '0.02em'}}>15+</div>
              <div className="stat-text" style={{color: '#2d3748', fontSize: '1.1rem', lineHeight: '1.4', fontWeight: '600'}}>Anni di esperienza<br/>nel settore immobiliare</div>
            </div>
            <div className="stat-card" style={{opacity: 1, transform: 'translateY(0px)', transition: 'opacity 0.6s, transform 0.6s', backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', textAlign: 'center', minWidth: '250px', flex: '1'}}>
              <div className="stat-number" style={{fontSize: '3.5rem', fontWeight: '900', color: 'rgb(43, 57, 101)', marginBottom: '1rem', letterSpacing: '0.02em'}}>500+</div>
              <div className="stat-text" style={{color: '#2d3748', fontSize: '1.1rem', lineHeight: '1.4', fontWeight: '600'}}>Clienti soddisfatti<br/>e proprietà vendute</div>
            </div>
            <div className="stat-card" style={{opacity: 1, transform: 'translateY(0px)', transition: 'opacity 0.6s, transform 0.6s', backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', textAlign: 'center', minWidth: '250px', flex: '1'}}>
              <div className="stat-number" style={{fontSize: '3.5rem', fontWeight: '900', color: 'rgb(43, 57, 101)', marginBottom: '1rem', letterSpacing: '0.02em'}}>3</div>
              <div className="stat-text" style={{color: '#2d3748', fontSize: '1.1rem', lineHeight: '1.4', fontWeight: '600'}}>Sedi operative<br/>a Roma e provincia</div>
            </div>
            <div className="stat-card" style={{opacity: 1, transform: 'translateY(0px)', transition: 'opacity 0.6s, transform 0.6s', backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', textAlign: 'center', minWidth: '250px', flex: '1'}}>
              <div className="stat-number" style={{fontSize: '3.5rem', fontWeight: '900', color: 'rgb(43, 57, 101)', marginBottom: '1rem', letterSpacing: '0.02em'}}>24/7</div>
              <div className="stat-text" style={{color: '#2d3748', fontSize: '1.1rem', lineHeight: '1.4', fontWeight: '600'}}>Assistenza clienti<br/>e consulenza gratuita</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="team" style={{paddingTop: '0', paddingBottom: '2rem', backgroundColor: 'rgb(43, 57, 101)'}}>
        <div className="container">
          <div className="team">
            <h2 className="section-title text-white" style={{color: 'white', textAlign: 'center', marginTop: '0', marginBottom: '2rem', fontSize: '2rem', fontWeight: 'bold'}}>Il Nostro Team</h2>
            
            {/* Desktop: 3 card in riga */}
            <div className="team-grid-desktop" style={{
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '2rem', 
              maxWidth: '1200px', 
              margin: '0 auto'
            }}>
              <div className="team-card" style={{
                opacity: 1, 
                transform: 'translateY(0px)', 
                transition: 'opacity 0.6s, transform 0.6s',
                backgroundColor: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                minHeight: '400px',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div className="team-photo" style={{marginBottom: '1rem', flex: '0 0 auto'}}>
                  <img alt="Sharon Abate" src="https://www.novareimmobiliare.it/Sharon2.png" style={{
                    width: '100%', 
                    height: '200px', 
                    borderRadius: '0.5rem', 
                    objectFit: 'cover', 
                    objectPosition: 'center'
                  }} />
                </div>
                <div className="team-info" style={{flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                  <div>
                    <h3 className="team-name" style={{fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem'}}>Sharon Abate</h3>
                    <p className="team-role" style={{color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: '1.3'}}>Amministratore delegato</p>
                  </div>
                  <p className="team-contact" style={{color: '#374151', fontSize: '0.875rem', fontWeight: '600', marginTop: 'auto'}}>📞 +39 345 345 4186</p>
                </div>
              </div>
              
              <div className="team-card" style={{
                opacity: 1, 
                transform: 'translateY(0px)', 
                transition: 'opacity 0.6s, transform 0.6s',
                backgroundColor: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                minHeight: '400px',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div className="team-photo" style={{marginBottom: '1rem', flex: '0 0 auto'}}>
                  <img alt="Sara Incipini" src="https://www.novareimmobiliare.it/SaraPC.png" style={{
                    width: '100%', 
                    height: '200px', 
                    borderRadius: '0.5rem', 
                    objectFit: 'cover', 
                    objectPosition: 'center'
                  }} />
                </div>
                <div className="team-info" style={{flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                  <div>
                    <h3 className="team-name" style={{fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem'}}>Sara Incipini</h3>
                    <p className="team-role" style={{color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: '1.3'}}>Coordinatrice delle sedi di Malatesta e Torre Maura</p>
                  </div>
                  <p className="team-contact" style={{color: '#374151', fontSize: '0.875rem', fontWeight: '600', marginTop: 'auto'}}>📞 +39 328 593 8181</p>
                </div>
              </div>
              
              <div className="team-card" style={{
                opacity: 1, 
                transform: 'translateY(0px)', 
                transition: 'opacity 0.6s, transform 0.6s',
                backgroundColor: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                minHeight: '400px',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div className="team-photo" style={{marginBottom: '1rem', flex: '0 0 auto'}}>
                  <img alt="Chiara Turco" src="https://www.novareimmobiliare.it/Chiara2.png" style={{
                    width: '100%', 
                    height: '200px', 
                    borderRadius: '0.5rem', 
                    objectFit: 'cover', 
                    objectPosition: 'center'
                  }} />
                </div>
                <div className="team-info" style={{flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                  <div>
                    <h3 className="team-name" style={{fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem'}}>Chiara Turco</h3>
                    <p className="team-role" style={{color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: '1.3'}}>Coordinatrice della sede di Ponte di Nona</p>
                  </div>
                  <p className="team-contact" style={{color: '#374151', fontSize: '0.875rem', fontWeight: '600', marginTop: 'auto'}}>📞 +39 389 961 5663</p>
                </div>
              </div>
            </div>

            {/* Mobile: Carousel */}
            <div className="team-carousel-mobile">
              <div className="carousel-container" style={{
                transform: `translateX(-${currentSlide * 300}px)`
              }}>
                {teamMembers.map((member, index) => (
                  <div key={index} className="carousel-card">
                    <div className="team-photo" style={{marginBottom: '1rem', flex: '0 0 auto'}}>
                      <img alt={member.name} src={member.image} style={{
                        width: '100%', 
                        height: '200px', 
                        borderRadius: '0.5rem', 
                        objectFit: 'cover', 
                        objectPosition: 'center'
                      }} />
                    </div>
                    <div className="team-info" style={{flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                      <div>
                        <h3 className="team-name" style={{fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem'}}>{member.name}</h3>
                        <p className="team-role" style={{color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: '1.3'}}>{member.role}</p>
                      </div>
                      <p className="team-contact" style={{color: '#374151', fontSize: '0.875rem', fontWeight: '600', marginTop: 'auto'}}>📞 {member.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Navigation arrows */}
              <button className="carousel-arrows prev" onClick={prevSlide}>
                ‹
              </button>
              <button className="carousel-arrows next" onClick={nextSlide}>
                ›
              </button>
              
              {/* Dots navigation */}
              <div className="carousel-navigation">
                {teamMembers.map((_, index) => (
                  <button
                    key={index}
                    className={`nav-dot ${index === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="partners" style={{padding: '2rem 0', backgroundColor: 'rgb(43, 57, 101)'}}>
        <div className="container">
          <h2 className="section-title" style={{textAlign: 'center', marginBottom: '1rem', color: 'white'}}>I nostri partner</h2>
          <p className="section-subtitle" style={{textAlign: 'center', marginBottom: '3rem', color: '#e5e7eb'}}>
            Collaboriamo con partner di fiducia per offrirti servizi completi e professionali
          </p>
          {/* Desktop: 4 partner in riga */}
          <div className="partners-grid-desktop" style={{
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '1.5rem', 
            maxWidth: '1000px', 
            margin: '0 auto'
          }}>
            {partners.map((partner, index) => (
              <div key={index} className="partner-card" style={{
                backgroundColor: 'white', 
                padding: '1.5rem', 
                borderRadius: '0.75rem', 
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', 
                textAlign: 'center', 
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}>
                <img alt={partner.name} src={partner.image} style={{
                  width: '60px', 
                  height: '60px', 
                  objectFit: 'contain', 
                  margin: '0 auto 1rem auto', 
                  display: 'block'
                }}/>
                <h3 style={{margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 'bold', color: '#1f2937'}}>{partner.name}</h3>
                <small style={{color: '#6b7280', fontSize: '0.75rem', fontWeight: '500'}}>{partner.description}</small>
              </div>
            ))}
          </div>

          {/* Mobile: Carousel Partner */}
          <div className="partners-carousel-mobile">
            <div className="carousel-container" style={{
              transform: `translateX(-${currentPartnerSlide * 280}px)`
            }}>
              {partners.map((partner, index) => (
                <div key={index} className="carousel-card" style={{
                  backgroundColor: 'white', 
                  padding: '1.5rem', 
                  borderRadius: '0.75rem', 
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', 
                  textAlign: 'center',
                  flex: '0 0 250px'
                }}>
                  <img alt={partner.name} src={partner.image} style={{
                    width: '60px', 
                    height: '60px', 
                    objectFit: 'contain', 
                    margin: '0 auto 1rem auto', 
                    display: 'block'
                  }}/>
                  <h3 style={{margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 'bold', color: '#1f2937'}}>{partner.name}</h3>
                  <small style={{color: '#6b7280', fontSize: '0.75rem', fontWeight: '500'}}>{partner.description}</small>
                </div>
              ))}
            </div>
            
            {/* Navigation arrows */}
            <button className="carousel-arrows prev" onClick={prevPartnerSlide}>
              ‹
            </button>
            <button className="carousel-arrows next" onClick={nextPartnerSlide}>
              ›
            </button>
            
            {/* Dots navigation */}
            <div className="carousel-navigation">
              {partners.map((_, index) => (
                <button
                  key={index}
                  className={`nav-dot ${index === currentPartnerSlide ? 'active' : ''}`}
                  onClick={() => setCurrentPartnerSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why choose (refined copy & layout) */}
      <section className="why" style={{padding: '2.5rem 0', backgroundColor: 'rgb(43, 57, 101)'}}>
        <div className="container">
          <div style={{backgroundColor: 'white', borderRadius: '1.5rem', padding: '3rem', border: '1px solid #d1d5db', marginBottom: '6rem'}}>
            <div style={{textAlign: 'center', marginBottom: '3rem'}}>
              <h2 style={{fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'black'}}>Perché scegliere Nova RE Immobiliare</h2>
              <p style={{fontSize: '1.25rem', color: '#374151', maxWidth: '48rem', margin: '0 auto'}}>La nostra differenza si vede nei risultati e nell'approccio al cliente</p>
            </div>
            <div style={{marginBottom: '3rem'}}>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', maxWidth: '64rem', margin: '0 auto'}}>
                <div style={{textAlign: 'center'}}>
                  <div style={{backgroundColor: '#f3f4f6', borderRadius: '50%', width: '4rem', height: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#4b5563'}}>
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                    </svg>
                  </div>
                  <h3 style={{fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'black'}}>Empatia e attenzione al cliente</h3>
                  <p style={{color: '#374151'}}>Voi al centro di tutto. Comprensione dei bisogni e flessibilità sono i nostri pilastri.</p>
                </div>
                <div style={{textAlign: 'center'}}>
                  <div style={{backgroundColor: '#f3f4f6', borderRadius: '50%', width: '4rem', height: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#4b5563'}}>
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </div>
                  <h3 style={{fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'black'}}>Trasparenza totale</h3>
                  <p style={{color: '#374151'}}>Comunicazione chiara e onesta in ogni fase del processo.</p>
                </div>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', maxWidth: '64rem', margin: '2rem auto 0 auto'}}>
                <div style={{textAlign: 'center'}}>
                  <div style={{backgroundColor: '#f3f4f6', borderRadius: '50%', width: '4rem', height: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#4b5563'}}>
                      <circle cx="12" cy="8" r="6"></circle>
                      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
                    </svg>
                  </div>
                  <h3 style={{fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'black'}}>Esperienza consolidata</h3>
                  <p style={{color: '#374151'}}>Anni di successi e competenze nel settore immobiliare romano.</p>
                </div>
                <div style={{textAlign: 'center'}}>
                  <div style={{backgroundColor: '#f3f4f6', borderRadius: '50%', width: '4rem', height: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#4b5563'}}>
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <path d="m9 11 3 3L22 4"></path>
                    </svg>
                  </div>
                  <h3 style={{fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'black'}}>Risultati garantiti</h3>
                  <p style={{color: '#374151'}}>Un alto tasso di soddisfazione dei clienti e transazioni rapide e sicure.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" style={{padding: '2.5rem 0', backgroundColor: 'rgb(43, 57, 101) !important', margin: '0'}}>
        <div className="container" style={{textAlign: 'center', maxWidth: '800px', margin: '0 auto'}}>
          <h2 className="section-title" style={{fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'white'}}>Pronto a iniziare la tua avventura immobiliare?</h2>
          <p className="section-subtitle" style={{fontSize: '1.25rem', lineHeight: '1.6', marginBottom: '2.5rem', color: '#e5e7eb', maxWidth: '600px', margin: '0 auto 2.5rem auto'}}>Scopri come possiamo aiutarti a realizzare i tuoi obiettivi con la professionalità e l'esperienza di Nova RE.</p>
          <div className="cta-actions" style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
            
            <button
              className="btn btn-ghost"
              onClick={() => document.getElementById('contact-form')?.scrollIntoView({behavior:'smooth'})}
              style={{backgroundColor: 'white', color: 'rgb(43, 57, 101)', padding: '0.75rem 2rem', borderRadius: '0.5rem', border: '2px solid white', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease'}}
            >Richiedi informazioni</button>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" style={{padding: '2.5rem 0', backgroundColor: 'rgb(43, 57, 101)'}}>
        <div className="container">
          <div style={{backgroundColor: 'white', borderRadius: '0.5rem', padding: '2rem', marginBottom: '3rem', border: '1px solid #d1d5db', maxWidth: '64rem', margin: '0 auto', scrollMarginTop: '7rem'}}>
            <h3 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'black', textAlign: 'center'}}>Richiedi informazioni</h3>
            <form style={{display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%'}} onSubmit={(e)=>e.preventDefault()}>
              <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '1rem'}} className="md:grid-cols-2">
                <div>
                  <label htmlFor="firstName" style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>Nome *</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    name="firstName" 
                    required 
                    style={{
                      width: '100%', 
                      padding: '0.75rem 1rem', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '0.5rem', 
                      backgroundColor: 'white', 
                      color: 'black',
                      transition: 'all 0.2s ease'
                    }} 
                    placeholder="Il tuo nome"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>Cognome *</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    name="lastName" 
                    required 
                    style={{
                      width: '100%', 
                      padding: '0.75rem 1rem', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '0.5rem', 
                      backgroundColor: 'white', 
                      color: 'black',
                      transition: 'all 0.2s ease'
                    }} 
                    placeholder="Il tuo cognome"
                  />
                </div>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '1rem'}} className="md:grid-cols-2">
                <div>
                  <label htmlFor="email" style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>Email *</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    style={{
                      width: '100%', 
                      padding: '0.75rem 1rem', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '0.5rem', 
                      backgroundColor: 'white', 
                      color: 'black',
                      transition: 'all 0.2s ease'
                    }} 
                    placeholder="tua@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>Telefono *</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    required 
                    style={{
                      width: '100%', 
                      padding: '0.75rem 1rem', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '0.5rem', 
                      backgroundColor: 'white', 
                      color: 'black',
                      transition: 'all 0.2s ease'
                    }} 
                    placeholder="Il tuo telefono"
                  />
                </div>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '1rem'}} className="md:grid-cols-2">
                <div>
                  <label htmlFor="service" style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>Servizio di Interesse *</label>
                  <select 
                    id="service" 
                    name="service" 
                    required 
                    style={{
                      width: '100%', 
                      padding: '0.75rem 1rem', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '0.5rem', 
                      backgroundColor: 'white', 
                      color: 'black',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <option value="">Seleziona un servizio</option>
                    <option value="vendita">Vendita Immobile</option>
                    <option value="acquisto">Acquisto Immobile</option>
                    <option value="affitto">Affitto</option>
                    <option value="valutazione">Valutazione</option>
                    <option value="investimento">Investimento</option>
                    <option value="consulenza">Consulenza</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>Messaggio *</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    required 
                    rows={6} 
                    style={{
                      width: '100%', 
                      padding: '0.75rem 1rem', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '0.5rem', 
                      backgroundColor: 'white', 
                      color: 'black',
                      resize: 'none',
                      transition: 'all 0.2s ease'
                    }} 
                    placeholder="Scrivi il tuo messaggio"
                  />
                </div>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <button 
                  type="submit" 
                  style={{
                    width: '100%',
                    maxWidth: 'auto',
                    background: 'linear-gradient(to right, #9ca3af, #d1d5db)',
                    color: 'black',
                    padding: '1rem 2rem',
                    borderRadius: '0.75rem',
                    fontWeight: 'bold',
                    fontSize: '1.125rem',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    transition: 'all 0.3s ease',
                    transform: 'scale(1)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(to right, #d1d5db, #f3f4f6)';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(to right, #9ca3af, #d1d5db)';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m22 2-7 20-4-9-9-4Z"></path>
                    <path d="M22 2 11 13"></path>
                  </svg>
                  <span>Invia messaggio</span>
                </button>
                <p style={{fontSize: '0.875rem', color: '#4b5563', textAlign: 'center', marginTop: '1rem'}}>I tuoi dati sono protetti e utilizzati solo per rispondere alla tua richiesta.</p>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
