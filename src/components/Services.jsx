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
      title: "Vendita Immobili",
      subtitle: "Residenziali e Commerciali",
      description: "Servizio completo di vendita immobili a Roma e provincia. Valutazioni accurate, marketing mirato e assistenza professionale per massimizzare il valore della tua proprietà. Dalla prima valutazione alla firma del rogito.",
      features: ["Valutazione gratuita", "Marketing professionale", "Assistenza legale", "Supporto post-vendita"]
    },
    {
      icon: "🔑", 
      title: "Affitto e Locazione",
      subtitle: "Soluzioni Flessibili",
      description: "Vasta selezione di immobili in affitto a Roma. Supporto completo nella selezione, gestione contratti e registrazione presso gli enti preposti. Assistenza continua per proprietari e inquilini.",
      features: ["Selezione inquilini", "Gestione contratti", "Registrazione legale", "Assistenza continua"]
    },
    {
      icon: "�",
      title: "Consulenza Immobiliare",
      subtitle: "Esperti Qualificati", 
      description: "Prima consulenza e valutazione completamente gratuita. I nostri esperti analizzano le tue esigenze e il valore della proprietà, offrendo consigli personalizzati e strategie su misura.",
      features: ["Consulenza gratuita", "Analisi di mercato", "Strategie personalizzate", "Supporto decisionale"]
    },
    {
      icon: "🏢",
      title: "Investimenti Immobiliari",
      subtitle: "Opportunità di Rendita",
      description: "Consulenza specializzata per investimenti immobiliari redditizi. Analisi del mercato, opportunità di investimento e gestione del portafoglio immobiliare per massimizzare i rendimenti.",
      features: ["Analisi ROI", "Portfolio management", "Opportunità esclusive", "Consulenza fiscale"]
    },
    {
      icon: "🔧",
      title: "Servizi Aggiuntivi",
      subtitle: "Supporto Completo",
      description: "Servizi accessori per rendere l'esperienza immobiliare completa: ristrutturazioni, mutui, assicurazioni, perizie tecniche e tutto il supporto necessario per il tuo immobile.",
      features: ["Mutui e finanziamenti", "Assicurazioni", "Ristrutturazioni", "Perizie tecniche"]
    },
    {
      icon: "📱",
      title: "Tecnologia Avanzata",
      subtitle: "Innovazione Digitale",
      description: "Utilizziamo le più moderne tecnologie per offrirti un servizio all'avanguardia: tour virtuali, marketing digitale, piattaforme online e strumenti innovativi per una migliore esperienza.",
      features: ["Tour virtuali 360°", "Marketing digitale", "App mobile", "Database avanzato"]
    }
  ];

  return (
    <section className="section services-blue" id="servizi">
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
                <button className="service-btn" onClick={() => {
                  const element = document.getElementById('contatti');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}>
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