import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faExpand } from '@fortawesome/free-solid-svg-icons';
import CalendarLegend from '../Calendrier/CalendarLegend';
import { getUpcomingMaintenances } from '../../services/maintenanceService';

const CalendarSection = () => {
  const [vehicles, setVehicles] = useState([]);
  const [calendarData, setCalendarData] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/admin/vehicules');
        const data = await response.json();
        setVehicles(data.vehicules || []);
      } catch (error) {
        console.error('Erreur lors du chargement des véhicules:', error);
      }
    };

    loadVehicles();
  }, []);

  useEffect(() => {
    if (vehicles && vehicles.length > 0) {
      setCalendarData(getUpcomingMaintenances(vehicles, 30)); // 30 jours pour la version mini
    }
  }, [vehicles]);

  // Map date -> entretiens pour accès rapide
  const dateMap = {};
  calendarData.forEach(({ date, entretiens }) => {
    dateMap[date] = entretiens;
  });

  // Générer les jours du mois actuel
  const getMonthDays = (year, month) => {
    const days = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }
    return days;
  };

  const days = getMonthDays(currentYear, currentMonth);
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const blanks = Array((firstDayOfWeek + 6) % 7).fill(null);

  // Compter les entretiens urgents ce mois
  const urgentCount = Object.values(dateMap).flat().filter(e => e.statut === 'red').length;

  // Fonction pour déterminer la couleur d'un jour
  const getDayColor = (date) => {
    const iso = date.toISOString().slice(0, 10);
    const entretiens = dateMap[iso] || [];
    
    if (entretiens.length === 0) return '';
    
    // Couleur la plus urgente du jour
    if (entretiens.some(e => e.statut === 'red')) return 'bg-red-200 border-red-500';
    if (entretiens.some(e => e.statut === 'orange')) return 'bg-orange-200 border-orange-500';
    return 'bg-green-200 border-green-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-indigo-600" />
          Calendrier d'entretien
        </h3>
        <div className="flex items-center gap-2">
          {urgentCount > 0 && (
            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
              {urgentCount} urgent{urgentCount > 1 ? 's' : ''}
            </span>
          )}
          <Link to="/maintenance-calendar" className="text-indigo-600 hover:text-indigo-800">
            <FontAwesomeIcon icon={faExpand} title="Vue complète" />
          </Link>
        </div>
      </div>

      {/* Mini calendrier */}
      <div className="grid grid-cols-7 gap-0.5 text-xs">
        {["L", "M", "M", "J", "V", "S", "D"].map(j => (
          <div key={j} className="py-1 text-center text-gray-500 font-medium">{j}</div>
        ))}
        {blanks.map((_, i) => <div key={i} />)}
        {days.map(date => {
          const iso = date.toISOString().slice(0, 10);
          const entretiens = dateMap[iso] || [];
          const color = getDayColor(date);
          
          return (
            <div
              key={iso}
              className={`aspect-square w-full h-6 flex items-center justify-center rounded text-xs ${color} ${entretiens.length > 0 ? 'font-bold' : 'text-gray-400'}`}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>

      <CalendarLegend compact={true} />
    </div>
  );
};

export default CalendarSection;