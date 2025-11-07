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
    { number: "20+", text: "Anni di esperienza" },
    { number: "350+", text: "Clienti soddisfatti" },
    { number: "Lun-Ven", text: "9:00-19:00\nAssistenza disponibile" },
    { number: "Roma", text: "e dintorni\nZone coperte" }
  ];

  return (
    <section className="section about" id="chi-siamo">
      <div className="container">
        <h2 className="section-title">Chi siamo</h2>
        <p className="section-subtitle">
          Nova RE nasce dalla volontà di innovare il settore immobiliare, 
          integrando digitalizzazione, trasparenza, empatia ed esperienza.
        </p>
        
        <div className="about-content">
          <div className="about-text">
            <h3>MISSION & VISION</h3>
            <p>
              <strong>Nova RE</strong> nasce dalla volontà di innovare il settore immobiliare, 
              integrando <strong>digitalizzazione, trasparenza, empatia ed esperienza.</strong> 
              Il nostro obiettivo è rendere il processo di compravendita e affitto{' '}
              <strong>semplice, veloce e trasparente</strong>, mettendo sempre il cliente al centro.
            </p>
            
            <p>
              Ci distinguiamo per l'utilizzo di <strong>nuove forme di comunicazione</strong> 
              accessibili e per consulenze gratuite con assistenza continua. Grazie a un{' '}
              <strong>team esperto e qualificato</strong>, garantiamo{' '}
              <strong>risultati concreti</strong> e un servizio su misura.
            </p>
            
            <p>
              <strong>In Nova Re crediamo in un futuro immobiliare costruito sulla fiducia, 
              sull'ascolto e su relazioni autentiche.</strong> Un futuro in cui ogni cliente 
              viene guidato, non semplicemente gestito. Dove la consulenza non è un servizio, 
              ma una responsabilità.
            </p>
          </div>
          <div className="about-gallery">
            <img 
              src="https://www.novareimmobiliare.it/Ufficio1_Esterno.png" 
              alt="Sede Nova RE" 
            />
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