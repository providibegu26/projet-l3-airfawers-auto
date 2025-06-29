import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import SearchBar from '../common/SearchBar';

const DriversList = () => {
  // Données simplifiées des chauffeurs congolais
    const drivers = [
    {
      id: 1,
      lastName: "Kabasele",
      firstName: "Didier",
      phone: "+243 81 234 5678",
      vehicle: "CD-123-ABC"
    },
    {
      id: 2,
      lastName: "Mukendi",
      firstName: "Grace", 
      phone: "+243 89 765 4321",
      vehicle: "CD-456-DEF"
    },
    {
      id: 3,
      lastName: "Nzau",
      firstName: "Patrick",
      phone: "+243 97 654 3210",
      vehicle: "CD-789-GHI"
    },
    {
      id: 4,
      lastName: "Tshibangu",
      firstName: "Rachel",
      phone: "+243 90 123 4567",
      vehicle: "CD-321-JKL"
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* En-tête avec barre de recherche */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Liste des chauffeurs</h3>
        <div className="w-64">
          <SearchBar placeholder="Rechercher un chauffeur..." />
        </div>
      </div>
      
      {/* Tableau ultra-simplifié */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 text-sm font-medium text-gray-500">Chauffeur</th>
              <th className="text-left py-3 text-sm font-medium text-gray-500">Téléphone</th>
              <th className="text-left py-3 text-sm font-medium text-gray-500">Véhicule</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {drivers.map(driver => (
              <tr key={driver.id} className="hover:bg-gray-50">
                <td className="py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                      <FontAwesomeIcon icon={faUser} className="text-indigo-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{driver.lastName} {driver.firstName}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-sm text-gray-700">{driver.phone}</td>
                <td className="py-4 text-sm text-gray-700">{driver.vehicle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination simplifiée */}
      <div className="mt-4 flex items-center justify-end">
        <div className="flex space-x-2">
          <button className="px-3 py-1 rounded border border-gray-300 text-sm text-gray-700 hover:bg-gray-50">
            Précédent
          </button>
          <button className="px-3 py-1 rounded bg-indigo-600 text-white text-sm hover:bg-indigo-700">
            1
          </button>
          <button className="px-3 py-1 rounded border border-gray-300 text-sm text-gray-700 hover:bg-gray-50">
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriversList;