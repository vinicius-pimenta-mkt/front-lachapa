import React, { useState, useEffect, useCallback } from 'react';
import './Kanban.css';
import '../../styles/theme.css';
import Sidebar from '../../components/common/Sidebar';
import Header from '../../components/common/Header';
import { fetchPedidos, updatePedidoStatus, deletePedido, printOrderTicket, type Pedido } from '../../config/api';

// Tipos para o Kanban
interface KanbanOrder {
  id: number;
  number: string;
  customer: string;
  phone: string;
  address: string;
  total: number;
  paymentMethod: string;
  status: 'em_analise' | 'em_producao' | 'em_entrega';
  time: string;
  items: { name: string; quantity: number; price: number; notes?: string }[];
  notes?: string;
}

const Kanban: React.FC = () => {
  const [orders, setOrders] = useState<KanbanOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<KanbanOrder | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Converter pedido da API para o formato Kanban
  const mapPedidoToOrder = (pedido: Pedido): KanbanOrder => ({
    id: pedido.id,
    number: pedido.numero,
    customer: pedido.cliente_nome || 'Cliente não informado',
    phone: pedido.cliente_telefone || '',
    address: pedido.endereco_entrega || '',
    total: pedido.valor_total,
    paymentMethod: pedido.metodo_pagamento || '',
    status: pedido.status,
    time: pedido.data_criacao ? new Date(pedido.data_criacao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '--:--',
    items: (pedido.itens || []).map(item => ({
      name: item.produto_nome,
      quantity: item.quantidade,
      price: item.valor_unitario,
      notes: item.observacoes || undefined,
    })),
    notes: pedido.observacoes || undefined,
  });

  const loadOrders = useCallback(async () => {
    try {
      setError(null);
      const pedidos = await fetchPedidos();
      setOrders(pedidos.map(mapPedidoToOrder));
    } catch (err: any) {
      console.error('Erro ao carregar pedidos:', err);
      setError(err.message || 'Erro ao carregar pedidos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
    // Polling a cada 15 segundos para atualizar pedidos
    const interval = setInterval(loadOrders, 15000);
    return () => clearInterval(interval);
  }, [loadOrders]);

  // Filtragem de pedidos
  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    return (
      order.number.toLowerCase().includes(searchLower) ||
      order.customer.toLowerCase().includes(searchLower) ||
      order.phone.toLowerCase().includes(searchLower)
    );
  });

  const ordersByStatus = {
    em_analise: filteredOrders.filter(order => order.status === 'em_analise'),
    em_producao: filteredOrders.filter(order => order.status === 'em_producao'),
    em_entrega: filteredOrders.filter(order => order.status === 'em_entrega'),
  };

  const handleOrderClick = (order: KanbanOrder) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleMoveOrder = async (order: KanbanOrder, newStatus: 'em_analise' | 'em_producao' | 'em_entrega') => {
    try {
      await updatePedidoStatus(order.id, newStatus);
      
      setOrders(prevOrders =>
        prevOrders.map(o => o.id === order.id ? { ...o, status: newStatus } : o)
      );

      // Imprimir comanda ao aceitar pedido
      if (newStatus === 'em_producao') {
        try {
          await printOrderTicket(order.id);
        } catch (printErr) {
          console.warn('Erro ao imprimir comanda:', printErr);
        }
      }
    } catch (err: any) {
      console.error('Erro ao mover pedido:', err);
      alert(`Erro ao atualizar pedido: ${err.message}`);
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este pedido?')) return;
    
    try {
      await deletePedido(orderId);
      setOrders(prev => prev.filter(o => o.id !== orderId));
      setShowDetailsModal(false);
    } catch (err: any) {
      alert(`Erro ao excluir pedido: ${err.message}`);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'em_analise': return 'Em análise';
      case 'em_producao': return 'Em produção';
      case 'em_entrega': return 'Foi pra entrega';
      default: return status;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'card': case 'Crédito': case 'Cartão de Crédito': return 'Cartão';
      case 'cash': case 'Dinheiro': return 'Dinheiro';
      case 'pix': case 'Pix': return 'PIX';
      case 'Débito': case 'Cartão de Débito': return 'Débito';
      default: return method || 'N/A';
    }
  };

  const getPaymentMethodClass = (method: string) => {
    switch (method) {
      case 'card': case 'Crédito': case 'Cartão de Crédito': return 'payment-card';
      case 'cash': case 'Dinheiro': return 'payment-cash';
      case 'pix': case 'Pix': return 'payment-pix';
      default: return '';
    }
  };

  const calculateWaitTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return 0;
    const orderTime = new Date();
    orderTime.setHours(hours, minutes, 0);
    const now = new Date();
    const diffMs = now.getTime() - orderTime.getTime();
    return Math.max(0, Math.floor(diffMs / 60000));
  };

  const renderOrderCard = (order: KanbanOrder) => (
    <div key={order.id} className="order-card" onClick={() => handleOrderClick(order)}>
      <div className="order-header">
        <div className="order-number">#{order.number}</div>
        <div className="order-time">
          <i className="bi bi-clock"></i>
          <span>{calculateWaitTime(order.time)} min</span>
        </div>
      </div>
      
      <div className="order-customer">
        <strong>{order.customer}</strong>
        <div>{order.phone}</div>
      </div>
      
      <div className="order-items-preview">
        {order.items.slice(0, 2).map((item, idx) => (
          <div key={idx} className="item-preview">
            {item.quantity}x {item.name}
          </div>
        ))}
        {order.items.length > 2 && (
          <div className="more-items">+{order.items.length - 2} itens</div>
        )}
      </div>
      
      <div className="order-footer">
        <div className="order-total">R$ {order.total.toFixed(2)}</div>
        <div className={`order-payment ${getPaymentMethodClass(order.paymentMethod)}`}>
          {getPaymentMethodText(order.paymentMethod)}
        </div>
      </div>
      
      <div className="order-actions">
        {order.status === 'em_analise' && (
          <button className="btn-accept" onClick={(e) => { e.stopPropagation(); handleMoveOrder(order, 'em_producao'); }}>
            ✓ Aceitar
          </button>
        )}
        {order.status === 'em_producao' && (
          <button className="btn-deliver" onClick={(e) => { e.stopPropagation(); handleMoveOrder(order, 'em_entrega'); }}>
            🚀 Enviar
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="kanban-container">
      <Sidebar />
      
      <div className="kanban-content">
        <Header title="Gestão de Pedidos" />
        
        {error && (
          <div style={{ padding: '12px 16px', margin: '16px 0', background: 'rgba(229,57,53,0.1)', color: '#E53935', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>⚠️ {error}</span>
            <button onClick={loadOrders} style={{ background: '#E53935', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer' }}>
              Tentar novamente
            </button>
          </div>
        )}
        
        <div className="kanban-actions">
          <div className="kanban-search">
            <input 
              type="text" 
              placeholder="Buscar pedido por número, cliente ou telefone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button><i className="bi bi-search"></i></button>
          </div>
          
          <div className="kanban-filters">
            <button className="filter-btn active" onClick={loadOrders}>Atualizar</button>
          </div>
        </div>
        
        <div className="kanban-board">
          {/* Coluna 1: Em análise */}
          <div className="kanban-column analise-column">
            <div className="column-header">
              <h2>Em análise</h2>
              <span className="order-count">{ordersByStatus.em_analise.length}</span>
            </div>
            <div className="column-content">
              {isLoading ? (
                <div className="loading-placeholder"><div className="spinner"></div><p>Carregando...</p></div>
              ) : ordersByStatus.em_analise.length === 0 ? (
                <div className="empty-column"><p>Nenhum pedido em análise</p></div>
              ) : (
                ordersByStatus.em_analise.map(renderOrderCard)
              )}
            </div>
          </div>

          {/* Coluna 2: Em produção */}
          <div className="kanban-column producao-column">
            <div className="column-header">
              <h2>Em produção</h2>
              <span className="order-count">{ordersByStatus.em_producao.length}</span>
            </div>
            <div className="column-content">
              {isLoading ? (
                <div className="loading-placeholder"><div className="spinner"></div><p>Carregando...</p></div>
              ) : ordersByStatus.em_producao.length === 0 ? (
                <div className="empty-column"><p>Nenhum pedido em produção</p></div>
              ) : (
                ordersByStatus.em_producao.map(renderOrderCard)
              )}
            </div>
          </div>

          {/* Coluna 3: Em entrega */}
          <div className="kanban-column entrega-column">
            <div className="column-header">
              <h2>Em entrega</h2>
              <span className="order-count">{ordersByStatus.em_entrega.length}</span>
            </div>
            <div className="column-content">
              {isLoading ? (
                <div className="loading-placeholder"><div className="spinner"></div><p>Carregando...</p></div>
              ) : ordersByStatus.em_entrega.length === 0 ? (
                <div className="empty-column"><p>Nenhum pedido em entrega</p></div>
              ) : (
                ordersByStatus.em_entrega.map(renderOrderCard)
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes */}
      {showDetailsModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Pedido #{selectedOrder.number}</h2>
              <button className="modal-close" onClick={() => setShowDetailsModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="detail-group">
                <strong>Cliente:</strong> {selectedOrder.customer}
              </div>
              <div className="detail-group">
                <strong>Telefone:</strong> {selectedOrder.phone}
              </div>
              {selectedOrder.address && (
                <div className="detail-group">
                  <strong>Endereço:</strong> {selectedOrder.address}
                </div>
              )}
              <div className="detail-group">
                <strong>Status:</strong> {getStatusText(selectedOrder.status)}
              </div>
              <div className="detail-group">
                <strong>Pagamento:</strong> {getPaymentMethodText(selectedOrder.paymentMethod)}
              </div>
              
              <h3 style={{ marginTop: '16px' }}>Itens</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #eee' }}>Item</th>
                    <th style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #eee' }}>Qtd</th>
                    <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #eee' }}>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: '8px', borderBottom: '1px solid #f5f5f5' }}>
                        {item.name}
                        {item.notes && <div style={{ fontSize: '0.8rem', color: '#999' }}>Obs: {item.notes}</div>}
                      </td>
                      <td style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #f5f5f5' }}>{item.quantity}</td>
                      <td style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #f5f5f5' }}>R$ {(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div style={{ textAlign: 'right', fontSize: '1.2rem', fontWeight: 700, marginTop: '12px', color: '#E53935' }}>
                Total: R$ {selectedOrder.total.toFixed(2)}
              </div>
              
              {selectedOrder.notes && (
                <div className="detail-group" style={{ marginTop: '12px', padding: '10px', background: '#FFF3E0', borderRadius: '6px' }}>
                  <strong>Observações:</strong> {selectedOrder.notes}
                </div>
              )}
            </div>
            <div className="modal-footer" style={{ display: 'flex', gap: '8px', padding: '16px', borderTop: '1px solid #eee' }}>
              {selectedOrder.status === 'em_analise' && (
                <button className="btn-accept" onClick={() => { handleMoveOrder(selectedOrder, 'em_producao'); setShowDetailsModal(false); }}>
                  ✓ Aceitar Pedido
                </button>
              )}
              {selectedOrder.status === 'em_producao' && (
                <button className="btn-deliver" onClick={() => { handleMoveOrder(selectedOrder, 'em_entrega'); setShowDetailsModal(false); }}>
                  🚀 Enviar para Entrega
                </button>
              )}
              <button style={{ padding: '8px 16px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' }} onClick={() => handleDeleteOrder(selectedOrder.id)}>
                🗑️ Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kanban;
