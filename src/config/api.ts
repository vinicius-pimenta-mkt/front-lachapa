/**
 * Configuração da API - PDV LaChapa
 * 
 * Este arquivo centraliza todas as chamadas à API do backend
 * Substitua a URL base pela URL do seu backend na EasyPanel
 * 
 * Variáveis de ambiente necessárias:
 * - REACT_APP_API_URL: URL base da API (ex: http://localhost:5000/api)
 */

// URL base da API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ============================================
// TIPOS E INTERFACES
// ============================================

export interface Pedido {
  id: number;
  numero: string;
  cliente_nome: string;
  cliente_telefone: string;
  endereco_entrega?: string;
  valor_total: number;
  metodo_pagamento: string;
  status: 'em_analise' | 'em_producao' | 'em_entrega';
  origem: string;
  observacoes?: string;
  data_criacao: string;
  data_atualizacao: string;
  itens: ItemPedido[];
}

export interface ItemPedido {
  id: number;
  pedido_id: number;
  produto_nome: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  observacoes?: string;
}

export interface SalesReport {
  success: boolean;
  data: {
    period: {
      start_date: string;
      end_date: string;
    };
    sales: Array<{
      date: string;
      total: number;
      orders: number;
    }>;
    total_revenue: number;
    total_orders: number;
  };
}

export interface ProductsReport {
  success: boolean;
  data: {
    products: Array<{
      id: number;
      name: string;
      quantity: number;
      revenue: number;
    }>;
  };
}

