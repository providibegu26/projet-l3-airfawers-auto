// Test des calculs de vidange avec des scénarios réalistes
function testVidangeRealiste() {
  console.log('🧪 Test des calculs de vidange (scénarios réalistes)...');
  
  const thresholds = {
    HEAVY: { vidange: 8000, bougies: 80000, freins: 20000 },
    LIGHT: { vidange: 5000, bougies: 40000, freins: 50000 }
  };
  
  // Scénarios réalistes
  const scenarios = [
    {
      name: 'Véhicule HEAVY neuf avec 0 km',
      category: 'HEAVY',
      currentKm: 0,
      weeklyKm: 500,
      historiqueEntretiens: []
    },
    {
      name: 'Véhicule HEAVY neuf avec 1000 km',
      category: 'HEAVY',
      currentKm: 1000,
      weeklyKm: 500,
      historiqueEntretiens: []
    },
    {
      name: 'Véhicule HEAVY proche du seuil (7000 km)',
      category: 'HEAVY',
      currentKm: 7000,
      weeklyKm: 500,
      historiqueEntretiens: []
    },
    {
      name: 'Véhicule HEAVY au seuil (8000 km)',
      category: 'HEAVY',
      currentKm: 8000,
      weeklyKm: 500,
      historiqueEntretiens: []
    },
    {
      name: 'Véhicule HEAVY dépassé (9000 km)',
      category: 'HEAVY',
      currentKm: 9000,
      weeklyKm: 500,
      historiqueEntretiens: []
    },
    {
      name: 'Véhicule LIGHT neuf avec 0 km',
      category: 'LIGHT',
      currentKm: 0,
      weeklyKm: 500,
      historiqueEntretiens: []
    },
    {
      name: 'Véhicule LIGHT proche du seuil (4000 km)',
      category: 'LIGHT',
      currentKm: 4000,
      weeklyKm: 500,
      historiqueEntretiens: []
    },
    {
      name: 'Véhicule LIGHT au seuil (5000 km)',
      category: 'LIGHT',
      currentKm: 5000,
      weeklyKm: 500,
      historiqueEntretiens: []
    }
  ];
  
  scenarios.forEach((scenario, index) => {
    console.log(`\n📊 Scénario ${index + 1}: ${scenario.name}`);
    
    const threshold = thresholds[scenario.category].vidange;
    
    // Trouver le dernier entretien de ce type
    const dernierEntretien = scenario.historiqueEntretiens.find(
      entretien => entretien.type === 'vidange'
    );
    
    let baseKm;
    if (dernierEntretien) {
      baseKm = dernierEntretien.kilometrage;
      console.log(`  Dernier entretien: ${baseKm} km`);
    } else {
      baseKm = scenario.currentKm;
      console.log(`  Premier entretien (base: ${scenario.currentKm} km)`);
    }
    
    // Calculer le prochain seuil
    let prochainSeuil;
    if (baseKm >= threshold) {
      const seuilsPasses = Math.floor(baseKm / threshold);
      prochainSeuil = (seuilsPasses + 1) * threshold;
    } else {
      prochainSeuil = threshold;
    }
    
    // Calculer les estimations
    const kmRestants = prochainSeuil - scenario.currentKm;
    const semainesRestantes = Math.ceil(kmRestants / scenario.weeklyKm);
    const joursRestants = semainesRestantes * 7;
    
    console.log('Résultats:', {
      baseKm,
      threshold,
      prochainSeuil,
      kmRestants,
      semainesRestantes,
      joursRestants,
      isUrgent: joursRestants <= 7,
      isEnRetard: joursRestants < 0
    });
    
    // Vérifier le statut
    if (joursRestants < 0) {
      console.log('  🚨 EN RETARD: Cet entretien apparaîtra dans les urgents');
    } else if (joursRestants <= 7) {
      console.log('  🚨 URGENT: Cet entretien apparaîtra dans les urgents');
    } else {
      console.log('  ✅ Normal: Cet entretien n\'apparaîtra pas dans les urgents');
    }
  });
  
  console.log('\n🎉 Test des scénarios réalistes terminé !');
}

testVidangeRealiste(); 