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

// REGISTRAR componentes
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

type InvestmentEntry = {
  portfolioValue: number;
  date: { seconds: number; nanoseconds: number };
  contributions: number;
  dailyReturn: number;
  portfolioIndex: number;
};

const InvestmentChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = listenToInvestmentData('user1', (data) => {
        const historyArray = data?.array;
        
        if (Array.isArray(historyArray)) {
    
            const sortedHistory = historyArray; //.sort((a: InvestmentEntry, b: InvestmentEntry) => a.date.seconds - b.date.seconds);

            const labels = sortedHistory.map((entry: InvestmentEntry) => {
                const date = new Date(entry.date.seconds * 1000); 
                return date.toLocaleDateString();
            });

            const values = sortedHistory.map((entry: InvestmentEntry) => entry.portfolioValue);

            setChartData({
                labels,
                datasets: [
                {
                    label: 'Valor del Portafolio',
                    data: values,
                    borderColor: 'magenta',
                    fill: 'origin',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
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

  console.log("Chart data:");
  if (!chartData) return <p>Loading chart...</p>;

  return <Line data={chartData} options={{
    responsive: true,
    plugins: {
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
                display: false // Oculta líneas verticales
            }
        },
        x: {
            title: { display: true, text: 'Fecha' },
            grid: {
                color: 'rgba(200,0,0,0.1)' // Cambia el color o pon false para ocultar
            }
        }
    }
    }} />;
};

export default InvestmentChart;
