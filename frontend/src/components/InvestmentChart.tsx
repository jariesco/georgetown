import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
} from 'chart.js';

import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { listenToInvestmentData } from '../firebase/investmentData';
import { TooltipItem } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

// REGISTRAR componentes
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  zoomPlugin
);

type InvestmentEntry = {
  portfolioValue: number;
  date: { seconds: number; nanoseconds: number };
  contributions: number;
  dailyReturn: number;
  portfolioIndex: number;
};

const createGradient = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return 'blue'; // fallback

  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(0, 123, 255, 0.4)');
  gradient.addColorStop(1, 'rgba(0, 123, 255, 0)');

  return gradient;
};


const InvestmentChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    const unsubscribe = listenToInvestmentData('user1', (data) => {
        const historyArray = data?.array;
        
        let gradient;
        if (chartRef.current) {
            const ctx = chartRef.current.ctx;
            gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(0, 123, 255, 0.4)');
            gradient.addColorStop(1, 'rgba(0, 123, 255, 0)');
        } else {
            gradient = createGradient();
        }
        
        if (Array.isArray(historyArray)) {

            
            const sortedHistory = historyArray; //.sort((a: InvestmentEntry, b: InvestmentEntry) => a.date.seconds - b.date.seconds);
            const downsampled = sortedHistory; //.filter((_, i) => i % 5 === 0);
            const labels = downsampled.map((entry: InvestmentEntry) => {
                const date = new Date(entry.date.seconds * 1000); 
                return date.toLocaleDateString();
            });

            const values = downsampled.map((entry: InvestmentEntry) => entry.portfolioValue);

            setChartData({
                labels,
                datasets: [
                    {
                        label: 'Valor del Portafolio',
                        data: values,
                        borderColor: 'magenta',
                        fill: true,
                        backgroundColor: gradient,
                        borderWidth: 2,
                        pointRadius: 0.3,
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

  return <Line ref={chartRef} data={chartData} options={
    {
        responsive: true,
        plugins: {
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true, // activa zoom con scroll
                    },
                    pinch: {
                        enabled: true, // activa zoom táctil
                    },
                    mode: 'x', // zoom solo horizontal
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
                callbacks: {
                    label: function (ctx: TooltipItem<'line'>) {
                        const value = ctx.raw as number;
                        return `$${value.toLocaleString()}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Valor ($)' },
                grid: {
                    color: 'rgba(232, 20, 34, 0.1)',
                    display: true // Oculta líneas verticales
                }
            },
            x: {
                title: { display: true, text: 'Fecha' },
                grid: {
                    color: 'rgba(215, 17, 17, 0.1)', // Cambia el color o pon false para ocultar
                    
                    display: false, // Muestra líneas horizontales
                    
                }
            }
        }
    }

  } />;
};

export default InvestmentChart;
