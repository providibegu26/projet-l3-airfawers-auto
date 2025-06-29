import { useState } from 'react';
import Header from '../components/Header';
import { VehicleTable } from '../components/Vehicules/VehicleTable';
import { VehicleDetailsModal } from '../components/Vehicules/VehicleDetailsModal';
import { AddVehicleModal } from '../components/Vehicules/AddVehicleModal';


const vehiculesData = [
  {
    id: 1,
    matricule: "AA-123-BB",
    marque: "Toyota",
    modele: "Corolla",
    chassis: "JTDKB20U1777",
    kilometrage: "125,450 km",
    categorie: "Berline",
    conducteur: "Jean Dupont",
    statut: "Attribué",
    dernierEntretien: "15/03/2023"
  },
  {
    id: 2,
    matricule: "CC-456-DD",
    marque: "Renault",
    modele: "Clio",
    chassis: "VF1CB0E0287",
    kilometrage: "78,230 km",
    categorie: "Citadine",
    conducteur: null,
    statut: "Non attribué",
    dernierEntretien: "02/04/2023"
  },
  {
    id: 3,
    matricule: "EE-789-FF",
    marque: "BMW",
    modele: "Série 5",
    chassis: "WBAFG0100L",
    kilometrage: "203,760 km",
    categorie: "Berline",
    conducteur: "Marie Durand",
    statut: "Attribué",
    dernierEntretien: "28/02/2023"
  }
];



export const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState(vehiculesData);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden w-full">
        <div className="flex-1 overflow-auto relative  transition-colors duration-300 [-ms-overflow-style:none] [scrollbar-width:none]">
          {/*<Header />*/}
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestion des Véhicules</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <i className="fas fa-plus mr-2"></i> Ajouter un véhicule
        </button>
      </div>

      <VehicleTable 
        vehicles={vehicles} 
        onRowClick={setSelectedVehicle}
        onAddVehicle={() => setShowAddModal(true)}
      />

      {selectedVehicle && (
        <VehicleDetailsModal 
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}

      {showAddModal && (
        <AddVehicleModal 
          onClose={() => setShowAddModal(false)}
          onSave={(newVehicle) => {
            setVehicles([...vehicles, { ...newVehicle, id: vehicles.length + 1 }]);
            setShowAddModal(false);
          }}
        />
      )}
    </main>
        </div>
      </div>
  );
};
export default VehiclesPage;