// Seuils d'entretien par catégorie de véhicule (en kilomètres)
export const maintenanceThresholds = {
  HEAVY: {
    vidange: 8000,
    bougies: 80000,
    freins: 20000
  },
  LIGHT: {
    vidange: 5000,
    bougies: 40000,
    freins: 50000
  }
};

// Récupérer les véhicules depuis la base de données
export const fetchVehicles = async () => {
  try {
    const response = await fetch('http://localhost:4000/api/admin/vehicules');
    const data = await response.json();
    
    // Ajouter les propriétés nécessaires pour les entretiens
    const vehiclesWithMaintenance = data.vehicules.map(vehicle => ({
      ...vehicle,
      currentMileage: vehicle.kilometrage || 0,
      weeklyKm: 0, // Première fois pour tous les véhicules
      lastMaintenanceUpdate: null,
      lastMileageUpdate: null, // Date de la dernière mise à jour du kilométrage
      maintenanceHistory: []
    }));
    
    return vehiclesWithMaintenance;
  } catch (error) {
    console.error('Erreur récupération véhicules:', error);
    throw error;
  }
};

// Vérifier si un véhicule peut être mis à jour (une fois par semaine)
export const canUpdateMileage = (vehicle) => {
  // TEMPORAIREMENT DÉSACTIVÉ POUR LES TESTS
  // Retourner toujours true pour permettre les tests
  return true;
  
  // Code original (commenté pour les tests)
  /*
  if (!vehicle.lastMileageUpdate) return true;
  
  const lastUpdate = new Date(vehicle.lastMileageUpdate);
  const now = new Date();
  const daysSinceLastUpdate = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));
  
  return daysSinceLastUpdate >= 7;
  */
};

// Obtenir le nombre de jours jusqu'à la prochaine mise à jour possible
export const getDaysUntilNextUpdate = (vehicle) => {
  // TEMPORAIREMENT DÉSACTIVÉ POUR LES TESTS
  // Retourner toujours 0 pour permettre les tests
  return 0;
  
  // Code original (commenté pour les tests)
  /*
  if (!vehicle.lastMileageUpdate) return 0;
  
  const lastUpdate = new Date(vehicle.lastMileageUpdate);
  const now = new Date();
  const daysSinceLastUpdate = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));
  
  return Math.max(0, 7 - daysSinceLastUpdate);
  */
};

// Calculer la moyenne hebdomadaire de la flotte
export const calculateFleetAverage = (vehicles) => {
  const vehiclesWithWeeklyKm = vehicles.filter(v => v.weeklyKm > 0);
  if (vehiclesWithWeeklyKm.length === 0) return 500; // Valeur par défaut
  
  const totalWeeklyKm = vehiclesWithWeeklyKm.reduce((sum, v) => sum + v.weeklyKm, 0);
  return Math.round(totalWeeklyKm / vehiclesWithWeeklyKm.length);
};

