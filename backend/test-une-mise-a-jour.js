const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testUneMiseAJour() {
  try {
    console.log('🧪 Test d\'une seule mise à jour...');
    
    // 1. État initial
    console.log('\n📊 1. État initial...');
    const initialResponse = await fetch('http://localhost:4000/api/admin/vehicules');
    const initialData = await initialResponse.json();
    
    const vehicle = initialData.vehicules[0];
    console.log('🚗 Véhicule initial:', {
      id: vehicle.id,
      immatriculation: vehicle.immatriculation,
      kilometrage: vehicle.kilometrage,
      weeklyKm: vehicle.weeklyKm
    });
    
    // Analyser l'état initial
    ['vidange', 'bougies', 'freins'].forEach(type => {
      const daysRemaining = vehicle[`${type}DaysRemaining`];
      const nextThreshold = vehicle[`${type}NextThreshold`];
      const kmRemaining = vehicle[`${type}KmRemaining`];
      
      console.log(`  ${type} (INITIAL):`);
      console.log(`    - Jours restants: ${daysRemaining}`);
      console.log(`    - Prochain seuil: ${nextThreshold} km`);
      console.log(`    - Km restants: ${kmRemaining} km`);
    });
    
    // 2. Effectuer une mise à jour
    console.log('\n🔧 2. Mise à jour...');
    const newKilometrage = vehicle.kilometrage + 1000;
    const newWeeklyKm = vehicle.weeklyKm;
    
    console.log(`📋 Mise à jour vers: ${newKilometrage} km, ${newWeeklyKm} km/sem`);
    
    const updateResponse = await fetch(`http://localhost:4000/api/admin/vehicules/${vehicle.immatriculation}/mileage`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        newMileage: newKilometrage,
        weeklyKm: newWeeklyKm
      })
    });
    
    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      console.error('❌ Erreur mise à jour:', errorData);
      return;
    }
    
    console.log('✅ Mise à jour réussie');
    
    // 3. Récupérer l'état après mise à jour
    console.log('\n📊 3. État après mise à jour...');
    const updatedResponse = await fetch('http://localhost:4000/api/admin/vehicules');
    const updatedData = await updatedResponse.json();
    const updatedVehicle = updatedData.vehicules.find(v => v.id === vehicle.id);
    
    console.log('🚗 Véhicule mis à jour:', {
      immatriculation: updatedVehicle.immatriculation,
      kilometrage: updatedVehicle.kilometrage,
      weeklyKm: updatedVehicle.weeklyKm
    });
    
    // Analyser l'état après mise à jour
    ['vidange', 'bougies', 'freins'].forEach(type => {
      const daysRemaining = updatedVehicle[`${type}DaysRemaining`];
      const nextThreshold = updatedVehicle[`${type}NextThreshold`];
      const kmRemaining = updatedVehicle[`${type}KmRemaining`];
      const weeksRemaining = updatedVehicle[`${type}WeeksRemaining`];
      
      console.log(`  ${type} (APRÈS):`);
      console.log(`    - Jours restants: ${daysRemaining}`);
      console.log(`    - Semaines restantes: ${weeksRemaining}`);
      console.log(`    - Prochain seuil: ${nextThreshold} km`);
      console.log(`    - Km restants: ${kmRemaining} km`);
      
      // Vérifier la cohérence du calcul
      const expectedWeeks = Math.ceil(kmRemaining / updatedVehicle.weeklyKm);
      const expectedDays = expectedWeeks * 7;
      
      console.log(`    - Calcul attendu: ${kmRemaining} km / ${updatedVehicle.weeklyKm} km/sem = ${expectedWeeks} semaines = ${expectedDays} jours`);
      
      if (daysRemaining === expectedDays) {
        console.log(`    ✅ Calcul cohérent`);
      } else {
        console.log(`    ❌ Calcul incohérent: attendu ${expectedDays}, obtenu ${daysRemaining}`);
      }
      
      if (daysRemaining <= 7) {
        console.log(`    🚨 URGENT: Apparaît sur la page des entretiens urgents`);
      } else {
        console.log(`    ✅ Normal: Apparaît sur la page ${type}`);
      }
    });
    
    console.log('\n🎉 Test terminé !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le test
testUneMiseAJour(); 