import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const ExpensesDistributionChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Carburant', 'Entretien', 'Divers'],
        datasets: [{
          data: [125000, 85000, 35000],
          backgroundColor: ['#10B981', '#3B82F6', '#F59E0B'],
          borderWidth: 0,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        cutout: '70%',
        plugins: { legend: { position: 'right' } }
      }
    });

    return () => chart.destroy();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-800">Répartition des dépenses</h3>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-xs bg-indigo-100 text-indigo-600 rounded-full">2023</button>
          <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">2022</button>
        </div>
      </div>
      <div className="chart-container">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default ExpensesDistributionChart;