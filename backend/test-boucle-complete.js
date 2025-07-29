const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testBoucleComplete() {
  try {
    console.log('🧪 Test de la boucle complète...');
    
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
    
    // 2. Analyser les entretiens urgents
    console.log('\n📋 2. Entretiens urgents actuels:');
    ['vidange', 'bougies', 'freins'].forEach(type => {
      const daysRemaining = vehicle[`${type}DaysRemaining`];
      const nextThreshold = vehicle[`${type}NextThreshold`];
      
      if (daysRemaining <= 7) {
        console.log(`  🚨 ${type.toUpperCase()}: ${daysRemaining} jours restants (seuil: ${nextThreshold} km)`);
      } else {
        console.log(`  ✅ ${type.toUpperCase()}: ${daysRemaining} jours restants (non-urgent)`);
      }
    });
    
    // 3. Simuler une validation d'un entretien urgent
    console.log('\n🔧 3. Simulation de validation...');
    const typeToValidate = 'vidange';
    
    // Vérifier si l'entretien est urgent
    const daysRemaining = vehicle[`${typeToValidate}DaysRemaining`];
    if (daysRemaining > 7) {
      console.log(`⚠️ ${typeToValidate} n'est pas urgent (${daysRemaining} jours). Test impossible.`);
      return;
    }
    
    console.log(`✅ ${typeToValidate} est urgent (${daysRemaining} jours). Validation...`);
    
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
      console.log('✅ Validation réussie');
      
      // 4. Vérifier l'état après validation
      console.log('\n📊 4. État après validation...');
      const updatedResponse = await fetch('http://localhost:4000/api/admin/vehicules');
      const updatedData = await updatedResponse.json();
      const updatedVehicle = updatedData.vehicules.find(v => v.id === vehicle.id);
      
      console.log('📋 Nouvelle estimation:');
      const newDaysRemaining = updatedVehicle[`${typeToValidate}DaysRemaining`];
      const newNextThreshold = updatedVehicle[`${typeToValidate}NextThreshold`];
      
      console.log(`  - ${typeToValidate}: ${newDaysRemaining} jours restants (seuil: ${newNextThreshold} km)`);
      
      if (newDaysRemaining > 7) {
        console.log('  ✅ Entretien n\'est plus urgent - doit disparaître de la page urgente');
      } else {
        console.log('  🚨 Entretien reste urgent - doit rester sur la page urgente');
      }
      
      // 5. Simuler une mise à jour du kilométrage pour rendre l'entretien urgent à nouveau
      console.log('\n🔧 5. Simulation de mise à jour pour rendre urgent...');
      
      // Calculer le kilométrage nécessaire pour rendre l'entretien urgent
      // On veut que l'entretien devienne urgent (≤ 7 jours)
      const kmToAdd = Math.ceil((newDaysRemaining - 5) * updatedVehicle.weeklyKm / 7);
      const newKilometrage = updatedVehicle.kilometrage + kmToAdd;
      
      console.log(`  - Kilométrage actuel: ${updatedVehicle.kilometrage} km`);
      console.log(`  - Kilométrage cible: ${newKilometrage} km`);
      console.log(`  - Km à ajouter: ${kmToAdd} km`);
      console.log(`  - Jours actuels: ${newDaysRemaining}, jours cibles: 5`);
      
      const updateResponse = await fetch(`http://localhost:4000/api/admin/vehicules/${updatedVehicle.immatriculation}/mileage`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newMileage: newKilometrage,
          weeklyKm: updatedVehicle.weeklyKm
        })
      });
      
      if (updateResponse.ok) {
        console.log('✅ Mise à jour réussie');
        
        // 6. Vérifier l'état final
        console.log('\n📊 6. État final...');
        const finalResponse = await fetch('http://localhost:4000/api/admin/vehicules');
        const finalData = await finalResponse.json();
        const finalVehicle = finalData.vehicules.find(v => v.id === vehicle.id);
        
        const finalDaysRemaining = finalVehicle[`${typeToValidate}DaysRemaining`];
        const finalNextThreshold = finalVehicle[`${typeToValidate}NextThreshold`];
        
        console.log(`📋 État final ${typeToValidate}:`);
        console.log(`  - Jours restants: ${finalDaysRemaining}`);
        console.log(`  - Prochain seuil: ${finalNextThreshold} km`);
        
        if (finalDaysRemaining <= 7) {
          console.log('  🚨 Entretien redevient urgent - doit réapparaître sur la page urgente');
          console.log('  ✅ BOUCLE COMPLÈTE FONCTIONNE !');
        } else {
          console.log('  ✅ Entretien reste non-urgent');
        }
      } else {
        console.log('❌ Erreur lors de la mise à jour');
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
testBoucleComplete(); 