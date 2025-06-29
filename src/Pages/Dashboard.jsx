import React, { useEffect } from 'react';
import Header from '../components/Header';
import StatsCards from '../components/Dashboard/StatsCards';
import CalendarSection from '../components/Dashboard/CalendarSection';
import MapSection from '../components/Dashboard/MapSection';
import DriversList from '../components/Dashboard/DriversList';

const Dashboard = () => {

  useEffect(() => {
    const updateDriverStatusIndicators = () => {
      const viewportWidth = window.innerWidth;
      const statusCells = document.querySelectorAll('tbody tr td:nth-child(2)');
      
      if (viewportWidth < 768) {
        statusCells.forEach(cell => {
          const text = cell.querySelector('span:nth-child(2)').textContent;
          const indicator = cell.querySelector('.status-indicator');
          
          if (text.includes('mission')) {
            indicator.classList.remove('status-pending', 'status-inactive');
            indicator.classList.add('status-active');
          } else if (text.includes('attente')) {
            indicator.classList.remove('status-active', 'status-inactive');
            indicator.classList.add('status-pending');
          } else {
            indicator.classList.remove('status-active', 'status-pending');
            indicator.classList.add('status-inactive');
          }
        });
      }
    };

    window.addEventListener('load', updateDriverStatusIndicators);
    window.addEventListener('resize', updateDriverStatusIndicators);

    return () => {
      window.removeEventListener('load', updateDriverStatusIndicators);
      window.removeEventListener('resize', updateDriverStatusIndicators);
    };
  }, []);

  return (
   
      <div className="flex h-screen overflow-hidden w-full">
        <div className="flex-1 overflow-auto relative  transition-colors duration-300 [-ms-overflow-style:none] [scrollbar-width:none]">
          
          
          <main className="p-4 md:p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
            
            <StatsCards />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <CalendarSection />
              <MapSection />
            </div>
            
            <DriversList />
          </main>
        </div>
      </div>
    
  );
};

export default Dashboard;