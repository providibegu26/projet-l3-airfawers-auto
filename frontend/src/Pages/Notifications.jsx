// src/Pages/Notifications.jsx
import React from 'react';
import Layout from '../components/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faExclamationTriangle, 
  faTools,
  faGasPump,
  faCar,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

const Notifications = () => {
  // Données de démonstration
  const notifications = [
    {
      id: 1,
      type: 'panne',
      title: 'Nouvelle panne signalée',
      message: 'Problème moteur sur véhicule AB-123-CD',
      date: '10 min ago',
      read: false
    },
    {
      id: 2,
      type: 'entretien',
      title: 'Entretien programmé',
      message: 'Vidange nécessaire pour EF-456-GH',
      date: '2h ago',
      read: true
    },
    {
      id: 3,
      type: 'carburant',
      title: 'Niveau de carburant bas',
      message: 'IJ-789-KL a besoin de ravitaillement',
      date: '5h ago',
      read: true
    },
    {
      id: 4,
      type: 'validation',
      title: 'Panne résolue',
      message: 'Problème de pneu sur MN-012-OP est réparé',
      date: '1 jour',
      read: false
    }
  ];

  const getIcon = (type) => {
    switch(type) {
      case 'panne': return faExclamationTriangle;
      case 'entretien': return faTools;
      case 'carburant': return faGasPump;
      case 'validation': return faCheckCircle;
      default: return faCar;
    }
  };

  const getColor = (type) => {
    switch(type) {
      case 'panne': return 'text-red-500';
      case 'entretien': return 'text-blue-500';
      case 'carburant': return 'text-yellow-500';
      case 'validation': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Notifications</h1>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`border-b border-gray-200 p-4 ${!notification.read ? 'bg-blue-50' : ''}`}
            >
              <div className="flex items-start">
                <div className={`flex-shrink-0 mt-1 ${getColor(notification.type)}`}>
                  <FontAwesomeIcon icon={getIcon(notification.type)} className="text-lg" />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between">
                    <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-500">{notification.date}</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    
  );
};

export default Notifications;