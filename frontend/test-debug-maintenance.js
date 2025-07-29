// Script de test pour déboguer la logique de synchronisation
import { getUrgentMaintenance, getNonUrgentMaintenance } from './src/services/maintenanceService.js';

console.log('🧪 TEST DE SYNCHRONISATION DES ENTRETIENS');
console.log('==========================================');

// Cas 1 : Entretien urgent non validé
console.log('\n📋 CAS 1 : Entretien urgent non validé');
const vehicleUrgentNonValide = {
  id: 1,
  immatriculation: 'AB-123-CD',
  marque: 'Renault',
  modele: 'Trafic',
  kilometrage: 39800,
  weeklyKm: 500,
  historiqueEntretiens: [], // aucun entretien validé
  vidangeDaysRemaining: 2,
  vidangeNextThreshold: 40000,
  vidangeKmRemaining: 200,
  vidangeWeeksRemaining: 1,
  bougiesDaysRemaining: 45,
  bougiesNextThreshold: 80000,
  freinsDaysRemaining: 120,
  freinsNextThreshold: 60000
};

console.log('Véhicule:', vehicleUrgentNonValide.immatriculation);
console.log('Vidange - jours restants:', vehicleUrgentNonValide.vidangeDaysRemaining);
console.log('Historique entretiens:', vehicleUrgentNonValide.historiqueEntretiens.length);

const urgentResult = getUrgentMaintenance([vehicleUrgentNonValide]);
const vidangeResult = getNonUrgentMaintenance([vehicleUrgentNonValide], 'vidange');

console.log('\n🔍 RÉSULTATS :');
console.log('- Page urgente:', urgentResult.length, 'entretiens');
console.log('- Page vidange:', vidangeResult.length, 'entretiens');

if (urgentResult.length > 0) {
  console.log('✅ Entretien urgent trouvé sur la page urgente');
} else {
  console.log('❌ Entretien urgent NON trouvé sur la page urgente');
}

if (vidangeResult.length > 0) {
  console.log('❌ Entretien urgent trouvé sur la page vidange (ERREUR)');
} else {
  console.log('✅ Entretien urgent correctement exclu de la page vidange');
}

// Cas 2 : Entretien urgent validé récemment
console.log('\n📋 CAS 2 : Entretien urgent validé récemment');
const vehicleUrgentValide = {
  id: 2,
  immatriculation: 'EF-456-GH',
  marque: 'Peugeot',
  modele: 'Boxer',
  kilometrage: 39800,
  weeklyKm: 500,
  historiqueEntretiens: [
    {
      id: 1,
      type: 'vidange',
      dateEffectuee: new Date().toISOString(), // validé aujourd'hui
      kilometrage: 39800
    }
  ],
  vidangeDaysRemaining: 2,
  vidangeNextThreshold: 40000,
  vidangeKmRemaining: 200,
  vidangeWeeksRemaining: 1,
  bougiesDaysRemaining: 45,
  bougiesNextThreshold: 80000,
  freinsDaysRemaining: 120,
  freinsNextThreshold: 60000
};

console.log('Véhicule:', vehicleUrgentValide.immatriculation);
console.log('Vidange - jours restants:', vehicleUrgentValide.vidangeDaysRemaining);
console.log('Historique entretiens:', vehicleUrgentValide.historiqueEntretiens.length);

const urgentResult2 = getUrgentMaintenance([vehicleUrgentValide]);
const vidangeResult2 = getNonUrgentMaintenance([vehicleUrgentValide], 'vidange');

console.log('\n🔍 RÉSULTATS :');
console.log('- Page urgente:', urgentResult2.length, 'entretiens');
console.log('- Page vidange:', vidangeResult2.length, 'entretiens');

if (urgentResult2.length === 0) {
  console.log('✅ Entretien urgent correctement exclu de la page urgente');
} else {
  console.log('❌ Entretien urgent trouvé sur la page urgente (ERREUR)');
}

if (vidangeResult2.length > 0) {
  console.log('✅ Entretien urgent validé trouvé sur la page vidange');
} else {
  console.log('❌ Entretien urgent validé NON trouvé sur la page vidange (ERREUR)');
}

// Cas 3 : Entretien non-urgent
console.log('\n📋 CAS 3 : Entretien non-urgent');
const vehicleNonUrgent = {
  id: 3,
  immatriculation: 'IJ-789-KL',
  marque: 'Citroën',
  modele: 'Jumper',
  kilometrage: 39800,
  weeklyKm: 500,
  historiqueEntretiens: [],
  vidangeDaysRemaining: 25,
  vidangeNextThreshold: 40000,
  vidangeKmRemaining: 200,
  vidangeWeeksRemaining: 1,
  bougiesDaysRemaining: 45,
  bougiesNextThreshold: 80000,
  freinsDaysRemaining: 120,
  freinsNextThreshold: 60000
};

console.log('Véhicule:', vehicleNonUrgent.immatriculation);
console.log('Vidange - jours restants:', vehicleNonUrgent.vidangeDaysRemaining);

const urgentResult3 = getUrgentMaintenance([vehicleNonUrgent]);
const vidangeResult3 = getNonUrgentMaintenance([vehicleNonUrgent], 'vidange');

console.log('\n🔍 RÉSULTATS :');
console.log('- Page urgente:', urgentResult3.length, 'entretiens');
console.log('- Page vidange:', vidangeResult3.length, 'entretiens');

if (urgentResult3.length === 0) {
  console.log('✅ Entretien non-urgent correctement exclu de la page urgente');
} else {
  console.log('❌ Entretien non-urgent trouvé sur la page urgente (ERREUR)');
}

if (vidangeResult3.length > 0) {
  console.log('✅ Entretien non-urgent trouvé sur la page vidange');
} else {
  console.log('❌ Entretien non-urgent NON trouvé sur la page vidange (ERREUR)');
}

console.log('\n🎯 SYNTHÈSE :');
console.log('Cas 1 (urgent non validé) :', urgentResult.length > 0 && vidangeResult.length === 0 ? '✅ CORRECT' : '❌ ERREUR');
console.log('Cas 2 (urgent validé) :', urgentResult2.length === 0 && vidangeResult2.length > 0 ? '✅ CORRECT' : '❌ ERREUR');
console.log('Cas 3 (non-urgent) :', urgentResult3.length === 0 && vidangeResult3.length > 0 ? '✅ CORRECT' : '❌ ERREUR'); 