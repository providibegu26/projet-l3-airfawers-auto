import { FaTimes, FaCheck } from 'react-icons/fa';

const AssignFuelModal = ({ show, onClose, vehicle }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-bold">
            Attribuer du carburant
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {vehicle && (
            <div className="mb-4 bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium text-gray-700 mb-2">Véhicule sélectionné</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Immatriculation</p>
                  <p className="font-medium text-sm">{vehicle.plate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Marque/Modèle</p>
                  <p className="font-medium text-sm">{vehicle.brand}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Conducteur</p>
                  <p className="font-medium text-sm">{vehicle.driver || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Dernier ravitail.</p>
                  <p className="font-medium text-sm">{vehicle.lastRefill || '-'}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantité de carburant (L)
              </label>
              <input 
                type="number" 
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                placeholder="Quantité en litres"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de carburant
              </label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option>Essence</option>
                <option>Diesel</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date d'attribution
              </label>
              <input 
                type="date" 
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50"
          >
            Annuler
          </button>
          <button 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 flex items-center"
          >
            <FaCheck className="mr-2" />
            Valider
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignFuelModal;