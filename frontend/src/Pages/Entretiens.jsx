import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaOilCan, FaPlug, FaCar, FaExclamationTriangle, FaTachometerAlt, FaCheckCircle, FaTimesCircle, FaCalendarAlt } from 'react-icons/fa';
import MileageModal from '../components/Entretiens/MileageModal';
import { 
  fetchVehicles, 
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
      title: 'Catégorie A',
      icon: <FaOilCan className="text-xl" />,
      count: calculateMaintenanceStats(vehicles, 'vidange').length,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'Entretiens prévus',
      route: '/entretiens/vidange'
    },
    {
      title: 'Catégorie B',
      icon: <FaPlug className="text-xl" />,
      count: calculateMaintenanceStats(vehicles, 'categorie_b').length,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      description: 'Entretiens prévus',
      route: '/entretiens/bougies'
    },
    {
      title: 'Catégorie C',
      icon: <FaCar className="text-xl" />,
      count: calculateMaintenanceStats(vehicles, 'categorie_c').length,
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
        <h2 className="text-lg font-medium text-gray-800 mb-6">Catégories d'Entretien</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Catégorie A */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-700 mb-3">Catégorie A</h3>
            <ul className="space-y-2 text-sm text-blue-600">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Huile moteur
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Filtre à huile
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Filtre à air
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Filtre à essence
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Contrôle des liquides
              </li>
            </ul>
          </div>

          {/* Catégorie B */}
          <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-orange-700 mb-3">Catégorie B</h3>
            <div className="space-y-2 text-sm text-orange-600">
              <p className="font-medium mb-2">Catégorie A +</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Changement des bougies
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Plaquettes de freins
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Amortisseurs
                </li>
              </ul>
            </div>
          </div>

          {/* Catégorie C */}
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-red-700 mb-3">Catégorie C</h3>
            <div className="space-y-2 text-sm text-red-600">
              <p className="font-medium mb-2">Catégorie B +</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Suspensions
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Pneus
                </li>
              </ul>
            </div>
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