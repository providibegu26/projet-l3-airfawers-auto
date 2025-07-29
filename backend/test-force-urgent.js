const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testForceUrgent() {
  try {
    console.log('🧪 Test de force urgent...');
    
    // 1. Récupérer l'état initial
    console.log('\n📊 1. État initial...');
    const response = await fetch('http://localhost:4000/api/admin/vehicules');
    const data = await response.json();
    
    const vehicle = data.vehicules[0];
    console.log('🚗 Véhicule analysé:', {
      immatriculation: vehicle.immatriculation,
      kilometrage: vehicle.kilometrage,
      weeklyKm: vehicle.weeklyKm,
      historiqueCount: vehicle.historiqueEntretiens?.length || 0
    });
    
    // 2. Analyser les entretiens
    console.log('\n📋 2. Entretiens actuels:');
    ['vidange', 'bougies', 'freins'].forEach(type => {
      const daysRemaining = vehicle[`${type}DaysRemaining`];
      const nextThreshold = vehicle[`${type}NextThreshold`];
      
      console.log(`  ${type.toUpperCase()}: ${daysRemaining} jours restants (seuil: ${nextThreshold} km)`);
    });
    
    // 3. Choisir un type d'entretien et le rendre urgent
    const typeToTest = 'vidange';
    const currentDays = vehicle[`${typeToTest}DaysRemaining`];
    const currentKm = vehicle.kilometrage;
    const weeklyKm = vehicle.weeklyKm;
    
    console.log(`\n🔧 3. Rendre ${typeToTest} urgent...`);
    console.log(`  - Jours actuels: ${currentDays}`);
    console.log(`  - Kilométrage actuel: ${currentKm} km`);
    console.log(`  - WeeklyKm: ${weeklyKm} km/semaine`);
    
    // Calculer le kilométrage nécessaire pour rendre urgent (≤ 7 jours)
    const kmToAdd = Math.ceil((currentDays - 5) * weeklyKm / 7);
    const newKilometrage = currentKm + kmToAdd;
    
    console.log(`  - Km à ajouter: ${kmToAdd} km`);
    console.log(`  - Nouveau kilométrage: ${newKilometrage} km`);
    
    // 4. Mettre à jour le kilométrage
    const updateResponse = await fetch(`http://localhost:4000/api/admin/vehicules/${vehicle.immatriculation}/mileage`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        newMileage: newKilometrage,
        weeklyKm: weeklyKm
      })
    });
    
    if (updateResponse.ok) {
      console.log('✅ Mise à jour réussie');
      
      // 5. Vérifier l'état après mise à jour
      console.log('\n📊 4. État après mise à jour...');
      const updatedResponse = await fetch('http://localhost:4000/api/admin/vehicules');
      const updatedData = await updatedResponse.json();
      const updatedVehicle = updatedData.vehicules.find(v => v.id === vehicle.id);
      
      const newDaysRemaining = updatedVehicle[`${typeToTest}DaysRemaining`];
      const newNextThreshold = updatedVehicle[`${typeToTest}NextThreshold`];
      
      console.log(`📋 ${typeToTest.toUpperCase()}:`);
      console.log(`  - Jours restants: ${newDaysRemaining}`);
      console.log(`  - Prochain seuil: ${newNextThreshold} km`);
      
      if (newDaysRemaining <= 7) {
        console.log('  🚨 Entretien est maintenant urgent !');
        
        // 6. Simuler la validation
        console.log('\n🔧 5. Simulation de validation...');
        
        const validationResponse = await fetch('http://localhost:4000/api/admin/entretiens/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vehiculeId: updatedVehicle.id,
            type: typeToTest,
            kilometrage: updatedVehicle.kilometrage,
            description: `Test validation ${typeToTest}`
          })
        });
        
        if (validationResponse.ok) {
          console.log('✅ Validation réussie');
          
          // 7. Vérifier l'état après validation
          console.log('\n📊 6. État après validation...');
          const finalResponse = await fetch('http://localhost:4000/api/admin/vehicules');
          const finalData = await finalResponse.json();
          const finalVehicle = finalData.vehicules.find(v => v.id === vehicle.id);
          
          const finalDaysRemaining = finalVehicle[`${typeToTest}DaysRemaining`];
          const finalNextThreshold = finalVehicle[`${typeToTest}NextThreshold`];
          
          console.log(`📋 ${typeToTest.toUpperCase()} après validation:`);
          console.log(`  - Jours restants: ${finalDaysRemaining}`);
          console.log(`  - Prochain seuil: ${finalNextThreshold} km`);
          
          if (finalDaysRemaining > 7) {
            console.log('  ✅ Entretien n\'est plus urgent - doit disparaître de la page urgente');
            console.log('  ✅ BOUCLE COMPLÈTE FONCTIONNE !');
          } else {
            console.log('  🚨 Entretien reste urgent - doit rester sur la page urgente');
          }
        } else {
          console.log('❌ Erreur lors de la validation');
        }
      } else {
        console.log('❌ Entretien n\'est pas devenu urgent');
      }
    } else {
      console.log('❌ Erreur lors de la mise à jour');
    }
    
    console.log('\n🎉 Test terminé !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le test
testForceUrgent(); 