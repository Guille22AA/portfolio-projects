import React, { useState } from 'react';
import '../styles/SuggestChampion.css';

const SuggestChampion = ({ setPage }) => {
  // basic form state, just keeping the two inputs in one place
  const [formData, setFormData] = useState({
    name: '',
    anime: ''
  });
  // show the button is doing something while the request is running
  const [loading, setLoading] = useState(false);
  // feedback text for success or fail after the request
  const [message, setMessage] = useState('');

  // whenever the user types, we update the matching field in the form state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // send the form, wait for the backend, then update the UI
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/champions/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Sugerencia enviada exitosamente');
        setFormData({ name: '', anime: '' });
        // small pause so the user can actually see the success message before going back
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
          {/* main action button, it changes text while the request is in progress */}
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Suggestion'}
          </button>
          {/* quick exit back to the main champion view */}
          <button type="button" onClick={() => setPage('champions')} className="back-btn">
            Return
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default SuggestChampion;