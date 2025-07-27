import { useState } from 'react';
import Pagination from '../common/Pagination';

const FuelTable = ({ vehicles, onAssignFuel, searchTerm, onSearchChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = vehicles.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="font-semibold text-gray-800">Véhicules</h2>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Immatriculation</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marque / Modèle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conso. mensuelle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conducteur</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernier ravitaillement</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((vehicle, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{vehicle.plate}</td>
                <td className="px-6 py-4 whitespace-nowrap">{vehicle.brand}</td>
                <td className="px-6 py-4 whitespace-nowrap">{vehicle.consumption}</td>
                <td className="px-6 py-4 whitespace-nowrap">{vehicle.driver}</td>
                <td className="px-6 py-4 whitespace-nowrap">{vehicle.lastRefill}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => onAssignFuel(vehicle)} 
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <i className="fas fa-gas-pump mr-1"></i> Attribuer
                    </button>
                    
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination 
        totalItems={vehicles.length} 
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default FuelTable;