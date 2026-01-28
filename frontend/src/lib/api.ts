const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `API Error: ${res.status}`);
  }

  return res.json();
}

// Products
export const productsApi = {
  getAll: () => fetchAPI<import('@/types').Product[]>('/products'),
  getById: (id: string) => fetchAPI<import('@/types').Product>(`/products/${id}`),
  search: (query: string) => fetchAPI<import('@/types').Product[]>(`/products/search?q=${encodeURIComponent(query)}`),
  create: (data: { name: string; specification?: string; unit: string }) =>
    fetchAPI<import('@/types').Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: { name?: string; specification?: string; unit?: string }) =>
    fetchAPI<import('@/types').Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchAPI<void>(`/products/${id}`, {
      method: 'DELETE',
    }),
};

// Receivings
export const receivingsApi = {
  getAll: () => fetchAPI<import('@/types').Receiving[]>('/receivings'),
  getById: (id: string) => fetchAPI<import('@/types').Receiving>(`/receivings/${id}`),
  create: (data: {
    receivingDate: string;
    deliverySlipNo?: string;
    note?: string;
    details: { productId: string; quantity: number; unitPrice: number }[];
  }) =>
    fetchAPI<import('@/types').Receiving>('/receivings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Inventory
export const inventoryApi = {
  getAll: () => fetchAPI<import('@/types').Inventory[]>('/inventory'),
  getSummary: () => fetchAPI<import('@/types').InventorySummary[]>('/inventory/summary'),
  getByProductId: (productId: string) =>
    fetchAPI<{ product: import('@/types').Product; inventories: import('@/types').Inventory[] }>(
      `/inventory/${productId}`
    ),
};
