const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testHistoriqueCalcul() {
  try {
    console.log('🧪 Test de calcul avec historique...');
    
    // 1. Récupérer les véhicules avec historique
    console.log('\n📊 1. Récupération des véhicules...');
    const response = await fetch('http://localhost:4000/api/admin/vehicules');
    const data = await response.json();
    
    const vehicle = data.vehicules[0];
    console.log('🚗 Véhicule analysé:', {
      immatriculation: vehicle.immatriculation,
      kilometrage: vehicle.kilometrage,
      weeklyKm: vehicle.weeklyKm,
      historiqueCount: vehicle.historiqueEntretiens?.length || 0
    });
    
    // 2. Analyser l'historique
    if (vehicle.historiqueEntretiens && vehicle.historiqueEntretiens.length > 0) {
      console.log('\n📋 2. Historique des entretiens:');
      vehicle.historiqueEntretiens.forEach((entretien, index) => {
        console.log(`  ${index + 1}. ${entretien.type}: ${entretien.kilometrage} km (${entretien.dateEffectuee})`);
      });
    }
    
    // 3. Analyser le calcul actuel pour vidange
    console.log('\n🔧 3. Analyse du calcul vidange:');
    const vidangeDaysRemaining = vehicle.vidangeDaysRemaining;
    const vidangeNextThreshold = vehicle.vidangeNextThreshold;
    const vidangeKmRemaining = vehicle.vidangeKmRemaining;
    
    console.log('📊 Calcul actuel:');
    console.log(`  - Jours restants: ${vidangeDaysRemaining}`);
    console.log(`  - Prochain seuil: ${vidangeNextThreshold} km`);
    console.log(`  - Km restants: ${vidangeKmRemaining} km`);
    
    // 4. Vérifier le dernier entretien vidange
    const dernierEntretienVidange = vehicle.historiqueEntretiens?.find(
      entretien => entretien.type.toLowerCase() === 'vidange'
    );
    
    if (dernierEntretienVidange) {
      console.log('\n📋 4. Dernier entretien vidange:');
      console.log(`  - Kilométrage: ${dernierEntretienVidange.kilometrage} km`);
      console.log(`  - Date: ${dernierEntretienVidange.dateEffectuee}`);
      
      // 5. Calculer manuellement le prochain seuil
      const seuilVidange = 5000; // Pour LIGHT
      const kmDepuisDernierEntretien = vehicle.kilometrage - dernierEntretienVidange.kilometrage;
      const seuilsPasses = Math.floor(kmDepuisDernierEntretien / seuilVidange);
      const prochainSeuilCalcule = dernierEntretienVidange.kilometrage + ((seuilsPasses + 1) * seuilVidange);
      const kmRestantsCalcule = prochainSeuilCalcule - vehicle.kilometrage;
      const semainesRestantesCalcule = Math.ceil(kmRestantsCalcule / vehicle.weeklyKm);
      const joursRestantsCalcule = semainesRestantesCalcule * 7;
      
      console.log('\n📊 5. Calcul manuel:');
      console.log(`  - Km depuis dernier entretien: ${kmDepuisDernierEntretien} km`);
      console.log(`  - Seuils passés: ${seuilsPasses}`);
      console.log(`  - Prochain seuil calculé: ${prochainSeuilCalcule} km`);
      console.log(`  - Km restants calculé: ${kmRestantsCalcule} km`);
      console.log(`  - Semaines restantes calculé: ${semainesRestantesCalcule}`);
      console.log(`  - Jours restants calculé: ${joursRestantsCalcule}`);
      
      // 6. Comparer avec le calcul actuel
      console.log('\n🔍 6. Comparaison:');
      console.log(`  - Calcul actuel: ${vidangeDaysRemaining} jours`);
      console.log(`  - Calcul manuel: ${joursRestantsCalcule} jours`);
      
      if (vidangeDaysRemaining === joursRestantsCalcule) {
        console.log('  ✅ Calculs identiques');
      } else {
        console.log('  ❌ Calculs différents');
        console.log(`  ❌ Différence: ${Math.abs(vidangeDaysRemaining - joursRestantsCalcule)} jours`);
      }
    } else {
      console.log('ℹ️ Aucun entretien vidange dans l\'historique');
    }
    
    console.log('\n🎉 Test terminé !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le test
testHistoriqueCalcul(); 