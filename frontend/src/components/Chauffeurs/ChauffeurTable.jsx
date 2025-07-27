import { ChauffeurRow } from './ChauffeurRow';

export const ChauffeurTable = ({ chauffeurs, vehicles, onChauffeurClick, onUpdate, onDelete, hideActions = false }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Post-Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Prénom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Sexe</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Téléphone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Véhicule</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Statut</th>
              {!hideActions && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider action-buttons">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {chauffeurs.map((chauffeur) => (
              <ChauffeurRow 
                key={chauffeur.id} 
                chauffeur={chauffeur} 
                vehicles={vehicles}
                onClick={() => onChauffeurClick(chauffeur)}
                onUpdate={onUpdate}
                onDelete={onDelete}
                hideActions={hideActions}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};