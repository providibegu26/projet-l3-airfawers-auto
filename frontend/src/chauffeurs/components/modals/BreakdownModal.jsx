import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faExclamationTriangle, 
  faTimes, 
  faLocationDot,
  faCar,
  faCircleInfo
} from '@fortawesome/free-solid-svg-icons';

const BreakdownModal = ({ vehicle, onClose }) => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);

  // Récupération automatique de la localisation
  useEffect(() => {
    const getLocation = () => {
      setIsLocating(true);
      setLocationError(null);
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
            setIsLocating(false);
          },
          (error) => {
            setLocationError("Impossible de récupérer la localisation");
            setIsLocating(false);
            console.error("Erreur de géolocalisation:", error);
          }
        );
      } else {
        setLocationError("La géolocalisation n'est pas supportée par votre navigateur");
        setIsLocating(false);
      }
    };

    getLocation();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const report = {
      vehicleId: vehicle?.id,
      description,
      location,
      timestamp: new Date().toISOString()
    };
    console.log("Panne signalée:", report);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden">
        {/* Header avec icône d'alerte */}
        <div className="bg-red-600 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <FontAwesomeIcon 
              icon={faExclamationTriangle} 
              className="text-white text-xl mr-3" 
            />
            <h3 className="text-lg font-semibold text-white">Signalement de panne</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-white hover:text-red-200 transition-colors"
            aria-label="Fermer"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        {/* Contenu du formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Section Véhicule */}
          {vehicle && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-start">
                <FontAwesomeIcon 
                  icon={faCar} 
                  className="text-indigo-600 mt-1 mr-3" 
                />
                <div>
                  <h4 className="font-medium text-gray-900">Véhicule concerné</h4>
                  <p className="text-sm text-gray-600">
                    {vehicle.marque} {vehicle.modele} - {vehicle.immatriculation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Champ Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description de la panne *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              rows={4}
              placeholder="Décrivez précisément la panne rencontrée..."
              required
            />
          </div>

          {/* Champ Localisation */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Localisation *
              </label>
              {isLocating && (
                <span className="text-xs text-blue-600 flex items-center">
                  <FontAwesomeIcon icon={faCircleInfo} className="mr-1" />
                  Localisation en cours...
                </span>
              )}
            </div>
            
            <div className="relative">
              <FontAwesomeIcon 
                icon={faLocationDot} 
                className="absolute left-3 top-3 text-red-600" 
              />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Coordonnées GPS"
                required
              />
            </div>
            
            {locationError && (
              <p className="mt-1 text-sm text-red-600">{locationError}</p>
            )}
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              Envoyer le signalement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BreakdownModal;