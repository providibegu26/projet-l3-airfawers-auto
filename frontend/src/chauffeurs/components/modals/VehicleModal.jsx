import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faTimes } from '@fortawesome/free-solid-svg-icons';

const VehicleModal = ({ onClose }) => {
  // Valeurs fictives pour le frontend
  const vehicle = {
    marque: "Peugeot",
    modele: "208",
    immatriculation: "AB-123-CD",
    dateAcquisition: "2023-05-10",
    etat: "Bon"
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faCar} className="text-white text-xl mr-3" />
            <h3 className="text-lg font-semibold text-white">Détails du véhicule</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-indigo-200 transition-colors"
            aria-label="Fermer"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Marque</p>
                <p className="font-medium">{vehicle.marque}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Modèle</p>
                <p className="font-medium">{vehicle.modele}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Immatriculation</p>
                <p className="font-medium">{vehicle.immatriculation}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date d'acquisition</p>
                <p className="font-medium">{vehicle.dateAcquisition}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">État général</p>
              <div className="mt-1">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      vehicle.etat === 'Excellent' ? 'bg-green-500' :
                      vehicle.etat === 'Bon' ? 'bg-blue-500' :
                      vehicle.etat === 'Moyen' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${vehicle.etat === 'Excellent' ? '100%' : vehicle.etat === 'Bon' ? '75%' : vehicle.etat === 'Moyen' ? '50%' : '25%'}` }}
                  ></div>
                </div>
                <p className="text-sm mt-1 font-medium">{vehicle.etat}</p>
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleModal;