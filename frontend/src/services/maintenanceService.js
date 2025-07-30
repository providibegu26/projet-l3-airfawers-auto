// Seuils d'entretien par catégorie de véhicule (en kilomètres)
export const maintenanceThresholds = {
  HEAVY: {
    vidange: 8000,
    categorie_b: 16000,
    categorie_c: 24000
  },
  LIGHT: {
    vidange: 5000,
    categorie_b: 10000,
    categorie_c: 15000
  }
};

// Mapping des propriétés du backend vers le frontend
export const BACKEND_TO_FRONTEND_MAPPING = {
  'vidange': 'vidange',
  'bougies': 'categorie_b',
  'freins': 'categorie_c'
};

// Fonction pour mapper les propriétés du backend vers le frontend
export const mapBackendToFrontend = (vehicle) => {
  const mappedVehicle = { ...vehicle };
  
  // Mapper les propriétés d'estimation
  ['vidange', 'bougies', 'freins'].forEach(oldType => {
    const newType = BACKEND_TO_FRONTEND_MAPPING[oldType];
    if (newType && newType !== oldType) {
      // Copier les propriétés avec les nouveaux noms
      mappedVehicle[`${newType}NextThreshold`] = vehicle[`${oldType}NextThreshold`];
      mappedVehicle[`${newType}KmRemaining`] = vehicle[`${oldType}KmRemaining`];
      mappedVehicle[`${newType}WeeksRemaining`] = vehicle[`${oldType}WeeksRemaining`];
      mappedVehicle[`${newType}DaysRemaining`] = vehicle[`${oldType}DaysRemaining`];
    }
  });
  
  return mappedVehicle;
};

