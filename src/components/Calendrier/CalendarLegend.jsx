import React from 'react';

const CalendarLegend = ({ compact }) => {
  return (
    <div className={`mt-4 flex ${compact ? 'justify-between' : 'justify-start gap-6'} text-sm`}>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span>Terminé</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
        <span>Planifié</span>
      </div>
      {!compact && (
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          <span>Aucun</span>
        </div>
      )}
    </div>
  );
};

export default CalendarLegend;