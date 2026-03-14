import { NextRequest, NextResponse } from 'next/server';
import { adminDb, verifyAuthToken } from '@/lib/firebase/admin';

const SMM_API_KEY = process.env.SMM_API_KEY || '';
const SMM_BASE_URL = 'https://smm.id/api/v2';
const DISCOUNT_PER_ITEM = 1000;

async function smmPost(action: string, payload: any = {}) {
  const body = new URLSearchParams({
    key: SMM_API_KEY,
    action,
    ...payload,
  });

  const response = await fetch(SMM_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  const data = await response.json();
  return data;
}

function calcSmmFee(amount: number): number {
  const a = Number(amount || 0);
  if (!(a > 0)) return 0;

  const ceil = (x: number) => Math.ceil(x);
  let profit = 0;

  if (a < 5000) {
    profit = 500 + ((a - 1) * (3000 / 4999));
  } else if (a < 10000) {
    profit = 3500 + ((a - 5000) * (1500 / 5000));
  } else if (a < 15000) {
    profit = 5000 + ((a - 10000) * (2500 / 5000));
  } else if (a < 20000) {
    profit = 7500 + ((a - 15000) * (2500 / 5000));
  } else if (a < 30000) {
    profit = 10000 + ((a - 20000) * (2500 / 10000));
  } else if (a < 40000) {
    profit = 12500 + ((a - 30000) * (1500 / 10000));
  } else if (a < 50000) {
    profit = 14000 + ((a - 40000) * (3000 / 10000));
  } else if (a < 70000) {
    profit = 17000 + ((a - 50000) * (3000 / 20000));
  } else {
    profit = 20000;
  }

  return ceil(profit);
}

function calcTotalFromRatePer1000(ratePer1000: number, qty: number): number {
  const q = Math.max(0, parseInt(String(qty), 10) || 0);
  const r = Math.max(0, Number(ratePer1000 || 0));
  if (q <= 0 || r <= 0) return 0;
  return Math.floor((r * q + 999) / 1000);
}

export async function POST(request: NextRequest) {
  try {
    if (!SMM_API_KEY) {
      return NextResponse.json(
        { success: false, message: 'SMM API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { service, link, quantity, guest_email } = body;

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

    if (!service || !link || !quantity) {
      return NextResponse.json(
        { success: false, message: 'service, link & quantity wajib' },
        { status: 400 }
      );
    }

    const qtyInt = parseInt(String(quantity), 10);
    if (qtyInt <= 0) {
      return NextResponse.json(
        { success: false, message: 'Quantity tidak valid' },
        { status: 400 }
      );
    }

    // Get services to find the rate
    const servicesResult = await smmPost('services');
    if (!Array.isArray(servicesResult)) {
      return NextResponse.json(
        { success: false, message: 'Gagal mengambil data layanan' },
        { status: 500 }
      );
    }

    const serviceData = servicesResult.find((s: any) => String(s.service) === String(service));
    if (!serviceData) {
      return NextResponse.json(
        { success: false, message: 'Layanan tidak ditemukan' },
        { status: 404 }
      );
    }

    // Validate quantity
    const min = parseInt(serviceData.min, 10) || 0;
    const max = parseInt(serviceData.max, 10) || 0;

    if (min > 0 && qtyInt < min) {
      return NextResponse.json(
        { success: false, message: `Minimal order ${min}` },
        { status: 400 }
      );
    }
    if (max > 0 && qtyInt > max) {
      return NextResponse.json(
        { success: false, message: `Maksimal order ${max}` },
        { status: 400 }
      );
    }

    // Calculate price
    const baseRate = Number(serviceData.rate || 0);
    const chargedRate = baseRate + calcSmmFee(baseRate);
    const baseTotal = calcTotalFromRatePer1000(baseRate, qtyInt);
    let finalTotal = calcTotalFromRatePer1000(chargedRate, qtyInt);
    let discount = 0;

    // Apply discount for logged in users
    if (isLoggedIn) {
      finalTotal = Math.max(0, finalTotal - DISCOUNT_PER_ITEM);
      discount = DISCOUNT_PER_ITEM;
    }

    // Check balance for logged in users
    if (isLoggedIn && userData) {
      if ((userData.balance || 0) < finalTotal) {
        return NextResponse.json(
          { success: false, message: 'Saldo tidak cukup', code: 'INSUFFICIENT_BALANCE' },
          { status: 402 }
        );
      }
    }

    // Place order with SMM
    const orderResult = await smmPost('add', {
      service,
      link,
      quantity: String(qtyInt),
    });

    if (orderResult.error) {
      return NextResponse.json(
        { success: false, message: orderResult.error },
        { status: 400 }
      );
    }

    const providerOrderId = orderResult.order;

    // Deduct balance for logged in users
    if (isLoggedIn && uid) {
      await adminDb.collection('users').doc(uid).update({
        balance: (userData?.balance || 0) - finalTotal,
        updatedAt: Date.now(),
      });
    }

    // Create order record
    const orderRef = adminDb.collection('orders').doc();
    const orderData: any = {
      orderId: orderRef.id,
      providerOrderId,
      productId: service,
      productName: serviceData.name,
      productType: 'sosmed',
      target: link,
      quantity: qtyInt,
      price: baseTotal,
      fee: calcSmmFee(baseRate),
      discount,
      total: finalTotal,
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
        providerOrderId,
        total: finalTotal,
        discount,
        status: 'pending',
        message: 'Order berhasil dibuat',
      },
    });
  } catch (error: any) {
    console.error('SMM order error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
