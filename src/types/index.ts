export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  balance: number;
  role: 'USER' | 'ADMIN';
  createdAt: number;
  updatedAt: number;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  game?: string;
  brand?: string;
  type: 'game' | 'ppob' | 'streaming' | 'sosmed';
  price: number;
  priceBase: number;
  fee: number;
  priceTotal: number;
  min?: number;
  max?: number;
  imageUrl?: string;
  description?: string;
  status: 'active' | 'inactive' | 'empty';
}

export interface Order {
  id: string;
  orderId: string;
  trxid?: string;
  uid?: string;
  guestEmail?: string;
  productId: string;
  productName: string;
  productType: 'game' | 'ppob' | 'streaming' | 'sosmed';
  target: string;
  zone?: string;
  quantity?: number;
  price: number;
  fee: number;
  total: number;
  status: 'pending' | 'processing' | 'success' | 'failed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod?: string;
  paymentUrl?: string;
  createdAt: number;
  updatedAt: number;
  paidAt?: number;
  note?: string;
  raw?: any;
}

export interface Deposit {
  depositId: string;
  uid: string;
  amount: number;
  actualFee: number;
  chargeAmount: number;
  paymentMethod: string;
  paymentChannel: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REVIEW';
  gatewayRef: string;
  paymentUrl?: string;
  createdAt: number;
  updatedAt: number;
  paidAt?: number;
  ipaymuTxId?: string;
}

export interface PaymentChannel {
  code: string;
  name: string;
  paymentMethod: string;
  paymentChannel: string;
  fee: number;
  feePercent: number;
  minAmount: number;
  maxAmount: number;
  image?: string;
}

export interface CartItem {
  product: Product;
  target: string;
  zone?: string;
  quantity: number;
}

export interface GameCategory {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
}

export interface SmmService {
  id: string;
  category: string;
  name: string;
  note: string;
  min: number;
  max: number;
  price: number;
  baseRatePer1000: number;
  chargedRatePer1000: number;
  type: string;
  refill: boolean;
  cancel: boolean;
}
