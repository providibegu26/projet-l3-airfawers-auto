import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserTie,
  faCar,
  faTools,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

const StatsCards = () => {
  const [chauffeurCount, setChauffeurCount] = useState(0);
  const [vehicleCount, setVehicleCount] = useState(0);
  const [urgentMaintenanceCount, setUrgentMaintenanceCount] = useState(0);

  useEffect(() => {
    // Récupérer le nombre de chauffeurs
    fetch('http://localhost:4000/api/admin/chauffeurs')
      .then(res => res.json())
      .then(data => setChauffeurCount((data.chauffeurs || []).length));
    
    // Récupérer le nombre de véhicules et calculer les entretiens urgents
    fetch('http://localhost:4000/api/admin/vehicules')
      .then(res => res.json())
      .then(data => {
        const vehicles = data.vehicules || [];
        setVehicleCount(vehicles.length);
        
        // Calculer le nombre d'entretiens urgents
        let urgentCount = 0;
        vehicles.forEach(vehicle => {
          const historiqueEntretiens = vehicle.historiqueEntretiens || [];
          
          ['vidange', 'bougies', 'freins'].forEach(type => {
            const daysRemaining = vehicle[`${type}DaysRemaining`];
            
            if (daysRemaining !== undefined && daysRemaining <= 7) {
              // Vérifier si l'entretien n'a pas été validé récemment
              const dernierEntretien = historiqueEntretiens.find(
                entretien => entretien.type.toLowerCase() === type.toLowerCase()
              );
              
              if (!dernierEntretien) {
                urgentCount++;
              }
            }
          });
        });
        
        setUrgentMaintenanceCount(urgentCount);
      });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* Carte Chauffeurs */}
      <div className="card bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Chauffeurs</p>
            <h3 className="text-2xl font-bold text-gray-800">{chauffeurCount}</h3>
            <p className="text-indigo-600 text-xs mt-1 font-medium">Chauffeurs actifs</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <FontAwesomeIcon icon={faUserTie} className="text-xl" />
          </div>
        </div>
      </div>
      
      {/* Carte Véhicules */}
      <div className="card bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Véhicules</p>
            <h3 className="text-2xl font-bold text-gray-800">{vehicleCount}</h3>
            <p className="text-purple-600 text-xs mt-1 font-medium">Véhicules en flotte</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <FontAwesomeIcon icon={faCar} className="text-xl" />
          </div>
        </div>
      </div>
      
      {/* Carte Entretiens urgents */}
      <div className="card bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Entretiens</p>
            <h3 className="text-2xl font-bold text-gray-800">{urgentMaintenanceCount}</h3>
            <p className="text-red-500 text-xs mt-1">À traiter rapidement</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
            <FontAwesomeIcon icon={faTools} className="text-xl" />
          </div>
        </div>
      </div>
      
      {/* Carte Pannes actives */}
      <div className="card bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Pannes actives</p>
            <h3 className="text-2xl font-bold text-gray-800">3</h3>
            <p className="text-blue-500 text-xs mt-1">1 nouvelle aujourd'hui</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;