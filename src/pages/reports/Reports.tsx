import React, { useState, useEffect, useCallback } from 'react';
import { apiCall, API_ENDPOINTS } from '../../config/api';
import { toast } from 'sonner';
import './Reports.css';
import '../../styles/theme.css';
import Sidebar from '../../components/common/Sidebar';
import Header from '../../components/common/Header';

interface ReportData {
  total_pedidos: number;
  total_vendas: number;
  pedidos_por_status: { status: string; count: number }[];
  vendas_por_metodo_pagamento: { metodo: string; total: number }[];
  top_produtos_vendidos: { produto_nome: string; quantidade: number; total_vendido: number }[];
  // Adicione outros campos de relatório conforme necessário
}

const Reports: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);

      const response = await apiCall<ReportData>(API_ENDPOINTS.reports.generate, { params });
      setReportData(response);
      toast.success('Relatório gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
      toast.error('Erro ao carregar relatórios.');
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleGenerateReport = () => {
    fetchReports();
  };

  return (
    <div className="reports-container">
      <Sidebar />

      <div className="reports-content">
        <Header title="Relatórios de Vendas" />

        <div className="reports-filters">
          <label htmlFor="startDate">Data Início:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <label htmlFor="endDate">Data Fim:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button onClick={handleGenerateReport}>Gerar Relatório</button>
        </div>

        {isLoading ? (
          <div className="loading-placeholder">
            <div className="spinner"></div>
            <p>Carregando relatórios...</p>
          </div>
        ) : reportData ? (
          <div className="report-summary">
            <h2>Resumo do Período</h2>
            <p><strong>Total de Pedidos:</strong> {reportData.total_pedidos}</p>
            <p><strong>Total de Vendas:</strong> R$ {reportData.total_vendas.toFixed(2)}</p>

            <h3>Pedidos por Status</h3>
            <ul>
              {reportData.pedidos_por_status.map((item, index) => (
                <li key={index}>{item.status}: {item.count}</li>
              ))}
            </ul>

            <h3>Vendas por Método de Pagamento</h3>
            <ul>
              {reportData.vendas_por_metodo_pagamento.map((item, index) => (
                <li key={index}>{item.metodo}: R$ {item.total.toFixed(2)}</li>
              ))}
            </ul>

            <h3>Top Produtos Vendidos</h3>
            <ul>
              {reportData.top_produtos_vendidos.map((item, index) => (
                <li key={index}>{item.produto_nome} ({item.quantidade}x) - R$ {item.total_vendido.toFixed(2)}</li>
              ))}
            </ul>
            {/* Renderize outros dados do relatório aqui */}
          </div>
        ) : (
          <div className="empty-report">
            <i className="bi bi-bar-chart"></i>
            <p>Nenhum relatório disponível. Selecione um período e gere o relatório.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
