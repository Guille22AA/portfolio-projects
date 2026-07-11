import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// This is the place where the app gets hooked into the page.
const root = ReactDOM.createRoot(document.getElementById('root'));

// Then React loads the main component and shows it on screen.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);