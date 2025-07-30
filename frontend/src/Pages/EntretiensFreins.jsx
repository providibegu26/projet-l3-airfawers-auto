import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaFilePdf } from 'react-icons/fa';
import MaintenanceTable from '../components/Entretiens/MaintenanceTable';
import { 
  fetchVehicles,
  getNonUrgentMaintenance, 
  formatMaintenanceData,
  calculateFleetAverage,
  calculateMaintenanceForVehicle
} from '../services/maintenanceService';
import ToastNotification from '../components/UI/ToastNotification';

const EntretiensFreins = () => {
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
    console.log('🔄 Recalcul des entretiens freins avec', vehicles.length, 'véhicules');
    const maintenanceList = getNonUrgentMaintenance(vehicles, 'categorie_c');
    const formattedData = formatMaintenanceData(maintenanceList);
    setMaintenanceData(formattedData);
    console.log('✅ Entretiens freins calculés:', formattedData.length, 'entretiens');
  }, [vehicles]);

  const handleExportPDF = () => {
    // Logique d'export PDF
    console.log('Export PDF pour entretiens de freins');
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Liste des entretiens Catégorie C</h1>
        <button
          onClick={() => navigate('/entretiens')}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Retour
        </button>
      </div>

      <div className="bg-white rounded-xl shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Entretiens de Freins</h2>
            <div className="text-sm text-gray-500">
              <span className="text-orange-600 font-medium">⚠️</span> Les entretiens urgents (≤ 7 jours) sont gérés sur la page des entretiens urgents
            </div>
          </div>
        </div>
        <MaintenanceTable 
          data={maintenanceData}
          title=""
        />
      </div>
      {notification && <ToastNotification message={notification.message} type={notification.type} />}
    </div>
  );
};

export default EntretiensFreins; 