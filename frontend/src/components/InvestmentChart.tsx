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
                const date = new Date(entry.date.seconds * 1000); // convertir segundos a ms
                return date.toLocaleDateString(); // o toISOString() si prefieres
            });

            const values = sortedHistory.map((entry: InvestmentEntry) => entry.portfolioValue);

            setChartData({
                labels,
                datasets: [
                {
                    label: 'Valor del Portafolio',
                    data: values,
                    borderColor: 'blue',
                    fill: false,
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

  return <Line data={chartData} />;
};

export default InvestmentChart;
