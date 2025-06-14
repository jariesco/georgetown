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
    // console.log("inicio gradient fill");
    if (!chartArea || !data.datasets.length) return;
    // console.log("inicio gradient fill 2323223232");

    // area bajo el grafico de color verde
    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    gradient.addColorStop(0, 'rgba(255, 0, 255, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 0, 255, 0)');

    
    data.datasets[0].backgroundColor = 'red'; // Cambia el color de fondo a rojo
    data.datasets[0].fill = false; // Asegura que el área se rellene
    data.datasets[0].borderColor = 'blue'; // Cambia el color del borde a magenta

    // console.log("dataset:", data.datasets[0])
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
            const downsampled = sortedHistory.filter((_, i) => i % 5 === 0);
            const labels = downsampled.map((entry: InvestmentEntry) => {
                const date = new Date(entry.date.seconds * 1000); 
                return date.toLocaleDateString();
            });

            const values = downsampled.map((entry: InvestmentEntry) => String(entry.portfolioValue / 1000000));

            setChartData({
                labels,
                datasets: [
                    {
                        label: 'Valor del Portafolio',
                        data: values,
                        // borderColor: 'blue',
                        // fill: true, 
                        // backgroundColor: 'rgba(58, 4, 255, 0.97)',
                        borderWidth: 1, 
                        pointRadius: 12.3,
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

  return <Line data={chartData} options={
    {
        responsive: true,
        // linea vertical sobre punto actual de tooltip
        interaction: {
            mode: 'index',
            intersect: false,
        },

        
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
                },
                displayColors: false, // Oculta los colores de la leyenda
                backgroundColor: 'rgba(7, 2, 2, 0.9)', // Fondo blanco
                titleColor: 'white', // Color del título
                bodyColor: 'white', // Color del texto
                borderColor: 'rgba(255, 255, 255, 0.5)', // Color del borde
                borderWidth: 1, // Ancho del borde
                padding: 10, // Espaciado interno
                boxPadding: 10, // Espaciado alrededor del tooltip
                cornerRadius: 5, // Bordes redondeados
                titleFont: { size: 14, weight: 'bold' }, // Estilo del título
                bodyFont: { size: 12 }, // Estilo del cuerpo
                footerFont: { size: 12 }, // Estilo del pie
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Valor ($)' },
                grid: {
                    color: 'rgba(232, 20, 34, 0.1)',
                    display: false 
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
