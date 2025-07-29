const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testValidationVidange() {
  try {
    console.log('🧪 Test de validation de la vidange...');
    
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
      console.log(`  ${index + 1}. ${entretien.type}: ${entretien.kilometrage} km`);
    });
    
    // 4. Valider la vidange (qui est urgente)
    console.log('\n🔧 4. Validation de la vidange...');
    const validationResponse = await fetch('http://localhost:4000/api/admin/entretiens/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vehiculeId: vehicle.id,
        type: 'vidange',
        kilometrage: vehicle.kilometrage,
        description: 'Test validation vidange'
      })
    });
    
    if (validationResponse.ok) {
      console.log('✅ Validation de la vidange réussie');
      
      // 5. Vérifier l'état après validation
      console.log('\n📊 5. État après validation de la vidange...');
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
        console.log(`  ${index + 1}. ${entretien.type}: ${entretien.kilometrage} km`);
      });
      
      // 7. Vérifier l'indépendance
      console.log('\n🔍 7. Vérification de l\'indépendance:');
      
      const vidangeAvant = vehicle.vidangeDaysRemaining;
      const vidangeApres = updatedVehicle.vidangeDaysRemaining;
      const bougiesAvant = vehicle.bougiesDaysRemaining;
      const bougiesApres = updatedVehicle.bougiesDaysRemaining;
      const freinsAvant = vehicle.freinsDaysRemaining;
      const freinsApres = updatedVehicle.freinsDaysRemaining;
      
      console.log('📊 Comparaison avant/après:');
      console.log(`  VIDANGE: ${vidangeAvant} jours → ${vidangeApres} jours`);
      console.log(`  BOUGIES: ${bougiesAvant} jours → ${bougiesApres} jours`);
      console.log(`  FREINS: ${freinsAvant} jours → ${freinsApres} jours`);
      
      // Vérifier que seuls les entretiens qui étaient déjà urgents le restent
      const entretiensDevenusUrgents = [];
      
      if (vidangeAvant > 7 && vidangeApres <= 7) {
        entretiensDevenusUrgents.push('vidange');
        console.log('⚠️  VIDANGE est devenu urgent par erreur!');
      }
      
      if (bougiesAvant > 7 && bougiesApres <= 7) {
        entretiensDevenusUrgents.push('bougies');
        console.log('⚠️  BOUGIES est devenu urgent par erreur!');
      }
      
      if (freinsAvant > 7 && freinsApres <= 7) {
        entretiensDevenusUrgents.push('freins');
        console.log('⚠️  FREINS est devenu urgent par erreur!');
      }
      
      if (entretiensDevenusUrgents.length === 0) {
        console.log('✅ Aucun entretien n\'est devenu urgent par erreur');
        console.log('✅ Les entretiens sont maintenant indépendants!');
      } else {
        console.log(`❌ ${entretiensDevenusUrgents.length} entretien(s) sont devenus urgents par erreur:`, entretiensDevenusUrgents);
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
testValidationVidange(); 