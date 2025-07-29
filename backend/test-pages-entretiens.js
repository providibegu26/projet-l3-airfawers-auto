const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testPagesEntretiens() {
  try {
    console.log('🧪 Test des pages entretiens...');
    
    // 1. Récupérer l'état actuel
    const response = await fetch('http://localhost:4000/api/admin/vehicules');
    const data = await response.json();
    const vehicles = data.vehicules || [];
    const vehicle = vehicles[0];
    
    console.log(`📊 Véhicule: ${vehicle.immatriculation}`);
    console.log(`📊 Kilométrage: ${vehicle.kilometrage} km`);
    
    // 2. Analyser les entretiens actuels
    console.log('\n📋 Entretiens actuels:');
    ['vidange', 'bougies', 'freins'].forEach(type => {
      const daysRemaining = vehicle[`${type}DaysRemaining`];
      const nextThreshold = vehicle[`${type}NextThreshold`];
      
      console.log(`  ${type.toUpperCase()}:`);
      console.log(`    - Jours restants: ${daysRemaining}`);
      console.log(`    - Prochain seuil: ${nextThreshold} km`);
      console.log(`    - Urgent: ${daysRemaining <= 7 ? 'OUI' : 'NON'}`);
    });
    
    // 3. Analyser l'historique
    const historiqueEntretiens = vehicle.historiqueEntretiens || [];
    console.log('\n📋 Historique des entretiens:');
    historiqueEntretiens.forEach((entretien, index) => {
      console.log(`  ${index + 1}. ${entretien.type}: ${entretien.kilometrage} km (${entretien.dateEffectuee})`);
    });
    
    // 4. Simuler la logique de chaque page
    console.log('\n🔍 Simulation des pages:');
    
    // Page urgente
    console.log('\n🚨 PAGE URGENTE:');
    ['vidange', 'bougies', 'freins'].forEach(type => {
      const daysRemaining = vehicle[`${type}DaysRemaining`];
      if (daysRemaining <= 7) {
        console.log(`  ✅ ${type.toUpperCase()}: ${daysRemaining} jours (URGENT)`);
      }
    });
    
    // Pages spécifiques
    ['vidange', 'bougies', 'freins'].forEach(type => {
      console.log(`\n📋 PAGE ${type.toUpperCase()}:`);
      const daysRemaining = vehicle[`${type}DaysRemaining`];
      const dernierEntretien = historiqueEntretiens.find(
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
    
    // 5. Identifier le problème spécifique
    console.log('\n🔍 DIAGNOSTIC DU PROBLÈME:');
    
    // Vérifier s'il y a un conflit vidange/bougies
    const vidangeDays = vehicle.vidangeDaysRemaining;
    const bougiesDays = vehicle.bougiesDaysRemaining;
    
    if (vidangeDays <= 7 && bougiesDays <= 7) {
      console.log('⚠️ CONFLIT DÉTECTÉ: Vidange et bougies sont tous les deux urgents');
      console.log(`  - Vidange: ${vidangeDays} jours`);
      console.log(`  - Bougies: ${bougiesDays} jours`);
    }
    
    // Vérifier la validation
    const vidangeValidated = historiqueEntretiens.find(e => e.type.toLowerCase() === 'vidange');
    const bougiesValidated = historiqueEntretiens.find(e => e.type.toLowerCase() === 'bougies');
    
    if (vidangeValidated && !bougiesValidated) {
      console.log('ℹ️ Vidange validée récemment, bougies non validées');
    } else if (!vidangeValidated && bougiesValidated) {
      console.log('ℹ️ Bougies validées récemment, vidange non validées');
    } else if (vidangeValidated && bougiesValidated) {
      console.log('ℹ️ Vidange et bougies toutes les deux validées récemment');
    } else {
      console.log('ℹ️ Aucun entretien validé récemment');
    }
    
    console.log('\n🎉 Test terminé !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le test
testPagesEntretiens(); 