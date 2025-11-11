import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  // Controlla se l'utente è autenticato
  const isAuthenticated = localStorage.getItem('companyAuth') === 'true';
  const userInfo = JSON.parse(localStorage.getItem('companyUserInfo') || '{}');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    if (isHomePage) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Se non siamo nella homepage, naviga prima alla homepage poi scrolla
      window.location.href = `/#${sectionId}`;
    }
  };

  const scrollToContact = () => {
    if (isHomePage) {
      scrollToSection('contatti');
    } else {
      window.location.href = '/#contatti';
    }
  };

  const handleUserIconClick = () => {
    console.log('🔑 User icon clicked, authenticated:', isAuthenticated);
    if (isAuthenticated) {
      setShowUserMenu(!showUserMenu);
    } else {
      console.log('🔄 Navigating to /admin');
      navigate('/admin');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('companyAuth');
    localStorage.removeItem('companyUserInfo');
    localStorage.removeItem('registeredUsers');
    setShowUserMenu(false);
    navigate('/');
  };

  // Chiudi il menu se clicchi fuori
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="nav-container">
        <div className="logo">
          <Link to="/">
            <img 
              src="https://www.novareimmobiliare.it/NovaRe_LogoCircle.png" 
              alt="Nova RE Logo"
              style={{ cursor: 'pointer' }}
            />
          </Link>
        </div>
        <div className="navbar-center">
          <ul className="nav-menu">
            <li>
              {isHomePage ? (
                <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a>
              ) : (
                <Link to="/">Home</Link>
              )}
            </li>
            <li>
              <Link to="/immobili">Immobili</Link>
            </li>
            <li>
              <a href="#chi-siamo" onClick={(e) => { e.preventDefault(); scrollToSection('chi-siamo'); }}>Chi siamo</a>
            </li>
            <li>
              <a href="#servizi" onClick={(e) => { e.preventDefault(); scrollToSection('servizi'); }}>Servizi</a>
            </li>
            <li>
              <a href="#contatti" onClick={(e) => { e.preventDefault(); scrollToSection('contatti'); }}>Contatti</a>
            </li>
          </ul>
          
          <div className="navbar-right">
            <button className="contact-btn" onClick={scrollToContact}>
              Contattaci
            </button>
            
            <div className="user-menu-container">
              <div className="user-icon" onClick={handleUserIconClick}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                {isAuthenticated && <div className="user-indicator"></div>}
              </div>
              
              {showUserMenu && isAuthenticated && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <div className="user-name">{userInfo.username || 'Utente'}</div>
                    <div className="user-email">{userInfo.email || ''}</div>
                  </div>
                  <hr />
                  <button className="dropdown-item" onClick={() => navigate('/dashboard')}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    Pannello Admin
                  </button>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;