const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testValidationConflict() {
  try {
    console.log('🧪 Test de conflit de validation...');
    
    // 1. État initial
    console.log('\n📊 1. État initial...');
    const response = await fetch('http://localhost:4000/api/admin/vehicules');
    const data = await response.json();
    const vehicle = data.vehicules[0];
    
    console.log(`🚗 Véhicule: ${vehicle.immatriculation}`);
    console.log(`📊 Kilométrage: ${vehicle.kilometrage} km`);
    
    // 2. Analyser l'état avant validation
    console.log('\n📋 2. État avant validation:');
    ['vidange', 'bougies', 'freins'].forEach(type => {
      const daysRemaining = vehicle[`${type}DaysRemaining`];
      const nextThreshold = vehicle[`${type}NextThreshold`];
      
      console.log(`  ${type.toUpperCase()}:`);
      console.log(`    - Jours restants: ${daysRemaining}`);
      console.log(`    - Prochain seuil: ${nextThreshold} km`);
      console.log(`    - Urgent: ${daysRemaining <= 7 ? 'OUI' : 'NON'}`);
    });
    
    // 3. Analyser l'historique avant validation
    const historiqueAvant = vehicle.historiqueEntretiens || [];
    console.log('\n📋 3. Historique avant validation:');
    historiqueAvant.forEach((entretien, index) => {
      console.log(`  ${index + 1}. ${entretien.type}: ${entretien.kilometrage} km (${entretien.dateEffectuee})`);
    });
    
    // 4. Simuler la validation des bougies (qui sont urgentes)
    console.log('\n🔧 4. Validation des bougies...');
    const typeToValidate = 'bougies';
    
    const validationResponse = await fetch('http://localhost:4000/api/admin/entretiens/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vehiculeId: vehicle.id,
        type: typeToValidate,
        kilometrage: vehicle.kilometrage,
        description: `Test validation ${typeToValidate}`
      })
    });
    
    if (validationResponse.ok) {
      console.log('✅ Validation réussie');
      
      // 5. Vérifier l'état après validation
      console.log('\n📊 5. État après validation...');
      const updatedResponse = await fetch('http://localhost:4000/api/admin/vehicules');
      const updatedData = await updatedResponse.json();
      const updatedVehicle = updatedData.vehicules.find(v => v.id === vehicle.id);
      
      console.log('📋 Nouveaux calculs:');
      ['vidange', 'bougies', 'freins'].forEach(type => {
        const daysRemaining = updatedVehicle[`${type}DaysRemaining`];
        const nextThreshold = updatedVehicle[`${type}NextThreshold`];
        
        console.log(`  ${type.toUpperCase()}:`);
        console.log(`    - Jours restants: ${daysRemaining}`);
        console.log(`    - Prochain seuil: ${nextThreshold} km`);
        console.log(`    - Urgent: ${daysRemaining <= 7 ? 'OUI' : 'NON'}`);
      });
      
      // 6. Analyser l'historique après validation
      const historiqueApres = updatedVehicle.historiqueEntretiens || [];
      console.log('\n📋 6. Historique après validation:');
      historiqueApres.forEach((entretien, index) => {
        console.log(`  ${index + 1}. ${entretien.type}: ${entretien.kilometrage} km (${entretien.dateEffectuee})`);
      });
      
      // 7. Simuler les pages après validation
      console.log('\n🔍 7. Simulation des pages après validation:');
      
      // Page urgente
      console.log('\n🚨 PAGE URGENTE:');
      ['vidange', 'bougies', 'freins'].forEach(type => {
        const daysRemaining = updatedVehicle[`${type}DaysRemaining`];
        if (daysRemaining <= 7) {
          console.log(`  ✅ ${type.toUpperCase()}: ${daysRemaining} jours (URGENT)`);
        }
      });
      
      // Pages spécifiques
      ['vidange', 'bougies', 'freins'].forEach(type => {
        console.log(`\n📋 PAGE ${type.toUpperCase()}:`);
        const daysRemaining = updatedVehicle[`${type}DaysRemaining`];
        const dernierEntretien = historiqueApres.find(
          entretien => entretien.type.toLowerCase() === type.toLowerCase()
        );
        
        if (dernierEntretien) {
          console.log(`  ✅ INCLUS: ${type} validé récemment (${daysRemaining} jours)`);
        } else if (daysRemaining > 7) {
          console.log(`  ✅ INCLUS: ${type} non-urgent (${daysRemaining} jours)`);
        } else {
          console.log(`  🚫 EXCLU: ${type} urgent et non validé (${daysRemaining} jours)`);
        }
      });
      
      // 8. Identifier le problème
      console.log('\n🔍 8. DIAGNOSTIC DU PROBLÈME:');
      
      const vidangeValidated = historiqueApres.find(e => e.type.toLowerCase() === 'vidange');
      const bougiesValidated = historiqueApres.find(e => e.type.toLowerCase() === 'bougies');
      
      if (vidangeValidated && bougiesValidated) {
        console.log('⚠️ PROBLÈME: Vidange et bougies toutes les deux validées');
        console.log('  - Cela peut causer des conflits dans l\'affichage');
      }
      
      const vidangeUrgent = updatedVehicle.vidangeDaysRemaining <= 7;
      const bougiesUrgent = updatedVehicle.bougiesDaysRemaining <= 7;
      
      if (vidangeUrgent && bougiesUrgent) {
        console.log('⚠️ PROBLÈME: Vidange et bougies toutes les deux urgentes');
      }
      
    } else {
      console.log('❌ Erreur lors de la validation');
    }
    
    console.log('\n🎉 Test terminé !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le test
testValidationConflict(); 