const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

interface ApiCallOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  params?: URLSearchParams;
}

export async function apiCall<T>(endpoint: string, options?: ApiCallOptions): Promise<T> {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (options?.params) {
    options.params.forEach((value, key) => {
      url.searchParams.append(key, value);
    });
  }

  const response = await fetch(url.toString(), {
    method: options?.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: options?.body,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Erro na requisição da API');
  }

  return response.json() as Promise<T>;
}

export const API_ENDPOINTS = {
  pedidos: {
    list: '/pedidos/',
    get: (id: number) => `/pedidos/${id}/`,
    updateStatus: (id: number) => `/pedidos/${id}/status/`,
  },
  reports: {
    generate: '/reports/',
  },
  impressora: {
    list: '/impressoras/',
    add: '/impressoras/',
    get: (id: number) => `/impressoras/${id}/`,
    update: (id: number) => `/impressoras/${id}/`,
    delete: (id: number) => `/impressoras/${id}/`,
    test: (id: number) => `/impressoras/${id}/test/`,
  },
};