// Calculer les entretiens pour un véhicule
export const calculateMaintenanceForVehicle = (vehicle, fleetAverage) => {
  const category = vehicle.categorie || 'LIGHT';
  const thresholds = maintenanceThresholds[category];
  const currentKm = vehicle.currentMileage || vehicle.kilometrage || 0;
  const weeklyKm = vehicle.weeklyKm || fleetAverage;
  
  if (weeklyKm === 0) return null;

  const maintenance = {
    vidange: {
      threshold: thresholds.vidange,
      // Utiliser les nouvelles estimations si disponibles après validation
      nextKm: vehicle.vidangeNextThreshold || Math.ceil(currentKm / thresholds.vidange) * thresholds.vidange,
      kmRemaining: vehicle.vidangeKmRemaining || (Math.ceil(currentKm / thresholds.vidange) * thresholds.vidange - currentKm),
      weeksRemaining: vehicle.vidangeWeeksRemaining || Math.ceil((Math.ceil(currentKm / thresholds.vidange) * thresholds.vidange - currentKm) / weeklyKm),
      daysRemaining: vehicle.vidangeDaysRemaining || Math.ceil((Math.ceil(currentKm / thresholds.vidange) * thresholds.vidange - currentKm) / weeklyKm) * 7
    },
    bougies: {
      threshold: thresholds.bougies,
      // Utiliser les nouvelles estimations si disponibles après validation
      nextKm: vehicle.bougiesNextThreshold || Math.ceil(currentKm / thresholds.bougies) * thresholds.bougies,
      kmRemaining: vehicle.bougiesKmRemaining || (Math.ceil(currentKm / thresholds.bougies) * thresholds.bougies - currentKm),
      weeksRemaining: vehicle.bougiesWeeksRemaining || Math.ceil((Math.ceil(currentKm / thresholds.bougies) * thresholds.bougies - currentKm) / weeklyKm),
      daysRemaining: vehicle.bougiesDaysRemaining || Math.ceil((Math.ceil(currentKm / thresholds.bougies) * thresholds.bougies - currentKm) / weeklyKm) * 7
    },
    freins: {
      threshold: thresholds.freins,
      // Utiliser les nouvelles estimations si disponibles après validation
      nextKm: vehicle.freinsNextThreshold || Math.ceil(currentKm / thresholds.freins) * thresholds.freins,
      kmRemaining: vehicle.freinsKmRemaining || (Math.ceil(currentKm / thresholds.freins) * thresholds.freins - currentKm),
      weeksRemaining: vehicle.freinsWeeksRemaining || Math.ceil((Math.ceil(currentKm / thresholds.freins) * thresholds.freins - currentKm) / weeklyKm),
      daysRemaining: vehicle.freinsDaysRemaining || Math.ceil((Math.ceil(currentKm / thresholds.freins) * thresholds.freins - currentKm) / weeklyKm) * 7
    }
  };

  return maintenance;
};

// Calculer les statistiques par type d'entretien
export const calculateMaintenanceStats = (vehicles, type) => {
  const fleetAverage = calculateFleetAverage(vehicles);
  
  const maintenanceList = vehicles
    .map(vehicle => {
      const maintenance = calculateMaintenanceForVehicle(vehicle, fleetAverage);
      if (!maintenance) return null;
      
      return {
        vehicle: vehicle,
        maintenance: maintenance[type],
        type: type
      };
    })
    .filter(item => item !== null)
    .sort((a, b) => a.maintenance.daysRemaining - b.maintenance.daysRemaining);

  return maintenanceList;
};

// Calculer les entretiens urgents (≤ 7 jours)
export const getUrgentMaintenance = (vehicles) => {
  const fleetAverage = calculateFleetAverage(vehicles);
  const allMaintenance = [];
  
  vehicles.forEach(vehicle => {
    const maintenance = calculateMaintenanceForVehicle(vehicle, fleetAverage);
    if (!maintenance) return;
    
    Object.entries(maintenance).forEach(([type, data]) => {
      if (data.daysRemaining <= 7) {
        allMaintenance.push({
          vehicle: vehicle,
          maintenance: data,
          type: type
        });
      }
    });
  });
  
  return allMaintenance.sort((a, b) => a.maintenance.daysRemaining - b.maintenance.daysRemaining);
};

// Mettre à jour le kilométrage d'un véhicule
export const updateVehicleMileage = async (vehiclePlate, newMileage, weeklyKm) => {
  try {
    const response = await fetch(`http://localhost:4000/api/admin/vehicules/${vehiclePlate}/mileage`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newMileage, weeklyKm })
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour du kilométrage');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur mise à jour kilométrage:', error);
    throw error;
  }
};

