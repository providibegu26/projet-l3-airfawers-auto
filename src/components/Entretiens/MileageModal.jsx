import { useState } from 'react';

const MileageModal = ({ show, onClose, vehicles, onUpdate }) => {
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [newMileage, setNewMileage] = useState('');

  const handleUpdate = () => {
    if (!selectedVehicle || !newMileage || isNaN(newMileage)) {
      onUpdate('Veuillez sélectionner un véhicule et entrer un kilométrage valide', 'error');
      return;
    }
    
    onUpdate('Kilométrage mis à jour avec succès', 'success');
    onClose();
    setSelectedVehicle('');
    setNewMileage('');
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-2 slide-in">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Mise à jour du kilométrage</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="vehicle-select" className="block text-sm font-medium text-gray-700 mb-1">Véhicule</label>
              <select 
                id="vehicle-select" 
                className="block w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
              >
                <option value="">Sélectionnez un véhicule</option>
                {vehicles.map(vehicle => (
                  <option key={vehicle.plate} value={vehicle.plate}>
                    {vehicle.plate} - {vehicle.brand}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="new-mileage" className="block text-sm font-medium text-gray-700 mb-1">Nouveau kilométrage (km)</label>
              <input 
                type="number" 
                id="new-mileage" 
                className="block w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                placeholder="Ex: 125000"
                value={newMileage}
                onChange={(e) => setNewMileage(e.target.value)}
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button 
              onClick={onClose} 
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Annuler
            </button>
            <button 
              onClick={handleUpdate}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Valider
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MileageModal;