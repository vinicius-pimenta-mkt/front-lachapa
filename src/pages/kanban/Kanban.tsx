import React, { useState, useEffect, useCallback } from 'react';
import { apiCall, API_ENDPOINTS } from '../../config/api';
import { toast } from 'sonner';
import './Kanban.css';
import '../../styles/theme.css';
import Sidebar from '../../components/common/Sidebar';
import Header from '../../components/common/Header';

// Tipos
interface Order {
  id: number;
  numero: string;
  cliente_nome: string;
  cliente_telefone: string;
  endereco_entrega: string;
  valor_total: number;
  metodo_pagamento: string;
  status: 'em_analise' | 'em_producao' | 'em_entrega';
  data_criacao: string;
  itens: OrderItem[];
  observacoes?: string;
}

interface OrderItem {
  produto_nome: string;
  quantidade: number;
  valor_unitario: number;
  observacoes?: string;
}

const Kanban: React.FC = () => {
  // Estados
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Efeito para carregar os dados
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiCall<Order[]>(API_ENDPOINTS.pedidos.list);
      setOrders(response);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      toast.error('Erro ao carregar pedidos.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Filtragem de pedidos
  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    return (
      order.numero.toLowerCase().includes(searchLower) ||
      order.cliente_nome.toLowerCase().includes(searchLower) ||
      order.cliente_telefone.toLowerCase().includes(searchLower)
    );
  });

  // Pedidos separados por status
  const ordersByStatus = {
    em_analise: filteredOrders.filter(order => order.status === 'em_analise'),
    em_producao: filteredOrders.filter(order => order.status === 'em_producao'),
    em_entrega: filteredOrders.filter(order => order.status === 'em_entrega')
  };

  // Handlers
  const handleOrderClick = async (orderId: number) => {
    try {
      const orderDetails = await apiCall<Order>(API_ENDPOINTS.pedidos.get(orderId));
      setSelectedOrder(orderDetails);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Erro ao carregar detalhes do pedido:', error);
      toast.error('Erro ao carregar detalhes do pedido.');
    }
  };

  const handleMoveOrder = async (order: Order, newStatus: 'em_analise' | 'em_producao' | 'em_entrega') => {
    try {
      await apiCall(API_ENDPOINTS.pedidos.updateStatus(order.id), {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      setOrders(prevOrders =>
        prevOrders.map(o =>
          o.id === order.id ? { ...o, status: newStatus } : o
        )
      );
      toast.success(`Pedido #${order.numero} atualizado para ${getStatusText(newStatus)}.`);

      if (newStatus === 'em_producao') {
        // Chamar API de impressão
        try {
          await apiCall(API_ENDPOINTS.impressora.print(order.id), { method: 'POST' });
          toast.info(`Comanda do pedido #${order.numero} enviada para impressão.`);
        } catch (printError) {
          console.error('Erro ao imprimir comanda:', printError);
          toast.warning('Erro ao imprimir comanda. Verifique a impressora.');
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
      toast.error('Erro ao atualizar status do pedido.');
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

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'em_analise': return 'status-analise';
      case 'em_producao': return 'status-producao';
      case 'em_entrega': return 'status-entrega';
      default: return '';
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'card': return 'Cartão';
      case 'cash': return 'Dinheiro';
      case 'pix': return 'PIX';
      default: return method;
    }
  };

  const getPaymentMethodClass = (method: string) => {
    switch (method) {
      case 'card': return 'payment-card';
      case 'cash': return 'payment-cash';
      case 'pix': return 'payment-pix';
      default: return '';
    }
  };

  // Cálculo do tempo de espera
  const calculateWaitTime = (isoDateString: string) => {
    const orderTime = new Date(isoDateString);
    const now = new Date();
    const diffMs = now.getTime() - orderTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    return diffMins;
  };

  return (
    <div className="kanban-container">
      <Sidebar />

      <div className="kanban-content">
        <Header title="Gestão de Pedidos" />

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
            <button className="filter-btn active">Todos</button>
            <button className="filter-btn">Últimas 2h</button>
            <button className="filter-btn">Hoje</button>
            <button className="filter-btn">Delivery</button>
            <button className="filter-btn">Balcão</button>
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
                <div className="loading-placeholder">
                  <div className="spinner"></div>
                  <p>Carregando pedidos...</p>
                </div>
              ) : ordersByStatus.em_analise.length === 0 ? (
                <div className="empty-column">
                  <i className="bi bi-inbox"></i>
                  <p>Nenhum pedido em análise</p>
                </div>
              ) : (
                ordersByStatus.em_analise.map(order => (
                  <div
                    key={order.id}
                    className="order-card"
                    onClick={() => handleOrderClick(order.id)}
                  >
                    <div className="order-header">
                      <div className="order-number">#{order.numero}</div>
                      <div className="order-time">
                        <i className="bi bi-clock"></i>
                        <span>{calculateWaitTime(order.data_criacao)} min</span>
                      </div>
                    </div>

                    <div className="order-customer">
                      <strong>{order.cliente_nome}</strong>
                      <div>{order.cliente_telefone}</div>
                    </div>

                    <div className="order-items-preview">
                      {order.itens.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="item-preview">
                          {item.quantidade}x {item.produto_nome}
                        </div>
                      ))}
                      {order.itens.length > 2 && (
                        <div key={order.id} className="more-items">+{order.itens.length - 2} itens</div>
                      )}
                    </div>

                    <div className="order-footer">
                      <div className="order-total">R$ {order.valor_total.toFixed(2)}</div>

                      <div className="order-payment-method">
                        <span className={getPaymentMethodClass(order.metodo_pagamento)}>
                          {getPaymentMethodText(order.metodo_pagamento)}
                        </span>
                      </div>
                    </div>

                    <div className="order-actions">
                      <button
                        className="btn-action btn-producao"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveOrder(order, 'em_producao');
                        }}
                      >
                        <i className="bi bi-hourglass-split"></i>
                        <span>Produção</span>
                      </button>
                    </div>
                  </div>
                ))
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
                <div className="loading-placeholder">
                  <div className="spinner"></div>
                  <p>Carregando pedidos...</p>
                </div>
              ) : ordersByStatus.em_producao.length === 0 ? (
                <div className="empty-column">
                  <i className="bi bi-hourglass-split"></i>
                  <p>Nenhum pedido em produção</p>
                </div>
              ) : (
                ordersByStatus.em_producao.map(order => (
                  <div
                    key={order.id}
                    className="order-card"
                    onClick={() => handleOrderClick(order.id)}
                  >
                    <div className="order-header">
                      <div className="order-number">#{order.numero}</div>
                      <div className="order-time">
                        <i className="bi bi-clock"></i>
                        <span>{calculateWaitTime(order.data_criacao)} min</span>
                      </div>
                    </div>

                    <div className="order-customer">
                      <strong>{order.cliente_nome}</strong>
                      <div>{order.cliente_telefone}</div>
                    </div>

                    <div className="order-items-preview">
                      {order.itens.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="item-preview">
                          {item.quantidade}x {item.produto_nome}
                        </div>
                      ))}
                      {order.itens.length > 2 && (
                        <div key={order.id} className="more-items">+{order.itens.length - 2} itens</div>
                      )}
                    </div>

                    <div className="order-footer">
                      <div className="order-total">R$ {order.valor_total.toFixed(2)}</div>
                      <div className="order-payment-method">
                        <span className={getPaymentMethodClass(order.metodo_pagamento)}>
                          {getPaymentMethodText(order.metodo_pagamento)}
                        </span>
                      </div>
                    </div>

                    <div className="order-actions">
                      <button
                        className="btn-action btn-entrega"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveOrder(order, 'em_entrega');
                        }}
                      >
                        <i className="bi bi-truck"></i>
                        <span>Entrega</span>
                      </button>
                    </div>
                  </div>
                ))
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
                <div className="loading-placeholder">
                  <div className="spinner"></div>
                  <p>Carregando pedidos...</p>
                </div>
              ) : ordersByStatus.em_entrega.length === 0 ? (
                <div className="empty-column">
                  <i className="bi bi-truck"></i>
                  <p>Nenhum pedido em entrega</p>
                </div>
              ) : (
                ordersByStatus.em_entrega.map(order => (
                  <div
                    key={order.id}
                    className="order-card"
                    onClick={() => handleOrderClick(order.id)}
                  >
                    <div className="order-header">
                      <div className="order-number">#{order.numero}</div>
                      <div className="order-time">
                        <i className="bi bi-clock"></i>
                        <span>{calculateWaitTime(order.data_criacao)} min</span>
                      </div>
                    </div>

                    <div className="order-customer">
                      <strong>{order.cliente_nome}</strong>
                      <div>{order.cliente_telefone}</div>
                    </div>

                    <div className="order-items-preview">
                      {order.itens.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="item-preview">
                          {item.quantidade}x {item.produto_nome}
                        </div>
                      ))}
                      {order.itens.length > 2 && (
                        <div key={order.id} className="more-items">+{order.itens.length - 2} itens</div>
                      )}
                    </div>

                    <div className="order-footer">
                      <div className="order-total">R$ {order.valor_total.toFixed(2)}</div>
                      <div className="order-payment-method">
                        <span className={getPaymentMethodClass(order.metodo_pagamento)}>
                          {getPaymentMethodText(order.metodo_pagamento)}
                        </span>
                      </div>
                    </div>

                    <div className="order-actions">
                      <button
                        className="btn-action btn-concluido"
                        onClick={(e) => {
                          e.stopPropagation();
                          // handleMoveOrder(order, 'concluido'); // Assumindo que 'concluido' é um status final
                          toast.info(`Pedido #${order.numero} entregue!`);
                          // Remover o pedido da lista ou atualizar o status para 'concluido' e filtrar
                          setOrders(prevOrders => prevOrders.filter(o => o.id !== order.id));
                        }}
                      >
                        <i className="bi bi-check-circle"></i>
                        <span>Concluído</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes do Pedido */}
      {showDetailsModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setShowDetailsModal(false)}>&times;</button>
            <h2>Detalhes do Pedido #{selectedOrder.numero}</h2>
            <div className="modal-body">
              <p><strong>Cliente:</strong> {selectedOrder.cliente_nome}</p>
              <p><strong>Telefone:</strong> {selectedOrder.cliente_telefone}</p>
              <p><strong>Endereço:</strong> {selectedOrder.endereco_entrega}</p>
              <p><strong>Hora do Pedido:</strong> {selectedOrder.data_criacao.substring(11, 16)}</p>
              <p><strong>Método de Pagamento:</strong> {getPaymentMethodText(selectedOrder.metodo_pagamento)}</p>
              <p><strong>Total:</strong> R$ {selectedOrder.valor_total.toFixed(2)}</p>
              <h3>Itens:</h3>
              <ul>
                {selectedOrder.itens.map((item, idx) => (
                  <li key={idx}>
                    {item.quantidade}x {item.produto_nome} - R$ {item.valor_unitario.toFixed(2)}
                    {item.observacoes && (<p className="item-notes">Observações: {item.observacoes}</p>)}
                  </li>
                ))}
              </ul>
              {selectedOrder.observacoes && (
                <p><strong>Observações do Pedido:</strong> {selectedOrder.observacoes}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kanban;
