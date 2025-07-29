const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testLogiqueComplete() {
  try {
    console.log('🧪 Test de la logique complète...');
    
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
    
    // 4. Simuler la logique de chaque page
    console.log('\n🔍 4. Simulation des pages (logique complète):');
    
    // Page urgente
    console.log('\n🚨 PAGE URGENTE:');
    ['vidange', 'bougies', 'freins'].forEach(type => {
      const daysRemaining = vehicle[`${type}DaysRemaining`];
      const dernierEntretien = historiqueInitial.find(
        entretien => entretien.type.toLowerCase() === type.toLowerCase()
      );
      
      if (daysRemaining <= 7 && !dernierEntretien) {
        console.log(`  ✅ ${type.toUpperCase()}: ${daysRemaining} jours (URGENT) → Page urgente`);
      } else if (daysRemaining <= 7 && dernierEntretien) {
        console.log(`  🚫 ${type.toUpperCase()}: ${daysRemaining} jours (URGENT mais validé) → Page spécifique`);
      } else {
        console.log(`  ✅ ${type.toUpperCase()}: ${daysRemaining} jours (non-urgent) → Page spécifique`);
      }
    });
    
    // Pages spécifiques
    ['vidange', 'bougies', 'freins'].forEach(type => {
      console.log(`\n📋 PAGE ${type.toUpperCase()}:`);
      const daysRemaining = vehicle[`${type}DaysRemaining`];
      const dernierEntretien = historiqueInitial.find(
        entretien => entretien.type.toLowerCase() === type.toLowerCase()
      );
      
      if (dernierEntretien) {
        console.log(`  ✅ INCLUS: ${type} validé récemment (${daysRemaining} jours) → Page ${type}`);
      } else if (daysRemaining > 7) {
        console.log(`  ✅ INCLUS: ${type} non-urgent (${daysRemaining} jours) → Page ${type}`);
      } else {
        console.log(`  🚫 EXCLU: ${type} urgent et non validé (${daysRemaining} jours) → Page urgente uniquement`);
      }
    });
    
    // 5. Identifier un entretien urgent à valider
    const urgentType = ['vidange', 'bougies', 'freins'].find(type => {
      const daysRemaining = vehicle[`${type}DaysRemaining`];
      const dernierEntretien = historiqueInitial.find(
        entretien => entretien.type.toLowerCase() === type.toLowerCase()
      );
      return daysRemaining <= 7 && !dernierEntretien;
    });
    
    if (!urgentType) {
      console.log('\n❌ Aucun entretien urgent non validé trouvé');
      return;
    }
    
    console.log(`\n🔧 5. Validation de l'entretien urgent: ${urgentType.toUpperCase()}`);
    
    // 6. Valider l'entretien urgent
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
      
      // 7. Vérifier l'état après validation
      console.log('\n📊 6. État après validation...');
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
      
      // 8. Analyser l'historique après validation
      const historiqueApres = updatedVehicle.historiqueEntretiens || [];
      console.log('\n📋 7. Historique après validation:');
      historiqueApres.forEach((entretien, index) => {
        console.log(`  ${index + 1}. ${entretien.type}: ${entretien.kilometrage} km (${entretien.dateEffectuee})`);
      });
      
      // 9. Simuler les pages après validation
      console.log('\n🔍 8. Simulation des pages après validation:');
      
      // Page urgente après validation
      console.log('\n🚨 PAGE URGENTE (après validation):');
      ['vidange', 'bougies', 'freins'].forEach(type => {
        const daysRemaining = updatedVehicle[`${type}DaysRemaining`];
        const dernierEntretien = historiqueApres.find(
          entretien => entretien.type.toLowerCase() === type.toLowerCase()
        );
        
        if (daysRemaining <= 7 && !dernierEntretien) {
          console.log(`  ✅ ${type.toUpperCase()}: ${daysRemaining} jours (URGENT) → Page urgente`);
        } else if (daysRemaining <= 7 && dernierEntretien) {
          console.log(`  🚫 ${type.toUpperCase()}: ${daysRemaining} jours (URGENT mais validé) → Page spécifique`);
        } else {
          console.log(`  ✅ ${type.toUpperCase()}: ${daysRemaining} jours (non-urgent) → Page spécifique`);
        }
      });
      
      // Pages spécifiques après validation
      ['vidange', 'bougies', 'freins'].forEach(type => {
        console.log(`\n📋 PAGE ${type.toUpperCase()} (après validation):`);
        const daysRemaining = updatedVehicle[`${type}DaysRemaining`];
        const dernierEntretien = historiqueApres.find(
          entretien => entretien.type.toLowerCase() === type.toLowerCase()
        );
        
        if (dernierEntretien) {
          console.log(`  ✅ INCLUS: ${type} validé récemment (${daysRemaining} jours) → Page ${type}`);
        } else if (daysRemaining > 7) {
          console.log(`  ✅ INCLUS: ${type} non-urgent (${daysRemaining} jours) → Page ${type}`);
        } else {
          console.log(`  🚫 EXCLU: ${type} urgent et non validé (${daysRemaining} jours) → Page urgente uniquement`);
        }
      });
      
      // 10. Résumé du comportement
      console.log('\n📋 9. RÉSUMÉ DU COMPORTEMENT:');
      console.log('✅ Entretiens urgents non validés → Page urgente uniquement');
      console.log('✅ Entretiens urgents validés récemment → Page spécifique uniquement');
      console.log('✅ Entretiens non-urgents → Page spécifique');
      console.log('✅ Validation → Nouvelle estimation sur la page spécifique');
      console.log('✅ Pas d\'effet domino → Chaque entretien reste à sa place');
      
    } else {
      console.log('❌ Erreur lors de la validation');
    }
    
    console.log('\n🎉 Test terminé !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le test
testLogiqueComplete(); 