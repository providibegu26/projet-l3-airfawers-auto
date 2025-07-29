import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaOilCan, FaPlug, FaCar, FaExclamationTriangle, FaTachometerAlt, FaCheckCircle, FaTimesCircle, FaCalendarAlt } from 'react-icons/fa';
import MileageModal from '../components/Entretiens/MileageModal';
import { 
  fetchVehicles, 
  calculateFleetAverage, 
  calculateMaintenanceStats, 
  getUrgentMaintenance,
  updateVehicleMileage,
  refreshMaintenanceEstimations
} from '../services/maintenanceService';

const Entretiens = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Récupérer les véhicules depuis la base de données
  useEffect(() => {
    const loadVehicles = async () => {
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

    loadVehicles();
  }, []);

  // Gérer les notifications
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Mettre à jour le kilométrage d'un véhicule
  const handleMileageUpdate = async (vehiclePlate, newMileage, weeklyKm, isNewVehicle) => {
    try {
      console.log('Mise à jour kilométrage:', {
        vehiclePlate,
        newMileage,
        weeklyKm,
        isNewVehicle
      });

      // Appel API pour sauvegarder en base
      await updateVehicleMileage(vehiclePlate, newMileage, weeklyKm);

      // Forcer le recalcul des estimations en rechargeant depuis le serveur
      const updatedVehicles = await refreshMaintenanceEstimations();
      setVehicles(updatedVehicles);

      showNotification('Kilométrage mis à jour avec succès', 'success');

    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      showNotification('Erreur lors de la mise à jour du kilométrage', 'error');
      throw error;
    }
  };

  const cards = [
    {
      title: 'Vidange',
      icon: <FaOilCan className="text-xl" />,
      count: calculateMaintenanceStats(vehicles, 'vidange').length,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'Entretiens prévus',
      route: '/entretiens/vidange'
    },
    {
      title: 'Bougies',
      icon: <FaPlug className="text-xl" />,
      count: calculateMaintenanceStats(vehicles, 'bougies').length,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      description: 'Entretiens prévus',
      route: '/entretiens/bougies'
    },
    {
      title: 'Freins',
      icon: <FaCar className="text-xl" />,
      count: calculateMaintenanceStats(vehicles, 'freins').length,
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
      description: 'Entretiens prévus',
      route: '/entretiens/freins'
    },
    {
      title: 'Entretiens Urgents',
      icon: <FaExclamationTriangle className="text-xl" />,
      count: getUrgentMaintenance(vehicles).length,
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
      description: 'À traiter rapidement',
      route: '/entretiens/urgents'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Chargement des véhicules...</div>
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
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
          notification.type === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-800' 
            : 'bg-red-100 border border-red-400 text-red-800'
        }`}>
          {notification.type === 'success' ? <FaCheckCircle /> : <FaTimesCircle />}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Entretiens Généraux</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/historique-entretiens')}
            className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition"
          >
            <FaCalendarAlt className="text-sm" />
            Historique
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition"
          >
            <FaTachometerAlt className="text-sm" />
            Mettre à jour le kilométrage
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.route)}
            className="card bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{card.title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{card.count}</h3>
                <p className={`${card.textColor} text-xs mt-1 font-medium`}>{card.description}</p>
              </div>
              <div className={`w-12 h-12 rounded-full ${card.bgColor} flex items-center justify-center ${card.textColor}`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Informations de la flotte</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-blue-700">Véhicules en flotte</h3>
            <p className="text-xl font-semibold text-blue-600">{vehicles.length}</p>
          </div>
          <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-green-700">Moyenne hebdomadaire</h3>
            <p className="text-xl font-semibold text-green-600">{calculateFleetAverage(vehicles)} km</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-orange-700">Entretiens urgents</h3>
            <p className="text-xl font-semibold text-orange-600">{getUrgentMaintenance(vehicles).length}</p>
          </div>
        </div>
      </div>
      
      {/* Modal de mise à jour du kilométrage */}
      {showModal && (
      <MileageModal 
          show={true}
        onClose={() => setShowModal(false)} 
          vehicles={vehicles}
          onUpdate={showNotification}
          onMileageUpdate={handleMileageUpdate}
      />
      )}
    </div>
  );
};

export default Entretiens;