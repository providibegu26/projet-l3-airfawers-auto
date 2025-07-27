import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const MaintenanceCostChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
        datasets: [{
          label: 'Coût des entretiens',
          data: [12500, 14300, 10800, 17500, 15200, 19800],
          backgroundColor: '#6366F1',
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { drawBorder: false } },
          x: { grid: { display: false } }
        }
      }
    });

    return () => chart.destroy();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-800">Coût des entretiens (6 derniers mois)</h3>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-xs bg-indigo-100 text-indigo-600 rounded-full">Mensuel</button>
          <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">Annuel</button>
        </div>
      </div>
      <div className="chart-container">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default MaintenanceCostChart;