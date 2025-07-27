import React, { useState } from 'react';
import Layout from '../components/Layout';
import { FaExclamationTriangle, FaClock, FaCheckCircle, FaMapMarkerAlt, FaCheck, FaTrash, FaTimes } from 'react-icons/fa';

const Pannes = () => {
  // Données initiales
  const initialIncidents = [
    {
      id: 1,
      immatriculation: 'AB-123-CD',
      modele: 'Peugeot 308',
      conducteur: 'Martin Dupont',
      telephone: '+33 6 12 34 56 78',
      type: 'Problème moteur',
      description: "Niveau d'huile bas",
      date: '04/06/2023',
      heure: '10:45',
      statut: 'pending',
      location: '48.8566,2.3522' // Paris
    },
    {
      id: 2,
      immatriculation: 'EF-456-GH',
      modele: 'Renault Trafic',
      conducteur: 'Sophie Leroy',
      telephone: '+33 6 98 76 54 32',
      type: 'Pneu crevé',
      description: 'Pneu avant droit',
      date: '03/06/2023',
      heure: '15:20',
      statut: 'progress',
      location: '43.6047,1.4442' // Toulouse
    }
  ];

  // States
  const [incidents, setIncidents] = useState(initialIncidents);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('');
  const [currentAction, setCurrentAction] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);

  // Gestion des actions
  const handleViewLocation = (location) => {
    setCurrentLocation(location);
    setShowLocationModal(true);
  };

  const handleAction = (incident, action) => {
    setSelectedIncident(incident);
    setCurrentAction(action);
    setShowConfirmModal(true);
  };

  const confirmAction = () => {
    if (currentAction === 'resolve') {
      setIncidents(incidents.map(incident => 
        incident.id === selectedIncident.id ? {...incident, statut: 'resolved'} : incident
      ));
    } else {
      setIncidents(incidents.filter(incident => incident.id !== selectedIncident.id));
    }
    setShowConfirmModal(false);
  };

  // Configuration des statuts
  const statusClasses = {
    pending: 'bg-yellow-100 text-yellow-800',
    progress: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800'
  };

  const statusLabels = {
    pending: 'En attente',
    progress: 'En cours',
    resolved: 'Résolue'
  };

  // Stats calculées
  const stats = {
    total: incidents.length,
    pending: incidents.filter(i => i.statut === 'pending').length,
    resolved: incidents.filter(i => i.statut === 'resolved').length
  };

  return (
    
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestion des Pannes</h1>
        
        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-indigo-100 text-indigo-600">
                <FaExclamationTriangle className="text-xl" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Total des pannes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-orange-100 text-orange-600">
                <FaClock className="text-xl" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Pannes en attente</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-green-100 text-green-600">
                <FaCheckCircle className="text-xl" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Pannes résolues</p>
                <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tableau des pannes */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Véhicule</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conducteur</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Panne</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {incidents.map((incident) => (
                  <tr key={incident.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{incident.immatriculation}</div>
                      <div className="text-sm text-gray-500">{incident.modele}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{incident.conducteur}</div>
                      <div className="text-sm text-gray-500">{incident.telephone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{incident.type}</div>
                      <div className="text-sm text-gray-500">{incident.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{incident.date}</div>
                      <div className="text-sm text-gray-500">{incident.heure}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusClasses[incident.statut]}`}>
                        {statusLabels[incident.statut]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewLocation(incident.location)}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                          title="Voir localisation"
                        >
                          <FaMapMarkerAlt />
                        </button>
                        <button
                          onClick={() => handleAction(incident, 'resolve')}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Valider la résolution"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => handleAction(incident, 'delete')}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Supprimer la panne"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modale de localisation */}
        {showLocationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
              <div className="flex justify-between items-center border-b p-4">
                <h3 className="text-lg font-medium">Localisation du véhicule</h3>
                <button 
                  onClick={() => setShowLocationModal(false)} 
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="p-4">
                <div className="h-96 w-full bg-gray-200 rounded-md overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps/embed/v1/view?key=YOUR_API_KEY&center=${currentLocation}&zoom=15`}
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 flex justify-end">
                <button
                  onClick={() => setShowLocationModal(false)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modale de confirmation */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                  {currentAction === 'resolve' ? (
                    <FaCheckCircle className="h-6 w-6 text-indigo-600" />
                  ) : (
                    <FaExclamationTriangle className="h-6 w-6 text-red-600" />
                  )}
                </div>
                <h3 className="mt-3 text-lg font-medium text-gray-900">
                  {currentAction === 'resolve' 
                    ? 'Confirmer la résolution' 
                    : 'Confirmer la suppression'}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {currentAction === 'resolve'
                      ? 'Voulez-vous vraiment marquer cette panne comme résolue ?'
                      : 'Cette action supprimera définitivement la déclaration de panne. Voulez-vous continuer ?'}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 flex justify-center space-x-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmAction}
                  className={`px-4 py-2 rounded-md text-white ${
                    currentAction === 'resolve' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {currentAction === 'resolve' ? 'Confirmer' : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    
  );
};

export default Pannes;