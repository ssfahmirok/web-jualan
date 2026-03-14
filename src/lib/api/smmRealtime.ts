// SMM Realtime Database API
const RTDB_BASE_URL = "https://pembayaran-ardinastore-apk-default-rtdb.asia-southeast1.firebasedatabase.app";

export interface SmmOrder {
  orderId: string;
  category: string;
  serviceId: string;
  serviceName: string;
  quantity: number;
  totalPrice: number;
  chargedRatePer1000: number;
  status: string;
  target?: string;
  startCount?: number;
  remains?: number;
  refunded?: number;
  createdAt: number;
  updatedAt: number;
  publicKey?: string;
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

// Fetch SMM Orders from Realtime Database
export async function fetchSmmOrders(uid: string): Promise<SmmOrder[]> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const response = await fetch(
    `${RTDB_BASE_URL}/smm_private/${uid}.json?auth=${token}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch SMM orders: ${response.statusText}`);
  }

  const data = await response.json();
  
  if (!data) {
    return [];
  }

  // Convert object to array
  return Object.entries(data).map(([key, value]: [string, any]) => ({
    ...value,
    _key: key,
  })) as SmmOrder[];
}

// Fetch SMM Services (from API route)
export async function fetchSmmServices(): Promise<any[]> {
  const response = await fetch('/api/smm/services');
  
  if (!response.ok) {
    throw new Error(`Failed to fetch SMM services: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data || [];
}

// Place SMM Order
export async function placeSmmOrder(orderData: {
  service: string;
  link: string;
  quantity: number;
}): Promise<any> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const response = await fetch('/api/smm/order', {
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

// Check SMM Order Status
export async function checkSmmStatus(orderId: string, privateKey?: string, publicKey?: string): Promise<any> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const response = await fetch('/api/smm/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      action: 'status',
      id: orderId,
      privateKey,
      publicKey,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to check status: ${response.statusText}`);
  }

  return response.json();
}
