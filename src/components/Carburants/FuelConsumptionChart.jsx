import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const FuelConsumptionChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['AB-123-CD', 'EF-456-GH', 'IJ-789-KL'],
          datasets: [{
            data: [42, 38, 35],
            backgroundColor: ['#3B82F6', '#F97316', '#10B981'],
            borderWidth: 0
          }]
        },
        options: {
          cutout: '70%',
          plugins: { legend: { display: false } },
          responsive: true,
          maintainAspectRatio: false
        }
      });

      return () => chart.destroy();
    }
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center">
        <div className="mr-4">
          <div className="chart-container" style={{ width: '160px', height: '160px' }}>
            <canvas ref={chartRef}></canvas>
          </div>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Top 3 consommation</p>
          <div className="flex items-center mt-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-sm">AB-123-CD (42L)</span>
          </div>
          <div className="flex items-center mt-1">
            <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
            <span className="text-sm">EF-456-GH (38L)</span>
          </div>
          <div className="flex items-center mt-1">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm">IJ-789-KL (35L)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuelConsumptionChart;