import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import CalendarLegend from './CalendarLegend';

const FullCalendar = () => {
  // Données fictives pour la démo (3 véhicules, événements répartis sur le mois)
  const vehicles = [
    { 
      id: 1, 
      name: "Renault Trafic", 
      color: "indigo",
      events: [
        { day: 5, status: 'done' },
        { day: 15, status: 'pending' },
        { day: 22, status: 'done' }
      ]
    },
    { 
      id: 2, 
      name: "Peugeot Boxer", 
      color: "green",
      events: [
        { day: 2, status: 'pending' },
        { day: 10, status: 'done' },
        { day: 28, status: 'pending' }
      ]
    },
    { 
      id: 3, 
      name: "Citroën Jumper", 
      color: "red",
      events: [
        { day: 7, status: 'done' },
        { day: 18, status: 'pending' },
        { day: 30, status: 'done' }
      ]
    },
  ];

  // Génère les jours du mois (1 à 31)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  // Fonction utilitaire pour trouver l'événement d'un véhicule à un jour donné
  const getEventStatus = (vehicle, day) => {
    const event = vehicle.events.find(e => e.day === day);
    return event ? event.status : null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <Link to="/" className="text-indigo-600 hover:text-indigo-800 flex items-center">
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Retour
        </Link>
        <h2 className="text-xl font-semibold">Calendrier Mensuel</h2>
        <div className="w-6"></div> {/* Pour l'alignement */}
      </div>

      {/* Tableau complet */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left p-2">Véhicule</th>
              {daysInMonth.map(day => (
                <th key={day} className="p-2 text-center">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vehicles.map(vehicle => (
              <tr key={vehicle.id}>
                <td className="py-3 font-medium text-gray-700">
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 bg-${vehicle.color}-500`} />
                  {vehicle.name}
                </td>
                {daysInMonth.map(day => {
                  const status = getEventStatus(vehicle, day);
                  return (
                    <td key={day} className="p-2 text-center">
                      {status === 'done' && <span className="inline-block w-3 h-3 rounded-full bg-green-400" title="Entretien fait"></span>}
                      {status === 'pending' && <span className="inline-block w-3 h-3 rounded-full bg-yellow-400" title="À faire"></span>}
                      {!status && <span className="inline-block w-3 h-3 rounded-full bg-gray-200"></span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CalendarLegend compact={false} />
    </div>
  );
};

export default FullCalendar;