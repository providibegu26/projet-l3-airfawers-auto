import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaFilePdf } from 'react-icons/fa';
import MaintenanceTable from '../components/Entretiens/MaintenanceTable';
import { 
  fetchVehicles,
  getUrgentMaintenance, 
  formatMaintenanceData,
  validateMaintenance,
  calculateFleetAverage,
  calculateMaintenanceForVehicle
} from '../services/maintenanceService';
import ToastNotification from '../components/UI/ToastNotification';

const EntretiensUrgents = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const vehiclesData = await fetchVehicles();
        setVehicles(vehiclesData);
      } catch (err) {
        setError(err.message);
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Recalculer la liste à chaque changement de véhicules
  useEffect(() => {
    const urgentMaintenance = getUrgentMaintenance(vehicles);
    const formattedData = formatMaintenanceData(urgentMaintenance);
    setMaintenanceData(formattedData);
  }, [vehicles]);

  const handleExportPDF = () => {
    // Logique d'export PDF
    console.log('Export PDF pour entretiens urgents');
  };

  // Valider un entretien urgent
  const handleMaintenanceValidation = async (vehiclePlate, maintenanceType) => {
    try {
      // Trouver le véhicule
      const vehicle = vehicles.find(v => v.immatriculation === vehiclePlate);
      if (!vehicle) {
        setNotification({
          message: 'Véhicule non trouvé',
          type: 'error'
        });
        return;
      }

      // Valider l'entretien et l'enregistrer dans l'historique
      const updatedVehicle = await validateMaintenance(vehicle, maintenanceType);
      
      // Mettre à jour le véhicule dans la liste
      const updatedVehicles = vehicles.map(v =>
        v.immatriculation === vehiclePlate ? { ...updatedVehicle } : { ...v }
      );
      setVehicles([...updatedVehicles]);
      
      // Recalculer immédiatement la liste des entretiens avec les véhicules mis à jour
      // Utiliser directement les véhicules mis à jour pour éviter les problèmes de référence
      const fleetAverage = calculateFleetAverage(updatedVehicles);
      const urgentsMaintenance = [];
      
      updatedVehicles.forEach(vehicleInList => {
        // Utiliser le véhicule mis à jour si c'est celui qu'on vient de valider
        const vehicleToUse = vehicleInList.immatriculation === vehiclePlate ? updatedVehicle : vehicleInList;
        const maintenance = calculateMaintenanceForVehicle(vehicleToUse, fleetAverage);
        if (!maintenance) return;
        
        Object.entries(maintenance).forEach(([type, data]) => {
          if (data.daysRemaining <= 7) {
            urgentsMaintenance.push({
              vehicle: vehicleToUse, // Utiliser le véhicule avec le bon kilométrage
              maintenance: data, // Utiliser les nouvelles données d'entretien
              type: type
            });
          }
        });
      });
      
      const formattedData = formatMaintenanceData(urgentsMaintenance);
      setMaintenanceData(formattedData);
      
      console.log('Nouveau véhicule après validation:', updatedVehicle);
      console.log('Nouvelle liste d\'entretiens:', formattedData);

      // Notification de succès
      setNotification({
        message: `Entretien ${maintenanceType} validé pour ${vehiclePlate}. Nouvelle estimation calculée.`,
        type: 'success'
      });
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      setNotification({
        message: error.message || 'Erreur lors de la validation de l\'entretien',
        type: 'error'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Chargement des données...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-600">Erreur: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/entretiens')}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition"
          >
            <FaArrowLeft />
            Retour
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">Entretiens Urgents</h1>
        </div>
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          <FaFilePdf />
          Exporter en PDF
        </button>
      </div>

      <div className="bg-white rounded-xl shadow">
        <MaintenanceTable 
          data={maintenanceData}
          title="Entretiens Urgents (≤ 7 jours)"
          onComplete={handleMaintenanceValidation}
        />
      </div>
      {notification && <ToastNotification message={notification.message} type={notification.type} />}
    </div>
  );
};

export default EntretiensUrgents; 