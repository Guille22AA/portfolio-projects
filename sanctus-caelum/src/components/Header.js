import React, { useState } from "react";
import "../styles/Header.css";

const Header = () => {
  // little state to know if the language menu is open or not
  const [languageMenu, setLanguageMenu] = useState(false);

  const toggleLanguageMenu = () => {
    // just flips the state so the dropdown appears/disappears
    setLanguageMenu(!languageMenu);
  };

  return (
    <header className="main-header">
      <div className="header-container">
        {/* Left side: logo and the main nav links */}
        <div className="header-left">
          {/* the brand logo on the left */}
          <div className="header-logo">
            <img src="/iconos/sc_logo.png" alt="Sanctus Caelum" className="header-logo" />
          </div>
          {/* links that go to the main sections of the page */}
          <nav className="header-nav">
            <ul>
              <li><a href="#champions" className="nav-link">CHAMPIONS</a></li>
              <li><a href="#maps" className="nav-link">MAPS</a></li>
              <li><a href="#ranked" className="nav-link">RANKED SYSTEM</a></li>
            </ul>
          </nav>
        </div>

        {/* Right side: action buttons and small controls */}
        <div className="header-actions">
          {/* language selector, pretty simple UI stuff */}
          <div className="language-selector">
            <button className="lang-btn" onClick={toggleLanguageMenu} title="Language">
              <img src="/iconos/ww_icon.png" alt="Language" className="icon-img" />
            </button>
            {languageMenu && (
              <div className="language-menu">
                {/* the language options shown only when the menu is on */}
                <a href="#es">Español</a>
                <a href="#en">English</a>
                <a href="#fr">Français</a>
                <a href="#de">Deutsch</a>
              </div>
            )}
          </div>

          {/* search icon button */}
          <button className="search-btn" title="Search">
            <img src="/iconos/lens_icon.png" alt="Search" className="icon-img" />
          </button>

          {/* sign in button, basic CTA */}
          <button className="sign-in-btn">Sign In</button>

          {/* big play button for the main action */}
          <button className="play-btn">PLAY NOW</button>
        </div>
      </div>
    </header>
  );
};

export default Header;