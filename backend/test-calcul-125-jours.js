const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testCalcul125Jours() {
  try {
    console.log('🧪 Test de calcul pour 125 jours...');
    
    // 1. Récupérer les véhicules
    console.log('\n📊 1. Récupération des véhicules...');
    const response = await fetch('http://localhost:4000/api/admin/vehicules');
    const data = await response.json();
    
    const vehicle = data.vehicules[0];
    console.log('🚗 Véhicule analysé:', {
      immatriculation: vehicle.immatriculation,
      kilometrage: vehicle.kilometrage,
      weeklyKm: vehicle.weeklyKm,
      historiqueCount: vehicle.historiqueEntretiens?.length || 0
    });
    
    // 2. Analyser l'historique
    if (vehicle.historiqueEntretiens && vehicle.historiqueEntretiens.length > 0) {
      console.log('\n📋 2. Historique des entretiens:');
      vehicle.historiqueEntretiens.forEach((entretien, index) => {
        console.log(`  ${index + 1}. ${entretien.type}: ${entretien.kilometrage} km (${entretien.dateEffectuee})`);
      });
    }
    
    // 3. Analyser chaque type d'entretien
    ['vidange', 'bougies', 'freins'].forEach(type => {
      const daysRemaining = vehicle[`${type}DaysRemaining`];
      const nextThreshold = vehicle[`${type}NextThreshold`];
      const kmRemaining = vehicle[`${type}KmRemaining`];
      const weeksRemaining = vehicle[`${type}WeeksRemaining`];
      
      console.log(`\n📋 ${type.toUpperCase()}:`);
      console.log(`  - Jours restants: ${daysRemaining}`);
      console.log(`  - Semaines restantes: ${weeksRemaining}`);
      console.log(`  - Prochain seuil: ${nextThreshold} km`);
      console.log(`  - Km restants: ${kmRemaining} km`);
      
      // Vérifier si c'est proche de 125 jours
      if (Math.abs(daysRemaining - 125) <= 10) {
        console.log(`  🎯 PROCHE DE 125 JOURS: ${daysRemaining} jours`);
      }
      
      // Vérifier la cohérence du calcul
      const expectedWeeks = Math.ceil(kmRemaining / vehicle.weeklyKm);
      const expectedDays = expectedWeeks * 7;
      
      if (daysRemaining === expectedDays) {
        console.log(`  ✅ Calcul cohérent`);
      } else {
        console.log(`  ❌ Calcul incohérent: attendu ${expectedDays}, obtenu ${daysRemaining}`);
      }
    });
    
    // 4. Simuler une validation pour voir la nouvelle estimation
    console.log('\n🔧 3. Simulation de validation...');
    const typeToValidate = 'vidange';
    
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
      console.log('✅ Validation simulée réussie');
      
      // Récupérer les données mises à jour
      const updatedResponse = await fetch('http://localhost:4000/api/admin/vehicules');
      const updatedData = await updatedResponse.json();
      const updatedVehicle = updatedData.vehicules.find(v => v.id === vehicle.id);
      
      const newDaysRemaining = updatedVehicle[`${typeToValidate}DaysRemaining`];
      const newNextThreshold = updatedVehicle[`${typeToValidate}NextThreshold`];
      const newKmRemaining = updatedVehicle[`${typeToValidate}KmRemaining`];
      
      console.log(`📋 Nouvelle estimation ${typeToValidate}:`);
      console.log(`  - Jours restants: ${newDaysRemaining}`);
      console.log(`  - Prochain seuil: ${newNextThreshold} km`);
      console.log(`  - Km restants: ${newKmRemaining} km`);
      
      if (Math.abs(newDaysRemaining - 125) <= 10) {
        console.log(`  🎯 PROCHE DE 125 JOURS: ${newDaysRemaining} jours`);
      }
    } else {
      console.log('❌ Erreur lors de la validation simulée');
    }
    
    console.log('\n🎉 Test terminé !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le test
testCalcul125Jours(); 