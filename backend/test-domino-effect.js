const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testDominoEffect() {
  try {
    console.log('🧪 Test de l\'effet domino...');
    
    // 1. État initial
    console.log('\n📊 1. État initial...');
    const response = await fetch('http://localhost:4000/api/admin/vehicules');
    const data = await response.json();
    const vehicle = data.vehicules[0];
    
    console.log(`🚗 Véhicule: ${vehicle.immatriculation}`);
    console.log(`📊 Kilométrage: ${vehicle.kilometrage} km`);
    
    // 2. Analyser l'état initial
    console.log('\n📋 2. État initial des entretiens:');
    ['vidange', 'bougies', 'freins'].forEach(type => {
      const daysRemaining = vehicle[`${type}DaysRemaining`];
      const nextThreshold = vehicle[`${type}NextThreshold`];
      
      console.log(`  ${type.toUpperCase()}:`);
      console.log(`    - Jours restants: ${daysRemaining}`);
      console.log(`    - Prochain seuil: ${nextThreshold} km`);
      console.log(`    - Urgent: ${daysRemaining <= 7 ? 'OUI' : 'NON'}`);
    });
    
    // 3. Analyser l'historique initial
    const historiqueInitial = vehicle.historiqueEntretiens || [];
    console.log('\n📋 3. Historique initial:');
    historiqueInitial.forEach((entretien, index) => {
      console.log(`  ${index + 1}. ${entretien.type}: ${entretien.kilometrage} km (${entretien.dateEffectuee})`);
    });
    
    // 4. Identifier quel entretien est urgent
    const urgentType = ['vidange', 'bougies', 'freins'].find(type => 
      vehicle[`${type}DaysRemaining`] <= 7
    );
    
    if (!urgentType) {
      console.log('❌ Aucun entretien urgent trouvé');
      return;
    }
    
    console.log(`\n🔧 4. Validation de l'entretien urgent: ${urgentType.toUpperCase()}`);
    
    // 5. Valider l'entretien urgent
    const validationResponse = await fetch('http://localhost:4000/api/admin/entretiens/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vehiculeId: vehicle.id,
        type: urgentType,
        kilometrage: vehicle.kilometrage,
        description: `Test validation ${urgentType}`
      })
    });
    
    if (validationResponse.ok) {
      console.log('✅ Validation réussie');
      
      // 6. Vérifier l'état après validation
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
      
      // 7. Analyser l'historique après validation
      const historiqueApres = updatedVehicle.historiqueEntretiens || [];
      console.log('\n📋 6. Historique après validation:');
      historiqueApres.forEach((entretien, index) => {
        console.log(`  ${index + 1}. ${entretien.type}: ${entretien.kilometrage} km (${entretien.dateEffectuee})`);
      });
      
      // 8. Identifier le problème d'effet domino
      console.log('\n🔍 7. DIAGNOSTIC DE L\'EFFET DOMINO:');
      
      // Vérifier si un autre entretien est devenu urgent
      const nouveauxUrgents = ['vidange', 'bougies', 'freins'].filter(type => 
        updatedVehicle[`${type}DaysRemaining`] <= 7
      );
      
      if (nouveauxUrgents.length > 0) {
        console.log('⚠️ PROBLÈME DÉTECTÉ: Nouveaux entretiens urgents après validation');
        nouveauxUrgents.forEach(type => {
          const daysRemaining = updatedVehicle[`${type}DaysRemaining`];
          console.log(`  - ${type.toUpperCase()}: ${daysRemaining} jours (URGENT)`);
        });
        
        // Vérifier si c'était urgent avant
        nouveauxUrgents.forEach(type => {
          const wasUrgentBefore = vehicle[`${type}DaysRemaining`] <= 7;
          const isUrgentAfter = updatedVehicle[`${type}DaysRemaining`] <= 7;
          
          if (!wasUrgentBefore && isUrgentAfter) {
            console.log(`  🚨 ${type.toUpperCase()} est devenu urgent après validation !`);
          }
        });
      } else {
        console.log('✅ Aucun effet domino détecté');
      }
      
      // 9. Simuler les pages après validation
      console.log('\n🔍 8. Simulation des pages après validation:');
      
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
      
    } else {
      console.log('❌ Erreur lors de la validation');
    }
    
    console.log('\n🎉 Test terminé !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le test
testDominoEffect(); 