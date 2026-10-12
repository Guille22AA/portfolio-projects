import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SuggestChampion.css';

const SuggestChampion = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    anime: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('https://portfolio-projects-rcqt.onrender.com/api/champions/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Sugerencia enviada exitosamente');
        setFormData({ name: '', anime: '' });
        setTimeout(() => navigate('/'), 2000);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`Error de conexión: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="suggest-champion-container">
      <div className="suggest-form-box">
        <h2>Suggest a new Champion</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Character name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="anime"
            placeholder="Anime"
            value={formData.anime}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Suggestion'}
          </button>
          <button type="button" onClick={() => navigate('/')} className="back-btn">
            Return
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default SuggestChampion;