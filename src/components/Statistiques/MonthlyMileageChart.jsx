import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const MonthlyMileageChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
        datasets: [{
          label: 'Km parcourus',
          data: [2500, 2700, 3200, 2900, 3800, 4200],
          fill: false,
          borderColor: '#8B5CF6',
          tension: 0.4,
          borderWidth: 3,
          pointBackgroundColor: '#8B5CF6',
          pointRadius: 5,
          pointHoverRadius: 7
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
        <h3 className="font-medium text-gray-800">Kilométrage moyen mensuel</h3>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-xs bg-indigo-100 text-indigo-600 rounded-full">Tous</button>
          <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">Utilitaires</button>
        </div>
      </div>
      <div className="chart-container">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default MonthlyMileageChart;