export interface DashboardReport {
  success: boolean;
  data: {
    period: {
      start_date: string;
      end_date: string;
    };
    summary: {
      total_revenue: number;
      total_orders: number;
      average_ticket: number;
      revenue_change_percent: number;
    };
    top_products: Array<{
      id: number;
      name: string;
      quantity: number;
      revenue: number;
    }>;
  };
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

/**
 * Fazer requisição à API com tratamento de erro
 */
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Erro ${response.status}: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`Erro ao chamar ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Formatar data para YYYY-MM-DD
 */
export function formatDateForAPI(date: Date | string): string {
  if (typeof date === 'string') {
    return date;
  }
  return date.toISOString().split('T')[0];
}

// ============================================
// FUNÇÕES DE PEDIDOS
// ============================================

/**
 * Listar todos os pedidos com filtro opcional por status
 */
export async function fetchPedidos(status?: string): Promise<Pedido[]> {
  const query = status ? `?status=${status}` : '';
  return fetchAPI<Pedido[]>(`/pedidos${query}`);
}

/**
 * Obter pedido específico por ID
 */
export async function fetchPedidoById(id: number): Promise<Pedido> {
  return fetchAPI<Pedido>(`/pedidos/${id}`);
}

/**
 * Criar novo pedido
 */
export async function createPedido(pedido: {
  cliente_nome: string;
  cliente_telefone: string;
  endereco_entrega?: string;
  valor_total: number;
  metodo_pagamento: string;
  status?: string;
  origem?: string;
  observacoes?: string;
  itens: Array<{
    produto_nome: string;
    quantidade: number;
    valor_unitario: number;
    observacoes?: string;
  }>;
}): Promise<Pedido> {
  return fetchAPI<Pedido>('/pedidos', {
    method: 'POST',
    body: JSON.stringify(pedido),
  });
}

/**
 * Atualizar status do pedido
 * Status válidos: 'em_analise', 'em_producao', 'em_entrega'
 */
export async function updatePedidoStatus(
  id: number,
  status: 'em_analise' | 'em_producao' | 'em_entrega'
): Promise<Pedido> {
  return fetchAPI<Pedido>(`/pedidos/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

/**
 * Deletar pedido
 */
export async function deletePedido(id: number): Promise<void> {
  await fetchAPI(`/pedidos/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Aceitar pedido (mover para em_producao)
 */
export async function acceptPedido(id: number): Promise<Pedido> {
  return updatePedidoStatus(id, 'em_producao');
}

/**
 * Marcar pedido como em entrega
 */
export async function markPedidoForDelivery(id: number): Promise<Pedido> {
  return updatePedidoStatus(id, 'em_entrega');
}

// ============================================
// FUNÇÕES DE RELATÓRIOS
// ============================================

/**
 * Obter relatório de vendas por período
 */
export async function getSalesReport(
  startDate: string | Date,
  endDate: string | Date,
  groupBy?: 'day' | 'week' | 'month'
): Promise<SalesReport> {
  const start = formatDateForAPI(startDate);
  const end = formatDateForAPI(endDate);
  
  let query = `?start_date=${start}&end_date=${end}`;
  if (groupBy) {
    query += `&group_by=${groupBy}`;
  }

  return fetchAPI<SalesReport>(`/reports/sales${query}`);
}

/**
 * Obter relatório de produtos
 */
export async function getProductsReport(
  startDate: string | Date,
  endDate: string | Date,
  options?: {
    sortBy?: 'revenue' | 'quantity';
    order?: 'asc' | 'desc';
    limit?: number;
  }
): Promise<ProductsReport> {
  const start = formatDateForAPI(startDate);
  const end = formatDateForAPI(endDate);
  
  let query = `?start_date=${start}&end_date=${end}`;
  
  if (options?.sortBy) {
    query += `&sort_by=${options.sortBy}`;
  }
  if (options?.order) {
    query += `&order=${options.order}`;
  }
  if (options?.limit !== undefined) {
    query += `&limit=${options.limit}`;
  }

  return fetchAPI<ProductsReport>(`/reports/products${query}`);
}

/**
 * Obter dados do dashboard
 */
export async function getDashboardReport(
  startDate: string | Date,
  endDate: string | Date
): Promise<DashboardReport> {
  const start = formatDateForAPI(startDate);
  const end = formatDateForAPI(endDate);
  
  const query = `?start_date=${start}&end_date=${end}`;

  return fetchAPI<DashboardReport>(`/reports/dashboard${query}`);
}

// ============================================
// FUNÇÕES DE BUSCA
// ============================================

/**
 * Buscar pedidos por número, cliente ou telefone
 */
export async function searchPedidos(term: string): Promise<Pedido[]> {
  try {
    const pedidos = await fetchPedidos();
    const searchLower = term.toLowerCase();
    
    return pedidos.filter(
      pedido =>
        pedido.numero.toLowerCase().includes(searchLower) ||
        pedido.cliente_nome.toLowerCase().includes(searchLower) ||
        pedido.cliente_telefone.toLowerCase().includes(searchLower)
    );
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    throw error;
  }
}

// ============================================
// FUNÇÕES DE IMPRESSÃO
// ============================================

/**
 * Imprimir comanda do pedido
 * Nota: Esta função pode precisar de um endpoint específico no backend
 */
export async function printOrderTicket(pedidoId: number): Promise<void> {
  try {
    const pedido = await fetchPedidoById(pedidoId);
    
    // Formatar dados para impressão
    const ticketContent = formatTicketContent(pedido);
    
    // Abrir diálogo de impressão
    const printWindow = window.open('', '', 'height=400,width=600');
    if (printWindow) {
      printWindow.document.write('<pre>');
      printWindow.document.write(ticketContent);
      printWindow.document.write('</pre>');
      printWindow.document.close();
      printWindow.print();
    }
  } catch (error) {
    console.error('Erro ao imprimir comanda:', error);
    throw error;
  }
}

/**
 * Formatar conteúdo do ticket para impressão
 */
function formatTicketContent(pedido: Pedido): string {
  let content = '';
  content += '═══════════════════════════════════\n';
  content += '          LA CHAPA PDV\n';
  content += '═══════════════════════════════════\n\n';
  
  content += `Pedido: ${pedido.numero}\n`;
  content += `Data: ${new Date(pedido.data_criacao).toLocaleString('pt-BR')}\n`;
  content += `Status: ${getStatusText(pedido.status)}\n\n`;
  
  content += `Cliente: ${pedido.cliente_nome}\n`;
  content += `Telefone: ${pedido.cliente_telefone}\n`;
  if (pedido.endereco_entrega) {
    content += `Endereço: ${pedido.endereco_entrega}\n`;
  }
  content += '\n───────────────────────────────────\n';
  content += 'ITENS:\n';
  content += '───────────────────────────────────\n\n';
  
  pedido.itens.forEach(item => {
    content += `${item.quantidade}x ${item.produto_nome}\n`;
    content += `   R$ ${item.valor_unitario.toFixed(2)} x ${item.quantidade} = R$ ${item.valor_total.toFixed(2)}\n`;
    if (item.observacoes) {
      content += `   Obs: ${item.observacoes}\n`;
    }
    content += '\n';
  });
  
  content += '───────────────────────────────────\n';
  content += `TOTAL: R$ ${pedido.valor_total.toFixed(2)}\n`;
  content += `Pagamento: ${getPaymentMethodText(pedido.metodo_pagamento)}\n`;
  
  if (pedido.observacoes) {
    content += `\nObservações: ${pedido.observacoes}\n`;
  }
  
  content += '\n═══════════════════════════════════\n';
  
  return content;
}

/**
 * Obter texto do status
 */
function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    em_analise: 'Em análise',
    em_producao: 'Em produção',
    em_entrega: 'Em entrega',
  };
  return statusMap[status] || status;
}

/**
 * Obter texto do método de pagamento
 */
function getPaymentMethodText(method: string): string {
  const methodMap: Record<string, string> = {
    card: 'Cartão',
    cash: 'Dinheiro',
    pix: 'PIX',
  };
  return methodMap[method] || method;
}

// ============================================
// EXPORT DEFAULT
// ============================================

export default {
  // Pedidos
  fetchPedidos,
  fetchPedidoById,
  createPedido,
  updatePedidoStatus,
  deletePedido,
  acceptPedido,
  markPedidoForDelivery,
  
  // Relatórios
  getSalesReport,
  getProductsReport,
  getDashboardReport,
  
  // Busca
  searchPedidos,
  
  // Impressão
  printOrderTicket,
  
  // Utilitários
  formatDateForAPI,
};
