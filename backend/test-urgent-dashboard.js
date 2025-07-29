const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testUrgentDashboard() {
  try {
    console.log('🧪 Test dashboard avec entretien urgent...');
    
    // 1. Récupérer l'état actuel
    const response = await fetch('http://localhost:4000/api/admin/vehicules');
    const data = await response.json();
    const vehicles = data.vehicules || [];
    const vehicle = vehicles[0];
    
    console.log(`📊 Véhicule: ${vehicle.immatriculation}`);
    
    // 2. Rendre un entretien urgent
    const typeToTest = 'bougies';
    const currentDays = vehicle[`${typeToTest}DaysRemaining`];
    const currentKm = vehicle.kilometrage;
    const weeklyKm = vehicle.weeklyKm;
    
    console.log(`\n🔧 Rendre ${typeToTest} urgent...`);
    console.log(`  - Jours actuels: ${currentDays}`);
    
    // Calculer le kilométrage nécessaire pour rendre urgent (≤ 7 jours)
    const kmToAdd = Math.ceil((currentDays - 5) * weeklyKm / 7);
    const newKilometrage = currentKm + kmToAdd;
    
    console.log(`  - Km à ajouter: ${kmToAdd} km`);
    console.log(`  - Nouveau kilométrage: ${newKilometrage} km`);
    
    // 3. Mettre à jour le kilométrage
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
      
      // 4. Vérifier l'état après mise à jour
      const updatedResponse = await fetch('http://localhost:4000/api/admin/vehicules');
      const updatedData = await updatedResponse.json();
      const updatedVehicles = updatedData.vehicules || [];
      
      // 5. Calculer le dashboard
      let totalMaintenance = 0;
      let urgentMaintenance = 0;
      
      updatedVehicles.forEach(v => {
        ['vidange', 'bougies', 'freins'].forEach(type => {
          const daysRemaining = v[`${type}DaysRemaining`];
          if (daysRemaining !== undefined && daysRemaining > 0) {
            totalMaintenance++;
            if (daysRemaining <= 7) {
              urgentMaintenance++;
              console.log(`🚨 ${v.immatriculation} - ${type}: ${daysRemaining} jours (URGENT)`);
            } else {
              console.log(`✅ ${v.immatriculation} - ${type}: ${daysRemaining} jours`);
            }
          }
        });
      });
      
      console.log(`\n📊 Dashboard:`);
      console.log(`  - Total entretiens: ${totalMaintenance}`);
      console.log(`  - Entretiens urgents: ${urgentMaintenance}`);
      
      if (urgentMaintenance > 0) {
        console.log(`  - Affichage: "${urgentMaintenance} urgent(s)"`);
      } else {
        console.log(`  - Affichage: "Entretiens prévus"`);
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
testUrgentDashboard(); 