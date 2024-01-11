const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
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

// Fonction pour générer un friendcode aléatoire
function generateRandomFriendCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let friendcode = '';

  for (let i = 0; i < 6; i++) {
    friendcode += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return friendcode;
}

// Fonction pour vérifier si un friendcode existe déjà dans la base de données
async function isFriendCodeUnique(friendcode) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT COUNT(*) AS count FROM Users WHERE friendcode = ?';
    db.query(sql, [friendcode], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result[0].count === 0);
      }
    });
  });
}

// Route pour ajouter un utilisateur avec hachage de mot de passe et friendcode aléatoire
router.post('/users', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let friendcode;
    do {
      friendcode = generateRandomFriendCode();
    } while (!(await isFriendCodeUnique(friendcode)));

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = 'INSERT INTO Users (name, email, password, friendcode) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, email, hashedPassword, friendcode], (err, result) => {
      if (err) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur:', err);
        res.status(500).json({ error: 'Erreur serveur' });
      } else {
        res.json({ message: 'Utilisateur ajouté avec succès', friendcode });
      }
    });
  } catch (error) {
    console.error('Erreur lors du hachage du mot de passe:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour récupérer tous les voyages d'un utilisateur
router.get('/users/:userId/travel', (req, res) => {
  const { userId } = req.params;
  const sql = 'SELECT * FROM Travel WHERE userId = ?';

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Erreur lors de la récupération des voyages de l\'utilisateur:', err);
      res.status(500).json({ error: 'Erreur serveur' });
    } else {
      res.json(result);
    }
  });
});

// Route de connexion (login)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Récupérer l'utilisateur par son email depuis la base de données
    const sql = 'SELECT * FROM Users WHERE email = ?';
    db.query(sql, [email], async (err, result) => {
      if (err) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', err);
        res.status(500).json({ error: 'Erreur serveur' });
      } else {
        if (result.length > 0) {
          // Vérifier le mot de passe avec Bcrypt
          const isPasswordValid = await bcrypt.compare(password, result[0].password);

          if (isPasswordValid) {
            // Générer un token JWT pour l'utilisateur
            const token = jwt.sign({ userId: result[0].id }, 'AZD21431DSQSDFGHJKD12D1DFQ', { expiresIn: '1h' });
            res.json({ token });
          } else {
            res.status(401).json({ error: 'Mot de passe incorrect' });
          }
        } else {
          res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors du traitement de la connexion:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
