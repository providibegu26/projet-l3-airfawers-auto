const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testCleanState() {
  try {
    console.log('🧪 Test avec état propre...');
    
    // 1. État actuel
    console.log('\n📊 1. État actuel...');
    const response = await fetch('http://localhost:4000/api/admin/vehicules');
    const data = await response.json();
    const vehicle = data.vehicules[0];
    
    console.log(`🚗 Véhicule: ${vehicle.immatriculation}`);
    console.log(`📊 Kilométrage: ${vehicle.kilometrage} km`);
    
    // 2. Analyser l'état
    console.log('\n📋 2. État des entretiens:');
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
    console.log('\n📋 3. Historique des entretiens:');
    historiqueEntretiens.forEach((entretien, index) => {
      console.log(`  ${index + 1}. ${entretien.type}: ${entretien.kilometrage} km (${entretien.dateEffectuee})`);
    });
    
    // 4. Simuler les pages avec la nouvelle logique
    console.log('\n🔍 4. Simulation des pages (nouvelle logique):');
    
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
        // NOUVELLE LOGIQUE : Toujours inclure si validé récemment
        const reason = daysRemaining <= 7 ? 'Validé récemment (urgent)' : 'Validé récemment';
        console.log(`  ✅ INCLUS: ${reason} (${daysRemaining} jours)`);
      } else if (daysRemaining > 7) {
        console.log(`  ✅ INCLUS: Non-urgent (${daysRemaining} jours)`);
      } else {
        console.log(`  🚫 EXCLU: Urgent et non validé (${daysRemaining} jours)`);
      }
    });
    
    // 5. Résumé du comportement attendu
    console.log('\n📋 5. COMPORTEMENT ATTENDU:');
    console.log('✅ Vidange validée récemment → Toujours sur la page vidange');
    console.log('✅ Bougies validées récemment → Toujours sur la page bougies');
    console.log('✅ Vidange urgente et non validée → Sur la page urgente');
    console.log('✅ Bougies urgentes et non validées → Sur la page urgente');
    
    console.log('\n🎉 Test terminé !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le test
testCleanState(); 