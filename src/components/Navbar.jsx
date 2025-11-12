import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthPersistent } from '../hooks/useAuthPersistent';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  // Usa il nuovo hook di autenticazione unificato
  const { isAuthenticated, user, logout } = useAuthPersistent();

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
    // Chiudi il menu mobile dopo il click
    setMobileMenuOpen(false);
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
    console.log('🚪 Logout dalla navbar');
    logout(); // Usa il nuovo sistema unificato
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
        
        {/* Menu Hamburger per Mobile */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="navbar-center">
          <ul className={`nav-menu ${mobileMenuOpen ? 'nav-menu-open' : ''}`}>
            <li>
              {isHomePage ? (
                <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a>
              ) : (
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              )}
            </li>
            <li>
              <Link 
                to="/immobili" 
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowUserMenu(false);
                }}
              >
                Immobili
              </Link>
            </li>
            <li>
              <Link 
                to="/about" 
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowUserMenu(false);
                }}
              >
                Chi siamo
              </Link>
            </li>
            <li>
              {isHomePage ? (
                <a href="#servizi" onClick={(e) => { e.preventDefault(); scrollToSection('servizi'); }}>Servizi</a>
              ) : (
                <a href="/#servizi" onClick={(e) => { e.preventDefault(); window.location.href = '/#servizi'; setMobileMenuOpen(false); }}>Servizi</a>
              )}
            </li>
            <li>
              {isHomePage ? (
                <a href="#contatti" onClick={(e) => { e.preventDefault(); scrollToSection('contatti'); }}>Contatti</a>
              ) : (
                <a href="/#contatti" onClick={(e) => { e.preventDefault(); window.location.href = '/#contatti'; setMobileMenuOpen(false); }}>Contatti</a>
              )}
            </li>
            <li>
              <a 
                href="https://www.novareimmobiliare.it/brochure.pdf" 
                download="Nova_RE_Brochure.pdf"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowUserMenu(false);
                }}
              >
                Brochure
              </a>
            </li>
          </ul>
          
          <div className="navbar-right">
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
                    <div className="user-name">{user?.fullName || user?.username || 'Utente'}</div>
                    <div className="user-email">{user?.email || ''}</div>
                    {user?.role && <div className="user-role">{user.role}</div>}
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