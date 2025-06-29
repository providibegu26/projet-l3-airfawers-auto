import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import MapControls from './MapControls';

const FullMap = () => {
  // Données simulées - À remplacer par l'API
  const incidents = [
    { id: 1, location: [48.8566, 2.3522], vehicle: 'AB-123-CD', type: 'panne', status: 'active' },
    // ... autres incidents
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <Link 
          to="/" 
          className="text-indigo-600 hover:text-indigo-800 flex items-center"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Retour
        </Link>
        <h2 className="text-xl font-semibold">Carte des interventions</h2>
        <MapControls />
      </div>

      {/* Conteneur de la carte */}
      <div className="h-[calc(100vh-180px)] relative">
        {/* Placeholder pour la vraie carte */}
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p className="text-lg mb-2">Carte interactive</p>
            <p className="text-sm">(Intégration API Map à venir)</p>
          </div>
          
          {/* Marqueurs simulés */}
          {incidents.map(incident => (
            <div
              key={incident.id}
              className={`absolute w-5 h-5 rounded-full ${
                incident.type === 'panne' ? 'bg-red-500' : 'bg-blue-500'
              } transform -translate-x-1/2 -translate-y-1/2`}
              style={{
                left: `${((incident.location[1] + 180) / 360) * 100}%`,
                top: `${((90 - incident.location[0]) / 180) * 100}%`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FullMap;