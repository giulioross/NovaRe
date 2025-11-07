import React, { useEffect, useRef } from 'react';

const Services = () => {
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
      description: "Servizio completo di vendita immobili a Roma. Valutazioni accurate, marketing mirato e assistenza professionale per massimizzare il valore della tua proprietà."
    },
    {
      icon: "🔑",
      title: "Affitto di immobili residenziali e commerciali",
      description: "Vasta selezione di immobili in affitto a Roma. Supporto completo nella selezione, gestione contratti e registrazione presso gli enti preposti."
    },
    {
      icon: "📊",
      title: "Consulenza e valutazione gratuita",
      description: "Prima consulenza e valutazione gratuita. I nostri esperti analizzano esigenze e valore della proprietà, offrendo consigli personalizzati."
    }
  ];

  return (
    <section className="section" id="servizi">
      <div className="container">
        <h2 className="section-title">I nostri servizi</h2>
        <p className="section-subtitle">
          Specializzati nella vendita e affitto di immobili residenziali e 
          commerciali a Roma, offriamo consulenza gratuita e supporto completo.
        </p>
        
        <div className="services-grid">
          {services.map((service, index) => (
            <div 
              key={index}
              className="service-card"
              ref={el => servicesRef.current[index] = el}
            >
              <div className="service-icon">{service.icon}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;