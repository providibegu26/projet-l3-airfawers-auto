import { FaUserTie, FaTimes, FaFilePdf } from 'react-icons/fa';

export const ChauffeurDetailsModal = ({ chauffeur, onClose }) => {
  const vehicleHistory = [
    {
      vehicule: "Toyota Corolla",
      immatriculation: "AA-123-BB",
      debut: "12/01/2023",
      fin: "-"
    },
    // ... autres véhicules
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-bold flex items-center">
            <FaUserTie className="text-indigo-500 mr-2" />
            Détails du chauffeur
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
              <h4 className="font-bold text-gray-800 mb-3">Informations personnelles</h4>
              <div className="space-y-2">
                <div><span className="text-gray-600">ID:</span> {chauffeur.chauffeurId}</div>
                <div><span className="text-gray-600">Nom:</span> {chauffeur.nom}</div>
                <div><span className="text-gray-600">Prénom:</span> {chauffeur.prenom}</div>
                <div><span className="text-gray-600">Sexe:</span> {chauffeur.sexe}</div>
                <div><span className="text-gray-600">Téléphone:</span> {chauffeur.telephone}</div>
                <div><span className="text-gray-600">Email:</span> {chauffeur.email}</div>
                <div><span className="text-gray-600">Date embauche:</span> {chauffeur.dateEmbauche}</div>
              </div>
            </div>

            {/* Colonne 2 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-3">Véhicule actuel</h4>
              <div className="space-y-2">
                <div><span className="text-gray-600">Marque/Modèle:</span> {chauffeur.vehicule || 'Aucun'}</div>
                <div><span className="text-gray-600">Immatriculation:</span> AA-123-BB</div>
                <div><span className="text-gray-600">Date d'assignation:</span> 12/01/2023</div>
              </div>
            </div>

            {/* Colonne 3 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-3">Historique des véhicules</h4>
              <div className="overflow-y-auto max-h-40">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-2 py-1 text-left text-xs text-gray-500">Véhicule</th>
                      <th className="px-2 py-1 text-left text-xs text-gray-500">Immat.</th>
                      <th className="px-2 py-1 text-left text-xs text-gray-500">Début</th>
                      <th className="px-2 py-1 text-left text-xs text-gray-500">Fin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicleHistory.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="px-2 py-1 text-sm">{item.vehicule}</td>
                        <td className="px-2 py-1 text-sm">{item.immatriculation}</td>
                        <td className="px-2 py-1 text-sm">{item.debut}</td>
                        <td className="px-2 py-1 text-sm">{item.fin}</td>
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
    </div>
  );
};