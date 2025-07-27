import { useState, useEffect } from 'react';
import { FaTimes, FaUserTie } from 'react-icons/fa';
import PropTypes from 'prop-types';

export const EditChauffeurModal = ({ chauffeur, onClose, onUpdate }) => {
  const [form, setForm] = useState({
    nom: '',
    postnom: '',
    prenom: '',
    sexe: 'Masculin',
    telephone: '',
    email: ''
  });

  useEffect(() => {
    if (chauffeur) {
      setForm({
        nom: chauffeur.nom || '',
        postnom: chauffeur.postnom || '',
        prenom: chauffeur.prenom || '',
        sexe: chauffeur.sexe || 'Masculin',
        telephone: chauffeur.telephone || '',
        email: chauffeur.user?.email || ''
      });
    }
  }, [chauffeur]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({
      ...chauffeur,
      ...form
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-3">
          <h3 className="text-md font-semibold flex items-center">
            <FaUserTie className="text-indigo-500 mr-2 text-sm" />
            Modifier le chauffeur
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-3">
            {[
              { label: "Nom", name: "nom", type: "text", required: true },
              { label: "Post-Nom", name: "postnom", type: "text", required: true },
              { label: "Prénom", name: "prenom", type: "text", required: true },
              { 
                label: "Sexe", 
                name: "sexe", 
                type: "select",
                options: ["Masculin", "Féminin"],
                required: true
              },
              { label: "Email", name: "email", type: "email", required: true },
              { label: "Téléphone", name: "telephone", type: "tel", required: true }
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
                    required={field.required}
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

          {/* Buttons */}
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
              className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditChauffeurModal.propTypes = {
  chauffeur: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired
};