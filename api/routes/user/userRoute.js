const express = require('express');
const router = express.Router();
const db = require('../../db');

// Route pour récupérer tous les utilisateurs
router.get('/users', (req, res) => {
  const sql = 'SELECT * FROM Users';

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Erreur lors de la récupération des utilisateurs:', err);
      res.status(500).json({ error: 'Erreur serveur' });
    } else {
      res.json(result);
    }   
  });
});

// Route pour ajouter un utilisateur
router.post('/users', (req, res) => {
  const { name, email, password, friendcode } = req.body;
  const sql = 'INSERT INTO Users (name, email, password, friendcode) VALUES (?, ?, ?, ?)';

  db.query(sql, [name, email, password, friendcode], (err, result) => {
    console.log(name)
    console.log(email)
    console.log(password)
    console.log(friendcode)
    if (err) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur:', err);
      res.status(500).json({ error: 'Erreur serveur' });
    } else {
      res.json({ message: 'Utilisateur ajouté avec succès' });
    }
  });
});

module.exports = router;
