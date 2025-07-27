import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGasPump, faTimes, faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const FuelModal = ({ onClose }) => {
  const [isCollected, setIsCollected] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleCollectFuel = () => {
    setShowConfirmation(true);
  };

  const confirmCollection = () => {
    setIsCollected(true);
    setShowConfirmation(false); // Ferme le modal de confirmation
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* Modal principal */}
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className={`px-6 py-4 flex justify-between items-center ${isCollected ? 'bg-gray-500' : 'bg-green-600'}`}>
          <div className="flex items-center">
            <FontAwesomeIcon 
              icon={isCollected ? faCheckCircle : faGasPump} 
              className="text-white text-xl mr-3" 
            />
            <h3 className="text-lg font-semibold text-white">
              {isCollected ? 'Carburant récupéré' : 'Carburant de la semaine'}
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-white hover:opacity-80 transition-opacity"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 font-medium">Quantité</p>
              <p className="text-lg font-bold text-green-600">30 litres</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 font-medium">Type</p>
              <p className="text-lg font-bold">Diesel</p>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 font-medium">Date</p>
            <p className="text-lg">29 Juin 2025</p>
          </div>

          {isCollected ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
              <FontAwesomeIcon 
                icon={faExclamationTriangle} 
                className="text-yellow-500 mt-1 mr-3" 
              />
              <div>
                <p className="font-medium text-yellow-800">Déjà récupéré</p>
                <p className="text-sm text-yellow-600">
                  Vous avez confirmé la récupération du carburant.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Fermer
              </button>
              <button
                onClick={handleCollectFuel}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Valider la récupération
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmation - Disparaît après validation */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="bg-green-600 px-6 py-4">
              <h3 className="text-lg font-semibold text-white text-center">
                Confirmation
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-center">
                Confirmez-vous avoir reçu 30L de Diesel ?
              </p>
              
              <div className="flex justify-center space-x-4 pt-4">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmCollection}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FuelModal;