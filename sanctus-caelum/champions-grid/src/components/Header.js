import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";

const Header = () => {
  const [languageMenu, setLanguageMenu] = useState(false);

  const toggleLanguageMenu = () => {
    setLanguageMenu(!languageMenu);
  };

  // Enlaces a secciones que aún no existen: se mantiene el hover pero no navegan
  const disableLink = (e) => e.preventDefault();

  // El grid está en "/": si ya estamos ahí el Link no hace nada visible, así que subimos arriba
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="header-left">
          <div className="header-logo">
            <Link to="/" onClick={scrollToTop}>
              <img src="/iconos/SC_logo.png" alt="Sanctus Caelum" className="header-logo" />
            </Link>
          </div>
          <nav className="header-nav">
            <ul>
              <li><Link to="/" className="nav-link" onClick={scrollToTop}>CHAMPIONS</Link></li>
              <li><a href="#maps" className="nav-link" onClick={disableLink}>WORLD BUILDING</a></li>
              <li><a href="#ranked" className="nav-link" onClick={disableLink}>RANKED SYSTEM</a></li>
            </ul>
          </nav>
        </div>

        <div className="header-actions">
          <div className="language-selector">
            <button className="lang-btn" onClick={toggleLanguageMenu} title="Language">
              <img src="/iconos/ww_icon.png" alt="Language" className="icon-img" />
            </button>
            {languageMenu && (
              <div className="language-menu">
                <a href="#es" onClick={disableLink}>Español</a>
                <a href="#en" onClick={disableLink}>English</a>
                <a href="#fr" onClick={disableLink}>Français</a>
                <a href="#de" onClick={disableLink}>Deutsch</a>
              </div>
            )}
          </div>

          <button className="search-btn" title="Search">
            <img src="/iconos/lens_icon.png" alt="Search" className="icon-img" />
          </button>

          <button className="sign-in-btn">Sign In</button>
          <button className="play-btn">PLAY NOW</button>
        </div>
      </div>
    </header>
  );
};

export default Header;