// Récupérer les véhicules depuis la base de données
export const fetchVehicles = async () => {
  try {
    console.log('🔄 Récupération des véhicules depuis le serveur...');
    const response = await fetch('http://localhost:4000/api/admin/vehicules');
    const data = await response.json();
    
    console.log('📊 Données reçues du serveur:', data.vehicules?.length || 0, 'véhicules');
    
    // Ajouter les propriétés nécessaires pour les entretiens
    const vehiclesWithMaintenance = data.vehicules.map(vehicle => {
      // Mapper les propriétés du backend vers le frontend
      const mappedVehicle = mapBackendToFrontend(vehicle);
      
      const vehicleWithData = {
        ...mappedVehicle,
        currentMileage: vehicle.kilometrage || 0,
        weeklyKm: vehicle.weeklyKm || 500, // Utiliser le weeklyKm de la base
        lastMaintenanceUpdate: null,
        lastMileageUpdate: null, // Date de la dernière mise à jour du kilométrage
        maintenanceHistory: []
      };
      
      console.log(`🚗 ${vehicle.immatriculation}:`, {
        kilometrage: vehicle.kilometrage,
        weeklyKm: vehicle.weeklyKm,
        historiqueCount: vehicle.historiqueEntretiens?.length || 0,
        mappedProperties: {
          categorie_bDaysRemaining: mappedVehicle.categorie_bDaysRemaining,
          categorie_cDaysRemaining: mappedVehicle.categorie_cDaysRemaining
        }
      });
      
      return vehicleWithData;
    });
    
    console.log('🚗 Véhicules récupérés avec weeklyKm:', 
      vehiclesWithMaintenance.map(v => ({
        immatriculation: v.immatriculation,
        weeklyKm: v.weeklyKm,
        kilometrage: v.kilometrage,
        historiqueCount: v.historiqueEntretiens?.length || 0
      }))
    );
    
    return vehiclesWithMaintenance;
  } catch (error) {
    console.error('❌ Erreur récupération véhicules:', error);
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

  // Utiliser les estimations dynamiques calculées côté serveur
  const maintenance = {
    vidange: {
      threshold: thresholds.vidange,
      nextKm: vehicle.vidangeNextThreshold,
      kmRemaining: vehicle.vidangeKmRemaining,
      weeksRemaining: vehicle.vidangeWeeksRemaining,
      daysRemaining: vehicle.vidangeDaysRemaining
    },
    categorie_b: {
      threshold: thresholds.categorie_b,
      nextKm: vehicle.categorie_bNextThreshold,
      kmRemaining: vehicle.categorie_bKmRemaining,
      weeksRemaining: vehicle.categorie_bWeeksRemaining,
      daysRemaining: vehicle.categorie_bDaysRemaining
    },
    categorie_c: {
      threshold: thresholds.categorie_c,
      nextKm: vehicle.categorie_cNextThreshold,
      kmRemaining: vehicle.categorie_cKmRemaining,
      weeksRemaining: vehicle.categorie_cWeeksRemaining,
      daysRemaining: vehicle.categorie_cDaysRemaining
    }
  };

  console.log(`🔧 Estimations dynamiques pour ${vehicle.immatriculation}:`, {
    currentKm,
    weeklyKm,
    vidange: maintenance.vidange,
    categorie_b: maintenance.categorie_b,
    categorie_c: maintenance.categorie_c
  });

  return maintenance;
};

// Calculer les statistiques d'entretien pour un type spécifique
export const calculateMaintenanceStats = (vehicles, type) => {
  const fleetAverage = calculateFleetAverage(vehicles);
  const maintenanceList = vehicles
    .map(vehicle => {
      const maintenance = calculateMaintenanceForVehicle(vehicle, fleetAverage);
      if (!maintenance || !maintenance[type]) return null;
      
      // EXCLURE les entretiens urgents (≤ 7 jours) des pages spécifiques
      // Ils ne doivent apparaître que sur la page des entretiens urgents
      if (maintenance[type].daysRemaining <= 7) {
        console.log(`🚫 ${vehicle.immatriculation} - ${type}: Entretien urgent exclu de la page spécifique`);
        return null;
      }
      
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

// Calculer les entretiens urgents (≤ 7 jours) - SEULEMENT sur la page urgente
export const getUrgentMaintenance = (vehicles) => {
  console.log('🔍 getUrgentMaintenance appelé avec', vehicles.length, 'véhicules');
  const allMaintenance = [];
  
  vehicles.forEach(vehicle => {
    const historiqueEntretiens = vehicle.historiqueEntretiens || [];
    console.log(`📊 ${vehicle.immatriculation}: ${historiqueEntretiens.length} entretiens dans l'historique`);
    
    // Pour chaque type d'entretien
    ['vidange', 'categorie_b', 'categorie_c'].forEach(type => {
      const nextThreshold = vehicle[`${type}NextThreshold`];
      const daysRemaining = vehicle[`${type}DaysRemaining`];
      
      if (nextThreshold && daysRemaining !== undefined) {
        console.log(`  ${type}: ${daysRemaining} jours restants`);
        
        // RÈGLE CORRIGÉE : Inclure TOUS les entretiens urgents (≤ 7 jours) sur la page urgente
        if (daysRemaining <= 7) {
          console.log(`    🚨 INCLUS: Entretien urgent (${daysRemaining} jours) → Page urgente`);
          allMaintenance.push({
            vehicle: vehicle,
            maintenance: {
              nextThreshold: nextThreshold,
              daysRemaining: daysRemaining,
              kmRemaining: vehicle[`${type}KmRemaining`],
              weeksRemaining: vehicle[`${type}WeeksRemaining`]
            },
            type: type
          });
        } else {
          console.log(`    ✅ Non-urgent (${daysRemaining} jours) → Page spécifique`);
        }
      }
    });
  });
  
  console.log('📋 Entretiens urgents trouvés:', allMaintenance.length);
  return allMaintenance.sort((a, b) => a.maintenance.daysRemaining - b.maintenance.daysRemaining);
};

// Calculer les entretiens pour les pages spécifiques (vidange, categorie_b, categorie_c)
export const getNonUrgentMaintenance = (vehicles, type) => {
  console.log(`🔍 getNonUrgentMaintenance appelé pour ${type} avec`, vehicles.length, 'véhicules');
  const maintenanceList = [];
  
  vehicles.forEach(vehicle => {
    const nextThreshold = vehicle[`${type}NextThreshold`];
    const daysRemaining = vehicle[`${type}DaysRemaining`];
    
    if (nextThreshold && daysRemaining !== undefined) {
      console.log(`  ${vehicle.immatriculation} - ${type}: ${daysRemaining} jours restants`);
      
      // RÈGLE CORRIGÉE : Inclure UNIQUEMENT les entretiens non-urgents (> 7 jours) sur les pages spécifiques
      if (daysRemaining > 7) {
        console.log(`    ✅ INCLUS: Non-urgent (${daysRemaining} jours) → Page ${type}`);
        maintenanceList.push({
          vehicle: vehicle,
          maintenance: {
            nextThreshold: nextThreshold,
            daysRemaining: daysRemaining,
            kmRemaining: vehicle[`${type}KmRemaining`],
            weeksRemaining: vehicle[`${type}WeeksRemaining`]
          },
          type: type
        });
      } else {
        // Entretien urgent → Page urgente uniquement
        console.log(`    🚫 EXCLU: Urgent (${daysRemaining} jours) → Page urgente uniquement`);
      }
    }
  });
  
  console.log(`📋 Entretiens trouvés pour ${type}:`, maintenanceList.length);
  return maintenanceList.sort((a, b) => a.maintenance.daysRemaining - b.maintenance.daysRemaining);
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
    
    // NOUVELLE LOGIQUE : Les estimations seront recalculées dynamiquement côté serveur
    // Pas besoin de calculer ici, car elles seront recalculées à chaque requête
    
    console.log('🔄 Estimations seront recalculées dynamiquement au prochain affichage');
    
    // Retourner le véhicule avec la date de mise à jour
    const updatedVehicle = {
      ...vehicle,
      currentMileage: currentMileage,
      lastMaintenanceUpdate: new Date().toISOString()
    };
    
    return updatedVehicle;
    
  } catch (error) {
    console.error('❌ Erreur validation entretien:', error);
    throw error;
  }
};

// Forcer le recalcul des estimations en rechargeant les données
export const refreshMaintenanceEstimations = async () => {
  try {
    console.log('🔄 Rechargement des estimations depuis le serveur...');
    const vehicles = await fetchVehicles();
    console.log('✅ Estimations recalculées:', vehicles.length, 'véhicules');
    return vehicles;
  } catch (error) {
    console.error('❌ Erreur recalcul estimations:', error);
    throw error;
  }
};

// Forcer le recalcul global des estimations
export const forceGlobalRecalculation = async () => {
  try {
    console.log('🔄 Recalcul global des estimations...');
    
    // 1. Recharger les véhicules depuis le serveur avec l'historique
    const response = await fetch('http://localhost:4000/api/admin/vehicules');
    const data = await response.json();
    
    console.log('✅ Données reçues du serveur:', data.vehicules?.length || 0, 'véhicules');
    
    // 2. Mettre à jour les véhicules avec les nouvelles estimations et l'historique
    const updatedVehicles = data.vehicules.map(vehicle => {
      const vehicleWithData = {
        ...vehicle,
        currentMileage: vehicle.kilometrage || 0,
        weeklyKm: vehicle.weeklyKm || 500,
        lastMaintenanceUpdate: null,
        lastMileageUpdate: null,
        maintenanceHistory: [],
        // Conserver l'historique des entretiens
        historiqueEntretiens: vehicle.historiqueEntretiens || []
      };
      
      console.log(`🚗 ${vehicle.immatriculation}:`, {
        kilometrage: vehicle.kilometrage,
        weeklyKm: vehicle.weeklyKm,
        historiqueCount: vehicle.historiqueEntretiens?.length || 0,
        estimations: {
          vidangeNextThreshold: vehicle.vidangeNextThreshold,
          bougiesNextThreshold: vehicle.bougiesNextThreshold,
          freinsNextThreshold: vehicle.freinsNextThreshold
        }
      });
      
      return vehicleWithData;
    });
    
    console.log('✅ Recalcul global terminé');
    return updatedVehicles;
    
  } catch (error) {
    console.error('❌ Erreur recalcul global:', error);
    throw error;
  }
};

// Formater les données pour l'affichage dans les tableaux
export const formatMaintenanceData = (maintenanceList) => {
  const getTypeLabel = (type) => {
    const typeLabels = {
      'vidange': 'Catégorie A',
      'categorie_b': 'Catégorie B',
      'categorie_c': 'Catégorie C'
    };
    return typeLabels[type] || type;
  };

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
      type: getTypeLabel(item.type),
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

// Générer la liste des entretiens prévus dans les 2 mois à venir (pour le calendrier)
export const getUpcomingMaintenances = (vehicles, daysWindow = 60) => {
  const upcomingMaintenances = [];
  
  vehicles.forEach(vehicle => {
    ['vidange', 'categorie_b', 'categorie_c'].forEach(type => {
      const daysRemaining = vehicle[`${type}DaysRemaining`];
      
      if (daysRemaining !== undefined && daysRemaining <= daysWindow) {
        upcomingMaintenances.push({
          vehicle: vehicle,
          type: type,
          daysRemaining: daysRemaining,
          nextThreshold: vehicle[`${type}NextThreshold`]
        });
      }
    });
  });
  
  return upcomingMaintenances.sort((a, b) => a.daysRemaining - b.daysRemaining);
}; 