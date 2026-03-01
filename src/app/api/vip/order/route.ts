import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminDb, verifyAuthToken } from '@/lib/firebase/admin';

const VIP_API_ID = process.env.VIP_API_ID || '';
const VIP_API_KEY = process.env.VIP_API_KEY || '';
const VIP_BASE = 'https://vip-reseller.co.id';
const DISCOUNT_PER_ITEM = 1000;

function md5(input: string): string {
  return crypto.createHash('md5').update(input).digest('hex');
}

function makeVipSign(): string {
  return md5(`${VIP_API_ID}${VIP_API_KEY}`);
}

async function vipPost(path: string, payload: any) {
  const url = `${VIP_BASE}${path}`;
  const body = new URLSearchParams({
    key: VIP_API_KEY,
    sign: makeVipSign(),
    ...payload,
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  const data = await response.json();
  return data;
}

function calcLevelFromBalance(balance: number): string {
  if (balance >= 1_000_000) return 'VIP';
  if (balance >= 500_000) return 'PRO';
  if (balance >= 200_000) return 'RESELLER';
  return 'MEMBER';
}

function feeByLevel(level: string, role: string): number {
  if (role === 'ADMIN') return 0;
  switch (level) {
    case 'VIP':
      return 300;
    case 'PRO':
      return 500;
    case 'RESELLER':
      return 750;
    default:
      return 1000;
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!VIP_API_ID || !VIP_API_KEY) {
      return NextResponse.json(
        { success: false, message: 'VIP credentials not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { type, service, data_no, data_zone, quantity, guest_email } = body;

    let uid: string | null = null;
    let userData: any = null;
    let isLoggedIn = false;

    // Check if user is logged in
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.split('Bearer ')[1];
        const decoded = await verifyAuthToken(token);
        uid = decoded.uid;
        const userDoc = await adminDb.collection('users').doc(uid).get();
        if (userDoc.exists) {
          userData = userDoc.data();
          isLoggedIn = true;
        }
      } catch (error) {
        console.log('Auth error, proceeding as guest:', error);
      }
    }

    // Guest checkout requires email
    if (!isLoggedIn && !guest_email) {
      return NextResponse.json(
        { success: false, message: 'Email wajib diisi untuk pembelian tanpa login' },
        { status: 400 }
      );
    }

    if (!service || !data_no) {
      return NextResponse.json(
        { success: false, message: 'service & data_no wajib' },
        { status: 400 }
      );
    }

    // Get service details from VIP
    const servicesResult = await vipPost(type === 'prepaid' ? '/api/prepaid' : '/api/game-feature', {
      type: 'services',
    });

    if (!servicesResult.result && !servicesResult.Result) {
      return NextResponse.json(
        { success: false, message: 'Gagal mengambil data layanan' },
        { status: 500 }
      );
    }

    const services = servicesResult.data || [];
    const serviceData = services.find((s: any) => 
      (s.service || s.code || s.id) === service
    );

    if (!serviceData) {
      return NextResponse.json(
        { success: false, message: 'Layanan tidak ditemukan' },
        { status: 404 }
      );
    }

    // Calculate price
    const basePrice = Number(
      serviceData.price?.basic || 
      serviceData.price?.premium || 
      serviceData.price?.special || 
      serviceData.harga || 
      serviceData.price || 0
    );

    let finalPrice = basePrice;
    let discount = 0;

    // Apply discount for logged in users
    if (isLoggedIn && userData) {
      const level = calcLevelFromBalance(userData.balance || 0);
      const fee = feeByLevel(level, userData.role || 'USER');
      finalPrice = basePrice + fee - DISCOUNT_PER_ITEM;
      discount = DISCOUNT_PER_ITEM;
    }

    // Check balance for logged in users
    if (isLoggedIn && userData) {
      if ((userData.balance || 0) < finalPrice) {
        return NextResponse.json(
          { success: false, message: 'Saldo tidak cukup', code: 'INSUFFICIENT_BALANCE' },
          { status: 402 }
        );
      }
    }

    // Place order with VIP
    const orderPayload: any = {
      type: 'order',
      service,
      data_no,
    };

    if (data_zone) orderPayload.data_zone = data_zone;
    if (quantity) orderPayload.quantity = String(quantity);

    const orderResult = await vipPost(
      type === 'prepaid' ? '/api/prepaid' : '/api/game-feature',
      orderPayload
    );

    if (!orderResult.result && !orderResult.Result) {
      return NextResponse.json(
        { 
          success: false, 
          message: orderResult.message || 'Gagal membuat order',
          data: orderResult 
        },
        { status: 400 }
      );
    }

    const trxid = orderResult.data?.trxid || orderResult.trxid;

    // Deduct balance for logged in users
    if (isLoggedIn && uid) {
      await adminDb.collection('users').doc(uid).update({
        balance: (userData?.balance || 0) - finalPrice,
        updatedAt: Date.now(),
      });
    }

    // Create order record
    const orderRef = adminDb.collection('orders').doc();
    const orderData: any = {
      orderId: orderRef.id,
      trxid,
      productId: service,
      productName: serviceData.name || serviceData.service_name,
      productType: type,
      target: data_no,
      zone: data_zone || null,
      quantity: quantity || 1,
      price: basePrice,
      fee: isLoggedIn ? feeByLevel(calcLevelFromBalance(userData?.balance || 0), userData?.role || 'USER') : 0,
      discount,
      total: finalPrice,
      status: 'pending',
      paymentStatus: isLoggedIn ? 'paid' : 'pending',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      raw: orderResult,
    };

    if (isLoggedIn && uid) {
      orderData.uid = uid;
    } else if (guest_email) {
      orderData.guestEmail = guest_email;
    }

    await orderRef.set(orderData);

    return NextResponse.json({
      success: true,
      data: {
        orderId: orderRef.id,
        trxid,
        total: finalPrice,
        discount,
        status: 'pending',
        message: 'Order berhasil dibuat',
      },
    });
  } catch (error: any) {
    console.error('VIP order error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
