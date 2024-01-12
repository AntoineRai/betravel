const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const db = require("../../db");

// Route pour récupérer tous les utilisateurs
router.get("/users", (req, res) => {
  const sql = "SELECT * FROM Users";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Erreur lors de la récupération des utilisateurs:", err);
      res.status(500).json({ error: "Erreur serveur" });
    } else {
      res.json(result);
    }
  });
});

// Fonction pour générer un friendcode aléatoire
function generateRandomFriendCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let friendcode = "";

  for (let i = 0; i < 6; i++) {
    friendcode += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  return friendcode;
}

// Fonction pour vérifier si un friendcode existe déjà dans la base de données
async function isFriendCodeUnique(friendcode) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT COUNT(*) AS count FROM Users WHERE friendcode = ?";
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
router.post("/users", async (req, res) => {
  const { name, email, password } = req.body;

  // Vérifier si l'email est déjà présent
  const emailCheckSql = "SELECT * FROM Users WHERE email = ?";
  db.query(emailCheckSql, [email], async (emailCheckErr, emailCheckResult) => {
    if (emailCheckErr) {
      console.error(
        "Erreur lors de la vérification de l'email:",
        emailCheckErr
      );
      return res.status(500).json({ error: "Erreur serveur" });
    }

    if (emailCheckResult.length > 0) {
      // L'email est déjà utilisé
      return res.status(400).json({ error: "Cet email est déjà enregistré" });
    }

    // Vérifier si le nom d'utilisateur est déjà présent
    const usernameCheckSql = "SELECT * FROM Users WHERE name = ?";
    db.query(
      usernameCheckSql,
      [name],
      async (usernameCheckErr, usernameCheckResult) => {
        if (usernameCheckErr) {
          console.error(
            "Erreur lors de la vérification du nom d'utilisateur:",
            usernameCheckErr
          );
          return res.status(500).json({ error: "Erreur serveur" });
        }

        if (usernameCheckResult.length > 0) {
          // Le nom d'utilisateur est déjà utilisé
          return res
            .status(400)
            .json({ error: "Ce nom d'utilisateur est déjà enregistré" });
        }

        try {
          let friendcode;
          do {
            friendcode = generateRandomFriendCode();
          } while (!(await isFriendCodeUnique(friendcode)));

          const hashedPassword = await bcrypt.hash(password, 10);

          const insertSql =
            "INSERT INTO Users (name, email, password, friendcode) VALUES (?, ?, ?, ?)";
          db.query(
            insertSql,
            [name, email, hashedPassword, friendcode],
            (insertErr, insertResult) => {
              if (insertErr) {
                console.error(
                  "Erreur lors de l'ajout de l'utilisateur:",
                  insertErr
                );
                return res.status(500).json({ error: "Erreur serveur" });
              } else {
                res.json({
                  message: "Utilisateur ajouté avec succès",
                  friendcode,
                });
              }
            }
          );
        } catch (hashError) {
          console.error("Erreur lors du hachage du mot de passe:", hashError);
          res.status(500).json({ error: "Erreur serveur" });
        }
      }
    );
  });
});

// Route pour modifier le nom d'utilisateur
router.put("/users/modify/:userId/", async (req, res) => {
  const { userId } = req.params;
  const { newUsername } = req.body;

  // Vérifier si le nouveau nom d'utilisateur est déjà présent
  const usernameCheckSql = "SELECT * FROM Users WHERE name = ? AND idUser != ?";
  db.query(
    usernameCheckSql,
    [newUsername, userId],
    async (usernameCheckErr, usernameCheckResult) => {
      if (usernameCheckErr) {
        console.error(
          "Erreur lors de la vérification du nouveau nom d'utilisateur:",
          usernameCheckErr
        );
        return res.status(500).json({ error: "Erreur serveur" });
      }

      if (usernameCheckResult.length > 0) {
        // Le nouveau nom d'utilisateur est déjà utilisé
        return res
          .status(400)
          .json({ error: "Ce nom d'utilisateur est déjà enregistré" });
      }

      // Mettre à jour le nom d'utilisateur
      const updateUsernameSql = "UPDATE Users SET name = ? WHERE idUser = ?";
      db.query(
        updateUsernameSql,
        [newUsername, userId],
        (updateErr, updateResult) => {
          if (updateErr) {
            console.error(
              "Erreur lors de la mise à jour du nom d'utilisateur:",
              updateErr
            );
            return res.status(500).json({ error: "Erreur serveur" });
          } else {
            res.json({ message: "Nom d'utilisateur mis à jour avec succès" });
          }
        }
      );
    }
  );
});

// Route pour récupérer tous les voyages d'un utilisateur
router.get("/users/:userId/travel", (req, res) => {
  const { userId } = req.params;
  const sql = "SELECT * FROM Travel WHERE userId = ?";

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error(
        "Erreur lors de la récupération des voyages de l'utilisateur:",
        err
      );
      res.status(500).json({ error: "Erreur serveur" });
    } else {
      res.json(result);
    }
  });
});

// Route pour récupérer le dernier voyage d'un utilisateur
router.get("/users/:userId/lastTravel", (req, res) => {
  const { userId } = req.params;
  const sql =
    "SELECT * FROM Travel WHERE userId = ? ORDER BY startDate DESC LIMIT 1";

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error(
        "Erreur lors de la récupération des voyages de l'utilisateur:",
        err
      );
      res.status(500).json({ error: "Erreur serveur" });
    } else {
      res.json(result);
    }
  });
});

