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
import { getSalesReport, getProductsReport, getPaymentMethodsReport, formatDateForAPI } from '../../config/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

interface ReportData {
  totalRevenue: number;
  totalOrders: number;
  averageTicket: number;
  salesByPeriod: { date: string; total: number }[];
  topProducts: { name: string; quantity: number; revenue: number }[];
  paymentMethods: { method: string; amount: number }[];
}

const Reports: React.FC = () => {
  const [period, setPeriod] = useState<'day' | 'week' | 'fortnight' | 'month'>('day');
  const [startDate, setStartDate] = useState<string>(getTodayDate());
  const [endDate, setEndDate] = useState<string>(getTodayDate());
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  function getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  function formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  useEffect(() => {
    fetchReportData();
  }, [period, startDate, endDate]);

  const fetchReportData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const groupBy = period === 'day' ? 'day' : period === 'week' ? 'day' : period === 'fortnight' ? 'day' : 'day';

      const [salesResp, productsResp, paymentResp] = await Promise.all([
        getSalesReport(startDate, endDate, groupBy),
        getProductsReport(startDate, endDate, { sortBy: 'revenue', order: 'desc', limit: 10 }),
        getPaymentMethodsReport(startDate, endDate),
      ]);

      const salesByPeriod = salesResp.success
        ? salesResp.data.sales.map(s => ({
            date: s.date || s.week || s.month || '',
            total: s.revenue,
          }))
        : [];

      const topProducts = productsResp.success
        ? productsResp.data.products.map(p => ({
            name: p.name,
            quantity: p.quantity,
            revenue: p.revenue,
          }))
        : [];

      const paymentMethods = paymentResp.success
        ? paymentResp.data.payment_methods.map(p => ({
            method: p.method,
            amount: p.total,
          }))
        : [];

      const totalRevenue = salesResp.success ? salesResp.data.total_revenue : 0;
      const totalOrders = salesResp.success ? salesResp.data.total_orders : 0;
      const averageTicket = salesResp.success ? salesResp.data.average_ticket : 0;

      setReportData({ totalRevenue, totalOrders, averageTicket, salesByPeriod, topProducts, paymentMethods });
    } catch (err: any) {
      console.error('Erro ao carregar dados do relatório:', err);
      setError(err.message || 'Erro ao carregar relatórios');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePeriodChange = (newPeriod: 'day' | 'week' | 'fortnight' | 'month') => {
    setPeriod(newPeriod);
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

  const salesChartData = {
    labels: reportData?.salesByPeriod.map(item => item.date) || [],
    datasets: [{
      label: 'Vendas',
      data: reportData?.salesByPeriod.map(item => item.total) || [],
      backgroundColor: 'rgba(229, 57, 53, 0.2)',
      borderColor: 'rgba(229, 57, 53, 1)',
      borderWidth: 2,
      tension: 0.4,
    }],
  };

  const productsChartData = {
    labels: reportData?.topProducts.slice(0, 5).map(item => item.name) || [],
    datasets: [{
      label: 'Quantidade Vendida',
      data: reportData?.topProducts.slice(0, 5).map(item => item.quantity) || [],
      backgroundColor: ['rgba(255,152,0,0.7)', 'rgba(229,57,53,0.7)', 'rgba(255,193,7,0.7)', 'rgba(76,175,80,0.7)', 'rgba(33,150,243,0.7)'],
      borderWidth: 1,
    }],
  };

  const paymentChartData = {
    labels: reportData?.paymentMethods.map(item => item.method) || [],
    datasets: [{
      data: reportData?.paymentMethods.map(item => item.amount) || [],
      backgroundColor: ['rgba(33,150,243,0.7)', 'rgba(76,175,80,0.7)', 'rgba(255,193,7,0.7)', 'rgba(229,57,53,0.7)'],
      borderWidth: 1,
    }],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: { legend: { position: 'top' as const }, title: { display: true, text: `Vendas por ${period === 'day' ? 'Hora' : 'Dia'}` } },
  };
  const barChartOptions = {
    responsive: true,
    plugins: { legend: { position: 'top' as const }, title: { display: true, text: 'Top 5 Produtos Mais Vendidos' } },
  };
  const pieChartOptions = {
    responsive: true,
    plugins: { legend: { position: 'right' as const }, title: { display: true, text: 'Métodos de Pagamento' } },
  };

  return (
    <div className="reports-container">
      <Sidebar />
      <div className="reports-content">
        <Header title="Relatórios" />

        {error && (
          <div style={{ padding: '12px 16px', margin: '16px 0', background: 'rgba(229,57,53,0.1)', color: '#E53935', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>⚠️ {error}</span>
            <button onClick={fetchReportData} style={{ background: '#E53935', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer' }}>Tentar novamente</button>
          </div>
        )}

        <div className="reports-filters">
          <div className="period-selector">
            <button className={`period-btn ${period === 'day' ? 'active' : ''}`} onClick={() => handlePeriodChange('day')}>Hoje</button>
            <button className={`period-btn ${period === 'week' ? 'active' : ''}`} onClick={() => handlePeriodChange('week')}>Última Semana</button>
            <button className={`period-btn ${period === 'fortnight' ? 'active' : ''}`} onClick={() => handlePeriodChange('fortnight')}>Últimos 15 dias</button>
            <button className={`period-btn ${period === 'month' ? 'active' : ''}`} onClick={() => handlePeriodChange('month')}>Último Mês</button>
          </div>
          <div className="date-range-selector">
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <span>até</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>

        {isLoading ? (
          <div className="loading-state"><div className="spinner"></div></div>
        ) : reportData && (
          <div className="reports-grid">
            {/* Resumo */}
            <div className="reports-summary">
              <div className="summary-card">
                <h4>Receita Total</h4>
                <p className="summary-value">{formatCurrency(reportData.totalRevenue)}</p>
              </div>
              <div className="summary-card">
                <h4>Total de Pedidos</h4>
                <p className="summary-value">{reportData.totalOrders}</p>
              </div>
              <div className="summary-card">
                <h4>Ticket Médio</h4>
                <p className="summary-value">{formatCurrency(reportData.averageTicket)}</p>
              </div>
            </div>

            {/* Gráficos */}
            <div className="reports-charts">
              <div className="chart-card">
                <Line data={salesChartData} options={lineChartOptions} />
              </div>
              <div className="chart-card">
                <Bar data={productsChartData} options={barChartOptions} />
              </div>
              <div className="chart-card chart-small">
                <Pie data={paymentChartData} options={pieChartOptions} />
              </div>
            </div>

            {/* Tabela de produtos */}
            <div className="reports-table-section">
              <h3>Produtos Mais Vendidos</h3>
              <table className="reports-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Produto</th>
                    <th>Quantidade</th>
                    <th>Receita</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.topProducts.map((product, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{product.name}</td>
                      <td>{product.quantity}</td>
                      <td>{formatCurrency(product.revenue)}</td>
                    </tr>
                  ))}
                  {reportData.topProducts.length === 0 && (
                    <tr><td colSpan={4} style={{ textAlign: 'center', color: '#999' }}>Nenhum dado disponível</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
