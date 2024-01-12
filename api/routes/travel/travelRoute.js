const express = require('express');
const router = express.Router();
const db = require('../../db');

// Route pour récupérer tous les voyages
router.get('/travel', (req, res) => {
  const sql = 'SELECT * FROM Travel';

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Erreur lors de la récupération des voyages:', err);
      res.status(500).json({ error: 'Erreur serveur' });
    } else {
      res.json(result);
    }
  });
});

// Route pour ajouter un voyage
router.post('/travel', (req, res) => {
  const { city, startDate, endDate, commentary, userId } = req.body;
  const sql = 'INSERT INTO Travel (city, startDate, endDate, commentary, userId) VALUES (?, ?, ?, ?, ?)';

  db.query(sql, [city, startDate, endDate, commentary, userId], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'ajout du voyage:', err);
      res.status(500).json({ error: 'Erreur serveur' });
    } else {
      res.json({ message: 'Voyage ajouté avec succès' });
    }
  });
});

module.exports = router;
