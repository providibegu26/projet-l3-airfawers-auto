const express = require('express');
const router = express.Router();
const {
  validateMaintenance,
  getMaintenanceHistory,
  getAllMaintenanceHistory
} = require('../controllers/entretienController');

// Valider un entretien
router.post('/validate', validateMaintenance);

// Récupérer l'historique d'un véhicule
router.get('/history/:vehiculeId', getMaintenanceHistory);

// Récupérer tout l'historique
router.get('/history', getAllMaintenanceHistory);

module.exports = router; 