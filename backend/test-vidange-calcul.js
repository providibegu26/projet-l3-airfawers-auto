// Test des calculs de vidange
function testVidangeCalcul() {
  console.log('🧪 Test des calculs de vidange...');
  
  const thresholds = {
    HEAVY: { vidange: 8000, bougies: 80000, freins: 20000 },
    LIGHT: { vidange: 5000, bougies: 40000, freins: 50000 }
  };
  
  // Scénarios de test
  const scenarios = [
    {
      name: 'Véhicule neuf HEAVY',
      category: 'HEAVY',
      currentKm: 1000,
      weeklyKm: 500,
      historiqueEntretiens: []
    },
    {
      name: 'Véhicule HEAVY avec vidange récente',
      category: 'HEAVY',
      currentKm: 8500,
      weeklyKm: 500,
      historiqueEntretiens: [
        { type: 'vidange', kilometrage: 8000 }
      ]
    },
    {
      name: 'Véhicule HEAVY en retard',
      category: 'HEAVY',
      currentKm: 9000,
      weeklyKm: 500,
      historiqueEntretiens: []
    },
    {
      name: 'Véhicule LIGHT neuf',
      category: 'LIGHT',
      currentKm: 1000,
      weeklyKm: 500,
      historiqueEntretiens: []
    },
    {
      name: 'Véhicule LIGHT avec vidange récente',
      category: 'LIGHT',
      currentKm: 6000,
      weeklyKm: 500,
      historiqueEntretiens: [
        { type: 'vidange', kilometrage: 5000 }
      ]
    }
  ];
  
  scenarios.forEach((scenario, index) => {
    console.log(`\n📊 Scénario ${index + 1}: ${scenario.name}`);
    console.log('Données:', {
      category: scenario.category,
      currentKm: scenario.currentKm,
      weeklyKm: scenario.weeklyKm,
      historiqueCount: scenario.historiqueEntretiens.length
    });
    
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
      isUrgent: joursRestants <= 7
    });
    
    // Vérifier si c'est urgent
    if (joursRestants <= 7) {
      console.log('  🚨 URGENT: Cet entretien apparaîtra dans les entretiens urgents');
    } else {
      console.log('  ✅ Normal: Cet entretien n\'apparaîtra pas dans les urgents');
    }
  });
  
  console.log('\n🎉 Test des calculs terminé !');
}

testVidangeCalcul(); 