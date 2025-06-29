import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const MapSection = () => {
  // Données simulées - À remplacer par l'API plus tard
  const incidents = [
    { id: 1, location: [48.8566, 2.3522], type: 'panne' },
    { id: 2, location: [43.6047, 1.4442], type: 'entretien' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-red-500" />
          Localisation des véhicules
        </h3>
        <Link 
          to="/fleet-map" 
          className="text-indigo-600 hover:text-indigo-800"
          title="Vue complète"
        >
          <FontAwesomeIcon icon={faExpand} />
        </Link>
      </div>

      {/* Carte miniature */}
      <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
        {/* Placeholder pour la carte - sera remplacé par MapContainer */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-2xl mb-2" />
            <p>Carte interactive</p>
          </div>
        </div>
        
        {/* Marqueurs simulés */}
        {incidents.map(incident => (
          <div 
            key={incident.id}
            className={`absolute w-4 h-4 rounded-full ${
              incident.type === 'panne' ? 'bg-red-500' : 'bg-blue-500'
            }`}
            style={{
              left: `${((incident.location[1] + 180) / 360) * 100}%`,
              top: `${((90 - incident.location[0]) / 180) * 100}%`
            }}
          />
        ))}
      </div>

      <div className="mt-3 flex justify-between text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
          <span>Pannes</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
          <span>Entretiens</span>
        </div>
      </div>
    </div>
  );
};

export default MapSection;