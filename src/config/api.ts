/**
 * Configuração de API para o PDV LaChapa
 * Define a URL base e configurações padrão para chamadas à API
 */

// URL base da API - ajuste conforme seu ambiente
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Configurações padrão para requisições
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Função para fazer requisições à API
 */
export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...API_CONFIG.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Call Error [${endpoint}]:`, error);
    throw error;
  }
}

/**
 * Endpoints da API
 */
export const API_ENDPOINTS = {
  // Pedidos
  pedidos: {
    list: '/pedidos',
    get: (id: number) => `/pedidos/${id}`,
    create: '/pedidos',
    updateStatus: (id: number) => `/pedidos/${id}/status`,
    delete: (id: number) => `/pedidos/${id}`,
  },
  
  // Relatórios
  reports: {
    sales: '/reports/sales',
    products: '/reports/products',
    dashboard: '/reports/dashboard',
  },
  
  // Usuários
  users: {
    login: '/users/login',
    logout: '/users/logout',
    profile: '/users/profile',
  },
};
