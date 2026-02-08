import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './PaymentMethodsChart.css';

// Registrar componentes do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

interface PaymentMethodsChartProps {
  isLoading: boolean;
  data: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[];
  };
  title?: string;
  height?: number;
}

const PaymentMethodsChart: React.FC<PaymentMethodsChartProps> = ({ 
  data, 
  title = 'Métodos de Pagamento', 
  height = 300,
  isLoading = false
}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          font: {
            size: 12
          },
          padding: 20
        }
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
          weight: 'bold' as const
        },
        padding: {
          bottom: 15
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            
            return `${label}: ${new Intl.NumberFormat('pt-BR', { 
              style: 'currency', 
              currency: 'BRL' 
            }).format(value)} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%',
  };

  return (
    <div className="payment-methods-chart-container" style={{ height }}>
      {isLoading ? (
        <div className="loading-state">Carregando dados...</div>
      ) : (
        <Doughnut data={data} options={options} />
      )}
    </div>
  );
};

export default PaymentMethodsChart;
