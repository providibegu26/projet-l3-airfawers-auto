import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTools, faTimes, faCalendarAlt, faWrench, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const MaintenanceModal = ({ onClose, maintenance }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden">
        {/* Header avec icône */}
        <div className="bg-yellow-500 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <FontAwesomeIcon 
              icon={faTools} 
              className="text-white text-2xl mr-3" 
            />
            <div>
              <h3 className="text-xl font-semibold text-white">Entretien programmé</h3>
              <p className="text-xs text-yellow-100">À confirmer par l'administrateur</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-white hover:text-yellow-200 transition-colors"
            aria-label="Fermer"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        {/* Corps du modal */}
        <div className="p-6 space-y-5">
          <div className="space-y-3">
            <div className="flex items-start">
              <FontAwesomeIcon 
                icon={faCalendarAlt} 
                className="text-yellow-500 mt-1 mr-3" 
              />
              <div>
                <p className="text-sm text-gray-500">Date prévue</p>
                <p className="font-medium">{maintenance?.date || "3 Juillet 2025"}</p>
              </div>
            </div>

            <div className="flex items-start">
              <FontAwesomeIcon 
                icon={faWrench} 
                className="text-yellow-500 mt-1 mr-3" 
              />
              <div>
                <p className="text-sm text-gray-500">Type d'intervention</p>
                <p className="font-medium">{maintenance?.type || "Vidange + Vérification des freins"}</p>
              </div>
            </div>

            <div className="flex items-start">
              <FontAwesomeIcon 
                icon={faMapMarkerAlt} 
                className="text-yellow-500 mt-1 mr-3" 
              />
              <div>
                <p className="text-sm text-gray-500">Lieu</p>
                <p className="font-medium">{maintenance?.location || "Garage AirFawers – Gombe"}</p>
              </div>
            </div>
          </div>

          {/* Bouton de fermeture */}
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Compris
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceModal;