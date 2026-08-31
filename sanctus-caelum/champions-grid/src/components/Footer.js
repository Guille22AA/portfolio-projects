import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Footer.css";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="main-footer">
      <div className="footer-simulation-bar">
        <button onClick={() => navigate('/')}>About Sanctus Caelum</button>
        <button onClick={() => navigate('/suggest')}>Help Us Improve</button>
        <button onClick={() => navigate('/')}>Server Status</button>
        <button onClick={() => navigate('/contact')}>Support</button>
      </div>

      <div className="footer-content">
        <div className="footer-logo-section">
          <img src="/iconos/G2A2_logo.png" alt="Sanctus Caelum" className="footer-logo-G2A2" />
        </div>

        <p className="footer-copyright">
          © 2024 Sanctus Caelum. All rights reserved. Anime Champions is a fan-made project created with passion by dedicated fans.
        </p>

        <div className="footer-links">
          <ul>
            <li><a href="#privacy">PRIVACY POLICY</a></li>
            <li><a href="#terms">TERMS OF USE</a></li>
            <li><a href="#cookies">COOKIE PREFERENCES</a></li>
          </ul>
        </div>

        <div className="rating-section">
          <div className="rating-box">
            <div className="rating-content">
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