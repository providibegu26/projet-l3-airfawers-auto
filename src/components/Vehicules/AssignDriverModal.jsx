import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const AssignDriverModal = ({ isOpen, vehicle, onClose, onAssign }) => {
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [availableDrivers, setAvailableDrivers] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // Mock data - replace with API call
      setAvailableDrivers([
        { id: '1', prenom: 'Jean', nom: 'Dupont' },
        { id: '2', prenom: 'Marie', nom: 'Martin' }
      ]);
    }
  }, [isOpen]);

  if (!isOpen || !vehicle) return null;

  const handleAssign = () => {
    if (selectedDriverId) {
      onAssign(selectedDriverId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">
            Attribuer un chauffeur à {vehicle.marque} {vehicle.modele}
          </h3>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chauffeur disponible
            </label>
            <select
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Sélectionnez un chauffeur</option>
              {availableDrivers.map(driver => (
                <option key={driver.id} value={driver.id}>
                  {driver.prenom} {driver.nom}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleAssign}
              disabled={!selectedDriverId}
              className={`px-4 py-2 text-white rounded-md text-sm ${
                selectedDriverId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'
              }`}
            >
              Attribuer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

AssignDriverModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  vehicle: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onAssign: PropTypes.func.isRequired
};