// Valider un entretien (recalculer les estimations)
export const validateMaintenance = async (vehicle, maintenanceType) => {
  try {
    console.log(`Entretien ${maintenanceType} validé pour le véhicule ${vehicle.immatriculation}`);
    
    // Utiliser le bon champ de kilométrage
    const currentMileage = vehicle.currentMileage || vehicle.kilometrage || 0;
    
    // Sauvegarder l'entretien en base via l'API
    const response = await fetch('http://localhost:4000/api/admin/entretiens/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vehiculeId: vehicle.id,
        type: maintenanceType,
        kilometrage: currentMileage,
        description: `Entretien ${maintenanceType} effectué`
      })
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la validation de l\'entretien');
    }

    const data = await response.json();
    console.log('✅ Entretien sauvegardé en base:', data);
    
    // Calculer le prochain seuil pour ce type d'entretien
    const category = vehicle.categorie || 'LIGHT';
    const threshold = maintenanceThresholds[category][maintenanceType];
    
    // Le prochain seuil sera le seuil actuel + le seuil de maintenance
    // EXEMPLE CONCRET:
    // - Véhicule HEAVY (seuil vidange: 8 000 km)
    // - Kilométrage actuel: 8 000 km (entretien validé)
    // - Prochain seuil: 8 000 + 8 000 = 16 000 km
    // - Si km hebdomadaire = 500 km
    // - Jours restants: (16 000 - 8 000) / 500 * 7 = 112 jours
    const nextThreshold = Math.ceil(currentMileage / threshold) * threshold + threshold;
    
    console.log('Seuil actuel:', Math.ceil(currentMileage / threshold) * threshold);
    console.log('Prochain seuil calculé:', nextThreshold);
    
    // Calculer les nouvelles estimations pour ce type d'entretien
    const weeklyKm = vehicle.weeklyKm || 500; // Utiliser le km hebdomadaire du véhicule
    const kmRemaining = nextThreshold - currentMileage;
    const weeksRemaining = Math.ceil(kmRemaining / weeklyKm);
    const daysRemaining = weeksRemaining * 7;
    
    console.log('Nouvelles estimations après validation:');
    console.log('- Kilométrage actuel:', currentMileage);
    console.log('- Prochain seuil:', nextThreshold);
    console.log('- Km restants:', kmRemaining);
    console.log('- Semaines restantes:', weeksRemaining);
    console.log('- Jours restants:', daysRemaining);
    
    // Créer un nouvel objet véhicule avec les nouvelles estimations
    const updatedVehicle = {
      ...vehicle,
      currentMileage: currentMileage, // S'assurer que currentMileage est défini
      lastMaintenanceUpdate: new Date().toISOString()
    };
    
    // Mettre à jour les estimations pour ce type d'entretien spécifique
    updatedVehicle[`${maintenanceType}NextThreshold`] = nextThreshold;
    updatedVehicle[`${maintenanceType}KmRemaining`] = kmRemaining;
    updatedVehicle[`${maintenanceType}WeeksRemaining`] = weeksRemaining;
    updatedVehicle[`${maintenanceType}DaysRemaining`] = daysRemaining;
    
    return updatedVehicle;
    
  } catch (error) {
    console.error('❌ Erreur validation entretien:', error);
    throw error;
  }
};

// Formater les données pour l'affichage dans les tableaux
export const formatMaintenanceData = (maintenanceList) => {
  return maintenanceList.map(item => {
    // Calculer la date d'entretien en utilisant la date actuelle de l'appareil
    const currentDate = new Date();
    const maintenanceDate = new Date(currentDate);
    maintenanceDate.setDate(currentDate.getDate() + item.maintenance.daysRemaining);
    
    return {
      id: item.vehicle.id,
      immatriculation: item.vehicle.immatriculation,
      marque: item.vehicle.marque,
      modele: item.vehicle.modele,
      chauffeur: item.vehicle.chauffeur 
        ? `${item.vehicle.chauffeur.nom} ${item.vehicle.chauffeur.prenom}`
        : 'Non attribué',
      kilometrage: item.vehicle.currentMileage,
      type: item.type,
      seuil: item.maintenance.threshold,
      prochainKm: item.maintenance.nextKm,
      kmRestants: item.maintenance.kmRemaining,
      semainesRestantes: item.maintenance.weeksRemaining,
      joursRestants: item.maintenance.daysRemaining,
      dateEntretien: maintenanceDate.toLocaleDateString('fr-FR', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      statut: item.maintenance.daysRemaining <= 7 ? 'Urgent' : 
              item.maintenance.daysRemaining <= 14 ? 'À venir' : 'Normal'
    };
  });
}; 