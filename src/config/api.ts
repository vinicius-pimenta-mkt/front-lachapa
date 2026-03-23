/**
 * Configuração da API - PDV LaChapa
 * 
 * Este arquivo centraliza todas as chamadas à API do backend.
 * Configure VITE_API_URL no seu .env (ex: http://localhost:5000/api)
 */

// URL base da API - usa Vite env var
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
    total_revenue: number;
    total_orders: number;
    average_ticket: number;
    sales: Array<{
      date?: string;
      week?: string;
      month?: string;
      revenue: number;
      orders: number;
    }>;
  };
}

export interface ProductsReport {
  success: boolean;
  data: {
    products: Array<{
      name: string;
      quantity: number;
      revenue: number;
      percentage?: number;
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
      name: string;
      quantity: number;
      revenue: number;
    }>;
    payment_methods: Array<{
      method: string;
      total: number;
      orders: number;
    }>;
  };
}

export interface PaymentMethodsReport {
  success: boolean;
  data: {
    period: {
      start_date: string;
      end_date: string;
    };
    total_revenue: number;
    payment_methods: Array<{
      method: string;
      total: number;
      orders: number;
      percentage: number;
    }>;
  };
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  role?: string;
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

/**
 * Obter token de autenticação armazenado
 */
function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

/**
 * Fazer requisição à API com tratamento de erro
 */
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const defaultOptions: RequestInit = {
    headers: {
      ...defaultHeaders,
      ...(options.headers as Record<string, string> || {}),
    },
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });

    if (response.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
      throw new Error('Sessão expirada. Faça login novamente.');
    }

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
// FUNÇÕES DE AUTENTICAÇÃO
// ============================================

/**
 * Fazer login
 */
export async function login(username: string, password: string): Promise<LoginResponse> {
  const response = await fetchAPI<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  
  if (response.success && response.token) {
    localStorage.setItem('auth_token', response.token);
    if (response.user) {
      localStorage.setItem('auth_user', JSON.stringify(response.user));
    }
  }
  
  return response;
}

/**
 * Fazer logout
 */
export function logout(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
  window.location.href = '/login';
}

/**
 * Verificar se está autenticado
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

/**
 * Obter usuário autenticado
 */
export function getAuthUser(): User | null {
  const userStr = localStorage.getItem('auth_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

// ============================================
// FUNÇÕES DE PEDIDOS
// ============================================

/**
 * Listar todos os pedidos com filtro opcional por status
 */
export async function fetchPedidos(status?: string): Promise<Pedido[]> {
  const query = status ? `?status=${status}` : '';
  const response = await fetchAPI<{ success: boolean; data: Pedido[] }>(`/pedidos${query}`);
  return response.data || [];
}

/**
 * Obter pedido específico por ID
 */
export async function fetchPedidoById(id: number): Promise<Pedido> {
  const response = await fetchAPI<{ success: boolean; data: Pedido }>(`/pedidos/${id}`);
  return response.data;
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
  const response = await fetchAPI<{ success: boolean; data: Pedido }>('/pedidos', {
    method: 'POST',
    body: JSON.stringify(pedido),
  });
  return response.data;
}

/**
 * Atualizar status do pedido
 */
export async function updatePedidoStatus(
  id: number,
  status: 'em_analise' | 'em_producao' | 'em_entrega'
): Promise<Pedido> {
  const response = await fetchAPI<{ success: boolean; data: Pedido }>(`/pedidos/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
  return response.data;
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
 * Buscar pedidos
 */
export async function searchPedidos(term: string): Promise<Pedido[]> {
  const response = await fetchAPI<{ success: boolean; data: Pedido[] }>(`/pedidos/buscar?q=${encodeURIComponent(term)}`);
  return response.data || [];
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
  
  if (options?.sortBy) query += `&sort_by=${options.sortBy}`;
  if (options?.order) query += `&order=${options.order}`;
  if (options?.limit !== undefined) query += `&limit=${options.limit}`;

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
  
  return fetchAPI<DashboardReport>(`/reports/dashboard?start_date=${start}&end_date=${end}`);
}

/**
 * Obter relatório de métodos de pagamento
 */
export async function getPaymentMethodsReport(
  startDate: string | Date,
  endDate: string | Date
): Promise<PaymentMethodsReport> {
  const start = formatDateForAPI(startDate);
  const end = formatDateForAPI(endDate);
  
  return fetchAPI<PaymentMethodsReport>(`/reports/payment-methods?start_date=${start}&end_date=${end}`);
}

// ============================================
// FUNÇÕES DE USUÁRIOS
// ============================================

/**
 * Listar usuários
 */
export async function fetchUsers(): Promise<User[]> {
  return fetchAPI<User[]>('/users');
}

/**
 * Criar usuário
 */
export async function createUser(user: { username: string; email: string; password: string; role?: string }): Promise<User> {
  return fetchAPI<User>('/users', {
    method: 'POST',
    body: JSON.stringify(user),
  });
}

/**
 * Atualizar usuário
 */
export async function updateUser(id: number, data: Partial<User>): Promise<User> {
  return fetchAPI<User>(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Deletar usuário
 */
export async function deleteUser(id: number): Promise<void> {
  await fetchAPI(`/users/${id}`, { method: 'DELETE' });
}

// ============================================
// FUNÇÕES DE IMPRESSÃO
// ============================================

/**
 * Imprimir comanda do pedido via backend
 */
export async function printOrderTicket(pedidoId: number): Promise<{ success: boolean; message: string }> {
  return fetchAPI<{ success: boolean; message: string }>(`/impressora/imprimir/${pedidoId}`, {
    method: 'POST',
  });
}

/**
 * Obter configuração da impressora
 */
export async function getPrinterConfig(): Promise<any> {
  return fetchAPI('/impressora/config');
}

/**
 * Salvar configuração da impressora
 */
export async function savePrinterConfig(config: any): Promise<any> {
  return fetchAPI('/impressora/config', {
    method: 'POST',
    body: JSON.stringify(config),
  });
}

/**
 * Testar impressora
 */
export async function testPrinter(): Promise<{ success: boolean; message: string }> {
  return fetchAPI<{ success: boolean; message: string }>('/impressora/teste', {
    method: 'POST',
  });
}
