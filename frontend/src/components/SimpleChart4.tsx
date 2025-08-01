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
import type { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';
import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { listenToInvestmentData } from '../firebase/investmentData';
import { TooltipItem } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { callback } from 'chart.js/dist/helpers/helpers.core';

const verticalLinePlugin = {
  id: 'verticalLinePlugin',
  afterDraw: (chart: any) => {
    if (chart.tooltip?._active?.length) {
      const ctx = chart.ctx;
      const x = chart.tooltip._active[0].element.x;
      const topY = chart.chartArea.top;
      const bottomY = chart.chartArea.bottom;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, topY);
      ctx.lineTo(x, bottomY);
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#999'; // color de la línea vertical
      ctx.setLineDash([2, 3]);  // línea punteada opcional
      ctx.stroke();
      ctx.restore();
    }
  }
};

// REGISTRAR componentes
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  zoomPlugin,
  verticalLinePlugin
);

type InvestmentEntry = {
  portfolioValue: number;
  date: { seconds: number; nanoseconds: number };
  contributions: number;
  dailyReturn: number;
  portfolioIndex: number;
};


const SimpleChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);
  const chartRef = useRef<ChartJSOrUndefined<'line'>>(null);
  const [selectedPoints, setSelectedPoints] = useState<number[]>([]);
  const [comparison, setComparison] = useState<any>(null);
  const [updateFlag, setUpdateFlag] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const chart = chartRef.current;
    if (!chart) return;

    const { left } = chart.canvas.getBoundingClientRect();
    const x = event.clientX - left;
    const xScale = chart.scales.x;
    const xValue = xScale.getValueForPixel(x);
    const nearestIndex = Math.round(Number(xValue));

    if (nearestIndex < 0 || nearestIndex >= chartData.datasets[0].data.length) return;

    const newPoints = [...selectedPoints, nearestIndex];

    if (newPoints.length === 2) {
      const [i1, i2] = newPoints;
      const v1 = chartData.datasets[0].data[i1];
      const v2 = chartData.datasets[0].data[i2];
      const percentage = ((v2 - v1) / v1 * 100).toFixed(2);
      setComparison({ i1, i2, v1, v2, percentage });
      setSelectedPoints([]);
    } else {
      setSelectedPoints(newPoints);
    }
  };

  // chartData.datasets[0].data


  useEffect(() => {
    const unsubscribe = listenToInvestmentData('user1', (data) => {
        const historyArray = data?.array;
    
        
        if (Array.isArray(historyArray)) {

            
            const sortedHistory = historyArray; //.sort((a: InvestmentEntry, b: InvestmentEntry) => a.date.seconds - b.date.seconds);
            const downsampled = sortedHistory; //.filter((_, i) => i % 5 === 0);
            const labels = downsampled.map((entry: InvestmentEntry) => {
                const date = new Date(entry.date.seconds * 1000); 
                // Formato de fecha: YYYY/MM/DD
                return date.toISOString().split('T')[0]; // YYYY-MM-DD
                // return date.toLocaleDateString();
                // return date.toLocaleString('es-ES', { month: 'short', year: 'numeric' });
            });

            const values = downsampled.map((entry: InvestmentEntry) => Number(entry.portfolioValue / 1000000));

            setChartData({
                labels,
                datasets: [
                    {
                        label: '',
                        data: values,
                        borderColor: 'rgb(158, 13, 236)',
                        fill: false, 
                        backgroundColor: 'rgba(158, 13, 236, 0.97)',
                        borderWidth: 3.0, 
                        pointRadius: 0,
                        tension: 0.1,
                    },
                ],
            });
        } else {
            console.warn('No data.array found or not an array');
        }
    });

    return () => unsubscribe();
    }, []);

  if (!chartData) return <p>Loading chart...</p>;

  return (
    <div style={{ position: 'relative' }}>
  <Line 
  
  
  
  ref={chartRef} 


  data={{
    ...chartData,
    datasets: chartData.datasets.map((dataset: any, i: number) => ({
      ...dataset,
      pointRadius: (ctx: any) => {
          const index = ctx.dataIndex;
          if (comparison && (index === comparison.i1 || index === comparison.i2)) {
            return 5; // tamaño del punto cuando está seleccionado
          }
          return 0; // tamaño del punto normal
        }
      , // los puntos no se ven normalmente
      backgroundColor: (ctx: any) => {
          const index = ctx.dataIndex;
          if (comparison && (index === comparison.i1 || index === comparison.i2)) {
            return 'red'; // tamaño del punto cuando está seleccionado
          }
          return dataset.backgroundColor || 'blue';
        },
    }))
  }}
  
  
  onClick={handleClick} options={
    {
        responsive: true,
        interaction: {
            mode: 'index',      // activa todos los puntos en la misma posición X
            intersect: false    // permite que funcione sin tener que tocar el punto exacto
        },
        elements: {
            point: {
                radius: 0,           // los puntos no se ven normalmente
                hoverRadius: 6,      // pero sí se inflan cuando el mouse pasa cerca
                hoverBackgroundColor: 'rgba(13, 236, 31, 0.97)', // color del punto inflado
                hitRadius: 1000        // tolerancia para detectar hover
            }
        },
        plugins: {
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: true,
                    },
                    mode: 'x',
                },
                pan: {
                    enabled: true,
                    mode: 'xy',
                },
            },
            legend: {
                position: 'top',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                enabled: true, 
                backgroundColor: '#ffffff', // fondo blanco
                borderColor: 'rgba(158, 13, 236, 0.97)',     // borde gris oscuro
                borderWidth: 2,
                titleColor: '#000000',      // color de la fecha
                bodyColor: '#000000',   
                displayColors: false,
                yAlign: 'bottom',
                xAlign: 'center',
                padding: 10,

                // 👇 Personaliza sombra
                boxPadding: 12, // separa el contenido de los bordes del tooltip
                boxHeight: 2,
                boxWidth: 2,

                // 👇 Más separación respecto al punto (offset)
                caretPadding: 24, // separa el tooltip del puntero
                caretSize: 0,     // tamaño del triángulo que apunta    // color del valor
                titleFont: {
                    size: 14,
                    weight: 'bold',
                    family: 'Lexend',
                },
                bodyFont: {
                    size: 16,
                    family: 'Lexend',
                },

                callbacks: {
                    title: function (items) {
                        // primera línea: la fecha (label del eje X)
                        return `${items[0].label}`;
                    },
                    label: function (ctx) {
                        // segunda línea: el valor con formato
                        return `$ ${(Number(ctx.raw)   ).toFixed(1)}M`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: '' },
                
                border: {
                    display: false, // Oculta la línea del eje X
                },
                grid: {
                    color: 'rgba(232, 20, 34, 0.1)',
                    display: false,
                    // drawBorder: false,
                    drawOnChartArea: false,
                    drawTicks: false,
                },
                ticks: {
                    maxTicksLimit: 3,
                    callback: function (value) {
                        return `${Number(value).toFixed(1)}M`; // ✅ máximo 1 decimal
                    },
                    padding: 12,
                    align: 'inner',
                    color: '#444', // opcional
                    
                },
                position: 'right', // opcional si quieres moverlo
                alignToPixels: true,
                offset: true // en x y en y, si lo tienes activado
                // align: 'start', // o 'end' para cambiar la alineación del texto
            },
            x: {
                title: { display: true, text: '' },
                display: true,
                border: {
                    display: false, // Oculta la línea del eje X
                },
                grid: {
                    color: 'rgba(215, 17, 17, 0.1)', 
                    display: false, 
                    // drawBorder: false,
                    drawOnChartArea: false,
                    drawTicks: false,
                    
                },
                ticks: {
                    // autoSkip: true,
                    // maxTicksLimit: 6,
                    color: '#333',
                    callback: function(value, index, ticks) {
                        const total = ticks.length;
                        if (total > 60) {
                            // const step = (total - 2) / 3;
                            // const idx1 = Math.round(step);
                            // const idx2 = Math.round(step * 2);
                            if (index === total - 1 || index === 0) {
                                const label = this.getLabelForValue(Number(value));
                                // Espera formato M/D/YYYY
                                // const [day, month, year] = label.split('/').map(Number);
                                // Ajusta el mes (JavaScript cuenta los meses desde 0)
                                // const date = new Date(year, month-1, day);
                                const date = new Date(label);
                                // return String(month-1) + " " + String(year); // Formato "MM YYYY"
                                return date.toLocaleString('es-ES', { month: 'short', year: 'numeric' });

                                // return label;
                            }
                        }
                        return '';
                    }
                }
            }
        }
    }
  }  />
  {comparison && (
        <>
          <div style={{
            position: 'absolute',
            left: `${(comparison.i1 / (chartData.labels.length - 1)) * 100}%`,
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
            left: `${(comparison.i2 / (chartData.labels.length - 1)) * 100}%`,
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
  </div>);
};

export default SimpleChart;
