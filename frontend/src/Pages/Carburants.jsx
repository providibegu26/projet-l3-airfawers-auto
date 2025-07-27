import { useState } from 'react';
import FuelCards from '../components/Carburants/FuelCards';
import FuelConsumptionChart from '../components/Carburants/FuelConsumptionChart';
import FuelTable from '../components/Carburants/FuelTable';
import AssignFuelModal from '../components/Carburants/AssignFuelModal';
import SearchBar from '../components/common/SearchBar';

const Carburants = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Données des véhicules
  const [vehicles] = useState([
    {
      plate: "AB-123-CD",
      brand: "Toyota Corolla",
      consumption: "42 L",
      driver: "Jean Dupont",
      lastRefill: "14/03/2023"
    },
    // ... autres véhicules
  ]);

  // Filtrer les véhicules basé sur la recherche
  const filteredVehicles = vehicles.filter(vehicle => 
    vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssignFuel = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowModal(true);
  };

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Gestion du Carburant</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <FuelCards />
        <FuelConsumptionChart />
      </div>
      
      <FuelTable 
        vehicles={filteredVehicles} 
        onAssignFuel={handleAssignFuel}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      <AssignFuelModal 
        show={showModal}
        onClose={() => setShowModal(false)}
        vehicle={selectedVehicle}
      />
    </main>
  );
};

export default Carburants;