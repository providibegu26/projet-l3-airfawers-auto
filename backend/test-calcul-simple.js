const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testCalculSimple() {
  try {
    console.log('🧪 Test de calcul simple...');
    
    // 1. Récupérer les véhicules
    console.log('\n📊 1. Récupération des véhicules...');
    const response = await fetch('http://localhost:4000/api/admin/vehicules');
    const data = await response.json();
    
    console.log(`✅ ${data.vehicules.length} véhicules récupérés`);
    
    // 2. Analyser le premier véhicule
    const vehicle = data.vehicules[0];
    if (!vehicle) {
      console.log('❌ Aucun véhicule trouvé');
      return;
    }
    
    console.log('\n🚗 Véhicule analysé:', {
      immatriculation: vehicle.immatriculation,
      kilometrage: vehicle.kilometrage,
      weeklyKm: vehicle.weeklyKm,
      categorie: vehicle.categorie,
      historiqueCount: vehicle.historiqueEntretiens?.length || 0
    });
    
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
      
      // Vérifier la cohérence du calcul
      const expectedWeeks = Math.ceil(kmRemaining / vehicle.weeklyKm);
      const expectedDays = expectedWeeks * 7;
      
      console.log(`  - Calcul attendu: ${kmRemaining} km / ${vehicle.weeklyKm} km/sem = ${expectedWeeks} semaines = ${expectedDays} jours`);
      
      if (daysRemaining === expectedDays) {
        console.log(`  ✅ Calcul cohérent`);
      } else {
        console.log(`  ❌ Calcul incohérent: attendu ${expectedDays}, obtenu ${daysRemaining}`);
      }
      
      if (daysRemaining <= 7) {
        console.log(`  🚨 URGENT: Apparaît sur la page des entretiens urgents`);
      } else {
        console.log(`  ✅ Normal: Apparaît sur la page ${type}`);
      }
    });
    
    console.log('\n🎉 Test de calcul terminé !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le test
testCalculSimple(); 