import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaFilePdf } from 'react-icons/fa';
import MaintenanceTable from '../components/Entretiens/MaintenanceTable';
import ToastNotification from '../components/UI/ToastNotification';
import { 
  fetchVehicles,
  getNonUrgentMaintenance, 
  formatMaintenanceData,
  calculateFleetAverage,
  calculateMaintenanceForVehicle
} from '../services/maintenanceService';

const EntretiensBougies = () => {
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
    console.log('🔄 Recalcul des entretiens bougies avec', vehicles.length, 'véhicules');
    const bougiesMaintenance = getNonUrgentMaintenance(vehicles, 'bougies');
    const formattedData = formatMaintenanceData(bougiesMaintenance);
    setMaintenanceData(formattedData);
    console.log('✅ Entretiens bougies calculés:', formattedData.length, 'entretiens');
  }, [vehicles]);

  const handleExportPDF = () => {
    // Logique d'export PDF
    console.log('Export PDF pour entretiens de bougies');
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
      {/* Notification modale */}
      {notification && (
        <ToastNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/entretiens')}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition"
          >
            <FaArrowLeft />
            Retour
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">Entretiens de Bougies</h1>
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
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Entretiens de Bougies</h2>
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
    </div>
  );
};

export default EntretiensBougies; 