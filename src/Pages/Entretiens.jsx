import { useState, useEffect } from 'react';
import Filters from '../components/Entretiens/Filters';
import MaintenanceTable from '../components/Entretiens/MaintenanceTable';
import MileageModal from '../components/Entretiens/MileageModal';
import ToastNotification from '../components/Entretiens/ToastNotification';

const Entretiens = () => {
  const [maintenanceData] = useState([
    { 
      plate: "AA-123-BB", 
      brand: "Renault Trafic", 
      driver: "Martin Dupont", 
      mileage: 84520, 
      nextMaintenance: "2023-06-02", 
      daysLeft: 3,
      status: "urgent"
    },
    // ... autres données
  ]);
  
  const [filteredData, setFilteredData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    setFilteredData(maintenanceData);
  }, [maintenanceData]);

  const filterByStatus = (status) => {
    if (status === 'all') {
      setFilteredData(maintenanceData);
      return;
    }
    
    const filtered = maintenanceData.filter(item => {
      if (status === 'urgent') return item.daysLeft < 7 || item.daysLeft < 0;
      if (status === 'warning') return item.daysLeft >= 7 && item.daysLeft < 14;
      if (status === 'ok') return item.daysLeft >= 14;
      return true;
    });
    
    setFilteredData(filtered);
  };

  

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const completeMaintenance = (plate) => {
    showToast(`Entretien pour ${plate} marqué comme complété`, 'success');
  };

  const showDetails = (plate) => {
    const vehicle = maintenanceData.find(v => v.plate === plate);
    if (vehicle) {
      alert(`Détails pour ${plate}:\n\nMarque/Modèle: ${vehicle.brand}\nChauffeur: ${vehicle.driver}\nKm actuels: ${vehicle.mileage.toLocaleString('fr-FR')} km\nProchain entretien: ${new Date(vehicle.nextMaintenance).toLocaleDateString('fr-FR')}`);
    }
  };

  const updateMileage = (message, type) => {
    showToast(message, type);
    setShowModal(false);
  };

  return (
    <div className="flex-1 overflow-auto p-4 bg-gray-50">
      {/* Titre et recherche */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="mb-4 md:mb-0">
          <h2 className="text-lg font-semibold text-gray-800">Liste des entretiens urgents</h2>
          <p className="text-sm text-gray-500">Classés par ordre d'urgence descendante</p>
        </div>
        
       
        
      </div>
      
      {/* Filtres et boutons */}
      <Filters 
        onFilterChange={filterByStatus} 
        onMileageUpdate={() => setShowModal(true)}
        onExportPDF={() => showToast('PDF généré avec succès', 'success')}
      />
      
      {/* Tableau principal */}
      <MaintenanceTable 
        data={filteredData} 
        onComplete={completeMaintenance}
        onShowDetails={showDetails}
      />
      
      {/* Modal pour la mise à jour du kilométrage */}
      <MileageModal 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        vehicles={maintenanceData}
        onUpdate={updateMileage}
      />
      
      {/* Notifications toast */}
      <ToastNotification {...toast} />
    </div>
  );
};

export default Entretiens;