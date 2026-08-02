const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const ChampionSuggestion = require('./models/ChampionSuggestion');
const Newsletter = require('./models/Newsletter');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conectar y sincronizar BD
sequelize.sync({ force: false })
  .then(() => console.log('✅ Base de datos sincronizada'))
  .catch(err => console.log('❌ Error:', err));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend funcionando ✅' });
});

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});

// Importar rutas
const championsRouter = require('./routes/champions');
const newsletterRouter = require('./routes/newsletter');

// Usar rutas
app.use('/api/champions', championsRouter);
app.use('/api/newsletter', newsletterRouter);