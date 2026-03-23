import React, { useState, useEffect } from 'react';
import './Kanban.css';
import '../../styles/theme.css';
import Sidebar from '../../components/common/Sidebar';
import Header from '../../components/common/Header';

// Tipos
interface Order {
  id: string;
  number: string;
  customer: string;
  phone: string;
  address: string;
  total: number;
  paymentMethod: string;
  status: 'em_analise' | 'em_producao' | 'em_entrega';
  time: string;
  items: OrderItem[];
  notes?: string;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

const Kanban: React.FC = () => {
  // Estados
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Dados simulados
  const mockOrders: Order[] = [
    {
      id: '1',
      number: '20251022-1234',
      customer: 'João Silva',
      phone: '(11) 99999-9999',
      address: 'Av. Paulista, 1000',
      total: 35.90,
      paymentMethod: 'card',
      status: 'em_analise',
      time: '15:15',
      items: [
        { name: 'X-Tudo', quantity: 1, price: 25.90 },
        { name: 'Refrigerante Lata', quantity: 1, price: 6.00 },
        { name: 'Batata Frita P', quantity: 1, price: 4.00 }
      ],
      notes: 'Sem cebola no X-Tudo. Entregar com guardanapos extras.'
    },
    {
      id: '2',
      number: '20251022-5678',
      customer: 'Maria Oliveira',
      phone: '(11) 98888-8888',
      address: 'Avenida Brigadeiro Faria Lima, 500',
      total: 57.50,
      paymentMethod: 'cash',
      status: 'em_producao',
      time: '15:17',
      items: [
        { name: 'X-Bacon', quantity: 2, price: 22.90 },
        { name: 'Batata Frita G', quantity: 1, price: 10.00 },
        { name: 'Refrigerante 2L', quantity: 1, price: 12.00 }
      ]
    },
    {
      id: '3',
      number: '20251022-9012',
      customer: 'Pedro Santos',
      phone: '(11) 97777-7777',
      address: 'Rua Augusta, 200',
      total: 42.80,
      paymentMethod: 'pix',
      status: 'em_analise',
      time: '15:25',
      items: [
        { name: 'X-Salada', quantity: 1, price: 18.90 },
        { name: 'X-Bacon', quantity: 1, price: 22.90 },
        { name: 'Água Mineral', quantity: 1, price: 3.00 }
      ]
    },
    {
      id: '4',
      number: '20251022-3456',
      customer: 'Ana Costa',
      phone: '(11) 96666-6666',
      address: 'Rua Oscar Freire, 300',
      total: 68.70,
      paymentMethod: 'card',
      status: 'em_producao',
      time: '15:30',
      items: [
        { name: 'Combo Família', quantity: 1, price: 65.90 },
        { name: 'Sobremesa', quantity: 1, price: 5.00 }
      ],
      notes: 'Cliente vai buscar no local.'
    },
    {
      id: '5',
      number: '20251022-7890',
      customer: 'Carlos Mendes',
      phone: '(11) 95555-5555',
      address: 'Alameda Santos, 700',
      total: 29.90,
      paymentMethod: 'cash',
      status: 'em_entrega',
      time: '15:10',
      items: [
        { name: 'X-Tudo', quantity: 1, price: 25.90 },
        { name: 'Refrigerante Lata', quantity: 1, price: 6.00 }
      ],
      notes: 'Troco para R$ 50,00'
    }
  ];

  // Efeito para carregar os dados
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Simulando chamada à API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOrders(mockOrders);
      } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filtragem de pedidos
  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    return (
      order.number.toLowerCase().includes(searchLower) ||
      order.customer.toLowerCase().includes(searchLower) ||
      order.phone.toLowerCase().includes(searchLower)
    );
  });

  // Pedidos separados por status
  const ordersByStatus = {
    em_analise: filteredOrders.filter(order => order.status === 'em_analise'),
    em_producao: filteredOrders.filter(order => order.status === 'em_producao'),
    em_entrega: filteredOrders.filter(order => order.status === 'em_entrega')
  };

  // Handlers
  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleMoveOrder = (order: Order, newStatus: 'em_analise' | 'em_producao' | 'em_entrega') => {
    // Em um ambiente real, aqui seria feita a chamada à API
    setOrders(prevOrders =>
      prevOrders.map(o => 
        o.id === order.id ? { ...o, status: newStatus } : o
      )
    );

    // Se estiver movendo para produção, simular impressão
    if (newStatus === 'em_producao') {
      alert(`Imprimindo comanda do pedido #${order.number}...`);
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
  const calculateWaitTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const orderTime = new Date();
    orderTime.setHours(hours, minutes, 0);
    
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
                    onClick={() => handleOrderClick(order)}
                  >
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
                      <button 
                        className="action-btn details-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOrderClick(order);
                        }}
                      >
                        Detalhes
                      </button>
                      <button 
                        className="action-btn approve-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveOrder(order, 'em_producao');
                        }}
                      >
                        Aprovar
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
                  <i className="bi bi-tools"></i>
                  <p>Nenhum pedido em produção</p>
                </div>
              ) : (
                ordersByStatus.em_producao.map(order => (
                  <div 
                    key={order.id} 
                    className="order-card"
                    onClick={() => handleOrderClick(order)}
                  >
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
                      <button 
                        className="action-btn details-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOrderClick(order);
                        }}
                      >
                        Detalhes
                      </button>
                      <button 
                        className="action-btn deliver-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveOrder(order, 'em_entrega');
                        }}
                      >
                        Avançar Pedido
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Coluna 3: Foi pra entrega */}
          <div className="kanban-column entrega-column">
            <div className="column-header">
              <h2>Foi pra entrega</h2>
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
                    onClick={() => handleOrderClick(order)}
                  >
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
                      <button 
                        className="action-btn details-btn full-width"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOrderClick(order);
                        }}
                      >
                        Detalhes
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal de detalhes do pedido */}
      {showDetailsModal && selectedOrder && (
        <div className="order-modal-overlay">
          <div className="order-modal">
            <div className="modal-header">
              <h2>Detalhes do Pedido #{selectedOrder.number}</h2>
              <button onClick={() => setShowDetailsModal(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="order-info-grid">
                <div className="order-info-section">
                  <h3>Informações do Cliente</h3>
                  <p><strong>Nome:</strong> {selectedOrder.customer}</p>
                  <p><strong>Telefone:</strong> {selectedOrder.phone}</p>
                  <p><strong>Endereço:</strong> {selectedOrder.address}</p>
                </div>
                
                <div className="order-info-section">
                  <h3>Informações do Pedido</h3>
                  <p><strong>Número:</strong> #{selectedOrder.number}</p>
                  <p><strong>Horário:</strong> {selectedOrder.time}</p>
                  <p>
                    <strong>Status:</strong> 
                    <span className={`status-badge ${getStatusClass(selectedOrder.status)}`}>
                      {getStatusText(selectedOrder.status)}
                    </span>
                  </p>
                  <p>
                    <strong>Pagamento:</strong> 
                    <span className={`payment-badge ${getPaymentMethodClass(selectedOrder.paymentMethod)}`}>
                      {getPaymentMethodText(selectedOrder.paymentMethod)}
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="order-items-section">
                <h3>Itens do Pedido</h3>
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Qtd</th>
                      <th>Valor Unit.</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          {item.name}
                          {item.notes && <div className="item-note">{item.notes}</div>}
                        </td>
                        <td>{item.quantity}</td>
                        <td>R$ {item.price.toFixed(2)}</td>
                        <td>R$ {(item.quantity * item.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="total-label">Total</td>
                      <td className="total-value">R$ {selectedOrder.total.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              {selectedOrder.notes && (
                <div className="order-notes-section">
                  <h3>Observações</h3>
                  <p>{selectedOrder.notes}</p>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn-close"
                onClick={() => setShowDetailsModal(false)}
              >
                Fechar
              </button>
              
              {selectedOrder.status === 'em_analise' && (
                <button 
                  className="btn-approve"
                  onClick={() => {
                    handleMoveOrder(selectedOrder, 'em_producao');
                    setShowDetailsModal(false);
                  }}
                >
                  <i className="bi bi-check2-circle"></i> Aprovar e Imprimir
                </button>
              )}
              
              {selectedOrder.status === 'em_producao' && (
                <button 
                  className="btn-deliver"
                  onClick={() => {
                    handleMoveOrder(selectedOrder, 'em_entrega');
                    setShowDetailsModal(false);
                  }}
                >
                  <i className="bi bi-truck"></i> Avançar para Entrega
                </button>
              )}
              
              <button className="btn-print">
                <i className="bi bi-printer"></i> Reimprimir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kanban;
