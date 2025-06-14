import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
} from 'chart.js';

import React, { useEffect, useState } from 'react';
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
  zoomPlugin,
  {
  id: 'gradient-fill',
  beforeDatasetsDraw(chart: any) {
    const { ctx, chartArea, data } = chart;
    if (!chartArea || !data.datasets.length) return;

    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    gradient.addColorStop(0, 'rgba(255, 0, 255, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 0, 255, 0)');
    data.datasets[0].backgroundColor = gradient;
  },
}
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

  useEffect(() => {
    const unsubscribe = listenToInvestmentData('user1', (data) => {
        const historyArray = data?.array;
    
        
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

//   const gradientFillPlugin = {
//     id: 'gradient-fill',
//     beforeDatasetsDraw: (chart: any) => {
//         const { ctx, chartArea, data } = chart;
//         if (!chartArea || !data.datasets.length) return;

//         const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
//         gradient.addColorStop(0, 'rgba(255, 0, 255, 0.4)');  
//         gradient.addColorStop(1, 'rgba(255, 0, 255, 0)');   

//         data.datasets[0].backgroundColor = gradient;
//     }
//     };

  return <Line data={chartData} options={
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
                    display: true 
                }
            },
            x: {
                title: { display: true, text: 'Fecha' },
                grid: {
                    color: 'rgba(215, 17, 17, 0.1)', 
                    
                    display: false, 
                    
                }
            }
        }
    }

  }  />;
};

export default SimpleChart;
