// VIP Worker API - Cloudflare Worker Integration
const VIP_WORKER_BASE_URL = "https://order-games-vipayment.fahmikemenag959.workers.dev";

// Types
export interface VipService {
  service: string;
  code: string;
  name: string;
  game?: string;
  brand?: string;
  category?: string;
  price: number;
  priceBase: number;
  fee: number;
  priceTotal: number;
  min?: number;
  max?: number;
  imageUrl?: string;
  status?: string;
  note?: string;
  type?: string;
}

export interface VipOrderResponse {
  result: boolean;
  message?: string;
  data?: {
    trxid?: string;
    status?: string;
    note?: string;
    [key: string]: any;
  };
}

export interface MyOrder {
  trxid: string;
  kind: string;
  service: string;
  serviceName: string;
  brand?: string;
  game?: string;
  status: string;
  price: number;
  fee: number;
  total: number;
  data_no: string;
  data_zone?: string;
  createdAt: number;
  updatedAt: number;
  note?: string;
  message?: string;
}

// Helper to get auth token
async function getAuthToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  
  const { getAuth } = await import('firebase/auth');
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user) return null;
  return user.getIdToken();
}

// Fetch Game Services
export async function fetchGameServices(filter?: { filter_game?: string; filter_status?: string }): Promise<VipService[]> {
  const token = await getAuthToken();
  
  const url = new URL(`${VIP_WORKER_BASE_URL}/?action=game_services`);
  
  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify(filter || {}),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch game services: ${response.statusText}`);
  }

  const data = await response.json();
  
  if (!data.result && !data.Result) {
    throw new Error(data.message || 'Failed to fetch services');
  }

  return data.data || [];
}

// Fetch Prepaid Services (PPOB)
export async function fetchPrepaidServices(filter?: { filter_type?: string; filter_value?: string }): Promise<VipService[]> {
  const token = await getAuthToken();
  
  const url = new URL(`${VIP_WORKER_BASE_URL}/?action=prepaid_services`);
  
  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify(filter || {}),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch prepaid services: ${response.statusText}`);
  }

  const data = await response.json();
  
  if (!data.result && !data.Result) {
    throw new Error(data.message || 'Failed to fetch services');
  }

  return data.data || [];
}

// Place Game Order
export async function placeGameOrder(orderData: {
  service: string;
  data_no: string;
  data_zone?: string;
  pin?: string;
}): Promise<VipOrderResponse> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const url = new URL(`${VIP_WORKER_BASE_URL}/?action=game_order`);
  
  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    throw new Error(`Failed to place order: ${response.statusText}`);
  }

  return response.json();
}

// Place Prepaid Order (PPOB)
export async function placePrepaidOrder(orderData: {
  service: string;
  data_no: string;
  pin?: string;
}): Promise<VipOrderResponse> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const url = new URL(`${VIP_WORKER_BASE_URL}/?action=prepaid_order`);
  
  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    throw new Error(`Failed to place order: ${response.statusText}`);
  }

  return response.json();
}

// Get My Orders
export async function fetchMyOrders(params?: {
  kind?: 'game' | 'prepaid' | '';
  limit?: number;
  mode?: 'mine' | 'all';
}): Promise<{ result: boolean; data: MyOrder[]; count: number; limit: number; mode: string }> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const url = new URL(`${VIP_WORKER_BASE_URL}/?action=my_orders`);
  
  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(params || {}),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch orders: ${response.statusText}`);
  }

  return response.json();
}

// Sync Order Status
export async function syncOrderStatus(trxid: string): Promise<VipOrderResponse> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const url = new URL(`${VIP_WORKER_BASE_URL}/?action=sync_order_status`);
  
  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ trxid }),
  });

  if (!response.ok) {
    throw new Error(`Failed to sync order status: ${response.statusText}`);
  }

  return response.json();
}

// Get Game Nickname
export async function getGameNickname(code: string, target: string, additionalTarget?: string): Promise<any> {
  const token = await getAuthToken();
  
  const url = new URL(`${VIP_WORKER_BASE_URL}/?action=game_get_nickname`);
  
  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify({
      code,
      target,
      additional_target: additionalTarget,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get nickname: ${response.statusText}`);
  }

  return response.json();
}

// Check Game Stock
export async function checkGameStock(service: string): Promise<any> {
  const token = await getAuthToken();
  
  const url = new URL(`${VIP_WORKER_BASE_URL}/?action=game_service_stock`);
  
  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify({ service }),
  });

  if (!response.ok) {
    throw new Error(`Failed to check stock: ${response.statusText}`);
  }

  return response.json();
}
