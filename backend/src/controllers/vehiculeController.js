const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Créer un véhicule
async function createVehicule(req, res) {
  try {
    console.log('BODY VEHICULE:', req.body);
    const { marque, modele, immatriculation, categorie, kilometrage, statut, chauffeurId } = req.body;
    
    const vehicule = await prisma.vehicule.create({
      data: {
        marque,
        modele,
        immatriculation,
        categorie,
        kilometrage: Number(kilometrage),
        statut: statut || "non attribué",
        chauffeurId: chauffeurId || null,
        dateAjout: new Date()
      }
    });

    res.status(201).json({ message: "Véhicule créé avec succès", vehicule });
  } catch (error) {
    console.error('Erreur création véhicule:', error);
    res.status(500).json({ error: error.message });
  }
}

// Récupérer tous les véhicules
async function getAllVehicules(req, res) {
  try {
    const vehicules = await prisma.vehicule.findMany({
      include: {
        chauffeur: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            telephone: true,
            user: {
              select: {
                email: true
              }
            }
          }
        },
        historiqueEntretiens: {
          orderBy: { dateEffectuee: 'desc' },
          take: 1 // Prendre le dernier entretien de chaque type
        }
      }
    });

    // Ajouter les estimations d'entretien calculées
    const vehiculesWithEstimations = vehicules.map(vehicule => {
      const category = vehicule.categorie || 'LIGHT';
      const thresholds = {
        HEAVY: { vidange: 8000, bougies: 80000, freins: 20000 },
        LIGHT: { vidange: 5000, bougies: 40000, freins: 50000 }
      };
      
      const currentKm = vehicule.kilometrage || 0;
      const weeklyKm = vehicule.weeklyKm || 500;
      
      // Calculer les estimations pour chaque type d'entretien
      const estimations = {};
      ['vidange', 'bougies', 'freins'].forEach(type => {
        const threshold = thresholds[category][type];
        const nextThreshold = Math.ceil(currentKm / threshold) * threshold + threshold;
        const kmRemaining = nextThreshold - currentKm;
        const weeksRemaining = Math.ceil(kmRemaining / weeklyKm);
        const daysRemaining = weeksRemaining * 7;
        
        estimations[`${type}NextThreshold`] = nextThreshold;
        estimations[`${type}KmRemaining`] = kmRemaining;
        estimations[`${type}WeeksRemaining`] = weeksRemaining;
        estimations[`${type}DaysRemaining`] = daysRemaining;
      });
      
      return {
        ...vehicule,
        ...estimations
      };
    });

    res.json({ vehicules: vehiculesWithEstimations });
  } catch (error) {
    console.error('❌ Erreur récupération véhicules:', error);
    res.status(500).json({ error: error.message });
  }
}

// Assigner un chauffeur à un véhicule
async function assignDriver(req, res) {
  try {
    const { id } = req.params;
    const { chauffeurId } = req.body;
    
    console.log('👤 Assignation chauffeur:', { vehiculeId: id, chauffeurId });
    
    // Vérifier si le chauffeur est déjà assigné à un autre véhicule
    if (chauffeurId) {
      const existingAssignment = await prisma.vehicule.findFirst({
        where: {
          chauffeurId: parseInt(chauffeurId),
          id: { not: parseInt(id) }
        }
      });
      
      if (existingAssignment) {
        return res.status(400).json({ 
          error: "Ce chauffeur est déjà assigné à un autre véhicule" 
        });
      }
    }
    
    // Mettre à jour le véhicule avec le nouveau chauffeur
    const vehicule = await prisma.vehicule.update({
      where: { id: parseInt(id) },
      data: {
        chauffeurId: chauffeurId ? parseInt(chauffeurId) : null,
        statut: chauffeurId ? "attribué" : "non attribué"
      },
      include: {
        chauffeur: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            telephone: true,
            user: {
              select: {
                email: true
              }
            }
          }
        }
      }
    });

    console.log('✅ Chauffeur assigné:', vehicule);
    res.json({ 
      message: chauffeurId ? "Chauffeur assigné avec succès" : "Chauffeur retiré avec succès", 
      vehicule 
    });
  } catch (error) {
    console.error('❌ Erreur assignation chauffeur:', error);
    res.status(500).json({ error: error.message });
  }
}

// Mettre à jour un véhicule
async function updateVehicule(req, res) {
  try {
    const { id } = req.params;
    const { marque, modele, immatriculation, categorie, kilometrage, statut, chauffeurId } = req.body;
    
    console.log('🔄 Mise à jour véhicule:', { id, marque, modele, immatriculation, categorie, kilometrage });
    
    const vehicule = await prisma.vehicule.update({
      where: { id: parseInt(id) },
      data: {
        marque,
        modele,
        immatriculation,
        categorie,
        kilometrage: Number(kilometrage),
        statut,
        chauffeurId: chauffeurId || null
      },
      include: {
        chauffeur: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            telephone: true,
            user: {
              select: {
                email: true
              }
            }
          }
        }
      }
    });

    console.log('✅ Véhicule mis à jour:', vehicule);
    res.json({ message: "Véhicule mis à jour avec succès", vehicule });
  } catch (error) {
    console.error('❌ Erreur mise à jour véhicule:', error);
    res.status(500).json({ error: error.message });
  }
}

// Supprimer un véhicule
async function deleteVehicule(req, res) {
  try {
    const { id } = req.params;
    
    console.log('🗑️ Suppression véhicule:', id);
    
    await prisma.vehicule.delete({
      where: { id: parseInt(id) }
    });

    console.log('✅ Véhicule supprimé avec succès');
    res.json({ message: "Véhicule supprimé avec succès" });
  } catch (error) {
    console.error('❌ Erreur suppression véhicule:', error);
    res.status(500).json({ error: error.message });
  }
}

// Mettre à jour le kilométrage d'un véhicule
async function updateMileage(req, res) {
  try {
    const { immatriculation } = req.params;
    const { newMileage, weeklyKm } = req.body;

    console.log('Mise à jour kilométrage:', { immatriculation, newMileage, weeklyKm });

    // Trouver le véhicule par immatriculation
    const vehicule = await prisma.vehicule.findUnique({
      where: { immatriculation }
    });

    if (!vehicule) {
      return res.status(404).json({ error: "Véhicule non trouvé" });
    }

    // Mettre à jour le kilométrage
    const updatedVehicule = await prisma.vehicule.update({
      where: { immatriculation },
      data: {
        kilometrage: Number(newMileage),
        // On pourrait ajouter un champ weeklyKm dans la base si nécessaire
        // weeklyKm: Number(weeklyKm)
      },
      include: {
        chauffeur: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            telephone: true
          }
        }
      }
    });

    res.json({
      message: "Kilométrage mis à jour avec succès", 
      vehicule: updatedVehicule,
      weeklyKm: weeklyKm 
    });

  } catch (error) {
    console.error('Erreur mise à jour kilométrage:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createVehicule,
  getAllVehicules,
  updateVehicule,
  deleteVehicule,
  updateMileage,
  assignDriver
}; 