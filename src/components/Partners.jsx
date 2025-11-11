import React, { useEffect, useRef } from 'react';

const Partners = () => {
  const partnersRef = useRef([]);

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

    partnersRef.current.forEach(el => {
      if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  const partners = [
    {
      name: "EUROANSA",
      description: "SOCIETÀ DI MEDIAZIONE CREDITIZIA",
      logo: "https://www.novareimmobiliare.it/Euroansa.jpg"
    },
    {
      name: "KIRON",
      description: "SOCIETÀ DI MEDIAZIONE CREDITIZIA",
      logo: "https://www.novareimmobiliare.it/Kiron.jpg"
    },
    {
      name: "AVVERA GRUPPO CREDEM",
      description: "SOCIETÀ DI CREDITO",
      logo: "https://www.novareimmobiliare.it/Avvera.webp"
    },
    {
      name: "REA COMPANY",
      description: "AGENZIA DI MARKETING",
      logo: "https://www.novareimmobiliare.it/Rea_Company.png"
    }
  ];

  return (
    <section className="section" id="partner" style={{backgroundImage: 'url("https://plus.unsplash.com/premium_photo-1675975678457-d70708bf77c8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTd8fHJvbWElMjBpbGx1bWluYXRhJTIwZ2lvcm5vfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600")'}}>
      <div className="container">
        <h2 className="section-title" style={{textAlign: 'center'}}>I nostri partner</h2>
        <p className="section-subtitle" style={{textAlign: 'center'}}>
          Collaboriamo con partner di fiducia per offrirti servizi completi e professionali
        </p>
        
        <div className="partners-grid">
          {partners.map((partner, index) => (
            <div 
              key={index}
              className="partner-card"
              ref={el => partnersRef.current[index] = el}
            >
              <div className="partner-logo">
                <img src={partner.logo} alt={`${partner.name} Logo`} />
              </div>
              <h3>{partner.name}</h3>
              <p>{partner.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;