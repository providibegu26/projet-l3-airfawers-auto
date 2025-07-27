import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FiX, FiSave } from 'react-icons/fi';

export const EditVehicleModal = ({ isOpen, vehicle, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    immatriculation: '',
    marque: 'Toyota',
    modele: '',
    categorie: 'LIGHT',
    kilometrage: ''
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        immatriculation: vehicle.immatriculation || '',
        marque: vehicle.marque || 'Toyota',
        modele: vehicle.modele || '',
        categorie: vehicle.categorie || 'LIGHT',
        kilometrage: vehicle.kilometrage || ''
      });
    }
  }, [vehicle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('📝 Données du formulaire:', formData);
    const updatedVehicle = {
      ...vehicle,
      ...formData,
      kilometrage: Number(formData.kilometrage)
    };
    console.log('🚗 Véhicule à mettre à jour:', updatedVehicle);
    onSave(updatedVehicle);
  };

  if (!isOpen || !vehicle) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xs">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-3">
          <h3 className="text-md font-semibold">Modifier véhicule</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-3">
          <div className="space-y-2">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Immatriculation</label>
              <input
                type="text"
                name="immatriculation"
                value={formData.immatriculation}
                onChange={handleChange}
                className="w-full p-1.5 text-xs border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Marque</label>
              <select
                name="marque"
                value={formData.marque}
                onChange={handleChange}
                className="w-full p-1.5 text-xs border border-gray-300 rounded"
              >
                <option>Toyota</option>
                <option>Renault</option>
                <option>Peugeot</option>
                <option>Mercedes</option>
                <option>BMW</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Modèle</label>
              <input
                type="text"
                name="modele"
                value={formData.modele}
                onChange={handleChange}
                className="w-full p-1.5 text-xs border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Catégorie</label>
              <select
                name="categorie"
                value={formData.categorie}
                onChange={handleChange}
                className="w-full p-1.5 text-xs border border-gray-300 rounded"
              >
                <option value="LIGHT">LIGHT</option>
                <option value="HEAVY">HEAVY</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Kilométrage</label>
              <input
                type="number"
                name="kilometrage"
                value={formData.kilometrage}
                onChange={handleChange}
                className="w-full p-1.5 text-xs border border-gray-300 rounded"
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs border border-gray-300 rounded bg-white hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
            >
              <FiSave className="mr-1" size={12} />
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditVehicleModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  vehicle: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};