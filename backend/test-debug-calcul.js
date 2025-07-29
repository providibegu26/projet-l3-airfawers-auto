const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testDebugCalcul() {
  try {
    console.log('🔍 Debug du calcul des entretiens...');
    
    // 1. État initial
    const response = await fetch('http://localhost:4000/api/admin/vehicules');
    const data = await response.json();
    const vehicle = data.vehicules[0];
    
    console.log(`🚗 Véhicule: ${vehicle.immatriculation}`);
    console.log(`📊 Kilométrage: ${vehicle.kilometrage} km`);
    
    // 2. Analyser l'historique en détail
    const historique = vehicle.historiqueEntretiens || [];
    console.log('\n📋 Historique détaillé:');
    historique.forEach((entretien, index) => {
      console.log(`  ${index + 1}. Type: "${entretien.type}" (${typeof entretien.type})`);
      console.log(`     Kilométrage: ${entretien.kilometrage} km`);
      console.log(`     Date: ${entretien.dateEffectuee}`);
    });
    
    // 3. Tester la recherche pour chaque type
    console.log('\n🔍 Test de recherche par type:');
    ['vidange', 'bougies', 'freins'].forEach(type => {
      console.log(`\n  Recherche pour "${type}":`);
      
      // Test avec toLowerCase()
      const result1 = historique.find(
        entretien => entretien.type.toLowerCase() === type.toLowerCase()
      );
      console.log(`    toLowerCase(): ${result1 ? `Trouvé "${result1.type}"` : 'Non trouvé'}`);
      
      // Test avec comparaison directe
      const result2 = historique.find(
        entretien => entretien.type === type
      );
      console.log(`    Comparaison directe: ${result2 ? `Trouvé "${result2.type}"` : 'Non trouvé'}`);
      
      // Test avec includes
      const result3 = historique.find(
        entretien => entretien.type.toLowerCase().includes(type.toLowerCase())
      );
      console.log(`    includes(): ${result3 ? `Trouvé "${result3.type}"` : 'Non trouvé'}`);
      
      // Afficher tous les types dans l'historique
      console.log(`    Types dans l'historique: [${historique.map(e => `"${e.type}"`).join(', ')}]`);
    });
    
    // 4. Simuler le calcul manuellement
    console.log('\n🧮 Simulation du calcul manuel:');
    const category = vehicle.categorie || 'LIGHT';
    const thresholds = {
      HEAVY: { vidange: 8000, bougies: 80000, freins: 20000 },
      LIGHT: { vidange: 5000, bougies: 40000, freins: 50000 }
    };
    const currentKm = vehicle.kilometrage || 0;
    const weeklyKm = vehicle.weeklyKm || 500;
    
    ['vidange', 'bougies', 'freins'].forEach(type => {
      const threshold = thresholds[category][type];
      console.log(`\n  ${type.toUpperCase()}:`);
      console.log(`    Seuil: ${threshold} km`);
      
      // Recherche manuelle
      const dernierEntretien = historique.find(
        entretien => entretien.type.toLowerCase() === type.toLowerCase()
      );
      
      console.log(`    Dernier entretien trouvé: ${dernierEntretien ? `"${dernierEntretien.type}" à ${dernierEntretien.kilometrage} km` : 'Aucun'}`);
      
      let baseKm;
      let prochainSeuil;
      
      if (dernierEntretien) {
        baseKm = dernierEntretien.kilometrage;
        const kmDepuisDernierEntretien = currentKm - baseKm;
        const seuilsPasses = Math.floor(kmDepuisDernierEntretien / threshold);
        prochainSeuil = baseKm + ((seuilsPasses + 1) * threshold);
        
        console.log(`    Base km: ${baseKm}`);
        console.log(`    Km depuis dernier entretien: ${kmDepuisDernierEntretien}`);
        console.log(`    Seuils passés: ${seuilsPasses}`);
        console.log(`    Prochain seuil calculé: ${prochainSeuil}`);
      } else {
        baseKm = 0;
        prochainSeuil = threshold;
        console.log(`    Base km: ${baseKm} (premier entretien)`);
        console.log(`    Prochain seuil: ${prochainSeuil}`);
      }
      
      // Vérifier si dépassé
      if (currentKm >= prochainSeuil) {
        const seuilsPasses = Math.floor(currentKm / threshold);
        prochainSeuil = (seuilsPasses + 1) * threshold;
        console.log(`    Véhicule a dépassé le seuil, nouveau prochain seuil: ${prochainSeuil}`);
      }
      
      const kmRestants = prochainSeuil - currentKm;
      const semainesRestantes = Math.ceil(kmRestants / weeklyKm);
      const joursRestants = semainesRestantes * 7;
      
      console.log(`    Résultat final:`);
      console.log(`      - Prochain seuil: ${prochainSeuil} km`);
      console.log(`      - Km restants: ${kmRestants} km`);
      console.log(`      - Jours restants: ${joursRestants} jours`);
      console.log(`      - Urgent: ${joursRestants <= 7 ? 'OUI' : 'NON'}`);
    });
    
    console.log('\n🎉 Debug terminé !');
    
  } catch (error) {
    console.error('❌ Erreur lors du debug:', error);
  }
}

// Exécuter le test
testDebugCalcul(); 