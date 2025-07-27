import React from 'react';
import { FaCar, FaUserTie, FaDollarSign, FaExclamationTriangle } from 'react-icons/fa';

const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Véhicules */}
      <div className="bg-white p-6 rounded-xl shadow-sm hover:transform hover:-translate-y-1 hover:shadow-md transition-all duration-300 border-t-4 border-indigo-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Véhicules</p>
            <p className="text-2xl font-semibold text-gray-800 mt-1">42</p>
          </div>
          <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
            <FaCar className="text-xl" />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4"><span className="text-green-500">+2.5%</span> vs mois dernier</p>
      </div>

      {/* Chauffeurs */}
      <div className="bg-white p-6 rounded-xl shadow-sm hover:transform hover:-translate-y-1 hover:shadow-md transition-all duration-300 border-t-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Chauffeurs</p>
            <p className="text-2xl font-semibold text-gray-800 mt-1">38</p>
          </div>
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <FaUserTie className="text-xl" />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4"><span className="text-green-500">+1.2%</span> vs mois dernier</p>
      </div>

      {/* Coût mensuel */}
      <div className="bg-white p-6 rounded-xl shadow-sm hover:transform hover:-translate-y-1 hover:shadow-md transition-all duration-300 border-t-4 border-orange-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Coût mensuel</p>
            <p className="text-2xl font-semibold text-gray-800 mt-1">24,560$</p>
          </div>
          <div className="p-3 rounded-full bg-orange-100 text-orange-600">
            <FaDollarSign className="text-xl" />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4"><span className="text-red-500">-3.8%</span> vs mois dernier</p>
      </div>

      {/* Pannes */}
      <div className="bg-white p-6 rounded-xl shadow-sm hover:transform hover:-translate-y-1 hover:shadow-md transition-all duration-300 border-t-4 border-red-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Pannes</p>
            <p className="text-2xl font-semibold text-gray-800 mt-1">18</p>
          </div>
          <div className="p-3 rounded-full bg-red-100 text-red-600">
            <FaExclamationTriangle className="text-xl" />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4"><span className="text-red-500">+5.6%</span> vs mois dernier</p>
      </div>
    </div>
  );
};

export default StatsCards;