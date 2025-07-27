import { useState, useEffect } from 'react';
import { FaTachometerAlt, FaTimes, FaCar, FaCalculator } from 'react-icons/fa';

const MileageModal = ({ show, onClose, vehicles, onMileageUpdate }) => {
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [currentMileage, setCurrentMileage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Réinitialiser le formulaire quand le modal s'ouvre
  useEffect(() => {
    if (show) {
      setSelectedVehicle('');
      setCurrentMileage('');
      setError(null);
    }
  }, [show]);

  // Calculer automatiquement le kilométrage hebdomadaire
  const calculateWeeklyKm = () => {
    if (!selectedVehicle || !currentMileage) return 0;
    
    const vehicle = vehicles.find(v => v.immatriculation === selectedVehicle);
    if (!vehicle) return 0;
    
    const previousMileage = vehicle.currentMileage || vehicle.kilometrage || 0;
    const newMileage = parseInt(currentMileage);
    const weeklyKm = newMileage - previousMileage;
    
    return weeklyKm > 0 ? weeklyKm : 0;
  };

  const handleSubmit = async () => {
    if (!selectedVehicle) {
      setError('Veuillez sélectionner un véhicule');
      return;
    }

    if (!currentMileage || currentMileage <= 0) {
      setError('Veuillez saisir un kilométrage valide');
      return;
    }

    const weeklyKm = calculateWeeklyKm();
    if (weeklyKm <= 0) {
      setError('Le nouveau kilométrage doit être supérieur au kilométrage précédent');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Trouver le véhicule sélectionné
      const vehicle = vehicles.find(v => v.immatriculation === selectedVehicle);
      if (!vehicle) {
        setError('Véhicule non trouvé');
        return;
      }

      const newMileage = parseInt(currentMileage);
      
      await onMileageUpdate(selectedVehicle, newMileage, weeklyKm);
      
      // Fermer le modal après succès
      onClose();
    } catch (error) {
      console.error('Erreur mise à jour kilométrage:', error);
      setError('Erreur lors de la mise à jour du kilométrage');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedVehicle('');
    setCurrentMileage('');
    setError(null);
    onClose();
  };

  if (!show) return null;

  const weeklyKm = calculateWeeklyKm();
  const selectedVehicleData = vehicles.find(v => v.immatriculation === selectedVehicle);
  const previousMileage = selectedVehicleData ? (selectedVehicleData.currentMileage || selectedVehicleData.kilometrage || 0) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <FaTachometerAlt className="text-indigo-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Mise à jour kilométrage</h3>
              <p className="text-sm text-gray-500">Saisie du kilométrage actuel</p>
            </div>
          </div>
          <button 
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Sélection du véhicule */}
          <div>
            <label htmlFor="vehicle-select" className="block text-sm font-medium text-gray-700 mb-3">
              <div className="flex items-center gap-2">
                <FaCar className="text-gray-500" />
                Véhicule
              </div>
            </label>
            <select
              id="vehicle-select"
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="block w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-700"
            >
              <option value="">Sélectionner un véhicule</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.immatriculation}>
                  {vehicle.immatriculation} - {vehicle.marque} {vehicle.modele}
                </option>
              ))}
            </select>
          </div>

          {/* Kilométrage actuel */}
          <div>
            <label htmlFor="current-mileage" className="block text-sm font-medium text-gray-700 mb-3">
              Kilométrage actuel du véhicule (km)
            </label>
            <input
              type="number"
              id="current-mileage"
              value={currentMileage}
              onChange={(e) => setCurrentMileage(e.target.value)}
              placeholder="Ex: 10500"
              min="1"
              className="block w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-700"
            />
            <p className="text-xs text-gray-500 mt-1">
              Saisissez le kilométrage actuel affiché sur le tableau de bord du véhicule
            </p>
          </div>

          {/* Informations et calculs */}
          {selectedVehicle && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <FaCalculator className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Calcul automatique</span>
              </div>
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex justify-between">
                  <span>Kilométrage précédent:</span>
                  <span className="font-medium">{previousMileage.toLocaleString('fr-FR')} km</span>
                </div>
                {currentMileage && (
                  <>
                    <div className="flex justify-between">
                      <span>Kilométrage actuel:</span>
                      <span className="font-medium">{parseInt(currentMileage).toLocaleString('fr-FR')} km</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between text-blue-700 font-semibold">
                        <span>Distance parcourue cette semaine:</span>
                        <span className="text-lg">{weeklyKm.toLocaleString('fr-FR')} km</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Avertissement si kilométrage invalide */}
          {currentMileage && weeklyKm <= 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm font-medium text-orange-700">
                  Le nouveau kilométrage doit être supérieur au kilométrage précédent
                </span>
              </div>
            </div>
          )}

          {/* Affichage des erreurs */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-red-700">{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer avec boutons */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !selectedVehicle || !currentMileage || currentMileage <= 0 || weeklyKm <= 0}
            className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
              loading || !selectedVehicle || !currentMileage || currentMileage <= 0 || weeklyKm <= 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Mise à jour...
              </div>
            ) : (
              'Valider'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MileageModal;