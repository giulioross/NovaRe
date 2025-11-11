import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import dei componenti
import Navbar from './Navbar';
import Hero from './Hero';
import About from './About';
import Services from './Services';
import Properties from './Properties';
import Partners from './Partners';
import Contact from './Contact';
import Footer from './Footer';
import DemoPage from './DemoPage';

// Import dei servizi
import { healthService } from '../services/api';

const HomePage = () => {
  const [showDemo, setShowDemo] = useState(false);
  const navigate = useNavigate();

  // Test connessione backend all'avvio (silenzioso)
  useEffect(() => {
    const testBackendConnection = async () => {
      try {
        const isHealthy = await healthService.check();
        if (isHealthy) {
          console.log('✅ Sistema operativo');
        }
      } catch (error) {
        // Ignoriamo silenziosamente gli errori di connessione
        console.debug('Backend in modalità manutenzione');
      }
    };

    testBackendConnection();
  }, []);

  const handleViewDetails = (listingId) => {
    navigate(`/listing/${listingId}`);
  };

  // Se è attiva la demo, mostra la demo page
  if (showDemo) {
    return <DemoPage onClose={() => setShowDemo(false)} />;
  }

  return (
    <div className="App">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Properties onViewDetails={handleViewDetails} />
      <Partners />
      <Contact />
      <Footer />
    </div>
  );
};

export default HomePage;