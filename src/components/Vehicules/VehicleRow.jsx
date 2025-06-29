import { FiEdit, FiEye, FiUserPlus } from 'react-icons/fi'; // Feather Icons
// ou
import { FaEdit, FaEye, FaUserPlus } from 'react-icons/fa'; // Font Awesome
// ou
import { HiOutlinePencil, HiOutlineEye, HiOutlineUserAdd } from 'react-icons/hi'; // Heroicons v1 style

export const VehicleRow = ({ vehicle, onViewDetails, onEdit, onAssignDriver }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">{vehicle.id}</td>
      <td className="px-6 py-4 whitespace-nowrap">{vehicle.marque}</td>
      <td className="px-6 py-4 whitespace-nowrap">{vehicle.modele}</td>
      <td className="px-6 py-4 whitespace-nowrap">{vehicle.immatriculation}</td>
      <td className="px-6 py-4 whitespace-nowrap">{vehicle.annee}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        {vehicle.chauffeur ? (
          `${vehicle.chauffeur.prenom} ${vehicle.chauffeur.nom}`
        ) : (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAssignDriver(vehicle);
            }}
            className="text-blue-500 hover:text-blue-700 flex items-center"
          >
            <FiUserPlus className="h-5 w-5 mr-1" /> {/* ou FaUserPlus ou HiOutlineUserAdd */}
            Attribuer
          </button>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 text-xs rounded-full ${
          vehicle.statut === 'Disponible' ? 'bg-green-100 text-green-800' : 
          vehicle.statut === 'En mission' ? 'bg-yellow-100 text-yellow-800' : 
          'bg-gray-100 text-gray-800'
        }`}>
          {vehicle.statut}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex justify-end space-x-3">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(vehicle);
            }}
            className="text-blue-500 hover:text-blue-700 flex items-center"
            title="Voir détails"
          >
            <FiEye className="h-5 w-5" /> {/* ou FaEye ou HiOutlineEye */}
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit(vehicle);
            }}
            className="text-green-500 hover:text-green-700 flex items-center"
            title="Modifier"
          >
            <FiEdit className="h-5 w-5" /> {/* ou FaEdit ou HiOutlinePencil */}
          </button>
        </div>
      </td>
    </tr>
  );
};