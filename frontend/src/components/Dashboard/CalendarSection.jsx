import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faExpand, faChevronLeft, faChevronRight, faTimes, faCar, faTools, faUser, faPhone } from '@fortawesome/free-solid-svg-icons';
import CalendarLegend from '../Calendrier/CalendarLegend';
import { generateCalendarData } from '../../services/maintenanceService';

const CalendarSection = () => {
  const [vehicles, setVehicles] = useState([]);
  const [calendarData, setCalendarData] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
      const calendarDataTransformed = generateCalendarData(vehicles, currentMonth, currentYear);
      setCalendarData(calendarDataTransformed);
    }
  }, [vehicles, currentMonth, currentYear]);

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

  // Fonctions de navigation
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToCurrentMonth = () => {
    const now = new Date();
    setCurrentMonth(now.getMonth());
    setCurrentYear(now.getFullYear());
  };

  // Noms des mois
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  // Compter les entretiens urgents ce mois
  const urgentCount = Object.values(dateMap).flat().filter(e => e.daysRemaining <= 7).length;

  // Fonction pour déterminer la couleur d'un jour
  const getDayColor = (date) => {
    const iso = date.toISOString().slice(0, 10);
    const entretiens = dateMap[iso] || [];
    
    if (entretiens.length === 0) return '';
    
    // Couleur la plus urgente du jour
    if (entretiens.some(e => e.daysRemaining <= 7)) return 'bg-red-200 border-red-500';
    if (entretiens.some(e => e.daysRemaining <= 14)) return 'bg-orange-200 border-orange-500';
    return 'bg-green-200 border-green-500';
  };

  // Fonction pour gérer le clic sur une date
  const handleDateClick = (date) => {
    const iso = date.toISOString().slice(0, 10);
    const entretiens = dateMap[iso] || [];
    
    if (entretiens.length > 0) {
      console.log('🔍 Données des entretiens:', entretiens);
      setSelectedDate({
        date: date,
        dateKey: iso,
        entretiens: entretiens
      });
      setShowModal(true);
    }
  };

  // Fonction pour fermer le modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedDate(null);
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

      {/* Navigation du mois */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Mois précédent"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="text-gray-600" />
        </button>
        
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-gray-700">
            {monthNames[currentMonth]} {currentYear}
          </h4>
          <button
            onClick={goToCurrentMonth}
            className="text-xs text-indigo-600 hover:text-indigo-800"
            title="Retour au mois actuel"
          >
            Aujourd'hui
          </button>
        </div>
        
        <button
          onClick={goToNextMonth}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Mois suivant"
        >
          <FontAwesomeIcon icon={faChevronRight} className="text-gray-600" />
        </button>
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
          const hasMaintenance = entretiens.length > 0;
          
          return (
            <div
              key={iso}
              onClick={() => handleDateClick(date)}
              className={`aspect-square w-full h-6 flex items-center justify-center rounded text-xs cursor-pointer transition-colors ${color} ${hasMaintenance ? 'font-bold hover:shadow-md' : 'text-gray-400'}`}
              title={hasMaintenance ? `${entretiens.length} entretien(s) prévu(s)` : 'Aucun entretien'}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>

      <CalendarLegend compact={true} />

      {/* Modal pour afficher les détails */}
      {showModal && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-indigo-600" />
                Entretiens du {selectedDate.date.toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div className="p-4">
              {selectedDate.entretiens.map((entretien, index) => (
                <div key={index} className="mb-4 p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCar} className="text-indigo-600" />
                      <span className="font-medium text-gray-800">
                        {entretien.vehicle.immatriculation}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      entretien.colorStatus === 'red' ? 'bg-red-100 text-red-700' :
                      entretien.colorStatus === 'orange' ? 'bg-orange-100 text-orange-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {entretien.daysRemaining} jour(s)
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <FontAwesomeIcon icon={faTools} className="text-gray-400" />
                    <span>{entretien.typeLabel}</span>
                  </div>
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faCar} className="text-gray-400" />
                      <span><strong>Véhicule:</strong> {entretien.vehicle.marque} {entretien.vehicle.modele}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faCar} className="text-gray-400" />
                      <span><strong>Immatriculation:</strong> {entretien.vehicle.immatriculation}</span>
                    </div>
                    {entretien.vehicle.chauffeur ? (
                      <>
                        <div className="flex items-center gap-1 text-gray-600">
                          <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                          <span><strong>Chauffeur:</strong> {entretien.vehicle.chauffeur.nom} {entretien.vehicle.chauffeur.prenom}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <FontAwesomeIcon icon={faPhone} className="text-gray-400" />
                          <span><strong>Téléphone:</strong> {entretien.vehicle.chauffeur.telephone || 'Non renseigné'}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-1 text-gray-500">
                        <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                        <span><strong>Chauffeur:</strong> Non attribué</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarSection;