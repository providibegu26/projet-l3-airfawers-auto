import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTools, FaCalendarAlt, FaCar } from 'react-icons/fa';

const HistoriqueEntretiens = () => {
  const navigate = useNavigate();
  const [historique, setHistorique] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistorique = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/api/admin/entretiens/history');
        const data = await response.json();
        
        if (response.ok) {
          setHistorique(data.historique || []);
        } else {
          setError(data.error || 'Erreur lors du chargement de l\'historique');
        }
      } catch (err) {
        setError('Erreur réseau lors du chargement de l\'historique');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorique();
  }, []);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'vidange':
        return <FaTools className="text-blue-500" />;
      case 'bougies':
        return <FaTools className="text-yellow-500" />;
      case 'freins':
        return <FaTools className="text-red-500" />;
      default:
        return <FaTools className="text-gray-500" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'vidange':
        return 'Vidange';
      case 'bougies':
        return 'Changement de bougies';
      case 'freins':
        return 'Plaquettes de frein';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Chargement de l'historique...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-600">Erreur: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/entretiens')}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition"
          >
            <FaArrowLeft />
            Retour
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">Historique des Entretiens</h1>
        </div>
      </div>

      {historique.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <FaTools className="text-gray-400 text-4xl mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">Aucun entretien enregistré</h3>
          <p className="text-gray-500">Les entretiens validés apparaîtront ici</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Tous les entretiens effectués</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Véhicule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type d'entretien
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kilométrage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date d'effectuation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {historique.map((entretien) => (
                  <tr key={entretien.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaCar className="text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {entretien.vehicule.immatriculation}
                          </div>
                          <div className="text-sm text-gray-500">
                            {entretien.vehicule.marque} {entretien.vehicule.modele}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTypeIcon(entretien.type)}
                        <span className="ml-2 text-sm font-medium text-gray-900">
                          {getTypeLabel(entretien.type)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entretien.kilometrage.toLocaleString('fr-FR')} km
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaCalendarAlt className="text-gray-400 mr-2" />
                        {new Date(entretien.dateEffectuee).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {entretien.description || 'Aucune description'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoriqueEntretiens; 