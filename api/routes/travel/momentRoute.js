const express = require('express');
const router = express.Router();
const db = require('../../db');

// Route pour récupérer tous les moments d'un voyage
router.get('/moment/:travelId', (req, res) => {
  const { travelId } = req.params;
  const sql = 'SELECT * FROM Moment WHERE travelId = ?';

  db.query(sql, [travelId], (err, result) => {
    if (err) {
      console.error('Erreur lors de la récupération des moments:', err);    
      res.status(500).json({ error: 'Erreur serveur' });
    } else {    
      res.json(result);
    }
  });
});

// Route pour ajouter un moment à un voyage
router.post('/moment', (req, res) => {
  const { place, activity, commentary, travelId } = req.body;
  const sql = 'INSERT INTO Moment (place, activity, momentCommentary, travelId) VALUES (?, ?, ?, ?)';

  db.query(sql, [place, activity, commentary, travelId], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'ajout du moment:', err);
      res.status(500).json({ error: 'Erreur serveur' });
    } else {
      res.json({ message: 'Moment ajouté avec succès' });
    }
  });
});

module.exports = router;
