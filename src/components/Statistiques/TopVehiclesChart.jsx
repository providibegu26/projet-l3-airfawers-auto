import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const TopVehiclesChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'AA-123-BB (Dupont)',
          'CC-456-DD (Martin)',
          'EE-789-FF (Durand)',
          'GG-012-HH (Leroy)',
          'II-345-JJ (Moreau)'
        ],
        datasets: [{
          label: 'Kilométrage',
          data: [9800, 8750, 7600, 6500, 5400],
          backgroundColor: [
            '#EC4899',
            '#F97316',
            '#14B8A6',
            '#A855F7',
            '#3B82F6'
          ],
          borderRadius: 8
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { beginAtZero: true, grid: { drawBorder: false } },
          y: { grid: { display: false } }
        }
      }
    });

    return () => chart.destroy();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-800">Top 5 véhicules les plus utilisés</h3>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-xs bg-indigo-100 text-indigo-600 rounded-full">Km</button>
          <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">Jours</button>
        </div>
      </div>
      <div className="chart-container">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default TopVehiclesChart;