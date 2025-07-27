import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import SearchBar from '../common/SearchBar';

const DriversList = () => {
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Charger les chauffeurs
    fetch('http://localhost:4000/api/admin/chauffeurs')
      .then(res => res.json())
      .then(data => setDrivers(data.chauffeurs || []));
    // Charger les véhicules
    fetch('http://localhost:4000/api/admin/vehicules')
      .then(res => res.json())
      .then(data => setVehicles(data.vehicules || []));
  }, []);

  // Associer chaque chauffeur à son véhicule (si attribué)
  const getVehicleBadge = (chauffeurId) => {
    const v = vehicles.find(v => v.chauffeurId === chauffeurId);
    if (!v) return <span className="text-gray-400">-</span>;
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full font-medium text-xs bg-violet-100 text-violet-700">
        {v.immatriculation}
      </span>
    );
  };

  // Recherche opérationnelle
  const filteredDrivers = drivers.filter(driver => {
    const q = search.toLowerCase();
    return (
      driver.nom?.toLowerCase().includes(q) ||
      driver.postnom?.toLowerCase().includes(q) ||
      driver.prenom?.toLowerCase().includes(q) ||
      driver.email?.toLowerCase().includes(q) ||
      driver.telephone?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* En-tête avec barre de recherche */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Liste des chauffeurs</h3>
        <div className="w-64">
          <SearchBar value={search} onChange={setSearch} />
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
            {filteredDrivers.map(driver => (
              <tr key={driver.id} className="hover:bg-gray-50">
                <td className="py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                      <FontAwesomeIcon icon={faUser} className="text-indigo-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{driver.nom} {driver.postnom} {driver.prenom}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-sm text-gray-700">{driver.telephone}</td>
                <td className="py-4 text-sm text-gray-700">{getVehicleBadge(driver.id)}</td>
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