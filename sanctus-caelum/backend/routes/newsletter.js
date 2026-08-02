const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');

// POST route to let people subscribe to the newsletter
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    // validation

    if (!email) {
      return res.status(400).json({ error: 'Email requerido' });
    }

    // create the subscription entry in the DB
    const subscription = await Newsletter.create({
      email,
      type: 'newsletter'
    });

    // send back the created record so the frontend can use it if needed
    res.json({ message: 'Suscripción exitosa ✅', data: subscription });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: 'Email ya registrado' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// another POST route, this one is for sending feedback or bug reports
router.post('/feedback', async (req, res) => {
  try {
    const { email, type, message } = req.body;

    // validation

    if (!email || !message) {
      return res.status(400).json({ error: 'Email y mensaje requeridos' });
    }

    // same model, but here we store a feedback message instead of a normal subscription
    const feedback = await Newsletter.create({
      email,
      type: type || 'support',
      message
    });

    // return the saved feedback so the client gets a response
    res.json({ message: 'Feedback enviado ✅', data: feedback });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET route for admins, just fetches all the submitted feedbacks
router.get('/feedbacks', async (req, res) => {
  try {
    const feedbacks = await Newsletter.findAll();

    // simple response with all rows found
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;