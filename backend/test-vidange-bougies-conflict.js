const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testVidangeBougiesConflict() {
  try {
    console.log('🧪 Test de conflit vidange/bougies...');
    
    // 1. Récupérer l'état actuel
    const response = await fetch('http://localhost:4000/api/admin/vehicules');
    const data = await response.json();
    const vehicles = data.vehicules || [];
    const vehicle = vehicles[0];
    
    console.log(`📊 Véhicule: ${vehicle.immatriculation}`);
    console.log(`📊 Kilométrage: ${vehicle.kilometrage} km`);
    console.log(`📊 WeeklyKm: ${vehicle.weeklyKm} km/semaine`);
    
    // 2. Analyser les entretiens actuels
    console.log('\n📋 Entretiens actuels:');
    ['vidange', 'bougies', 'freins'].forEach(type => {
      const daysRemaining = vehicle[`${type}DaysRemaining`];
      const nextThreshold = vehicle[`${type}NextThreshold`];
      const kmRemaining = vehicle[`${type}KmRemaining`];
      
      console.log(`  ${type.toUpperCase()}:`);
      console.log(`    - Jours restants: ${daysRemaining}`);
      console.log(`    - Prochain seuil: ${nextThreshold} km`);
      console.log(`    - Km restants: ${kmRemaining} km`);
      console.log(`    - Urgent: ${daysRemaining <= 7 ? 'OUI' : 'NON'}`);
    });
    
    // 3. Analyser l'historique
    const historiqueEntretiens = vehicle.historiqueEntretiens || [];
    console.log('\n📋 Historique des entretiens:');
    historiqueEntretiens.forEach((entretien, index) => {
      console.log(`  ${index + 1}. ${entretien.type}: ${entretien.kilometrage} km (${entretien.dateEffectuee})`);
    });
    
    // 4. Simuler la logique de getNonUrgentMaintenance
    console.log('\n🔍 Simulation de getNonUrgentMaintenance:');
    ['vidange', 'bougies', 'freins'].forEach(type => {
      const daysRemaining = vehicle[`${type}DaysRemaining`];
      const nextThreshold = vehicle[`${type}NextThreshold`];
      
      if (nextThreshold && daysRemaining !== undefined) {
        console.log(`\n  ${type.toUpperCase()}:`);
        console.log(`    - Jours restants: ${daysRemaining}`);
        
        const dernierEntretien = historiqueEntretiens.find(
          entretien => entretien.type.toLowerCase() === type.toLowerCase()
        );
        
        if (dernierEntretien) {
          console.log(`    ✅ INCLUS: Validé récemment`);
        } else if (daysRemaining > 7) {
          console.log(`    ✅ INCLUS: Non-urgent`);
        } else {
          console.log(`    🚫 EXCLU: Urgent et non validé`);
        }
      }
    });
    
    // 5. Simuler la logique de getUrgentMaintenance
    console.log('\n🔍 Simulation de getUrgentMaintenance:');
    ['vidange', 'bougies', 'freins'].forEach(type => {
      const daysRemaining = vehicle[`${type}DaysRemaining`];
      
      if (daysRemaining <= 7) {
        console.log(`  🚨 ${type.toUpperCase()}: ${daysRemaining} jours (URGENT)`);
      } else {
        console.log(`  ✅ ${type.toUpperCase()}: ${daysRemaining} jours (non-urgent)`);
      }
    });
    
    console.log('\n🎉 Test terminé !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le test
testVidangeBougiesConflict(); 