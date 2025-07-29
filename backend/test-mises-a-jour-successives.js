const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testMisesAJourSuccessives() {
  try {
    console.log('🧪 Test des mises à jour successives...');
    
    // 1. Récupérer l'état initial
    console.log('\n📊 1. État initial...');
    const initialResponse = await fetch('http://localhost:4000/api/admin/vehicules');
    const initialData = await initialResponse.json();
    
    const vehicle = initialData.vehicules[0];
    if (!vehicle) {
      console.log('❌ Aucun véhicule trouvé');
      return;
    }
    
    console.log('🚗 Véhicule initial:', {
      immatriculation: vehicle.immatriculation,
      kilometrage: vehicle.kilometrage,
      weeklyKm: vehicle.weeklyKm
    });
    
    // 2. Effectuer plusieurs mises à jour successives
    const misesAJour = [
      { kilometrage: vehicle.kilometrage + 1000, weeklyKm: vehicle.weeklyKm },
      { kilometrage: vehicle.kilometrage + 2000, weeklyKm: vehicle.weeklyKm },
      { kilometrage: vehicle.kilometrage + 3000, weeklyKm: vehicle.weeklyKm },
      { kilometrage: vehicle.kilometrage + 4000, weeklyKm: vehicle.weeklyKm }
    ];
    
    for (let i = 0; i < misesAJour.length; i++) {
      const miseAJour = misesAJour[i];
      console.log(`\n--- MISE À JOUR ${i + 1}: ${miseAJour.kilometrage} km ---`);
      
      // Effectuer la mise à jour
      const updateResponse = await fetch(`http://localhost:4000/api/admin/vehicules/${vehicle.id}/mileage`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kilometrage: miseAJour.kilometrage,
          weeklyKm: miseAJour.weeklyKm
        })
      });
      
      if (!updateResponse.ok) {
        console.error(`❌ Erreur mise à jour ${i + 1}`);
        continue;
      }
      
      console.log(`✅ Mise à jour ${i + 1} réussie`);
      
      // Récupérer les données mises à jour
      const updatedResponse = await fetch('http://localhost:4000/api/admin/vehicules');
      const updatedData = await updatedResponse.json();
      const updatedVehicle = updatedData.vehicules.find(v => v.id === vehicle.id);
      
      console.log('📋 Après mise à jour:', {
        kilometrage: updatedVehicle.kilometrage,
        weeklyKm: updatedVehicle.weeklyKm
      });
      
      // Analyser chaque type d'entretien
      ['vidange', 'bougies', 'freins'].forEach(type => {
        const daysRemaining = updatedVehicle[`${type}DaysRemaining`];
        const nextThreshold = updatedVehicle[`${type}NextThreshold`];
        const kmRemaining = updatedVehicle[`${type}KmRemaining`];
        const weeksRemaining = updatedVehicle[`${type}WeeksRemaining`];
        
        console.log(`  ${type}:`);
        console.log(`    - Jours restants: ${daysRemaining}`);
        console.log(`    - Semaines restantes: ${weeksRemaining}`);
        console.log(`    - Prochain seuil: ${nextThreshold} km`);
        console.log(`    - Km restants: ${kmRemaining} km`);
        
        // Vérifier la cohérence du calcul
        const expectedWeeks = Math.ceil(kmRemaining / updatedVehicle.weeklyKm);
        const expectedDays = expectedWeeks * 7;
        
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
      
      // Attendre un peu avant la prochaine mise à jour
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('\n🎉 Test des mises à jour terminé !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le test
testMisesAJourSuccessives(); 