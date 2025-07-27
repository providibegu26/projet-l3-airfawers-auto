import { useState } from 'react';
import { FaTimes, FaCar } from 'react-icons/fa';

export const AddVehicleModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    immatriculation: '',
    marque: 'Toyota',
    modele: '',
    categorie: 'LIGHT',
    kilometrage: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const vehiculeToSend = {
      immatriculation: form.immatriculation,
      marque: form.marque,
      modele: form.modele,
      categorie: form.categorie,
      kilometrage: Number(form.kilometrage),
      statut: 'non attribué'
    };
    console.log('FORM VEHICULE:', vehiculeToSend);
    onSave(vehiculeToSend);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
        {/* Header compact */}
        <div className="flex justify-between items-center border-b p-3">
          <h3 className="text-md font-semibold flex items-center">
            <FaCar className="text-blue-500 mr-2 text-sm" />
            Ajouter un véhicule
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            <FaTimes />
          </button>
        </div>

        {/* Form compact */}
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-3">
            {[ 
              { label: "Immatriculation", name: "immatriculation", type: "text", required: true },
              { label: "Marque", name: "marque", type: "select", options: ["Toyota", "Renault", "Peugeot", "Mercedes", "BMW"] },
              { label: "Modèle", name: "modele", type: "text", required: true },
              { label: "Catégorie", name: "categorie", type: "select", options: ["LIGHT", "HEAVY"] },
              { label: "Kilométrage", name: "kilometrage", type: "number", required: true }
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {field.label}{field.required && '*'}
                </label>
                {field.type === 'select' ? (
                  <select
                    value={form[field.name]}
                    onChange={(e) => setForm({...form, [field.name]: e.target.value})}
                    className="w-full p-1.5 text-sm border border-gray-300 rounded-md"
                  >
                    {field.options.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={form[field.name]}
                    onChange={(e) => setForm({...form, [field.name]: e.target.value})}
                    className="w-full p-1.5 text-sm border border-gray-300 rounded-md"
                    required={field.required}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Boutons compacts */}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs border border-gray-300 rounded-md bg-white hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};