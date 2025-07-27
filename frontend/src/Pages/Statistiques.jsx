import React from 'react';
import Layout from '../components/Layout';
import StatsCards from '../components/Statistiques/StatsCards';
import MaintenanceCostChart from '../components/Statistiques/MaintenanceCostChart';
import ExpensesDistributionChart from '../components/Statistiques/ExpensesDistributionChart';
import MonthlyMileageChart from '../components/Statistiques/MonthlyMileageChart';
import TopVehiclesChart from '../components/Statistiques/TopVehiclesChart';

const Statistiques = () => {
  return (
    
      <div className="flex-1 overflow-auto p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Statistiques de la flotte</h2>
        
        <StatsCards />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <MaintenanceCostChart />
          <ExpensesDistributionChart />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <MonthlyMileageChart />
          <TopVehiclesChart />
        </div>
      </div>
    
  );
};

export default Statistiques;