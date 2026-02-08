import React from 'react';
import './RecentOrdersTable.css';

interface Order {
  id: string;
  customer: string;
  total: number;
  status: string;
  time: string;
}

interface RecentOrdersTableProps {
  orders: Order[];
  isLoading?: boolean;
}

const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({ orders, isLoading = false }) => {
  // Função para traduzir status
  const getStatusLabel = (status: string): string => {
    const statusMap: Record<string, string> = {
      'em_analise': 'Em análise',
      'em_producao': 'Em produção',
      'em_entrega': 'Em entrega',
      'concluido': 'Concluído',
      'cancelado': 'Cancelado'
    };
    return statusMap[status] || status;
  };

  // Função para obter classe CSS do status
  const getStatusClass = (status: string): string => {
    const statusClassMap: Record<string, string> = {
      'em_analise': 'status-pending',
      'em_producao': 'status-processing',
      'em_entrega': 'status-shipping',
      'concluido': 'status-completed',
      'cancelado': 'status-canceled'
    };
    return statusClassMap[status] || '';
  };

  // Renderização de estado de carregamento
  if (isLoading) {
    return (
      <div className="recent-orders-table-container">
        <div className="loading-skeleton">
          <div className="skeleton-row header"></div>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="skeleton-row"></div>
          ))}
        </div>
      </div>
    );
  }

  // Renderização quando não há pedidos
  if (!orders || orders.length === 0) {
    return (
      <div className="recent-orders-table-container">
        <div className="no-orders-message">
          Nenhum pedido recente encontrado
        </div>
      </div>
    );
  }

  return (
    <div className="recent-orders-table-container">
      <table className="recent-orders-table">
        <thead>
          <tr>
            <th>Pedido</th>
            <th>Cliente</th>
            <th>Valor</th>
            <th>Status</th>
            <th>Hora</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td>R$ {order.total.toFixed(2)}</td>
              <td>
                <span className={`status-badge ${getStatusClass(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </td>
              <td>{order.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrdersTable;
