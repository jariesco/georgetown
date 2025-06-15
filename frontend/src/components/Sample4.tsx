import React, { useRef, useState } from 'react';
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
import type { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const labels = ['01/01', '01/02', '01/03', '01/04', '01/05', '01/06'];
const values = [1, 2, 1.5, 2.5, 3.2, 3.8];

const SimpleRangeChart = () => {
  const chartRef = useRef<ChartJSOrUndefined<'line'>>(null);
  const [selectedPoints, setSelectedPoints] = useState<number[]>([]);
  const [comparison, setComparison] = useState<any>(null);

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const chart = chartRef.current;
    if (!chart) return;

    const { left } = chart.canvas.getBoundingClientRect();
    const x = event.clientX - left;
    const xScale = chart.scales.x;
    const xValue = xScale.getValueForPixel(x);
    const nearestIndex = Math.round(Number(xValue));

    if (nearestIndex < 0 || nearestIndex >= values.length) return;

    const newPoints = [...selectedPoints, nearestIndex];

    if (newPoints.length === 2) {
      const [i1, i2] = newPoints;
      const v1 = values[i1];
      const v2 = values[i2];
      const percentage = ((v2 - v1) / v1 * 100).toFixed(2);
      setComparison({ i1, i2, v1, v2, percentage });
      setSelectedPoints([]);
    } else {
      setSelectedPoints(newPoints);
    }
  };

  const options: any = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    },
    scales: {
      x: {
        ticks: { display: true },
        grid: {
          drawTicks: false,
          drawOnChartArea: false,
          drawBorder: false
        },
      },
      y: {
        ticks: { display: true },
        grid: {
          drawTicks: false,
          drawOnChartArea: false,
          drawBorder: false
        },
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
        <>
          <div style={{
            position: 'absolute',
            left: `${(comparison.i1 / (labels.length - 1)) * 100}%`,
            top: '10%',
            transform: 'translateX(-50%)',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            padding: '4px 8px',
            fontSize: '12px',
            borderRadius: '4px'
          }}>
            {comparison.v1}
          </div>
          <div style={{
            position: 'absolute',
            left: `${(comparison.i2 / (labels.length - 1)) * 100}%`,
            top: '10%',
            transform: 'translateX(-50%)',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            padding: '4px 8px',
            fontSize: '12px',
            borderRadius: '4px'
          }}>
            <div>{comparison.v2}</div>
            <div>{comparison.percentage}%</div>
          </div>
        </>
      )}
    </div>
  );
};

export default SimpleRangeChart;
