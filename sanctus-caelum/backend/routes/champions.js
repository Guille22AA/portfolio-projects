const express = require('express');
const router = express.Router();
const ChampionSuggestion = require('../models/ChampionSuggestion');

// basic route to save a new champion idea from the form
router.post('/suggest', async (req, res) => {
  try {
    const { name, anime } = req.body;

    // validation
    if (!name || !anime) {
      return res.status(400).json({ error: 'Nombre y anime son requeridos' });
    }

    // create the new suggestion 
    const suggestion = await ChampionSuggestion.create({
      name,
      anime,
      description: '',
      imageUrl: ''
    });

    // send back the saved object so the frontend knows it worked
    res.json({ message: 'Sugerencia guardada ✅', data: suggestion });
  } catch (error) {
    // if something breaks, just return the error message
    res.status(500).json({ error: error.message });
  }
});

// get every saved suggestion, probably for an admin screen
router.get('/suggestions', async (req, res) => {
  try {
    const suggestions = await ChampionSuggestion.findAll();
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// simple count endpoint to know how many ideas are in the DB
router.get('/suggestions/count', async (req, res) => {
  try {
    const count = await ChampionSuggestion.count();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;