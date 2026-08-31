import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";

const Header = () => {
  const [languageMenu, setLanguageMenu] = useState(false);

  const toggleLanguageMenu = () => {
    setLanguageMenu(!languageMenu);
  };

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="header-left">
          <div className="header-logo">
            <Link to="/">
              <img src="/iconos/SC_logo.png" alt="Sanctus Caelum" className="header-logo" />
            </Link>
          </div>
          <nav className="header-nav">
            <ul>
              <li><Link to="/" className="nav-link">CHAMPIONS</Link></li>
              <li><a href="#maps" className="nav-link">WORLD BUILDING</a></li>
              <li><a href="#ranked" className="nav-link">RANKED SYSTEM</a></li>
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
                <a href="#es">Español</a>
                <a href="#en">English</a>
                <a href="#fr">Français</a>
                <a href="#de">Deutsch</a>
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