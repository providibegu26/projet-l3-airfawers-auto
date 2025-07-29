const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testCalculCorrectFinal() {
  try {
    console.log('🧮 Test du calcul correct final...');
    
    // 1. État initial
    console.log('\n📊 1. État initial...');
    const response = await fetch('http://localhost:4000/api/admin/vehicules');
    const data = await response.json();
    const vehicle = data.vehicules[0];
    
    console.log(`🚗 Véhicule: ${vehicle.immatriculation}`);
    console.log(`📊 Kilométrage actuel: ${vehicle.kilometrage} km`);
    console.log(`📊 Kilométrage hebdomadaire: ${vehicle.weeklyKm} km`);
    console.log(`📊 Catégorie: ${vehicle.categorie}`);
    
    // 2. Analyser l'historique
    const historique = vehicle.historiqueEntretiens || [];
    console.log('\n📋 2. Historique des entretiens:');
    historique.forEach((entretien, index) => {
      console.log(`  ${index + 1}. ${entretien.type}: ${entretien.kilometrage} km (${entretien.dateEffectuee})`);
    });
    
    // 3. Trouver le dernier entretien vidange
    const dernierEntretienVidange = historique
      .filter(entretien => entretien.type.toLowerCase() === 'vidange')
      .sort((a, b) => new Date(b.dateEffectuee) - new Date(a.dateEffectuee))[0];
    
    console.log('\n🔍 3. Dernier entretien vidange:');
    if (dernierEntretienVidange) {
      console.log(`  Kilométrage: ${dernierEntretienVidange.kilometrage} km`);
      console.log(`  Date: ${dernierEntretienVidange.dateEffectuee}`);
    } else {
      console.log('  Aucun entretien vidange trouvé');
    }
    
    // 4. Calcul manuel pour vérifier
    console.log('\n🧮 4. Calcul manuel:');
    const currentKm = vehicle.kilometrage;
    const weeklyKm = vehicle.weeklyKm;
    const threshold = vehicle.categorie === 'HEAVY' ? 8000 : 5000; // Seuil vidange
    
    console.log(`  Seuil vidange: ${threshold} km`);
    
    if (dernierEntretienVidange) {
      const baseKm = dernierEntretienVidange.kilometrage;
      const kmDepuisDernierEntretien = currentKm - baseKm;
      const seuilsPasses = Math.floor(kmDepuisDernierEntretien / threshold);
      const prochainSeuil = baseKm + ((seuilsPasses + 1) * threshold);
      const kmRestants = prochainSeuil - currentKm;
      const semainesRestantes = Math.ceil(kmRestants / weeklyKm);
      const joursRestants = semainesRestantes * 7;
      
      console.log(`  Base km (dernier entretien): ${baseKm} km`);
      console.log(`  Km depuis dernier entretien: ${kmDepuisDernierEntretien} km`);
      console.log(`  Seuils passés: ${seuilsPasses}`);
      console.log(`  Prochain seuil: ${baseKm} + ((${seuilsPasses} + 1) × ${threshold}) = ${prochainSeuil} km`);
      console.log(`  Km restants: ${prochainSeuil} - ${currentKm} = ${kmRestants} km`);
      console.log(`  Semaines restantes: ${kmRestants} ÷ ${weeklyKm} = ${semainesRestantes} semaines`);
      console.log(`  Jours restants: ${semainesRestantes} × 7 = ${joursRestants} jours`);
      
      // 5. Comparer avec le calcul du programme
      console.log('\n📊 5. Comparaison avec le programme:');
      const programmeJours = vehicle.vidangeDaysRemaining;
      console.log(`  Calcul manuel: ${joursRestants} jours`);
      console.log(`  Calcul programme: ${programmeJours} jours`);
      
      if (joursRestants === programmeJours) {
        console.log('✅ Les calculs sont identiques !');
      } else {
        console.log('❌ Les calculs sont différents !');
        console.log(`  Différence: ${Math.abs(joursRestants - programmeJours)} jours`);
      }
      
    } else {
      console.log('  Pas d\'entretien vidange précédent, calcul impossible');
    }
    
    // 6. Vérifier tous les types d'entretiens
    console.log('\n📋 6. Vérification de tous les types:');
    ['vidange', 'bougies', 'freins'].forEach(type => {
      const daysRemaining = vehicle[`${type}DaysRemaining`];
      const nextThreshold = vehicle[`${type}NextThreshold`];
      const kmRemaining = vehicle[`${type}KmRemaining`];
      const weeksRemaining = vehicle[`${type}WeeksRemaining`];
      
      console.log(`\n  ${type.toUpperCase()}:`);
      console.log(`    - Jours restants: ${daysRemaining}`);
      console.log(`    - Prochain seuil: ${nextThreshold} km`);
      console.log(`    - Km restants: ${kmRemaining} km`);
      console.log(`    - Semaines restantes: ${weeksRemaining}`);
      console.log(`    - Urgent: ${daysRemaining <= 7 ? 'OUI' : 'NON'}`);
    });
    
    console.log('\n🎉 Test terminé !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le test
testCalculCorrectFinal(); 