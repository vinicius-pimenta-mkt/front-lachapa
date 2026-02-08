import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './ProductsChart.css';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ProductsChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor?: string;
      borderWidth?: number;
    }[];
  };
  title?: string;
  height?: number;
}

const ProductsChart: React.FC<ProductsChartProps> = ({ 
  data, 
  title = 'Produtos Mais Vendidos', 
  height = 300 
}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: {
        position: 'top' as const,
        display: data.datasets.length > 1,
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.x !== null) {
              label += new Intl.NumberFormat('pt-BR', { 
                style: 'currency', 
                currency: 'BRL' 
              }).format(context.parsed.x);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return new Intl.NumberFormat('pt-BR', { 
              style: 'currency', 
              currency: 'BRL',
              maximumFractionDigits: 0
            }).format(value);
          }
        }
      },
      y: {
        ticks: {
          font: {
            size: 11
          },
          callback: function(_value: any, index: number, _values: any[]) {
            const label = data.labels[index];
            // Truncar texto longo
            return label.length > 20 ? label.substring(0, 18) + '...' : label;
          }
        }
      }
    }
  };

  return (
    <div className="products-chart-container" style={{ height }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default ProductsChart;
