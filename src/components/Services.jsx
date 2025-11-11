import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const navigate = useNavigate();
  const servicesRef = useRef([]);
  const [currentServiceSlide, setCurrentServiceSlide] = useState(0);

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

    servicesRef.current.forEach(el => {
      if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  const services = [
    {
      icon: "🏠",
      title: "Vendita di immobili residenziali e commerciali",
      subtitle: "Servizio Completo",
      description: "Servizio completo di vendita immobili a Roma. Valutazioni accurate, marketing mirato e assistenza professionale per massimizzare il valore della tua proprietà e garantire una vendita rapida.",
      features: ["Valutazione gratuita", "Marketing professionale", "Assistenza legale", "Vendita rapida"]
    },
    {
      icon: "🔑", 
      title: "Affitto di immobili residenziali e commerciali",
      subtitle: "Vasta Selezione",
      description: "Vasta selezione di immobili in affitto a Roma. Supporto completo nella selezione, gestione contratti e registrazione presso gli enti preposti.",
      features: ["Selezione inquilini", "Gestione contratti", "Registrazione enti", "Assistenza continua"]
    },
    {
      icon: "💡",
      title: "Consulenza e valutazione gratuita",
      subtitle: "Esperti Qualificati", 
      description: "Prima consulenza e valutazione gratuita. I nostri esperti analizzano esigenze e valore della proprietà, offrendo consigli personalizzati e assistenza tecnica.",
      features: ["Consulenza gratuita", "Analisi esigenze", "Consigli personalizzati", "Assistenza tecnica"]
    }
  ];

  const handleDiscoverMore = () => {
    navigate('/about');
  };

  const nextServiceSlide = () => {
    setCurrentServiceSlide((prev) => (prev + 1) % services.length);
  };
  
  const prevServiceSlide = () => {
    setCurrentServiceSlide((prev) => (prev - 1 + services.length) % services.length);
  };

  return (
    <section className="section services-blue" id="servizi">
      <div className="container">
        <h2 className="section-title text-white" style={{textAlign: 'center'}}>I nostri servizi</h2>
        <p className="section-subtitle text-white" style={{
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto 2rem auto',
          fontSize: '1.25rem',
          lineHeight: '1.7'
        }}>
          Specializzati nella vendita e affitto di immobili residenziali e commerciali a Roma, offriamo consulenza gratuita e supporto completo in ogni fase del processo immobiliare.
        </p>
        
        {/* Desktop: 3 servizi in riga */}
        <div className="services-grid services-grid-desktop">
          {services.map((service, index) => (
            <div 
              key={index}
              className="service-card"
              ref={el => servicesRef.current[index] = el}
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                padding: '2rem',
                background: 'white',
                borderRadius: '1rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-5px)';
                e.target.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div className="service-header" style={{textAlign: 'center', marginBottom: '1.5rem'}}>
                <div className="service-icon" style={{fontSize: '3rem', marginBottom: '1rem'}}>{service.icon}</div>
                <div className="service-titles">
                  <h3 className="service-title" style={{fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>{service.title}</h3>
                  <p className="service-subtitle" style={{color: '#6b7280', fontSize: '0.9rem', fontWeight: '600'}}>{service.subtitle}</p>
                </div>
              </div>
              
              <p className="service-description">{service.description}</p>
              
              <div className="service-features" style={{marginBottom: '2rem'}}>
                {service.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="service-feature" style={{
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '0.75rem',
                    padding: '0.5rem 0'
                  }}>
                    <span className="feature-check" style={{
                      color: '#10b981', 
                      fontSize: '1.1rem', 
                      fontWeight: 'bold', 
                      marginRight: '0.75rem',
                      minWidth: '20px'
                    }}>✓</span>
                    <span className="feature-text" style={{
                      fontSize: '0.95rem',
                      color: '#374151',
                      lineHeight: '1.4'
                    }}>{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="service-cta" style={{textAlign: 'center', marginTop: 'auto'}}>
                <button 
                  className="service-btn" 
                  onClick={handleDiscoverMore}
                  style={{
                    background: 'var(--nova-blue)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 2rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    width: '100%',
                    maxWidth: '200px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--nova-blue-dark)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'var(--nova-blue)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Scopri di più
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Carousel Servizi */}
        <div className="services-carousel-mobile">
          <div className="carousel-container" style={{
            transform: `translateX(-${currentServiceSlide * 300}px)`
          }}>
            {services.map((service, index) => (
              <div 
                key={index} 
                className="carousel-card service-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  padding: '2rem',
                  background: 'white',
                  borderRadius: '1rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  minHeight: '450px'
                }}
              >
                <div className="service-header" style={{textAlign: 'center', marginBottom: '1.5rem'}}>
                  <div className="service-icon" style={{fontSize: '3rem', marginBottom: '1rem'}}>{service.icon}</div>
                  <div className="service-titles">
                    <h3 className="service-title" style={{fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>{service.title}</h3>
                    <p className="service-subtitle" style={{color: '#6b7280', fontSize: '0.9rem', fontWeight: '600'}}>{service.subtitle}</p>
                  </div>
                </div>
                
                <p className="service-description">{service.description}</p>
                
                <div className="service-features" style={{marginBottom: '2rem'}}>
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="service-feature" style={{
                      display: 'flex', 
                      alignItems: 'center', 
                      marginBottom: '0.75rem',
                      padding: '0.5rem 0'
                    }}>
                      <span className="feature-check" style={{
                        color: '#10b981', 
                        fontSize: '1.1rem', 
                        fontWeight: 'bold', 
                        marginRight: '0.75rem',
                        minWidth: '20px'
                      }}>✓</span>
                      <span className="feature-text" style={{
                        fontSize: '0.95rem',
                        color: '#374151',
                        lineHeight: '1.4'
                      }}>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="service-cta" style={{textAlign: 'center', marginTop: 'auto'}}>
                  <button 
                    className="service-btn" 
                    onClick={handleDiscoverMore}
                    style={{
                      background: 'var(--nova-blue)',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 2rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      width: '100%',
                      maxWidth: '200px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'var(--nova-blue-dark)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'var(--nova-blue)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    Scopri di più
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation arrows */}
          <button className="carousel-arrows prev" onClick={prevServiceSlide}>
            ‹
          </button>
          <button className="carousel-arrows next" onClick={nextServiceSlide}>
            ›
          </button>
          
          {/* Dots navigation */}
          <div className="carousel-navigation">
            {services.map((_, index) => (
              <button
                key={index}
                className={`nav-dot ${index === currentServiceSlide ? 'active' : ''}`}
                onClick={() => setCurrentServiceSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
