const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user/userRoute');
const travelRoutes = require('./routes/travel/travelRoute');
const momentRoutes = require('./routes/travel/momentRoute');

const app = express();
const port = 3001;

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

// Utiliser les routes liées aux voyages
app.use('/api', travelRoutes);

// Utiliser les routes liées aux moments
app.use('/api', momentRoutes);

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
