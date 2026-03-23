import React, { useState, useEffect } from 'react';
import './Reports.css';
import '../../styles/theme.css';
import Sidebar from '../../components/common/Sidebar';
import Header from '../../components/common/Header';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Tipos
interface SalesByPeriod {
  date: string;
  total: number;
}

interface ProductSales {
  name: string;
  quantity: number;
  revenue: number;
}

interface PaymentMethodData {
  method: string;
  amount: number;
}

interface ReportData {
  totalRevenue: number;
  totalOrders: number;
  averageTicket: number;
  salesByPeriod: SalesByPeriod[];
  topProducts: ProductSales[];
  paymentMethods: PaymentMethodData[];
}

const Reports: React.FC = () => {
  // Estados
  const [period, setPeriod] = useState<'day' | 'week' | 'fortnight' | 'month'>('day');
  const [startDate, setStartDate] = useState<string>(getTodayDate());
  const [endDate, setEndDate] = useState<string>(getTodayDate());
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Funções auxiliares
  function getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  function formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  // Efeito para carregar dados do relatório
  useEffect(() => {
    const fetchReportData = async () => {
      setIsLoading(true);
      
      try {
        // Simulando chamada à API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Dados simulados
        const mockData: ReportData = generateMockData(period);
        setReportData(mockData);
      } catch (error) {
        console.error('Erro ao carregar dados do relatório:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [period, startDate, endDate]);

  // Gerar dados simulados com base no período selecionado
  function generateMockData(period: string): ReportData {
    let salesByPeriod: SalesByPeriod[] = [];
    // let daysInPeriod = 1; // Variável não utilizada
    
    // Gerar dados de vendas por período
    switch (period) {
      case 'day':
        // Vendas por hora do dia
        salesByPeriod = Array.from({ length: 12 }, (_, i) => {
          const hour = 10 + i; // 10h às 22h
          return {
            date: `${hour}:00`,
            total: Math.floor(Math.random() * 500) + 100
          };
        });
        break;
      
      case 'week':
        // Vendas dos últimos 7 dias
        // daysInPeriod = 7; // Variável não utilizada
        salesByPeriod = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - 6 + i);
          return {
            date: date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' }),
            total: Math.floor(Math.random() * 2000) + 500
          };
        });
        break;
      
      case 'fortnight':
        // Vendas dos últimos 15 dias
        // daysInPeriod = 15; // Variável não utilizada
        salesByPeriod = Array.from({ length: 15 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - 14 + i);
          return {
            date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
            total: Math.floor(Math.random() * 2000) + 500
          };
        });
        break;
      
      case 'month':
        // Vendas dos últimos 30 dias
        // daysInPeriod = 30; // Variável não utilizada
        salesByPeriod = Array.from({ length: 30 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - 29 + i);
          return {
            date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
            total: Math.floor(Math.random() * 2000) + 500
          };
        });
        break;
    }

    // Calcular receita total
    const totalRevenue = salesByPeriod.reduce((sum, day) => sum + day.total, 0);
    
    // Gerar dados de produtos mais vendidos
    const products = [
      'X-Tudo', 'X-Salada', 'X-Bacon', 'X-Egg', 'X-Frango',
      'Refrigerante Lata', 'Refrigerante 2L', 'Suco Natural',
      'Batata Frita P', 'Batata Frita M', 'Batata Frita G',
      'Combo 1', 'Combo 2', 'Combo Família'
    ];
    
    const topProducts: ProductSales[] = products.slice(0, 10).map(name => ({
      name,
      quantity: Math.floor(Math.random() * 100) + 10,
      revenue: Math.floor(Math.random() * 1000) + 200
    })).sort((a, b) => b.revenue - a.revenue);
    
    // Gerar dados de métodos de pagamento
    const paymentMethods: PaymentMethodData[] = [
      { method: 'Cartão de Crédito', amount: Math.floor(Math.random() * totalRevenue * 0.5) },
      { method: 'Cartão de Débito', amount: Math.floor(Math.random() * totalRevenue * 0.3) },
      { method: 'Dinheiro', amount: Math.floor(Math.random() * totalRevenue * 0.1) },
      { method: 'PIX', amount: Math.floor(Math.random() * totalRevenue * 0.2) }
    ];
    
    // Ajustar o último para garantir que a soma seja igual ao total
    const sumPayments = paymentMethods.reduce((sum, method) => sum + method.amount, 0);
    paymentMethods[3].amount += (totalRevenue - sumPayments);
    
    // Calcular número total de pedidos e ticket médio
    const totalOrders = Math.floor(totalRevenue / 35) + Math.floor(Math.random() * 20);
    const averageTicket = totalRevenue / totalOrders;
    
    return {
      totalRevenue,
      totalOrders,
      averageTicket,
      salesByPeriod,
      topProducts,
      paymentMethods
    };
  }

  // Configurar dados para os gráficos
  const salesChartData = {
    labels: reportData?.salesByPeriod.map(item => item.date) || [],
    datasets: [
      {
        label: 'Vendas',
        data: reportData?.salesByPeriod.map(item => item.total) || [],
        backgroundColor: 'rgba(229, 57, 53, 0.2)',
        borderColor: 'rgba(229, 57, 53, 1)',
        borderWidth: 2,
        tension: 0.4
      }
    ]
  };

  const productsChartData = {
    labels: reportData?.topProducts.slice(0, 5).map(item => item.name) || [],
    datasets: [
      {
        label: 'Quantidade Vendida',
        data: reportData?.topProducts.slice(0, 5).map(item => item.quantity) || [],
        backgroundColor: [
          'rgba(255, 152, 0, 0.7)',
          'rgba(229, 57, 53, 0.7)',
          'rgba(255, 193, 7, 0.7)',
          'rgba(76, 175, 80, 0.7)',
          'rgba(33, 150, 243, 0.7)'
        ],
        borderWidth: 1
      }
    ]
  };

  const paymentChartData = {
    labels: reportData?.paymentMethods.map(item => item.method) || [],
    datasets: [
      {
        data: reportData?.paymentMethods.map(item => item.amount) || [],
        backgroundColor: [
          'rgba(33, 150, 243, 0.7)',
          'rgba(76, 175, 80, 0.7)',
          'rgba(255, 193, 7, 0.7)',
          'rgba(229, 57, 53, 0.7)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Manipuladores de eventos
  const handlePeriodChange = (newPeriod: 'day' | 'week' | 'fortnight' | 'month') => {
    setPeriod(newPeriod);
    
    // Ajustar datas com base no período
    const today = new Date();
    let start = new Date();
    
    switch (newPeriod) {
      case 'day':
        setStartDate(today.toISOString().split('T')[0]);
        setEndDate(today.toISOString().split('T')[0]);
        break;
      
      case 'week':
        start.setDate(today.getDate() - 6);
        setStartDate(start.toISOString().split('T')[0]);
        setEndDate(today.toISOString().split('T')[0]);
        break;
      
      case 'fortnight':
        start.setDate(today.getDate() - 14);
        setStartDate(start.toISOString().split('T')[0]);
        setEndDate(today.toISOString().split('T')[0]);
        break;
      
      case 'month':
        start.setDate(today.getDate() - 29);
        setStartDate(start.toISOString().split('T')[0]);
        setEndDate(today.toISOString().split('T')[0]);
        break;
    }
  };

  // Opções para os gráficos
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Vendas por ${period === 'day' ? 'Hora' : 'Dia'}`,
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Top 5 Produtos Mais Vendidos',
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Métodos de Pagamento',
      },
    },
  };

  return (
    <div className="reports-container">
      <Sidebar />
      
      <div className="reports-content">
        <Header title="Relatórios" />
        
        <div className="reports-filters">
          <div className="period-selector">
            <button 
              className={`period-btn ${period === 'day' ? 'active' : ''}`}
              onClick={() => handlePeriodChange('day')}
            >
              Hoje
            </button>
            <button 
              className={`period-btn ${period === 'week' ? 'active' : ''}`}
              onClick={() => handlePeriodChange('week')}
            >
              Última Semana
            </button>
            <button 
              className={`period-btn ${period === 'fortnight' ? 'active' : ''}`}
              onClick={() => handlePeriodChange('fortnight')}
            >
              Última Quinzena
            </button>
            <button 
              className={`period-btn ${period === 'month' ? 'active' : ''}`}
              onClick={() => handlePeriodChange('month')}
            >
              Último Mês
            </button>
          </div>
          
          <div className="date-range">
            <div className="date-input">
              <label>De:</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="date-input">
              <label>Até:</label>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <button className="apply-btn">
              <i className="bi bi-search"></i> Aplicar
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Carregando dados do relatório...</p>
          </div>
        ) : reportData ? (
          <div className="reports-content-body">
            {/* Métricas principais */}
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon revenue-icon">
                  <i className="bi bi-cash-coin"></i>
                </div>
                <div className="metric-data">
                  <h3>Receita Total</h3>
                  <div className="metric-value">{formatCurrency(reportData.totalRevenue)}</div>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon orders-icon">
                  <i className="bi bi-bag-check"></i>
                </div>
                <div className="metric-data">
                  <h3>Total de Pedidos</h3>
                  <div className="metric-value">{reportData.totalOrders}</div>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon ticket-icon">
                  <i className="bi bi-receipt"></i>
                </div>
                <div className="metric-data">
                  <h3>Ticket Médio</h3>
                  <div className="metric-value">{formatCurrency(reportData.averageTicket)}</div>
                </div>
              </div>
            </div>
            
            {/* Gráfico de vendas */}
            <div className="chart-container sales-chart">
              <Line data={salesChartData} options={lineChartOptions} />
            </div>
            
            {/* Gráficos de produtos e pagamentos */}
            <div className="charts-row">
              <div className="chart-container products-chart">
                <Bar data={productsChartData} options={barChartOptions} />
              </div>
              
              <div className="chart-container payment-chart">
                <Pie data={paymentChartData} options={pieChartOptions} />
              </div>
            </div>
            
            {/* Tabela de produtos mais vendidos */}
            <div className="products-table-container">
              <h3>Produtos Mais Vendidos</h3>
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Quantidade</th>
                    <th>Receita</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.topProducts.map((product, index) => (
                    <tr key={index}>
                      <td>{product.name}</td>
                      <td>{product.quantity}</td>
                      <td>{formatCurrency(product.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Botões de exportação */}
            <div className="export-buttons">
              <button className="export-btn">
                <i className="bi bi-file-earmark-pdf"></i> Exportar PDF
              </button>
              <button className="export-btn">
                <i className="bi bi-file-earmark-excel"></i> Exportar Excel
              </button>
              <button className="export-btn">
                <i className="bi bi-printer"></i> Imprimir
              </button>
            </div>
          </div>
        ) : (
          <div className="no-data">
            <i className="bi bi-exclamation-circle"></i>
            <p>Nenhum dado disponível para o período selecionado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
