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

    // Mapping des nouveaux noms vers les anciens noms pour la sauvegarde
    const typeMapping = {
      'vidange': 'vidange',
      'categorie_b': 'bougies',
      'categorie_c': 'freins'
    };

    const oldType = typeMapping[type] || type;
    console.log(`🔄 Mapping: ${type} → ${oldType}`);

    // Sauvegarder l'entretien en base avec l'ancien nom
    const entretien = await prisma.historiqueEntretien.create({
      data: {
        vehiculeId: parseInt(vehiculeId),
        type: oldType,
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

// Supprimer un entretien spécifique
async function deleteMaintenance(req, res) {
  try {
    const { id } = req.params;
    
    console.log('🗑️ Suppression entretien:', { id });

    // Vérifier que l'entretien existe
    const entretien = await prisma.historiqueEntretien.findUnique({
      where: { id: parseInt(id) }
    });

    if (!entretien) {
      return res.status(404).json({ error: 'Entretien non trouvé' });
    }

    // Supprimer l'entretien
    await prisma.historiqueEntretien.delete({
      where: { id: parseInt(id) }
    });

    console.log('✅ Entretien supprimé:', entretien);
    res.json({ 
      message: 'Entretien supprimé avec succès',
      deletedEntretien: entretien
    });

  } catch (error) {
    console.error('❌ Erreur suppression entretien:', error);
    res.status(500).json({ error: error.message });
  }
}

// Vider tout l'historique des entretiens
async function clearAllMaintenance(req, res) {
  try {
    console.log('🗑️ Vidage de tout l\'historique des entretiens');

    // Supprimer tous les entretiens
    const result = await prisma.historiqueEntretien.deleteMany({});

    console.log('✅ Historique vidé:', result.count, 'entretiens supprimés');
    res.json({ 
      message: `Historique vidé avec succès (${result.count} entretiens supprimés)`,
      deletedCount: result.count
    });

  } catch (error) {
    console.error('❌ Erreur vidage historique:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  validateMaintenance,
  getMaintenanceHistory,
  getAllMaintenanceHistory,
  deleteMaintenance,
  clearAllMaintenance
}; 