import React, { useEffect, useState } from 'react';
import './App.css';

// Import dei componenti
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Properties from './components/Properties';
import Partners from './components/Partners';
import Contact from './components/Contact';
import Footer from './components/Footer';
import DemoPage from './components/DemoPage';

// Import dei servizi
import { healthService } from './services/api';

function App() {
  const [showDemo, setShowDemo] = useState(false);

  // Test di connessione al backend al caricamento della pagina
  useEffect(() => {
    const testBackendConnection = async () => {
      try {
        console.log('🔄 Testando connessione al backend...');
        const isHealthy = await healthService.check();
        if (isHealthy) {
          console.log('✅ Backend connesso correttamente!');
        } else {
          console.log('⚠️ Backend non raggiungibile. Modalità demo attiva.');
        }
      } catch (error) {
        console.log('⚠️ Backend non raggiungibile. Modalità demo attiva.');
      }
    };

    testBackendConnection();

    // Controlla se c'è il parametro demo nell'URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('demo') === 'true') {
      setShowDemo(true);
    }
  }, []);

  // Se è richiesta la modalità demo
  if (showDemo) {
    return <DemoPage />;
  }

  return (
    <div className="App">
      {/* Bottone per accedere alla demo (visibile solo in sviluppo) */}
      {import.meta.env.DEV && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999
        }}>
          <button
            onClick={() => setShowDemo(true)}
            style={{
              background: 'linear-gradient(45deg, #28a745, #20c997)',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              boxShadow: '0 5px 15px rgba(40, 167, 69, 0.3)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
            }}
          >
            🧪 Demo API
          </button>
        </div>
      )}
      
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Properties />
      <Partners />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
