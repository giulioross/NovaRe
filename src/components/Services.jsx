import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const navigate = useNavigate();
  const servicesRef = useRef([]);

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

  return (
    <section className="section services-blue" id="servizi">
      <div className="container">
        <h2 className="section-title text-white">I nostri servizi</h2>
        <p className="section-subtitle text-white">
          Specializzati nella vendita e affitto di immobili residenziali e commerciali a Roma, offriamo consulenza gratuita e supporto completo in ogni fase del processo immobiliare.
        </p>
        
        <div className="services-grid">
          {services.map((service, index) => (
            <div 
              key={index}
              className="service-card"
              ref={el => servicesRef.current[index] = el}
            >
              <div className="service-header">
                <div className="service-icon">{service.icon}</div>
                <div className="service-titles">
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-subtitle">{service.subtitle}</p>
                </div>
              </div>
              
              <p className="service-description">{service.description}</p>
              
              <div className="service-features">
                {service.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="service-feature">
                    <span className="feature-check">✓</span>
                    <span className="feature-text">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="service-cta">
                <button className="service-btn" onClick={handleDiscoverMore}>
                  Scopri di più
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
