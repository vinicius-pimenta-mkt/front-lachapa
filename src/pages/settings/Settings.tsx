import React, { useState } from 'react';
import './Settings.css';
import '../../styles/theme.css';
import Sidebar from '../../components/common/Sidebar';
import Header from '../../components/common/Header';

// Tipos
interface Printer {
  id: string;
  name: string;
  model: string;
  type: 'bluetooth' | 'usb' | 'network';
  address: string;
  isDefault: boolean;
  status: 'online' | 'offline' | 'error';
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'cashier';
  lastAccess: string;
}

const Settings: React.FC = () => {
  // Estados
  const [activeTab, setActiveTab] = useState<'profile' | 'printers' | 'integrations' | 'appearance' | 'backup'>('printers');
  const [printers, setPrinters] = useState<Printer[]>([
    {
      id: '1',
      name: 'Impressora Caixa',
      model: 'Epson TM-T20',
      type: 'usb',
      address: 'USB-001',
      isDefault: true,
      status: 'online'
    },
    {
      id: '2',
      name: 'Impressora Cozinha',
      model: 'Elgin i9',
      type: 'network',
      address: '192.168.1.100',
      isDefault: false,
      status: 'online'
    },
    {
      id: '3',
      name: 'Impressora Móvel',
      model: 'Bematech MP-4200',
      type: 'bluetooth',
      address: 'BT-001',
      isDefault: false,
      status: 'offline'
    }
  ]);
  
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Administrador',
      email: 'admin@lachapa.com',
      role: 'admin',
      lastAccess: '22/10/2025 10:15'
    },
    {
      id: '2',
      name: 'Gerente',
      email: 'gerente@lachapa.com',
      role: 'manager',
      lastAccess: '21/10/2025 18:30'
    },
    {
      id: '3',
      name: 'Atendente 1',
      email: 'atendente1@lachapa.com',
      role: 'cashier',
      lastAccess: '22/10/2025 09:45'
    }
  ]);
  
  const [showAddPrinterModal, setShowAddPrinterModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  
  // Funções
  const handleSetDefaultPrinter = (printerId: string) => {
    setPrinters(printers.map(printer => ({
      ...printer,
      isDefault: printer.id === printerId
    })));
  };
  
  const handleRemovePrinter = (printerId: string) => {
    if (window.confirm('Tem certeza que deseja remover esta impressora?')) {
      setPrinters(printers.filter(printer => printer.id !== printerId));
    }
  };
  
  const handleTestPrinter = (printerId: string) => {
    alert(`Enviando teste para impressora ${printerId}...`);
    // Aqui seria a integração com a API de impressão
  };
  
  const handleRemoveUser = (userId: string) => {
    if (window.confirm('Tem certeza que deseja remover este usuário?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'status-online';
      case 'offline': return 'status-offline';
      case 'error': return 'status-error';
      default: return '';
    }
  };
  
  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'manager': return 'Gerente';
      case 'cashier': return 'Atendente';
      default: return role;
    }
  };

  return (
    <div className="settings-container">
      <Sidebar />
      
      <div className="settings-content">
        <Header title="Configurações" />
        
        <div className="settings-tabs">
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="bi bi-person-circle"></i>
            <span>Perfil e Usuários</span>
          </button>
          
          <button 
            className={`tab-btn ${activeTab === 'printers' ? 'active' : ''}`}
            onClick={() => setActiveTab('printers')}
          >
            <i className="bi bi-printer"></i>
            <span>Impressoras</span>
          </button>
          
          <button 
            className={`tab-btn ${activeTab === 'integrations' ? 'active' : ''}`}
            onClick={() => setActiveTab('integrations')}
          >
            <i className="bi bi-link-45deg"></i>
            <span>Integrações</span>
          </button>
          
          <button 
            className={`tab-btn ${activeTab === 'appearance' ? 'active' : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            <i className="bi bi-palette"></i>
            <span>Aparência</span>
          </button>
          
          <button 
            className={`tab-btn ${activeTab === 'backup' ? 'active' : ''}`}
            onClick={() => setActiveTab('backup')}
          >
            <i className="bi bi-cloud-arrow-up"></i>
            <span>Backup e Sincronização</span>
          </button>
        </div>
        
        <div className="settings-body">
          {/* Perfil e Usuários */}
          {activeTab === 'profile' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Perfil e Usuários</h2>
                <button 
                  className="add-btn"
                  onClick={() => setShowAddUserModal(true)}
                >
                  <i className="bi bi-plus-circle"></i> Adicionar Usuário
                </button>
              </div>
              
              <div className="users-list">
                <table className="settings-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Email</th>
                      <th>Perfil</th>
                      <th>Último Acesso</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{getRoleText(user.role)}</td>
                        <td>{user.lastAccess}</td>
                        <td className="actions-cell">
                          <button className="action-btn edit-btn">
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button 
                            className="action-btn delete-btn"
                            onClick={() => handleRemoveUser(user.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="profile-section">
                <h3>Seu Perfil</h3>
                <div className="profile-form">
                  <div className="form-group">
                    <label>Nome</label>
                    <input type="text" value="Administrador" readOnly />
                  </div>
                  
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value="admin@lachapa.com" readOnly />
                  </div>
                  
                  <div className="form-group">
                    <label>Perfil</label>
                    <input type="text" value="Administrador" readOnly />
                  </div>
                  
                  <div className="form-actions">
                    <button className="primary-btn">
                      <i className="bi bi-key"></i> Alterar Senha
                    </button>
                    <button className="secondary-btn">
                      <i className="bi bi-pencil"></i> Editar Perfil
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Impressoras */}
          {activeTab === 'printers' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Impressoras</h2>
                <button 
                  className="add-btn"
                  onClick={() => setShowAddPrinterModal(true)}
                >
                  <i className="bi bi-plus-circle"></i> Adicionar Impressora
                </button>
              </div>
              
              <div className="printers-list">
                <table className="settings-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Modelo</th>
                      <th>Tipo</th>
                      <th>Endereço</th>
                      <th>Status</th>
                      <th>Padrão</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {printers.map(printer => (
                      <tr key={printer.id}>
                        <td>{printer.name}</td>
                        <td>{printer.model}</td>
                        <td>{printer.type === 'bluetooth' ? 'Bluetooth' : printer.type === 'usb' ? 'USB' : 'Rede'}</td>
                        <td>{printer.address}</td>
                        <td>
                          <span className={`status-badge ${getStatusColor(printer.status)}`}>
                            {printer.status === 'online' ? 'Online' : printer.status === 'offline' ? 'Offline' : 'Erro'}
                          </span>
                        </td>
                        <td>
                          <div className="default-toggle">
                            <input 
                              type="radio" 
                              id={`default-${printer.id}`}
                              name="default-printer"
                              checked={printer.isDefault}
                              onChange={() => handleSetDefaultPrinter(printer.id)}
                            />
                            <label htmlFor={`default-${printer.id}`}></label>
                          </div>
                        </td>
                        <td className="actions-cell">
                          <button 
                            className="action-btn test-btn"
                            onClick={() => handleTestPrinter(printer.id)}
                          >
                            <i className="bi bi-play"></i>
                          </button>
                          <button className="action-btn edit-btn">
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button 
                            className="action-btn delete-btn"
                            onClick={() => handleRemovePrinter(printer.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="printer-templates">
                <h3>Templates de Impressão</h3>
                <div className="templates-grid">
                  <div className="template-card">
                    <div className="template-header">
                      <h4>Comanda de Pedido</h4>
                      <span className="default-badge">Padrão</span>
                    </div>
                    <div className="template-preview">
                      <img src="/templates/order-template.png" alt="Template de Comanda" />
                    </div>
                    <div className="template-actions">
                      <button className="action-btn edit-btn">
                        <i className="bi bi-pencil"></i> Editar
                      </button>
                      <button className="action-btn preview-btn">
                        <i className="bi bi-eye"></i> Visualizar
                      </button>
                    </div>
                  </div>
                  
                  <div className="template-card">
                    <div className="template-header">
                      <h4>Recibo de Pagamento</h4>
                    </div>
                    <div className="template-preview">
                      <img src="/templates/receipt-template.png" alt="Template de Recibo" />
                    </div>
                    <div className="template-actions">
                      <button className="action-btn edit-btn">
                        <i className="bi bi-pencil"></i> Editar
                      </button>
                      <button className="action-btn preview-btn">
                        <i className="bi bi-eye"></i> Visualizar
                      </button>
                    </div>
                  </div>
                  
                  <div className="template-card add-template">
                    <div className="add-template-content">
                      <i className="bi bi-plus-circle"></i>
                      <p>Adicionar Novo Template</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Integrações */}
          {activeTab === 'integrations' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Integrações</h2>
              </div>
              
              <div className="integrations-grid">
                <div className="integration-card">
                  <div className="integration-logo">
                    <i className="bi bi-whatsapp"></i>
                  </div>
                  <div className="integration-info">
                    <h3>WhatsApp</h3>
                    <p>Integração com fluxo n8n para notificações de pedidos</p>
                    <div className="integration-status connected">
                      <span className="status-dot"></span>
                      Conectado
                    </div>
                  </div>
                  <div className="integration-actions">
                    <button className="secondary-btn">Configurar</button>
                    <button className="danger-btn">Desconectar</button>
                  </div>
                </div>
                
                <div className="integration-card">
                  <div className="integration-logo">
                    <i className="bi bi-cart"></i>
                  </div>
                  <div className="integration-info">
                    <h3>Cardápio Digital</h3>
                    <p>Integração com o cardápio digital para recebimento de pedidos</p>
                    <div className="integration-status connected">
                      <span className="status-dot"></span>
                      Conectado
                    </div>
                  </div>
                  <div className="integration-actions">
                    <button className="secondary-btn">Configurar</button>
                    <button className="danger-btn">Desconectar</button>
                  </div>
                </div>
                
                <div className="integration-card">
                  <div className="integration-logo">
                    <i className="bi bi-credit-card"></i>
                  </div>
                  <div className="integration-info">
                    <h3>Gateway de Pagamento</h3>
                    <p>Integração com gateway de pagamento para cartões e PIX</p>
                    <div className="integration-status disconnected">
                      <span className="status-dot"></span>
                      Desconectado
                    </div>
                  </div>
                  <div className="integration-actions">
                    <button className="primary-btn">Conectar</button>
                  </div>
                </div>
                
                <div className="integration-card">
                  <div className="integration-logo">
                    <i className="bi bi-box-seam"></i>
                  </div>
                  <div className="integration-info">
                    <h3>Estoque</h3>
                    <p>Integração com sistema de controle de estoque</p>
                    <div className="integration-status disconnected">
                      <span className="status-dot"></span>
                      Desconectado
                    </div>
                  </div>
                  <div className="integration-actions">
                    <button className="primary-btn">Conectar</button>
                  </div>
                </div>
              </div>
              
              <div className="webhook-section">
                <h3>Webhooks</h3>
                <p>Configure webhooks para integrar com outros sistemas.</p>
                
                <div className="webhook-list">
                  <div className="webhook-item">
                    <div className="webhook-info">
                      <h4>Novo Pedido</h4>
                      <div className="webhook-url">
                        <code>https://api.lachapa.com/webhooks/novo-pedido</code>
                        <button className="copy-btn">
                          <i className="bi bi-clipboard"></i>
                        </button>
                      </div>
                    </div>
                    <div className="webhook-actions">
                      <button className="secondary-btn">Editar</button>
                      <button className="danger-btn">Excluir</button>
                    </div>
                  </div>
                  
                  <div className="webhook-item">
                    <div className="webhook-info">
                      <h4>Atualização de Status</h4>
                      <div className="webhook-url">
                        <code>https://api.lachapa.com/webhooks/status</code>
                        <button className="copy-btn">
                          <i className="bi bi-clipboard"></i>
                        </button>
                      </div>
                    </div>
                    <div className="webhook-actions">
                      <button className="secondary-btn">Editar</button>
                      <button className="danger-btn">Excluir</button>
                    </div>
                  </div>
                  
                  <button className="add-webhook-btn">
                    <i className="bi bi-plus-circle"></i> Adicionar Webhook
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Aparência */}
          {activeTab === 'appearance' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Aparência</h2>
              </div>
              
              <div className="appearance-settings">
                <div className="color-theme-section">
                  <h3>Tema de Cores</h3>
                  <div className="color-themes">
                    <div className="color-theme-option active">
                      <div className="theme-preview">
                        <div className="color-sample primary"></div>
                        <div className="color-sample secondary"></div>
                        <div className="color-sample tertiary"></div>
                      </div>
                      <div className="theme-name">Padrão (Vermelho/Laranja)</div>
                    </div>
                    
                    <div className="color-theme-option">
                      <div className="theme-preview">
                        <div className="color-sample primary blue"></div>
                        <div className="color-sample secondary teal"></div>
                        <div className="color-sample tertiary light-blue"></div>
                      </div>
                      <div className="theme-name">Oceano (Azul/Verde)</div>
                    </div>
                    
                    <div className="color-theme-option">
                      <div className="theme-preview">
                        <div className="color-sample primary purple"></div>
                        <div className="color-sample secondary pink"></div>
                        <div className="color-sample tertiary light-purple"></div>
                      </div>
                      <div className="theme-name">Uva (Roxo/Rosa)</div>
                    </div>
                    
                    <div className="color-theme-option">
                      <div className="theme-preview">
                        <div className="color-sample primary green"></div>
                        <div className="color-sample secondary lime"></div>
                        <div className="color-sample tertiary yellow"></div>
                      </div>
                      <div className="theme-name">Natureza (Verde/Amarelo)</div>
                    </div>
                  </div>
                </div>
                
                <div className="layout-section">
                  <h3>Layout</h3>
                  <div className="layout-options">
                    <div className="form-group">
                      <label>Modo de Visualização</label>
                      <div className="toggle-options">
                        <button className="toggle-btn active">Claro</button>
                        <button className="toggle-btn">Escuro</button>
                        <button className="toggle-btn">Sistema</button>
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>Tamanho da Fonte</label>
                      <div className="range-slider">
                        <input type="range" min="80" max="120" value="100" />
                        <div className="range-value">100%</div>
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>Densidade do Layout</label>
                      <div className="toggle-options">
                        <button className="toggle-btn">Compacto</button>
                        <button className="toggle-btn active">Normal</button>
                        <button className="toggle-btn">Confortável</button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="logo-section">
                  <h3>Logo e Marca</h3>
                  <div className="logo-settings">
                    <div className="logo-preview">
                      <img src="/logo.png" alt="Logo atual" />
                    </div>
                    <div className="logo-actions">
                      <button className="secondary-btn">
                        <i className="bi bi-upload"></i> Alterar Logo
                      </button>
                      <button className="danger-btn">
                        <i className="bi bi-trash"></i> Remover
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="form-actions centered">
                  <button className="secondary-btn">Restaurar Padrão</button>
                  <button className="primary-btn">Salvar Alterações</button>
                </div>
              </div>
            </div>
          )}
          
          {/* Backup e Sincronização */}
          {activeTab === 'backup' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Backup e Sincronização</h2>
              </div>
              
              <div className="backup-settings">
                <div className="backup-status">
                  <div className="status-card">
                    <div className="status-icon">
                      <i className="bi bi-cloud-check"></i>
                    </div>
                    <div className="status-info">
                      <h3>Status da Sincronização</h3>
                      <div className="status-value">
                        <span className="status-badge status-online">Sincronizado</span>
                        <span className="status-time">Último: 22/10/2025 14:30</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="backup-options">
                  <h3>Opções de Backup</h3>
                  
                  <div className="form-group">
                    <label>Frequência de Backup Automático</label>
                    <select>
                      <option value="daily">Diário</option>
                      <option value="hourly">A cada hora</option>
                      <option value="manual">Manual</option>
                      <option value="realtime">Tempo real</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Dados a Incluir no Backup</label>
                    <div className="checkbox-group">
                      <div className="checkbox-item">
                        <input type="checkbox" id="backup-orders" checked />
                        <label htmlFor="backup-orders">Pedidos</label>
                      </div>
                      <div className="checkbox-item">
                        <input type="checkbox" id="backup-products" checked />
                        <label htmlFor="backup-products">Produtos</label>
                      </div>
                      <div className="checkbox-item">
                        <input type="checkbox" id="backup-customers" checked />
                        <label htmlFor="backup-customers">Clientes</label>
                      </div>
                      <div className="checkbox-item">
                        <input type="checkbox" id="backup-settings" checked />
                        <label htmlFor="backup-settings">Configurações</label>
                      </div>
                      <div className="checkbox-item">
                        <input type="checkbox" id="backup-reports" checked />
                        <label htmlFor="backup-reports">Relatórios</label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Retenção de Backup</label>
                    <select>
                      <option value="30">30 dias</option>
                      <option value="60">60 dias</option>
                      <option value="90">90 dias</option>
                      <option value="365">1 ano</option>
                      <option value="unlimited">Ilimitado</option>
                    </select>
                  </div>
                </div>
                
                <div className="backup-actions">
                  <button className="primary-btn">
                    <i className="bi bi-cloud-arrow-up"></i> Fazer Backup Agora
                  </button>
                  <button className="secondary-btn">
                    <i className="bi bi-cloud-arrow-down"></i> Restaurar Backup
                  </button>
                  <button className="secondary-btn">
                    <i className="bi bi-download"></i> Exportar Dados
                  </button>
                </div>
                
                <div className="backup-history">
                  <h3>Histórico de Backups</h3>
                  <table className="settings-table">
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Tamanho</th>
                        <th>Tipo</th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>22/10/2025 14:30</td>
                        <td>5.2 MB</td>
                        <td>Automático</td>
                        <td><span className="status-badge status-online">Concluído</span></td>
                        <td className="actions-cell">
                          <button className="action-btn download-btn">
                            <i className="bi bi-download"></i>
                          </button>
                          <button className="action-btn restore-btn">
                            <i className="bi bi-arrow-counterclockwise"></i>
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>21/10/2025 14:30</td>
                        <td>5.1 MB</td>
                        <td>Automático</td>
                        <td><span className="status-badge status-online">Concluído</span></td>
                        <td className="actions-cell">
                          <button className="action-btn download-btn">
                            <i className="bi bi-download"></i>
                          </button>
                          <button className="action-btn restore-btn">
                            <i className="bi bi-arrow-counterclockwise"></i>
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>20/10/2025 10:15</td>
                        <td>5.0 MB</td>
                        <td>Manual</td>
                        <td><span className="status-badge status-online">Concluído</span></td>
                        <td className="actions-cell">
                          <button className="action-btn download-btn">
                            <i className="bi bi-download"></i>
                          </button>
                          <button className="action-btn restore-btn">
                            <i className="bi bi-arrow-counterclockwise"></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal de Adicionar Impressora */}
      {showAddPrinterModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Adicionar Impressora</h2>
              <button 
                className="close-btn"
                onClick={() => setShowAddPrinterModal(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Nome da Impressora</label>
                <input type="text" placeholder="Ex: Impressora Caixa" />
              </div>
              
              <div className="form-group">
                <label>Modelo</label>
                <select>
                  <option value="">Selecione um modelo</option>
                  <option value="epson">Epson TM-T20</option>
                  <option value="elgin">Elgin i9</option>
                  <option value="bematech">Bematech MP-4200</option>
                  <option value="other">Outro</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Tipo de Conexão</label>
                <div className="radio-group">
                  <div className="radio-item">
                    <input type="radio" name="connection-type" id="usb" />
                    <label htmlFor="usb">USB</label>
                  </div>
                  <div className="radio-item">
                    <input type="radio" name="connection-type" id="bluetooth" />
                    <label htmlFor="bluetooth">Bluetooth</label>
                  </div>
                  <div className="radio-item">
                    <input type="radio" name="connection-type" id="network" />
                    <label htmlFor="network">Rede</label>
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label>Endereço</label>
                <input type="text" placeholder="Ex: USB-001 ou 192.168.1.100" />
              </div>
              
              <div className="form-group">
                <div className="checkbox-item">
                  <input type="checkbox" id="default-printer" />
                  <label htmlFor="default-printer">Definir como impressora padrão</label>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="secondary-btn"
                onClick={() => setShowAddPrinterModal(false)}
              >
                Cancelar
              </button>
              <button className="primary-btn">
                <i className="bi bi-plus-circle"></i> Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de Adicionar Usuário */}
      {showAddUserModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Adicionar Usuário</h2>
              <button 
                className="close-btn"
                onClick={() => setShowAddUserModal(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Nome</label>
                <input type="text" placeholder="Nome completo" />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="email@exemplo.com" />
              </div>
              
              <div className="form-group">
                <label>Perfil</label>
                <select>
                  <option value="">Selecione um perfil</option>
                  <option value="admin">Administrador</option>
                  <option value="manager">Gerente</option>
                  <option value="cashier">Atendente</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Senha</label>
                <input type="password" placeholder="Senha" />
              </div>
              
              <div className="form-group">
                <label>Confirmar Senha</label>
                <input type="password" placeholder="Confirmar senha" />
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="secondary-btn"
                onClick={() => setShowAddUserModal(false)}
              >
                Cancelar
              </button>
              <button className="primary-btn">
                <i className="bi bi-plus-circle"></i> Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
