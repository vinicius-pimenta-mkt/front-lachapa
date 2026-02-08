import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import '../../styles/theme.css';
import Sidebar from '../../components/common/Sidebar';
import Header from '../../components/common/Header';
import SalesChart from '../../components/dashboard/SalesChart';
import PaymentMethodsChart from '../../components/dashboard/PaymentMethodsChart';
import MetricCard from '../../components/dashboard/MetricCard';
import RecentOrdersTable from '../../components/dashboard/RecentOrdersTable';

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalSales: 0,
    ordersInProgress: 0,
    averageTime: 0,
    topProduct: ''
  });
  
  // Dados simulados para demonstração
  const mockData = {
    totalSales: 1250.75,
    ordersInProgress: 8,
    averageTime: 22,
    topProduct: 'X-Tudo',
    salesByHour: [
      { hour: '10:00', sales: 320 },
      { hour: '11:00', sales: 450 },
      { hour: '12:00', sales: 780 },
      { hour: '13:00', sales: 890 },
      { hour: '14:00', sales: 650 },
      { hour: '15:00', sales: 480 },
      { hour: '16:00', sales: 380 },
      { hour: '17:00', sales: 520 },
      { hour: '18:00', sales: 790 },
      { hour: '19:00', sales: 950 },
      { hour: '20:00', sales: 820 },
      { hour: '21:00', sales: 540 }
    ],
    paymentMethods: [
      { method: 'Dinheiro', value: 35 },
      { method: 'Cartão de Crédito', value: 42 },
      { method: 'Cartão de Débito', value: 18 },
      { method: 'Pix', value: 25 }
    ],
    recentOrders: [
      { id: '20251015-1234', customer: 'João Silva', total: 37.90, status: 'em_producao', time: '15:45' },
      { id: '20251015-1235', customer: 'Maria Oliveira', total: 52.50, status: 'em_analise', time: '15:42' },
      { id: '20251015-1236', customer: 'Pedro Santos', total: 28.90, status: 'em_entrega', time: '15:30' },
      { id: '20251015-1237', customer: 'Ana Costa', total: 45.80, status: 'em_producao', time: '15:25' },
      { id: '20251015-1238', customer: 'Carlos Mendes', total: 63.70, status: 'em_entrega', time: '15:10' }
    ]
  };

  useEffect(() => {
    // Simulando carregamento de dados da API
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMetrics({
          totalSales: mockData.totalSales,
          ordersInProgress: mockData.ordersInProgress,
          averageTime: mockData.averageTime,
          topProduct: mockData.topProduct
        });
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <div className="dashboard-content">
        <Header title="Dashboard" />
        
        <div className="dashboard-grid">
          {/* Métricas principais */}
          <div className="metrics-container">
            <MetricCard 
              title="Vendas Hoje" 
              value={`R$ ${metrics.totalSales.toFixed(2)}`} 
              icon="bi-cash-coin" 
              color="primary"
              isLoading={isLoading}
            />
            <MetricCard 
              title="Pedidos em Andamento" 
              value={metrics.ordersInProgress.toString()} 
              icon="bi-clipboard-check" 
              color="warning"
              isLoading={isLoading}
            />
            <MetricCard 
              title="Tempo Médio" 
              value={`${metrics.averageTime} min`} 
              icon="bi-clock" 
              color="info"
              isLoading={isLoading}
            />
            <MetricCard 
              title="Produto Mais Vendido" 
              value={metrics.topProduct} 
              icon="bi-trophy" 
              color="success"
              isLoading={isLoading}
            />
          </div>
          
          {/* Gráficos */}
          <div className="charts-container">
            <div className="chart-card">
              <h3>Vendas por Hora</h3>
              <SalesChart data={{
                labels: mockData.salesByHour.map(item => item.hour),
                datasets: [{
                  label: 'Vendas',
                  data: mockData.salesByHour.map(item => item.sales),
                  backgroundColor: 'rgba(255, 152, 0, 0.6)', // Orange
                  borderColor: 'rgba(255, 152, 0, 1)',
                  tension: 0.4,
                  fill: true,
                }]
              }} isLoading={isLoading} />
            </div>
            
            <div className="chart-card">
              <h3>Métodos de Pagamento</h3>
              <PaymentMethodsChart data={{
                labels: mockData.paymentMethods.map(item => item.method),
                datasets: [{
                  data: mockData.paymentMethods.map(item => item.value),
                  backgroundColor: ['#E53935', '#FF9800', '#4CAF50', '#FFEB3B'], // Red, Orange, Green, Yellow
                  borderColor: ['#E53935', '#FF9800', '#4CAF50', '#FFEB3B'],
                  borderWidth: 1,
                }]
              }} isLoading={isLoading} />
            </div>
          </div>
          
          {/* Pedidos Recentes */}
          <div className="recent-orders-container">
            <h3>Pedidos Recentes</h3>
            <RecentOrdersTable orders={mockData.recentOrders} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
