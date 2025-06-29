import { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { EditChauffeurModal } from './EditChauffeurModal';

export const ChauffeurRow = ({ chauffeur, onClick }) => {
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      <tr className="hover:bg-gray-50 cursor-pointer" onClick={onClick}>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="font-medium text-gray-900">{chauffeur.chauffeurId}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-gray-500">{chauffeur.nom}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-gray-500">{chauffeur.prenom}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-gray-500">{chauffeur.telephone}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-gray-500">{chauffeur.email}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-gray-500">{chauffeur.sexe}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-gray-500">{chauffeur.vehicule || '-'}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            chauffeur.statut === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {chauffeur.statut}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button 
            className="text-indigo-600 hover:text-indigo-900 mr-2"
            onClick={(e) => {
              e.stopPropagation();
              setShowEditModal(true);
            }}
          >
            <FaEdit />
          </button>
          <button 
            className="text-red-600 hover:text-red-900"
            onClick={(e) => e.stopPropagation()}
          >
            <FaTrash />
          </button>
        </td>
      </tr>

      {showEditModal && (
        <EditChauffeurModal 
          chauffeur={chauffeur}
          onClose={() => setShowEditModal(false)}
          onSave={(updatedChauffeur) => {
            // Ici vous devrez implémenter la logique de sauvegarde
            console.log('Chauffeur mis à jour:', updatedChauffeur);
            setShowEditModal(false);
          }}
        />
      )}
    </>
  );
};