import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import React from 'react';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);  

const chartData = {
  labels: ['01/01', '01/02', '01/03', '01/04', '01/05', '01/06', '01/07', '01/08', '01/09', '01/10', '01/11', '01/12'],
  datasets: [
    {
      label: 'Demo',
      data: [225, 239, 246, 236, 238, 243, 250, 255, 253, 267, 260, 254],
      borderColor: 'red',
      backgroundColor: 'rgba(0, 0, 255, 0.3)',
      fill: { target: 'origin', above: 'rgba(255,0,0,0.3)' },
      tension: 0.3
    }
  ]
};

const SimpleChart: React.FC = () => {
  return <Line data={chartData} options={{ responsive: true }} />;
};

export default SimpleChart;
