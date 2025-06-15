import React, { useRef, useEffect, useState } from 'react';
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
import { Chart } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const labels = ['01/01', '01/02', '01/03', '01/04', '01/05', '01/06'];
const values = [1, 2, 1.5, 2.5, 3.2, 3.8];

const SimpleRangeChart = () => {
  const chartRef = useRef<any>(null);
  const [range, setRange] = useState<any>(null);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState<number | null>(null);

  const handleMouseDown = (event: MouseEvent) => {
    const chart = chartRef.current?.canvas ? chartRef.current : null;
    if (!chart) return;
    const rect = chart.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    setStartX(x);
    setDragging(true);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!dragging || startX === null) return;
    const chart = chartRef.current?.canvas ? chartRef.current : null;
    if (!chart) return;
    const rect = chart.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const xScale = chart.scales.x;
    const startIdx = xScale.getValueForPixel(startX ?? 0);
    const endIdx = xScale.getValueForPixel(x);
    const i1 = Math.floor(Math.max(0, Math.min(startIdx, endIdx)));
    const i2 = Math.floor(Math.min(values.length - 1, Math.max(startIdx, endIdx)));
    const v1 = values[i1];
    const v2 = values[i2];
    const percentage = ((v2 - v1) / v1 * 100).toFixed(2);
    setRange({ i1, i2, v1, v2, percentage });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleClick = () => {
    if (!dragging && range) {
      setRange(null);
    }
  };

  const options: any = {
    responsive: true,
    onClick: handleClick,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    },
    scales: {
      x: {
        ticks: { display: true },
        grid: { drawBorder: false, drawOnChartArea: false, drawTicks: false },
      },
      y: {
        ticks: { display: true },
        grid: { drawBorder: false, drawOnChartArea: false, drawTicks: false },
      },
    },
  };

  useEffect(() => {
    const chart = chartRef.current?.canvas ? chartRef.current : null;
    if (!chart) return;
    const canvas = chart.canvas;
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, startX]);

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
      />
      {range && (
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
          <div>Inicio: {range.v1}</div>
          <div>Fin: {range.v2}</div>
          <div>Cambio: {range.percentage}%</div>
        </div>
      )}
    </div>
  );
};

export default SimpleRangeChart;
