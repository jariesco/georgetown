import React, { useRef, useState } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const labels = ['01/01', '01/02', '01/03', '01/04', '01/05', '01/06'];
const values = [1, 2, 1.5, 2.5, 3.2, 3.8];

const SimpleChart = () => {
  const chartRef = useRef<ChartJSOrUndefined<'line'>>(null);
  const [selectedPoints, setSelectedPoints] = useState<number[]>([]);
  const [comparison, setComparison] = useState<any>(null);

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const chart = chartRef.current;
    if (!chart) return;

    const elements = chart.getElementsAtEventForMode(
      event.nativeEvent,
      'nearest',
      { intersect: false },
      false
    );

    if (!elements.length) return;

    const index = elements[0].index;
    const newPoints = [...selectedPoints, index];

    if (newPoints.length === 2) {
      const i1 = newPoints[0];
      const i2 = newPoints[1];
      const v1 = values[i1];
      const v2 = values[i2];
      const percentage = ((v2 - v1) / v1 * 100).toFixed(2);
      setComparison({ i1, i2, v1, v2, percentage });
      setSelectedPoints([]);
    } else {
      setSelectedPoints(newPoints);
    }
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    },
    scales: {
      x: {
        ticks: { display: true },
        grid: { drawOnChartArea: false, drawTicks: false },
      },
      y: {
        ticks: { display: true },
        grid: { drawOnChartArea: false, drawTicks: false },
      },
    },
  };

  return (
    <div style={{ position: 'relative' }}>
      <Line
        ref={chartRef}
        data={{
          labels,
          datasets: [
            {
              label: 'Valor',
              data: values,
              borderColor: 'blue',
              pointRadius: 0,
              tension: 0.3,
            }
          ]
        }}
        options={options}
        onClick={handleClick}
      />
      {comparison && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          padding: '6px 12px',
          fontSize: '14px',
          boxShadow: '0px 2px 5px rgba(0,0,0,0.2)',
          borderRadius: '4px'
        }}>
          <div>Inicio: {comparison.v1}</div>
          <div>Fin: {comparison.v2}</div>
          <div>Cambio: {comparison.percentage}%</div>
        </div>
      )}
    </div>
  );
};

export default SimpleChart;
