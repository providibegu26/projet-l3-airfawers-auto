import { useState } from 'react';
import Header from '../components/Header';
import { ChauffeurTable } from '../components/Chauffeurs/ChauffeurTable';
import { ChauffeurDetailsModal } from '../components/Chauffeurs/ChauffeurDetailsModal';
import { AddChauffeurModal } from '../components/Chauffeurs/AddChauffeurModal';

// Données initiales des chauffeurs
const initialChauffeurs = [
  {
    id: 1,
    chauffeurId: "CH-001",
    nom: "Dupont",
    prenom: "Jean",
    telephone: "06 12 34 56 78",
    email: "j.dupont@mail.com",
    sexe: "Masculin",
    vehicule: "Toyota Corolla",
    statut: "Actif",
    dateEmbauche: "12/01/2020"
  },
  // ... autres chauffeurs
];

export const ChauffeursPage = () => {
  const [chauffeurs, setChauffeurs] = useState(initialChauffeurs);
  const [selectedChauffeur, setSelectedChauffeur] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddChauffeur = (newChauffeur) => {
    setChauffeurs([...chauffeurs, { 
      ...newChauffeur, 
      id: chauffeurs.length + 1,
      chauffeurId: `CH-${String(chauffeurs.length + 1).padStart(3, '0')}`
    }]);
    setShowAddModal(false);
  };

  return (
    <div className="flex h-screen overflow-hidden w-full">
        <div className="flex-1 overflow-auto relative  transition-colors duration-300 [-ms-overflow-style:none] [scrollbar-width:none]">
          
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestion des Chauffeurs</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <i className="fas fa-plus mr-2"></i> Ajouter un chauffeur
        </button>
      </div>

      <ChauffeurTable 
        chauffeurs={chauffeurs} 
        onChauffeurClick={setSelectedChauffeur}
      />

      {selectedChauffeur && (
        <ChauffeurDetailsModal 
          chauffeur={selectedChauffeur}
          onClose={() => setSelectedChauffeur(null)}
        />
      )}

      {showAddModal && (
        <AddChauffeurModal 
          onClose={() => setShowAddModal(false)}
          onSave={handleAddChauffeur}
        />
      )}
      
    </main>
        </div>
    </div>
  );
};
export default ChauffeursPage;