import React, { useState, useEffect } from 'react';
import { DollarSign, ClipboardCheck, Clock, Trophy } from 'lucide-react';
import './Dashboard.css';
import '../../styles/theme.css';
import Sidebar from '../../components/common/Sidebar';
import Header from '../../components/common/Header';
import SalesChart from '../../components/dashboard/SalesChart';
import PaymentMethodsChart from '../../components/dashboard/PaymentMethodsChart';
import MetricCard from '../../components/dashboard/MetricCard';
import RecentOrdersTable from '../../components/dashboard/RecentOrdersTable';
import { getDashboardReport, fetchPedidos, formatDateForAPI } from '../../config/api';

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({
    totalSales: 0,
    ordersInProgress: 0,
    averageTicket: 0,
    topProduct: '',
    revenueChange: 0,
  });
  const [salesData, setSalesData] = useState<{ labels: string[]; data: number[] }>({ labels: [], data: [] });
  const [paymentData, setPaymentData] = useState<{ labels: string[]; data: number[]; colors: string[] }>({ labels: [], data: [], colors: [] });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  const paymentColors: Record<string, string> = {
    'Dinheiro': '#4CAF50',
    'Cartão de Crédito': '#E53935',
    'Cartão de Débito': '#FF9800',
    'Crédito': '#E53935',
    'Débito': '#FF9800',
    'Pix': '#FFEB3B',
    'pix': '#FFEB3B',
    'cash': '#4CAF50',
    'card': '#E53935',
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const today = new Date();
      const startOfDay = formatDateForAPI(today);
      const endOfDay = formatDateForAPI(today);

      // Buscar dashboard report e pedidos recentes em paralelo
      const [dashboardData, pedidos] = await Promise.all([
        getDashboardReport(startOfDay, endOfDay),
        fetchPedidos(),
      ]);

      if (dashboardData.success) {
        const { summary, top_products, payment_methods } = dashboardData.data;

        setMetrics({
          totalSales: summary.total_revenue,
          ordersInProgress: summary.total_orders,
          averageTicket: summary.average_ticket,
          topProduct: top_products.length > 0 ? top_products[0].name : 'N/A',
          revenueChange: summary.revenue_change_percent,
        });

        // Preparar dados de métodos de pagamento
        if (payment_methods && payment_methods.length > 0) {
          setPaymentData({
            labels: payment_methods.map(p => p.method),
            data: payment_methods.map(p => p.total),
            colors: payment_methods.map(p => paymentColors[p.method] || '#9E9E9E'),
          });
        }
      }

      // Pedidos recentes (últimos 5)
      if (pedidos && pedidos.length > 0) {
        const recent = pedidos.slice(0, 5).map(p => ({
          id: p.numero,
          customer: p.cliente_nome,
          total: p.valor_total,
          status: p.status,
          time: p.data_criacao ? new Date(p.data_criacao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '--:--',
        }));
        setRecentOrders(recent);

        // Contar pedidos em andamento
        const inProgress = pedidos.filter(p => p.status === 'em_analise' || p.status === 'em_producao').length;
        setMetrics(prev => ({ ...prev, ordersInProgress: inProgress }));
      }

    } catch (err: any) {
      console.error('Erro ao carregar dados do dashboard:', err);
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <div className="dashboard-content">
        <Header title="Dashboard" />
        
        {error && (
          <div style={{ padding: '12px 16px', margin: '16px 0', background: 'rgba(229,57,53,0.1)', color: '#E53935', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>⚠️ {error}</span>
            <button onClick={fetchData} style={{ background: '#E53935', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer' }}>
              Tentar novamente
            </button>
          </div>
        )}
        
        <div className="dashboard-grid">
          {/* Métricas principais */}
          <div className="metrics-container">
            <MetricCard 
              title="Vendas Hoje" 
              value={`R$ ${metrics.totalSales.toFixed(2)}`} 
              icon={<DollarSign size={24} />}
              color="primary"
              isLoading={isLoading}
              change={metrics.revenueChange !== 0 ? { value: Math.abs(metrics.revenueChange), isPositive: metrics.revenueChange > 0 } : undefined}
            />
            <MetricCard 
              title="Pedidos em Andamento" 
              value={metrics.ordersInProgress.toString()} 
              icon={<ClipboardCheck size={24} />}
              color="warning"
              isLoading={isLoading}
            />
            <MetricCard 
              title="Ticket Médio" 
              value={`R$ ${metrics.averageTicket.toFixed(2)}`} 
              icon={<Clock size={24} />}
              color="info"
              isLoading={isLoading}
            />
            <MetricCard 
              title="Produto Mais Vendido" 
              value={metrics.topProduct} 
              icon={<Trophy size={24} />}
              color="success"
              isLoading={isLoading}
            />
          </div>
          
          {/* Gráficos */}
          <div className="charts-container">
            <div className="chart-card">
              <h3>Vendas</h3>
              <SalesChart data={{
                labels: salesData.labels.length > 0 ? salesData.labels : ['Sem dados'],
                datasets: [{
                  label: 'Vendas',
                  data: salesData.data.length > 0 ? salesData.data : [0],
                  backgroundColor: 'rgba(255, 152, 0, 0.6)',
                  borderColor: 'rgba(255, 152, 0, 1)',
                  tension: 0.4,
                  fill: true,
                }]
              }} isLoading={isLoading} />
            </div>
            
            <div className="chart-card">
              <h3>Métodos de Pagamento</h3>
              <PaymentMethodsChart data={{
                labels: paymentData.labels.length > 0 ? paymentData.labels : ['Sem dados'],
                datasets: [{
                  data: paymentData.data.length > 0 ? paymentData.data : [1],
                  backgroundColor: paymentData.colors.length > 0 ? paymentData.colors : ['#E0E0E0'],
                  borderColor: paymentData.colors.length > 0 ? paymentData.colors : ['#E0E0E0'],
                  borderWidth: 1,
                }]
              }} isLoading={isLoading} />
            </div>
          </div>
          
          {/* Pedidos Recentes */}
          <div className="recent-orders-container">
            <h3>Pedidos Recentes</h3>
            <RecentOrdersTable orders={recentOrders} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
