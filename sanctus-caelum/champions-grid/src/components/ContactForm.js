import React, { useState } from 'react';
import '../styles/ContactForm.css';

const ContactForm = ({ setPage }) => {
  // basic form state so the component can keep track of what the user types
  const [formData, setFormData] = useState({
    email: '',
    type: 'support',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // when an input changes, it updates the matching field in state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // the main submit flow: send the form, wait for the response, and show a message
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('https://portfolio-projects-rcqt.onrender.com/api/newsletter/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Mensaje enviado exitosamente');
        setFormData({ email: '', type: 'support', message: '' });
        // if everything goes well, it goes back to the main page after a bit
        setTimeout(() => setPage('champions'), 2000);
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error de conexión: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    // UI shell for the contact card and its form
    <div className="contact-form-container">
      <div className="contact-form-box">
        <h2>Contacta con nosotros</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Tu email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="newsletter">Suscripción a Newsletter</option>
            <option value="support">Soporte</option>
            <option value="bug">Reportar Bug</option>
          </select>
          <textarea
            name="message"
            placeholder="Tu mensaje..."
            value={formData.message}
            onChange={handleChange}
            rows="6"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
          <button type="button" onClick={() => setPage('champions')} className="back-btn">
            Volver
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default ContactForm;