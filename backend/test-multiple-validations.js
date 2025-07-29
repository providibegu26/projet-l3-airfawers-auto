const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testMultipleValidations() {
  try {
    console.log('🧪 Test de plusieurs validations consécutives...');
    
    // 1. Récupérer les véhicules initiaux
    console.log('\n📊 1. Récupération des véhicules initiaux...');
    const initialResponse = await fetch('http://localhost:4000/api/admin/vehicules');
    const initialData = await initialResponse.json();
    
    console.log(`✅ ${initialData.vehicules.length} véhicules récupérés`);
    
    // 2. Analyser chaque véhicule et ses entretiens
    initialData.vehicules.forEach((vehicle, index) => {
      console.log(`\n🚗 Véhicule ${index + 1}: ${vehicle.immatriculation}`);
      console.log('Données initiales:', {
        kilometrage: vehicle.kilometrage,
        weeklyKm: vehicle.weeklyKm,
        historiqueCount: vehicle.historiqueEntretiens?.length || 0
      });
      
      // Analyser chaque type d'entretien
      ['vidange', 'bougies', 'freins'].forEach(type => {
        const daysRemaining = vehicle[`${type}DaysRemaining`];
        const nextThreshold = vehicle[`${type}NextThreshold`];
        const kmRemaining = vehicle[`${type}KmRemaining`];
        
        console.log(`  ${type}:`);
        console.log(`    - Jours restants: ${daysRemaining}`);
        console.log(`    - Prochain seuil: ${nextThreshold} km`);
        console.log(`    - Km restants: ${kmRemaining} km`);
        
        if (daysRemaining <= 7) {
          console.log(`    🚨 URGENT: Apparaît sur la page des entretiens urgents`);
        } else {
          console.log(`    ✅ Normal: Apparaît sur la page ${type}`);
        }
      });
    });
    
    // 3. Effectuer plusieurs validations consécutives
    const vehicleToTest = initialData.vehicules[0];
    if (!vehicleToTest) {
      console.log('❌ Aucun véhicule trouvé pour les tests');
      return;
    }
    
    console.log(`\n🔧 2. Tests de validation pour ${vehicleToTest.immatriculation}...`);
    
    // Trouver les entretiens urgents
    const urgentTypes = ['vidange', 'bougies', 'freins'].filter(type => {
      const daysRemaining = vehicleToTest[`${type}DaysRemaining`];
      return daysRemaining !== undefined && daysRemaining <= 7;
    });
    
    console.log('🚨 Entretiens urgents disponibles:', urgentTypes);
    
    // Effectuer jusqu'à 3 validations
    for (let i = 0; i < Math.min(3, urgentTypes.length); i++) {
      const typeToValidate = urgentTypes[i];
      console.log(`\n--- VALIDATION ${i + 1}: ${typeToValidate} ---`);
      
      // Récupérer l'état actuel avant validation
      const beforeResponse = await fetch('http://localhost:4000/api/admin/vehicules');
      const beforeData = await beforeResponse.json();
      const beforeVehicle = beforeData.vehicules.find(v => v.id === vehicleToTest.id);
      
      console.log('📋 Avant validation:', {
        [`${typeToValidate}DaysRemaining`]: beforeVehicle[`${typeToValidate}DaysRemaining`],
        [`${typeToValidate}NextThreshold`]: beforeVehicle[`${typeToValidate}NextThreshold`],
        historiqueCount: beforeVehicle.historiqueEntretiens?.length || 0
      });
      
      // Effectuer la validation
      const validationResponse = await fetch('http://localhost:4000/api/admin/entretiens/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehiculeId: beforeVehicle.id,
          type: typeToValidate,
          kilometrage: beforeVehicle.kilometrage,
          description: `Test validation ${i + 1} - ${typeToValidate}`
        })
      });
      
      if (!validationResponse.ok) {
        const errorData = await validationResponse.json();
        console.error(`❌ Erreur validation ${i + 1}:`, errorData);
        continue;
      }
      
      const validationResult = await validationResponse.json();
      console.log(`✅ Validation ${i + 1} réussie:`, validationResult.message);
      
      // Récupérer l'état après validation
      const afterResponse = await fetch('http://localhost:4000/api/admin/vehicules');
      const afterData = await afterResponse.json();
      const afterVehicle = afterData.vehicules.find(v => v.id === vehicleToTest.id);
      
      console.log('📋 Après validation:', {
        [`${typeToValidate}DaysRemaining`]: afterVehicle[`${typeToValidate}DaysRemaining`],
        [`${typeToValidate}NextThreshold`]: afterVehicle[`${typeToValidate}NextThreshold`],
        historiqueCount: afterVehicle.historiqueEntretiens?.length || 0
      });
      
      // Vérifier la logique de synchronisation
      const newDaysRemaining = afterVehicle[`${typeToValidate}DaysRemaining`];
      if (newDaysRemaining > 7) {
        console.log(`✅ CORRECT: ${typeToValidate} n'est plus urgent (${newDaysRemaining} jours)`);
        console.log(`✅ CORRECT: ${typeToValidate} apparaît maintenant sur la page ${typeToValidate}`);
      } else {
        console.log(`❌ PROBLÈME: ${typeToValidate} est encore urgent (${newDaysRemaining} jours)`);
        console.log(`❌ PROBLÈME: ${typeToValidate} n'apparaît pas sur la page ${typeToValidate}`);
      }
      
      // Vérifier si l'entretien apparaît dans l'historique
      const historiqueEntry = afterVehicle.historiqueEntretiens?.find(
        entretien => entretien.type === typeToValidate
      );
      
      if (historiqueEntry) {
        console.log(`✅ CORRECT: ${typeToValidate} enregistré dans l'historique`);
      } else {
        console.log(`❌ PROBLÈME: ${typeToValidate} non trouvé dans l'historique`);
      }
      
      // Attendre un peu avant la prochaine validation
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // 4. Vérification finale
    console.log('\n🔍 3. Vérification finale...');
    const finalResponse = await fetch('http://localhost:4000/api/admin/vehicules');
    const finalData = await finalResponse.json();
    const finalVehicle = finalData.vehicules.find(v => v.id === vehicleToTest.id);
    
    console.log('📋 État final:', {
      immatriculation: finalVehicle.immatriculation,
      historiqueCount: finalVehicle.historiqueEntretiens?.length || 0,
      historiqueTypes: finalVehicle.historiqueEntretiens?.map(e => e.type) || []
    });
    
    // Vérifier les entretiens urgents restants
    const remainingUrgent = ['vidange', 'bougies', 'freins'].filter(type => {
      const daysRemaining = finalVehicle[`${type}DaysRemaining`];
      return daysRemaining !== undefined && daysRemaining <= 7;
    });
    
    console.log('🚨 Entretiens urgents restants:', remainingUrgent);
    
    console.log('\n🎉 Test de plusieurs validations terminé !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le test
testMultipleValidations(); 