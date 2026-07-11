import React from "react";
import "../styles/Footer.css";

const Footer = ({ setPage }) => {
  return (
    <footer className="main-footer">
      {/* quick top buttons to jump around the app */}
      <div className="footer-simulation-bar">
        <button onClick={() => setPage('champions')}>About Sanctus Caelum</button>
        <button onClick={() => setPage('suggest')}>Help Us Improve</button>
        <button onClick={() => setPage('champions')}>Server Status</button>
        <button onClick={() => setPage('contact')}>Support</button>
      </div>

      {/* main footer block, this is the big info part */}
      <div className="footer-content">
        <div className="footer-logo-section">
          {/* brand logo on the left side */}
          <img src="/iconos/G2A2_logo.png" alt="Sanctus Caelum" className="footer-logo-G2A2" />
        </div>

        {/* short copyright type text*/}
        <p className="footer-copyright">
          © 2024 Sanctus Caelum. All rights reserved. Anime Champions is a fan-made project created with passion by dedicated fans.
        </p>

        {/* small standard legal links at the bottom*/}
        <div className="footer-links">
          <ul>
            <li><a href="#privacy">PRIVACY POLICY</a></li>
            <li><a href="#terms">TERMS OF USE</a></li>
            <li><a href="#cookies">COOKIE PREFERENCES</a></li>
          </ul>
        </div>

        {/* age rating and the little descriptors */}
        <div className="rating-section">
          <div className="rating-box">
            <div className="rating-content">
              {/* rating badge, just visual info */}
              <img src="/iconos/ESRB_Teen.png" alt="ESBR Teen" className="ESRB-logo"/>
            </div>
            <div className="rating-description">
              <p className="rating-title">Violence, Anime Content</p>
              <ul className="rating-descriptors">
                <li>Non-realistic violence in anime style</li>
                <li>Fantasy battle scenes</li>
                <li>Superhuman abilities and combat</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;