
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="page-container">
      <Navbar />

      {/* Hero Section */}
      <section className="about-hero section--dark" style={{backgroundColor: 'rgb(43, 57, 101)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div className="container" style={{textAlign: 'center', maxWidth: '800px'}}>
          <h1 className="display text-invert" style={{fontSize: '3.5rem', marginBottom: '2rem', color: 'white'}}>Chi siamo</h1>
          <p className="lead" style={{fontSize: '1.25rem', lineHeight: '1.6', marginBottom: '1.5rem', color: '#e5e7eb'}}>
            Nova RE nasce dalla volontà di innovare il settore immobiliare, integrando digitalizzazione, trasparenza, empatia ed esperienza. Il nostro obiettivo è rendere il processo di compravendita e affitto semplice, veloce e trasparente, mettendo sempre il cliente al centro.
          </p>
          <p className="lead" style={{fontSize: '1.25rem', lineHeight: '1.6', color: '#e5e7eb'}}>
            Ci distinguiamo per l'utilizzo di nuove forme di comunicazione accessibili e per consulenze gratuite con assistenza continua. Grazie a un team esperto e qualificato, garantiamo risultati concreti e un servizio su misura.
          </p>
        </div>
      </section>

      {/* Valori: Mission & Vision (2 card) */}
      <section className="values section--dark" style={{backgroundColor: 'rgb(43, 57, 101)', padding: '5rem 0'}}>
        <div className="container">
          <h2 className="section-title text-invert" style={{color: 'white', textAlign: 'center', marginBottom: '3rem'}}>I nostri valori</h2>
          <div className="values-grid" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '1200px', margin: '0 auto'}}>
            <article className="value-card" style={{backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'}}>
              <h3 style={{color: '#1f2937', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'bold'}}>La nostra missione</h3>
              <p style={{color: '#4b5563', lineHeight: '1.6', fontSize: '1rem'}}>
                Crediamo in un futuro immobiliare che unisca tecnologia e centralità del cliente, costruendo fiducia reciproca. La nostra missione è semplificare e ottimizzare ogni fase, trasformando le complessità in un percorso senza stress grazie a un servizio completo e personalizzato fondato su trasparenza, innovazione e relazioni umane solide.
              </p>
            </article>
            <article className="value-card" style={{backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'}}>
              <h3 style={{color: '#1f2937', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'bold'}}>La nostra visione</h3>
              <p style={{color: '#4b5563', lineHeight: '1.6', fontSize: '1rem'}}>
                Essere riconosciuti come punto di riferimento a Roma per professionalità, innovazione e fiducia. Pionieri nell'uso della tecnologia e nell'eccellenza del servizio, vogliamo ridefinire gli standard del settore con soluzioni sostenibili, transazioni trasparenti ed esperienze autentiche.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* I nostri numeri: 4 card in riga */}
      <section className="numbers section--dark">
        <div className="container">
          <h2 className="section-title text-invert">I nostri numeri</h2>
          <div className="numbers-grid">
            <div className="number-item">
              <div className="number">15+</div>
              <div className="label">Anni di esperienza<br/>nel settore immobiliare</div>
            </div>
            <div className="number-item">
              <div className="number">500+</div>
              <div className="label">Clienti soddisfatti<br/>e proprietà vendute</div>
            </div>
            <div className="number-item">
              <div className="number">3</div>
              <div className="label">Sedi operative<br/>a Roma e provincia</div>
            </div>
            <div className="number-item">
              <div className="number">24/7</div>
              <div className="label">Assistenza clienti<br/>e consulenza gratuita</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="team">
        <div className="container">
          <h2 className="section-title">Il nostro team</h2>
          <div className="team-grid">
            <div className="team-card">
              <div className="team-photo">
                <img alt="Sharon Abate" src="https://www.novareimmobiliare.it/Sharon2.png"/>
              </div>
              <div className="team-meta">
                <h3>Sharon Abate</h3>
                <p>Amministratore delegato</p>
                <a className="tel" href="tel:+393453454186">+39 345 345 4186</a>
              </div>
            </div>
            <div className="team-card">
              <div className="team-photo">
                <img alt="Sara Incipini" src="https://www.novareimmobiliare.it/SaraPC.png"/>
              </div>
              <div className="team-meta">
                <h3>Sara Incipini</h3>
                <p>Coordinatrice sedi di Malatesta e Torre Maura</p>
                <a className="tel" href="tel:+393285938181">+39 328 593 8181</a>
              </div>
            </div>
            <div className="team-card">
              <div className="team-photo">
                <img alt="Chiara Turco" src="https://www.novareimmobiliare.it/Chiara2.png"/>
              </div>
              <div className="team-meta">
                <h3>Chiara Turco</h3>
                <p>Coordinatrice sede di Ponte di Nona</p>
                <a className="tel" href="tel:+393899615663">+39 389 961 5663</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="partners" style={{padding: '3rem 0'}}>
        <div className="container">
          <h2 className="section-title" style={{textAlign: 'center', marginBottom: '1rem'}}>I nostri partner</h2>
          <p className="section-subtitle" style={{textAlign: 'center', marginBottom: '3rem', color: '#64748b'}}>
            Collaboriamo con partner di fiducia per offrirti servizi completi e professionali
          </p>
          <div className="partners-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto'}}>
            
            <div className="partner-card" style={{backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', textAlign: 'center', transition: 'transform 0.3s ease, box-shadow 0.3s ease'}}>
              <img alt="EUROANSA" src="https://www.novareimmobiliare.it/Euroansa.jpg" style={{width: '60px', height: '60px', objectFit: 'contain', margin: '0 auto 1rem auto', display: 'block'}}/>
              <h3 style={{margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 'bold', color: '#1f2937'}}>EUROANSA</h3>
              <small style={{color: '#6b7280', fontSize: '0.75rem', fontWeight: '500'}}>SOCIETÀ DI MEDIAZIONE CREDITIZIA</small>
            </div>

            <div className="partner-card" style={{backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', textAlign: 'center', transition: 'transform 0.3s ease, box-shadow 0.3s ease'}}>
              <img alt="KIRON" src="https://www.novareimmobiliare.it/Kiron.jpg" style={{width: '60px', height: '60px', objectFit: 'contain', margin: '0 auto 1rem auto', display: 'block'}}/>
              <h3 style={{margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 'bold', color: '#1f2937'}}>KIRON</h3>
              <small style={{color: '#6b7280', fontSize: '0.75rem', fontWeight: '500'}}>SOCIETÀ DI MEDIAZIONE CREDITIZIA</small>
            </div>

            <div className="partner-card" style={{backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', textAlign: 'center', transition: 'transform 0.3s ease, box-shadow 0.3s ease'}}>
              <img alt="AVVERA GRUPPO CREDEM" src="https://www.novareimmobiliare.it/Avvera.webp" style={{width: '60px', height: '60px', objectFit: 'contain', margin: '0 auto 1rem auto', display: 'block'}}/>
              <h3 style={{margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 'bold', color: '#1f2937'}}>AVVERA</h3>
              <small style={{color: '#6b7280', fontSize: '0.75rem', fontWeight: '500'}}>SOCIETÀ DI CREDITO</small>
            </div>

            <div className="partner-card" style={{backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', textAlign: 'center', transition: 'transform 0.3s ease, box-shadow 0.3s ease'}}>
              <img alt="REA COMPANY" src="https://www.novareimmobiliare.it/Rea_Company.png" style={{width: '60px', height: '60px', objectFit: 'contain', margin: '0 auto 1rem auto', display: 'block'}}/>
              <h3 style={{margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 'bold', color: '#1f2937'}}>REA COMPANY</h3>
              <small style={{color: '#6b7280', fontSize: '0.75rem', fontWeight: '500'}}>AGENZIA DI MARKETING</small>
            </div>
            
          </div>
        </div>
      </section>

      {/* Why choose (refined copy & layout) */}
      <section className="why" style={{padding: '5rem 0'}}>
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
      <section className="section--accent">
        <div className="container">
          <h2 className="section-title">Pronto a iniziare la tua avventura immobiliare?</h2>
          <p className="section-subtitle">Scopri come possiamo aiutarti a realizzare i tuoi obiettivi con la professionalità e l'esperienza di Nova RE.</p>
          <div className="cta-actions">
            <button
              className="btn btn-primary"
              onClick={() => document.getElementById('contact-form')?.scrollIntoView({behavior:'smooth'})}
            >Contattaci</button>
            <button
              className="btn btn-ghost"
              onClick={() => document.getElementById('contact-form')?.scrollIntoView({behavior:'smooth'})}
            >Richiedi informazioni</button>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form">
        <div className="container">
          <h2 className="section-title">Richiedi informazioni</h2>
          <form className="contact-form" onSubmit={(e)=>e.preventDefault()}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nome">Nome *</label>
                <input type="text" id="nome" name="nome" placeholder="Il tuo nome" required />
              </div>
              <div className="form-group">
                <label htmlFor="cognome">Cognome *</label>
                <input type="text" id="cognome" name="cognome" placeholder="Il tuo cognome" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input type="email" id="email" name="email" placeholder="tua@email.com" required />
              </div>
              <div className="form-group">
                <label htmlFor="telefono">Telefono *</label>
                <input type="tel" id="telefono" name="telefono" placeholder="Il tuo telefono" required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="servizio">Servizio di interesse *</label>
              <select id="servizio" name="servizio" required>
                <option value="">Seleziona un servizio</option>
                <option value="vendita">Vendita immobile</option>
                <option value="acquisto">Acquisto immobile</option>
                <option value="affitto">Affitto immobile</option>
                <option value="locazione">Locazione immobile</option>
                <option value="valutazione">Valutazione gratuita</option>
                <option value="consulenza">Consulenza immobiliare</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="messaggio">Messaggio *</label>
              <textarea id="messaggio" name="messaggio" rows={5} placeholder="Scrivi il tuo messaggio" required />
            </div>
            <button type="submit" className="submit-btn">Invia messaggio</button>
            <p className="privacy-note">I tuoi dati sono protetti e utilizzati solo per rispondere alla tua richiesta.</p>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
