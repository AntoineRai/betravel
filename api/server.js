const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user/userRoute');

const app = express();
const port = 3000;

// Middleware pour parser les requêtes JSON
app.use(bodyParser.json());

// Middleware pour gérer les erreurs de CORS (si nécessaire)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Utiliser les routes liées aux utilisateurs
app.use('/api', userRoutes);

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
