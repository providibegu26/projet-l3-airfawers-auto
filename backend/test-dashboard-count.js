const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testDashboardCount() {
  try {
    console.log('🧪 Test du calcul dashboard...');
    
    // Récupérer les véhicules
    const response = await fetch('http://localhost:4000/api/admin/vehicules');
    const data = await response.json();
    const vehicles = data.vehicules || [];
    
    console.log(`📊 ${vehicles.length} véhicules trouvés`);
    
    // Calculer le nombre total d'entretiens prévus
    let totalMaintenance = 0;
    let urgentMaintenance = 0;
    let details = [];
    
    vehicles.forEach(vehicle => {
      console.log(`\n🚗 ${vehicle.immatriculation}:`);
      
      ['vidange', 'bougies', 'freins'].forEach(type => {
        const daysRemaining = vehicle[`${type}DaysRemaining`];
        const nextThreshold = vehicle[`${type}NextThreshold`];
        
        if (daysRemaining !== undefined && daysRemaining > 0) {
          totalMaintenance++;
          const isUrgent = daysRemaining <= 7;
          if (isUrgent) urgentMaintenance++;
          
          details.push({
            vehicle: vehicle.immatriculation,
            type: type,
            daysRemaining: daysRemaining,
            nextThreshold: nextThreshold,
            isUrgent: isUrgent
          });
          
          const status = isUrgent ? '🚨 URGENT' : '✅ Normal';
          console.log(`  ${status} ${type.toUpperCase()}: ${daysRemaining} jours restants (seuil: ${nextThreshold} km)`);
        } else {
          console.log(`  ❌ ${type.toUpperCase()}: Pas d'entretien prévu`);
        }
      });
    });
    
    console.log(`\n📋 Résumé Dashboard:`);
    console.log(`  - Total d'entretiens prévus: ${totalMaintenance}`);
    console.log(`  - Entretiens urgents: ${urgentMaintenance}`);
    console.log(`  - Détail par véhicule:`);
    
    details.forEach(detail => {
      const urgent = detail.isUrgent ? '🚨' : '✅';
      console.log(`    ${urgent} ${detail.vehicle} - ${detail.type}: ${detail.daysRemaining} jours`);
    });
    
    console.log('\n🎉 Test terminé !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le test
testDashboardCount(); 