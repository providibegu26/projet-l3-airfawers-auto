import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faExpand } from '@fortawesome/free-solid-svg-icons';
import CalendarLegend from '../Calendrier/CalendarLegend';

const CalendarSection = () => {
  // Données fictives pour la démo
  const vehicles = [
    { id: 1, name: "Renault Trafic", color: "indigo", days: [null, 'pending', 'done', null, null, 'done', null] },
    { id: 2, name: "Peugeot Boxer", color: "green", days: ['done', null, null, 'pending', null, null, null] },
    { id: 3, name: "Citroën Jumper", color: "red", days: [null, null, null, null, 'done', null, 'pending'] },
  ];

  const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-indigo-600" />
          Calendrier d'entretien
        </h3>
        <Link to="/maintenance-calendar" className="text-indigo-600 hover:text-indigo-800">
          <FontAwesomeIcon icon={faExpand} title="Vue complète" />
        </Link>
      </div>

      {/* Tableau compact */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left p-2">Véhicule</th>
              {daysOfWeek.map(day => (
                <th key={day} className="p-2">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vehicles.map(vehicle => (
              <tr key={vehicle.id}>
                <td className="p-2 font-medium text-gray-700">
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 bg-${vehicle.color}-500`} />
                  {vehicle.name}
                </td>
                {vehicle.days.map((status, idx) => (
                  <td key={idx} className="p-2 text-center">
                    {status === 'done' && <span className="inline-block w-3 h-3 rounded-full bg-green-400" title="Entretien fait"></span>}
                    {status === 'pending' && <span className="inline-block w-3 h-3 rounded-full bg-yellow-400" title="À faire"></span>}
                    {!status && <span className="inline-block w-3 h-3 rounded-full bg-gray-200"></span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CalendarLegend compact={true} />
    </div>
  );
};

export default CalendarSection;