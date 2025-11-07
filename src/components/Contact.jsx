import React, { useState, useEffect, useRef } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    telefono: '',
    messaggio: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const officesRef = useRef([]);

  const API_BASE = 'http://localhost:8080/api';

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

    officesRef.current.forEach(el => {
      if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  const offices = [
    {
      name: "Sede Malatesta",
      address: "Piazza Roberto Malatesta, 53, 00176 Roma RM",
      phone: "+39 345 345 4186",
      hours: "Lun-Ven: 9:00-19:00",
      image: "https://www.novareimmobiliare.it/Ufficio1_Esterno.png"
    },
    {
      name: "Sede Torre Maura",
      address: "Via dei Colombi, 110B-C, 00169 Roma RM",
      phone: "+39 389 961 5663",
      hours: "Lun-Ven: 9:00-19:00",
      image: "https://www.novareimmobiliare.it/Ufficio2_Interno.png"
    },
    {
      name: "Sede Ponte di Nona",
      address: "Via Marc Seguin, 3, 00132 Roma RM",
      phone: "+39 328 593 8181",
      hours: "Lun-Ven: 9:00-19:00",
      image: "https://www.novareimmobiliare.it/Ufficio3_Esterno.png"
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const sendContactForm = async (data) => {
    try {
      const response = await fetch(`${API_BASE}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Errore nell\'invio del form:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validazione base
      if (!formData.nome || !formData.cognome || !formData.email || !formData.messaggio) {
        throw new Error('Per favore compila tutti i campi obbligatori');
      }

      // Invia al backend
      await sendContactForm(formData);
      
      // Successo
      setMessage({
        type: 'success',
        text: '✅ Messaggio inviato con successo! Ti contatteremo presto.'
      });
      
      // Reset form
      setFormData({
        nome: '',
        cognome: '',
        email: '',
        telefono: '',
        messaggio: ''
      });
      
    } catch (error) {
      console.error('Errore invio form:', error);
      
      // Errore
      setMessage({
        type: 'error',
        text: '❌ Errore nell\'invio. Riprova o contattaci telefonicamente.'
      });
      
    } finally {
      setIsSubmitting(false);
      
      // Nascondi messaggio dopo 5 secondi
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
    }
  };

  return (
    <section className="section contact" id="contatti">
      <div className="container">
        <h2 className="section-title">Contatti</h2>
        <p className="section-subtitle">
          Se desideri vendere, acquistare o affittare un immobile a Roma, 
          Nova RE è il partner ideale per accompagnarti in questo percorso.
        </p>
        
        <div className="offices-grid">
          {offices.map((office, index) => (
            <div 
              key={index}
              className="office-card"
              ref={el => officesRef.current[index] = el}
            >
              <div className="office-image">
                <img src={office.image} alt={office.name} />
              </div>
              <h3 className="office-name">{office.name}</h3>
              <div className="office-info">
                <div>📍 {office.address}</div>
                <div>📞 {office.phone}</div>
                <div>🕒 {office.hours}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Form di Contatto */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '40px',
          marginTop: '60px',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{
            textAlign: 'center',
            marginBottom: '30px',
            fontSize: '1.5rem'
          }}>
            Invia una richiesta
          </h3>
          
          <form 
            onSubmit={handleSubmit}
            style={{ maxWidth: '600px', margin: '0 auto' }}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '20px'
            }}>
              <div>
                <label htmlFor="nome" style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: '500'
                }}>
                  Nome *
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label htmlFor="cognome" style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: '500'
                }}>
                  Cognome *
                </label>
                <input
                  type="text"
                  id="cognome"
                  name="cognome"
                  value={formData.cognome}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '20px'
            }}>
              <div>
                <label htmlFor="email" style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: '500'
                }}>
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label htmlFor="telefono" style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: '500'
                }}>
                  Telefono
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="messaggio" style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: '500'
              }}>
                Messaggio *
              </label>
              <textarea
                id="messaggio"
                name="messaggio"
                rows="5"
                value={formData.messaggio}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  color: '#007bff',
                  padding: '15px 40px',
                  border: 'none',
                  borderRadius: '30px',
                  fontWeight: '600',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  transition: 'all 0.3s',
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                {isSubmitting ? 'Invio in corso...' : 'Invia Richiesta'}
              </button>
            </div>
            
            {message.text && (
              <div style={{
                marginTop: '20px',
                padding: '15px',
                borderRadius: '10px',
                textAlign: 'center',
                background: message.type === 'success' 
                  ? 'rgba(40, 167, 69, 0.2)' 
                  : 'rgba(220, 53, 69, 0.2)',
                color: '#fff'
              }}>
                {message.text}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;