// Route de connexion (login)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Récupérer l'utilisateur par son email depuis la base de données
    const sql = "SELECT * FROM Users WHERE email = ?";
    db.query(sql, [email], async (err, result) => {
      if (err) {
        console.error("Erreur lors de la récupération de l'utilisateur:", err);
        res.status(500).json({ error: "Erreur serveur" });
      } else {
        if (result.length > 0) {
          // Vérifier le mot de passe avec Bcrypt
          const isPasswordValid = await bcrypt.compare(
            password,
            result[0].password
          );

          if (isPasswordValid) {
            // Générer un token JWT pour l'utilisateur
            const token = jwt.sign(
              { userId: result[0].idUser },
              "AZD21431DSQSDFGHJKD12D1DFQ",
              { expiresIn: "1h" }
            );
            res.json({ idUser: result[0].idUser, token: token });
          } else {
            res.status(401).json({ error: "Mot de passe incorrect" });
          }
        } else {
          res.status(404).json({ error: "Utilisateur non trouvé" });
        }
      }
    });
  } catch (error) {
    console.error("Erreur lors du traitement de la connexion:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Route pour récupérer les amis d'un utilisateur
router.get("/users/:userId/friends", (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  const sql =
    "SELECT Users.idUser, Users.name, Users.email, Users.friendcode FROM Friends " +
    "INNER JOIN Users ON Friends.userId2 = Users.idUser " +
    "WHERE Friends.userId1 = ?";

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error(
        "Erreur lors de la récupération des amis de l'utilisateur:",
        err
      );
      res.status(500).json({ error: "Erreur serveur" });
    } else {
      res.json(result);
    }
  });
});

// Fonction pour vérifier si les amis sont déjà enregistrés
async function areFriendsAlreadyAdded(userId1, userId2) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT COUNT(*) AS count FROM Friends " +
      "WHERE (userId1 = ? AND userId2 = ?)";
    db.query(sql, [userId1, userId2, userId1, userId2], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result[0].count > 0);
      }
    });
  });
}

// Route pour ajouter deux amis
router.post("/users/friends", async (req, res) => {
  const { userId1, userId2 } = req.body;

  try {
    // Vérifier que les amis ne sont pas déjà enregistrés
    const isAlreadyFriends = await areFriendsAlreadyAdded(userId1, userId2);

    if (!isAlreadyFriends) {
      // Enregistrer les amis dans la table Friends
      const sql = "INSERT INTO Friends (userId1, userId2) VALUES (?, ?)";
      db.query(sql, [userId1, userId2], (err, result) => {
        if (err) {
          console.error("Erreur lors de l'ajout des amis:", err);
          res.status(500).json({ error: "Erreur serveur" });
        } else {
          res.json({ message: "Amis ajoutés avec succès" });
        }
      });
    } else {
      res.status(400).json({ error: "Ces amis sont déjà enregistrés" });
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout des amis:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Route pour récupérer le profil d'un utilisateur grâce à son Id
router.get("/users/id/:userId", (req, res) => {
  const { userId } = req.params;
  const sql =
    "SELECT Users.idUser, Users.name, Users.email, Users.friendcode FROM Users WHERE idUser = ?";

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error(
        "Erreur lors de la récupération du profil de l'utilisateur par ID:",
        err
      );
      res.status(500).json({ error: "Erreur serveur" });
    } else {
      res.json(result);
    }
  });
});

// Route pour récupérer le profil d'un utilisateur grâce à son email
router.get("/users/email/:email", (req, res) => {
  const { email } = req.params;
  const sql =
    "SELECT Users.idUser, Users.name, Users.email, Users.friendcode FROM Users WHERE email = ?";

  db.query(sql, [email], (err, result) => {
    if (err) {
      console.error(
        "Erreur lors de la récupération du profil de l'utilisateur par email:",
        err
      );
      res.status(500).json({ error: "Erreur serveur" });
    } else {
      res.json(result);
    }
  });
});

// Route pour récupérer les derniers voyages de tous les amis d'un utilisateur
router.get("/users/:userId/friends/lastTravel", async (req, res) => {
  const { userId } = req.params;

  try {
    // Récupérer les amis de l'utilisateur
    const friendsSql = "SELECT userId2 FROM Friends WHERE userId1 = ?";
    db.query(friendsSql, [userId], async (friendsErr, friendsResult) => {
      if (friendsErr) {
        console.error(
          "Erreur lors de la récupération des amis de l'utilisateur:",
          friendsErr
        );
        return res.status(500).json({ error: "Erreur serveur" });
      }

      // Extraire les ID des amis
      const friendIds = friendsResult.map((friend) => friend.userId2);

      // Récupérer les noms des amis
      const usernamesSql = "SELECT idUser, name FROM Users WHERE idUser IN (?)";
      db.query(usernamesSql, [friendIds], (usernamesErr, usernamesResult) => {
        if (usernamesErr) {
          console.error(
            "Erreur lors de la récupération des noms des amis:",
            usernamesErr
          );
          return res.status(500).json({ error: "Erreur serveur" });
        }

        // Créer un objet pour stocker les noms des amis
        const friendNames = {};
        usernamesResult.forEach((user) => {
          friendNames[user.idUser] = user.name;
        });

        // Récupérer les derniers voyages de chaque ami
        const lastTravelsSql =
          "SELECT * FROM Travel WHERE (userId IN (?) AND startDate = (SELECT MAX(startDate) FROM Travel WHERE userId = Travel.userId))";
        db.query(lastTravelsSql, [friendIds], (travelsErr, travelsResult) => {
          if (travelsErr) {
            console.error(
              "Erreur lors de la récupération des derniers voyages des amis:",
              travelsErr
            );
            return res.status(500).json({ error: "Erreur serveur" });
          }

          // Ajouter les noms des amis aux résultats des voyages
          const resultWithNames = travelsResult.map((travel) => ({
            username: friendNames[travel.userId],
            travel: travel,
          }));

          res.json(resultWithNames);
        });
      });
    });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des derniers voyages des amis:",
      error
    );
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
