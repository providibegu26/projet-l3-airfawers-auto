// Test simple de la logique de calcul
function testCalcul() {
  console.log('🧪 Test de la logique de calcul...');
  
  // Exemple : véhicule HEAVY, vidange
  const category = 'HEAVY';
  const threshold = 8000; // vidange pour HEAVY
  const currentKm = 8500;
  const weeklyKm = 500;
  
  // Scénario 1 : Aucun entretien précédent
  console.log('\n📊 Scénario 1: Aucun entretien précédent');
  const baseKm1 = 0;
  const prochainSeuil1 = baseKm1 + threshold;
  const kmRestants1 = prochainSeuil1 - currentKm;
  const semainesRestantes1 = Math.ceil(kmRestants1 / weeklyKm);
  const joursRestants1 = semainesRestantes1 * 7;
  
  console.log({
    baseKm: baseKm1,
    prochainSeuil: prochainSeuil1,
    kmRestants: kmRestants1,
    semainesRestantes: semainesRestantes1,
    joursRestants: joursRestants1
  });
  
  // Scénario 2 : Entretien validé à 8000 km
  console.log('\n📊 Scénario 2: Entretien validé à 8000 km');
  const baseKm2 = 8000;
  const prochainSeuil2 = baseKm2 + threshold;
  const kmRestants2 = prochainSeuil2 - currentKm;
  const semainesRestantes2 = Math.ceil(kmRestants2 / weeklyKm);
  const joursRestants2 = semainesRestantes2 * 7;
  
  console.log({
    baseKm: baseKm2,
    prochainSeuil: prochainSeuil2,
    kmRestants: kmRestants2,
    semainesRestantes: semainesRestantes2,
    joursRestants: joursRestants2
  });
  
  // Scénario 3 : Entretien validé à 16000 km
  console.log('\n📊 Scénario 3: Entretien validé à 16000 km');
  const baseKm3 = 16000;
  const prochainSeuil3 = baseKm3 + threshold;
  const kmRestants3 = prochainSeuil3 - currentKm;
  const semainesRestantes3 = Math.ceil(kmRestants3 / weeklyKm);
  const joursRestants3 = semainesRestantes3 * 7;
  
  console.log({
    baseKm: baseKm3,
    prochainSeuil: prochainSeuil3,
    kmRestants: kmRestants3,
    semainesRestantes: semainesRestantes3,
    joursRestants: joursRestants3
  });
}

testCalcul(); 