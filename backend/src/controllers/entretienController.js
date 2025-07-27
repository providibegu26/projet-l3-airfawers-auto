const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Valider un entretien et le sauvegarder en base
async function validateMaintenance(req, res) {
  try {
    const { vehiculeId, type, kilometrage, description } = req.body;

    console.log('🔧 Validation entretien:', { vehiculeId, type, kilometrage });

    // Vérifier que le véhicule existe
    const vehicule = await prisma.vehicule.findUnique({
      where: { id: parseInt(vehiculeId) }
    });

    if (!vehicule) {
      return res.status(404).json({ error: 'Véhicule non trouvé' });
    }

    // Sauvegarder l'entretien en base
    const entretien = await prisma.historiqueEntretien.create({
      data: {
        vehiculeId: parseInt(vehiculeId),
        type: type,
        kilometrage: parseInt(kilometrage),
        description: description || `Entretien ${type} effectué`
      }
    });

    console.log('✅ Entretien sauvegardé:', entretien);

    // Retourner l'entretien créé
    res.status(201).json({
      message: `Entretien ${type} validé avec succès`,
      entretien
    });

  } catch (error) {
    console.error('❌ Erreur validation entretien:', error);
    res.status(500).json({ error: error.message });
  }
}

// Récupérer l'historique des entretiens d'un véhicule
async function getMaintenanceHistory(req, res) {
  try {
    const { vehiculeId } = req.params;

    const historique = await prisma.historiqueEntretien.findMany({
      where: { vehiculeId: parseInt(vehiculeId) },
      include: {
        vehicule: {
          select: {
            immatriculation: true,
            marque: true,
            modele: true
          }
        }
      },
      orderBy: { dateEffectuee: 'desc' }
    });

    res.json({ historique });

  } catch (error) {
    console.error('❌ Erreur récupération historique:', error);
    res.status(500).json({ error: error.message });
  }
}

// Récupérer tous les entretiens
async function getAllMaintenanceHistory(req, res) {
  try {
    const historique = await prisma.historiqueEntretien.findMany({
      include: {
        vehicule: {
          select: {
            immatriculation: true,
            marque: true,
            modele: true
          }
        }
      },
      orderBy: { dateEffectuee: 'desc' }
    });

    res.json({ historique });

  } catch (error) {
    console.error('❌ Erreur récupération historique:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  validateMaintenance,
  getMaintenanceHistory,
  getAllMaintenanceHistory
}; 