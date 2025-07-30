import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faChevronLeft, faChevronRight, faTimes, faTools, faUser, faCar, faPhone } from '@fortawesome/free-solid-svg-icons';
import CalendarLegend from './CalendarLegend';
import { generateCalendarData } from '../../services/maintenanceService';

const FullCalendar = () => {
  const [vehicles, setVehicles] = useState([]);
  const [calendarData, setCalendarData] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEntretiens, setSelectedEntretiens] = useState([]);

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
      const calendarDataTransformed = generateCalendarData(vehicles);
      setCalendarData(calendarDataTransformed);
    }
  }, [vehicles]);

  // Map date -> entretiens pour accès rapide
  const dateMap = {};
  calendarData.forEach(({ date, entretiens }) => {
    dateMap[date] = entretiens;
  });

  // Générer les jours du mois affiché
  const getMonthDays = (year, month) => {
    const days = [];
    const lastDay = new Date(year, month + 1, 0);
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }
    return days;
  };

  const days = getMonthDays(currentYear, currentMonth);
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const blanks = Array((firstDayOfWeek + 6) % 7).fill(null);

  // Gestion navigation mois
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11); setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0); setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Gestion clic sur un jour
  const handleDayClick = (date) => {
    const iso = date.toISOString().slice(0, 10);
    if (dateMap[iso]) {
      setSelectedDate(iso);
      setSelectedEntretiens(dateMap[iso]);
    } else {
      setSelectedDate(null);
      setSelectedEntretiens([]);
    }
  };

  // Fonction pour déterminer la couleur d'un jour
  const getDayColor = (date) => {
    const iso = date.toISOString().slice(0, 10);
    const entretiens = dateMap[iso] || [];
    
    if (entretiens.length === 0) return '';
    
    // Couleur la plus urgente du jour
    if (entretiens.some(e => e.daysRemaining <= 7)) return 'bg-gradient-to-br from-red-100 to-red-200 border-red-400 text-red-800 shadow-sm hover:shadow-md';
    if (entretiens.some(e => e.daysRemaining <= 14)) return 'bg-gradient-to-br from-orange-100 to-orange-200 border-orange-400 text-orange-800 shadow-sm hover:shadow-md';
    return 'bg-gradient-to-br from-green-100 to-green-200 border-green-400 text-green-800 shadow-sm hover:shadow-md';
  };

  // Vérifier si c'est aujourd'hui
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4 max-w-4xl mx-auto">
      {/* Header avec navigation */}
      <div className="flex items-center justify-between mb-4">
        <Link 
          to="/" 
          className="flex items-center px-2 py-1 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded transition-all duration-200 font-medium text-sm"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
          Retour
        </Link>
        
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-0.5">Calendrier des Entretiens</h2>
          <p className="text-gray-500 text-xs">Planification et suivi des maintenances</p>
        </div>

        {/* Navigation mois */}
        <div className="flex items-center gap-2">
          <button 
            onClick={prevMonth} 
            className="p-1 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-all duration-200"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
          </button>
          <span className="text-base font-semibold text-gray-800 min-w-[150px] text-center">
            {new Date(currentYear, currentMonth).toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}
          </span>
          <button 
            onClick={nextMonth} 
            className="p-1 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-all duration-200"
          >
            <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
          </button>
        </div>
      </div>

      {/* Calendrier */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 shadow-inner">
        {/* En-têtes des jours */}
        <div className="grid grid-cols-7 gap-0.5 mb-2">
          {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(j => (
            <div key={j} className="py-1 text-center text-xs font-bold text-gray-600 bg-white rounded shadow-sm">
              {j}
            </div>
          ))}
        </div>
        
        {/* Grille des jours */}
        <div className="grid grid-cols-7 gap-0.5">
          {blanks.map((_, i) => <div key={i} className="h-12" />)}
          {days.map(date => {
            const iso = date.toISOString().slice(0, 10);
            const entretiens = dateMap[iso] || [];
            const color = getDayColor(date);
            const today = isToday(date);
            
            return (
              <button
                key={iso}
                onClick={() => handleDayClick(date)}
                className={`
                  h-12 w-full flex flex-col items-center justify-center rounded border transition-all duration-200 
                  ${color} 
                  ${entretiens.length > 0 ? 'font-bold cursor-pointer hover:scale-105' : 'text-gray-400 cursor-default bg-white border-gray-200'} 
                  ${today ? 'ring-1 ring-indigo-400' : ''}
                  ${entretiens.length > 0 ? 'hover:shadow-md' : ''}
                `}
                disabled={entretiens.length === 0}
              >
                <span className={`text-xs ${today ? 'font-bold' : ''}`}>
                  {date.getDate()}
                </span>
                {entretiens.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {entretiens.slice(0, 2).map((e, idx) => (
                      <div 
                        key={idx} 
                        className={`w-1 h-1 rounded-full ${
                          e.statut === 'red' ? 'bg-red-500' : 
                          e.statut === 'orange' ? 'bg-orange-500' : 'bg-green-500'
                        }`}
                      />
                    ))}
                    {entretiens.length > 2 && (
                      <span className="text-xs font-medium">+{entretiens.length - 2}</span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal pour les entretiens du jour */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-4 w-full max-w-lg max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-0.5">
                  Entretiens prévus
                </h3>
                <p className="text-gray-600 text-sm">
                  {new Date(selectedDate).toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <button 
                onClick={() => setSelectedDate(null)} 
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all duration-200"
              >
                <FontAwesomeIcon icon={faTimes} className="text-lg" />
              </button>
            </div>
            
            <div className="space-y-2">
              {selectedEntretiens.map((e, idx) => (
                <div key={idx} className="bg-gradient-to-r from-gray-50 to-white rounded p-3 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-full ${
                        e.statut === 'red' ? 'bg-red-100 text-red-600' : 
                        e.statut === 'orange' ? 'bg-orange-100 text-orange-600' : 
                        'bg-green-100 text-green-600'
                      }`}>
                        <FontAwesomeIcon icon={faTools} className="text-xs" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-gray-800">
                          {e.immatriculation}
                        </h4>
                        <p className="text-gray-600 text-xs">
                          {e.marque} {e.modele}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      e.statut === 'red' ? 'bg-red-100 text-red-700' : 
                      e.statut === 'orange' ? 'bg-orange-100 text-orange-700' : 
                      'bg-green-100 text-green-700'
                    }`}>
                      {e.statut === 'red' ? 'Urgent' : e.statut === 'orange' ? 'À venir' : 'Normal'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faTools} className="text-gray-400" />
                      <span className="font-medium">Type :</span>
                      <span className="capitalize text-gray-700">{e.type}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                      <span className="font-medium">Chauffeur :</span>
                      <span className="text-gray-700">{e.chauffeur}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faCar} className="text-gray-400" />
                      <span className="font-medium">Jours restants :</span>
                      <span className={`font-bold ${
                        e.daysRemaining <= 7 ? 'text-red-600' : 
                        e.daysRemaining <= 14 ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {e.daysRemaining} jours
                      </span>
                    </div>
                    {e.telephone && (
                      <div className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faPhone} className="text-gray-400" />
                        <span className="font-medium">Téléphone :</span>
                        <span className="text-gray-700">{e.telephone}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <CalendarLegend compact={false} />
    </div>
  );
};

export default FullCalendar;