import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTools, FaCalendarAlt, FaCar, FaTrash, FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const HistoriqueEntretiens = () => {
  const navigate = useNavigate();
  const [historique, setHistorique] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchHistorique();
  }, []);

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

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteEntretien = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet entretien ?')) {
      return;
    }

    try {
      setDeletingId(id);
      const response = await fetch(`http://localhost:4000/api/admin/entretiens/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        showNotification('Entretien supprimé avec succès', 'success');
        fetchHistorique(); // Recharger la liste
      } else {
        const data = await response.json();
        showNotification(data.error || 'Erreur lors de la suppression', 'error');
      }
    } catch (error) {
      showNotification('Erreur réseau lors de la suppression', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir vider tout l\'historique ? Cette action est irréversible.')) {
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/admin/entretiens/clear/all', {
        method: 'DELETE'
      });

      if (response.ok) {
        const data = await response.json();
        showNotification(data.message, 'success');
        setHistorique([]);
        setShowClearConfirm(false);
      } else {
        const data = await response.json();
        showNotification(data.error || 'Erreur lors du vidage', 'error');
      }
    } catch (error) {
      showNotification('Erreur réseau lors du vidage', 'error');
    }
  };

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
        return 'Catégorie A';
      case 'bougies':
        return 'Catégorie B';
      case 'freins':
        return 'Catégorie C';
      default:
        return type;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'vidange':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'bougies':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'freins':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Chargement de l'historique...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
          <div className="text-red-600 text-lg">Erreur: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
          notification.type === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-800' 
            : 'bg-red-100 border border-red-400 text-red-800'
        }`}>
          {notification.type === 'success' ? <FaCheckCircle /> : <FaTimesCircle />}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/entretiens')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <FaArrowLeft />
              Retour
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Historique des Entretiens</h1>
              <p className="text-gray-600 mt-1">Gestion des entretiens validés</p>
            </div>
          </div>
          
          {historique.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <FaTrash />
              Vider l'historique
            </button>
          )}
        </div>

        {/* Statistiques */}
        {historique.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total entretiens</p>
                  <p className="text-2xl font-bold text-gray-800">{historique.length}</p>
                </div>
                <FaTools className="text-indigo-500 text-2xl" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Catégorie A</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {historique.filter(e => e.type === 'vidange').length}
                  </p>
                </div>
                <FaTools className="text-blue-500 text-2xl" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Catégorie B</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {historique.filter(e => e.type === 'bougies').length}
                  </p>
                </div>
                <FaTools className="text-yellow-500 text-2xl" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Catégorie C</p>
                  <p className="text-2xl font-bold text-red-600">
                    {historique.filter(e => e.type === 'freins').length}
                  </p>
                </div>
                <FaTools className="text-red-500 text-2xl" />
              </div>
            </div>
          </div>
        )}

        {/* Contenu principal */}
        {historique.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <FaTools className="text-gray-400 text-6xl mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-600 mb-3">Aucun entretien enregistré</h3>
            <p className="text-gray-500 mb-6">Les entretiens validés apparaîtront ici</p>
            <button
              onClick={() => navigate('/entretiens')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Retour aux entretiens
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800">Tous les entretiens effectués</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Véhicule
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type d'entretien
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kilométrage
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date d'effectuation
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {historique.map((entretien) => (
                    <tr key={entretien.id} className="hover:bg-gray-50 transition-colors">
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
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(entretien.type)}`}>
                            {getTypeIcon(entretien.type)}
                            <span className="ml-2">{getTypeLabel(entretien.type)}</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {entretien.kilometrage.toLocaleString('fr-FR')} km
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
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
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {entretien.description || 'Aucune description'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteEntretien(entretien.id)}
                          disabled={deletingId === entretien.id}
                          className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                          title="Supprimer cet entretien"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal de confirmation pour vider l'historique */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <FaExclamationTriangle className="text-red-500 text-xl" />
              <h3 className="text-lg font-semibold text-gray-800">Confirmer la suppression</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir vider tout l'historique des entretiens ? 
              Cette action est irréversible et supprimera {historique.length} entretien(s).
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleClearAll}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Vider l'historique
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoriqueEntretiens; 