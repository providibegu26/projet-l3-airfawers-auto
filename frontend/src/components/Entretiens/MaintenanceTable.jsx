const MaintenanceTable = ({ data, onComplete, title }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
      )}
      <div className="overflow-x-auto">
        {data.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="text-gray-500 text-lg font-medium">Aucun entretien urgent</div>
            <div className="text-gray-400 text-sm mt-2">Tous les entretiens sont à jour</div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Véhicule</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chauffeur</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kilométrage</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date entretien</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jours restants</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                {onComplete && (
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>
            
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map(item => {
                let statusClasses, statusText;
                const joursRestants = item.joursRestants || 0;
                
                if (joursRestants < 0) {
                  statusClasses = 'bg-red-100 text-red-800 urgent-pulse';
                  statusText = 'En retard';
                } else if (joursRestants <= 7) {
                  statusClasses = 'bg-red-100 text-red-800 urgent-pulse';
                  statusText = 'Urgent';
                } else if (joursRestants <= 14) {
                  statusClasses = 'bg-yellow-100 text-yellow-800';
                  statusText = 'À venir';
                } else {
                  statusClasses = 'bg-green-100 text-green-800';
                  statusText = 'Normal';
                }
                
                return (
                  <tr key={`${item.immatriculation}-${item.type}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.immatriculation || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{item.marque || ''} {item.modele || ''}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.chauffeur || 'Non assigné'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.type || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.kilometrage ? item.kilometrage.toLocaleString('fr-FR') : '0'} km
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.dateEntretien || 'N/A'}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      (item.joursRestants || 0) < 0 ? 'text-red-600' : 
                      (item.joursRestants || 0) <= 7 ? 'text-red-600' : 
                      (item.joursRestants || 0) <= 14 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {(item.joursRestants || 0) < 0 ? `${Math.abs(item.joursRestants || 0)} jour(s) de retard` : `${item.joursRestants || 0} jour(s)`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses} status-badge`}>
                        {statusText}
                      </span>
                    </td>
                    {onComplete && (
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <button 
                          onClick={() => {
                            console.log('🔘 Bouton Valider cliqué pour:', item.immatriculation, item.type);
                            onComplete(item.immatriculation, item.type);
                          }} 
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-xs font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-sm"
                        >
                          Valider
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MaintenanceTable;