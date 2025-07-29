const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testIndependanceEntretiens() {
  try {
    console.log('🧪 Test d\'indépendance des entretiens...');
    
    // 1. État initial
    console.log('\n📊 1. État initial...');
    const response = await fetch('http://localhost:4000/api/admin/vehicules');
    const data = await response.json();
    const vehicle = data.vehicules[0];
    
    console.log(`🚗 Véhicule: ${vehicle.immatriculation}`);
    console.log(`📊 Kilométrage: ${vehicle.kilometrage} km`);
    console.log(`📊 Kilométrage hebdomadaire: ${vehicle.weeklyKm} km`);
    
    // 2. Analyser l'état initial de chaque entretien
    console.log('\n📋 2. État initial détaillé:');
    ['vidange', 'bougies', 'freins'].forEach(type => {
      const daysRemaining = vehicle[`${type}DaysRemaining`];
      const nextThreshold = vehicle[`${type}NextThreshold`];
      const kmRemaining = vehicle[`${type}KmRemaining`];
      const weeksRemaining = vehicle[`${type}WeeksRemaining`];
      
      console.log(`\n  ${type.toUpperCase()}:`);
      console.log(`    - Jours restants: ${daysRemaining}`);
      console.log(`    - Prochain seuil: ${nextThreshold} km`);
      console.log(`    - Km restants: ${kmRemaining} km`);
      console.log(`    - Semaines restantes: ${weeksRemaining}`);
      console.log(`    - Urgent: ${daysRemaining <= 7 ? 'OUI' : 'NON'}`);
    });
    
    // 3. Analyser l'historique initial
    const historiqueInitial = vehicle.historiqueEntretiens || [];
    console.log('\n📋 3. Historique initial:');
    historiqueInitial.forEach((entretien, index) => {
      console.log(`  ${index + 1}. ${entretien.type}: ${entretien.kilometrage} km (${entretien.dateEffectuee})`);
    });
    
    // 4. Identifier l'entretien urgent à valider
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
      
      console.log('📋 Nouveaux calculs détaillés:');
      ['vidange', 'bougies', 'freins'].forEach(type => {
        const daysRemaining = updatedVehicle[`${type}DaysRemaining`];
        const nextThreshold = updatedVehicle[`${type}NextThreshold`];
        const kmRemaining = updatedVehicle[`${type}KmRemaining`];
        const weeksRemaining = updatedVehicle[`${type}WeeksRemaining`];
        
        console.log(`\n  ${type.toUpperCase()}:`);
        console.log(`    - Jours restants: ${daysRemaining}`);
        console.log(`    - Prochain seuil: ${nextThreshold} km`);
        console.log(`    - Km restants: ${kmRemaining} km`);
        console.log(`    - Semaines restantes: ${weeksRemaining}`);
        console.log(`    - Urgent: ${daysRemaining <= 7 ? 'OUI' : 'NON'}`);
      });
      
      // 7. Analyser l'historique après validation
      const historiqueApres = updatedVehicle.historiqueEntretiens || [];
      console.log('\n📋 6. Historique après validation:');
      historiqueApres.forEach((entretien, index) => {
        console.log(`  ${index + 1}. ${entretien.type}: ${entretien.kilometrage} km (${entretien.dateEffectuee})`);
      });
      
      // 8. Vérifier l'indépendance
      console.log('\n🔍 7. Vérification de l\'indépendance:');
      
      // Vérifier que seuls les entretiens qui étaient déjà urgents le restent
      const entretiensDevenusUrgents = ['vidange', 'bougies', 'freins'].filter(type => {
        const daysRemainingAvant = vehicle[`${type}DaysRemaining`];
        const daysRemainingApres = updatedVehicle[`${type}DaysRemaining`];
        const etaitUrgentAvant = daysRemainingAvant <= 7;
        const estUrgentApres = daysRemainingApres <= 7;
        
        // Un entretien ne doit devenir urgent que s'il était déjà proche de l'être
        const estDevenuUrgent = !etaitUrgentAvant && estUrgentApres;
        
        if (estDevenuUrgent) {
          console.log(`⚠️  ${type.toUpperCase()} est devenu urgent après validation de ${urgentType}!`);
          console.log(`    Avant: ${daysRemainingAvant} jours`);
          console.log(`    Après: ${daysRemainingApres} jours`);
        }
        
        return estDevenuUrgent;
      });
      
      if (entretiensDevenusUrgents.length === 0) {
        console.log('✅ Aucun entretien n\'est devenu urgent par erreur');
      } else {
        console.log(`❌ ${entretiensDevenusUrgents.length} entretien(s) sont devenus urgents par erreur:`, entretiensDevenusUrgents);
      }
      
      // 9. Analyser les changements de seuils
      console.log('\n📊 8. Analyse des changements de seuils:');
      ['vidange', 'bougies', 'freins'].forEach(type => {
        const seuilAvant = vehicle[`${type}NextThreshold`];
        const seuilApres = updatedVehicle[`${type}NextThreshold`];
        
        if (seuilAvant !== seuilApres) {
          console.log(`  ${type.toUpperCase()}:`);
          console.log(`    - Seuil avant: ${seuilAvant} km`);
          console.log(`    - Seuil après: ${seuilApres} km`);
          console.log(`    - Changement: ${seuilApres - seuilAvant} km`);
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
testIndependanceEntretiens(); 