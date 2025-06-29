const MaintenanceTable = ({ data, onComplete }) => {
  const formatter = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Immatriculation</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marque/Modèle</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chauffeur</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kilométrage</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date entretien</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jours restants</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map(item => {
              let statusClasses, statusText;
              if (item.daysLeft < 0) {
                statusClasses = 'bg-red-100 text-red-800 urgent-pulse';
                statusText = 'En retard';
              } else if (item.daysLeft < 7) {
                statusClasses = 'bg-red-100 text-red-800 urgent-pulse';
                statusText = 'Urgent';
              } else if (item.daysLeft < 14) {
                statusClasses = 'bg-yellow-100 text-yellow-800';
                statusText = 'À venir';
              } else {
                statusClasses = 'bg-green-100 text-green-800';
                statusText = 'Valide';
              }
              
              return (
                <tr key={item.plate} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.plate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.brand}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.driver}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.mileage.toLocaleString('fr-FR')} km</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatter.format(new Date(item.nextMaintenance))}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    item.daysLeft < 0 ? 'text-red-600' : 
                    item.daysLeft < 7 ? 'text-red-600' : 
                    item.daysLeft < 14 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {item.daysLeft < 0 ? `${Math.abs(item.daysLeft)} jour(s) de retard` : `${item.daysLeft} jour(s)`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses} status-badge`}>
                      {statusText}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => onComplete(item.plate)} 
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Valider
                    </button>
                    
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaintenanceTable;