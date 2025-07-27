require('dotenv').config();
const express = require('express');
const cors = require('cors');
const adminRoutes = require('./routes/adminRoutes');
const authChauffeurRoutes = require('./routes/authChauffeurRoutes');
const vehiculeRoutes = require('./routes/vehiculeRoutes');
const entretienRoutes = require('./routes/entretienRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/auth-chauffeur', authChauffeurRoutes);
app.use('/api/admin/vehicules', vehiculeRoutes);
app.use('/api/admin/entretiens', entretienRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
}); 