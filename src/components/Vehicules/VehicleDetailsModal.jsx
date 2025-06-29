import { FaCar, FaTimes, FaFilePdf } from 'react-icons/fa';

export const VehicleDetailsModal = ({ isOpen, vehicle, onClose }) => {
  if (!isOpen || !vehicle) return null;

  const maintenanceHistory = [
    {
      date: "15/03/2023",
      type: "Vidange + Filtres",
      provider: "Auto 2000",
      cost: "€250.00",
      mileage: "125,450 km"
    },
    // ... autres entretiens
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-bold flex items-center">
            <FaCar className="text-indigo-500 mr-2" />
            Détails du véhicule
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Colonne 1 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-3">Informations générales</h4>
              <div className="space-y-2">
                <div><span className="text-gray-600">Matricule:</span> {vehicle.matricule}</div>
                <div><span className="text-gray-600">Marque/Modèle:</span> {vehicle.marque} {vehicle.modele}</div>
                <div><span className="text-gray-600">N° Châssis:</span> {vehicle.chassis}</div>
                <div><span className="text-gray-600">Kilométrage:</span> {vehicle.kilometrage}</div>
                <div><span className="text-gray-600">Catégorie:</span> {vehicle.categorie}</div>
                <div><span className="text-gray-600">Année:</span> 2019</div>
              </div>
            </div>

            {/* Colonne 2 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-3">Assignation</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-600">Statut:</span> 
                  <span className={`ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    vehicle.statut === 'Attribué' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {vehicle.statut}
                  </span>
                </div>
                <div><span className="text-gray-600">Conducteur:</span> {vehicle.conducteur || '-'}</div>
                <div><span className="text-gray-600">Date d'assignation:</span> 12/01/2023</div>
              </div>
            </div>

            {/* Colonne 3 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-3">Entretien</h4>
              <div className="space-y-2">
                <div><span className="text-gray-600">Dernier entretien:</span> {vehicle.dernierEntretien}</div>
                <div><span className="text-gray-600">Type:</span> Vidange + Filtres</div>
                <div><span className="text-gray-600">Coût total:</span> €250.00</div>
                <div><span className="text-gray-600">Prochain entretien:</span> <span className="text-indigo-600">15/09/2023</span></div>
                <div><span className="text-gray-600">Kilométrage estimé:</span> 135,000 km</div>
              </div>
            </div>
          </div>

          {/* Historique */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 className="font-bold text-gray-800 mb-3">Historique des entretiens</h4>
            <div className="overflow-auto max-h-40">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fournisseur</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Coût</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kilométrage</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenanceHistory.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.type}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.provider}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.cost}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.mileage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 flex justify-end space-x-3">
          <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
            <FaFilePdf className="mr-2" />
            Exporter en PDF
          </button>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};