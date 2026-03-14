import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminDb, verifyAuthToken } from '@/lib/firebase/admin';

const VA = process.env.IPAYMU_VA || '';
const API_KEY = process.env.IPAYMU_API_KEY || '';
const IPAYMU_DIRECT_URL = process.env.IPAYMU_DIRECT_URL || 'https://my.ipaymu.com/api/v2/payment/direct';
const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const MIN_DEPOSIT = 5000;
const MAX_DEPOSIT = 50000000;
const COOLDOWN_MS = 30000;

function tsIpaymu() {
  const d = new Date();
  const pad = (x: number) => String(x).padStart(2, '0');
  return (
    d.getFullYear() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

function createSignature(bodyStr: string) {
  const bodyHash = crypto.createHash('sha256').update(bodyStr).digest('hex');
  const stringToSign = `POST:${VA}:${bodyHash}:${API_KEY}`;
  return crypto.createHmac('sha256', API_KEY).update(stringToSign).digest('hex');
}

function calcQrisCompoundFee(amount: number) {
  const step1Total = Math.ceil(amount * 1.007);
  const fee = step1Total - amount;
  return { fee, total: step1Total };
}

export async function POST(request: NextRequest) {
  try {
    if (!VA || !API_KEY) {
      return NextResponse.json(
        { success: false, message: 'iPaymu credentials not configured' },
        { status: 500 }
      );
    }

    // Verify auth token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Missing authorization token' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    const decoded = await verifyAuthToken(token);
    const uid = decoded.uid;

    // Check cooldown
    const lastDeposits = await adminDb
      .collection('deposits')
      .where('uid', '==', uid)
      .where('status', '==', 'PENDING')
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();

    if (!lastDeposits.empty) {
      const lastDeposit = lastDeposits.docs[0].data();
      const lastCreatedAt = Number(lastDeposit?.createdAt || 0);
      if (lastCreatedAt > 0) {
        const diff = Date.now() - lastCreatedAt;
        if (diff < COOLDOWN_MS) {
          const waitSec = Math.ceil((COOLDOWN_MS - diff) / 1000);
          return NextResponse.json(
            {
              success: false,
              message: `Terlalu cepat. Tunggu ${waitSec} detik lalu coba lagi.`,
              cooldownSeconds: waitSec,
            },
            { status: 429 }
          );
        }
      }
    }

    const body = await request.json();
    const { amount, paymentMethod, paymentChannel } = body;

    // Validate amount
    const amountNum = Number(amount);
    if (!amountNum || amountNum < MIN_DEPOSIT) {
      return NextResponse.json(
        { success: false, message: `Minimal deposit Rp ${MIN_DEPOSIT.toLocaleString('id-ID')}` },
        { status: 400 }
      );
    }
    if (amountNum > MAX_DEPOSIT) {
      return NextResponse.json(
        { success: false, message: 'Nominal terlalu besar' },
        { status: 400 }
      );
    }

    if (!paymentMethod || !paymentChannel) {
      return NextResponse.json(
        { success: false, message: 'paymentMethod & paymentChannel wajib' },
        { status: 400 }
      );
    }

    // Get user data
    const userDoc = await adminDb.collection('users').doc(uid).get();
    const userData = userDoc.exists ? userDoc.data() : null;

    // Calculate fee
    const isQRIS = paymentMethod.toUpperCase().includes('QRIS');
    let actualFee = 0;

    if (isQRIS) {
      const { fee } = calcQrisCompoundFee(amountNum);
      actualFee = fee;
    } else {
      actualFee = Math.floor(amountNum * 0.0349) + 1;
    }

    const uniqueCode = 100;
    const chargeAmount = amountNum + actualFee + uniqueCode;

    // Create deposit record
    const depositRef = adminDb.collection('deposits').doc();
    const depositId = depositRef.id;
    const referenceId = `DEP_${depositId}`;
    const now = Date.now();

    await depositRef.set({
      depositId,
      uid,
      amount: amountNum,
      actualFee,
      chargeAmount,
      paymentMethod,
      paymentChannel,
      channel: `${paymentMethod}/${paymentChannel}`,
      status: 'PENDING',
      gatewayRef: referenceId,
      createdAt: now,
      updatedAt: now,
      processedAt: null,
      paidAt: null,
      lastSyncAt: null,
      ipaymuTxId: null,
      ipaymu: { status: 'PENDING' },
    });

    // Call iPaymu
    const customerName = userData?.displayName || 'Customer';
    const customerEmail = userData?.email || `customer${depositId}@gmail.com`;
    const customerPhone = userData?.phone || '08123456789';

    const ipaymuBody = {
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
      product: [`Deposit ${referenceId}`],
      comments: `Deposit ${referenceId}`,
      qty: [1],
      price: [chargeAmount],
      notifyUrl: `${APP_BASE_URL}/api/ipaymu/webhook`,
      returnUrl: `${APP_BASE_URL}/deposit/success?ref=${encodeURIComponent(referenceId)}`,
      referenceId,
      paymentMethod,
      paymentChannel,
      amount: chargeAmount,
    };

    const bodyStr = JSON.stringify(ipaymuBody);
    const signature = createSignature(bodyStr);
    const timestamp = tsIpaymu();

    const ipaymuResponse = await fetch(IPAYMU_DIRECT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        VA,
        Signature: signature,
        Timestamp: timestamp,
      },
      body: bodyStr,
    });

    const rawResponse = await ipaymuResponse.text();
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(rawResponse);
    } catch {
      parsedResponse = null;
    }

    if (!parsedResponse || parsedResponse?.Status !== 200) {
      await depositRef.set(
        { status: 'FAILED', updatedAt: Date.now(), ipaymu: { status: 'FAILED', resp: parsedResponse } },
        { merge: true }
      );
      return NextResponse.json(
        { success: false, message: 'Gagal membuat invoice', data: parsedResponse },
        { status: 400 }
      );
    }

    const invoiceData = parsedResponse?.Data || {};
    const paymentUrl =
      invoiceData?.Url ||
      invoiceData?.PaymentUrl ||
      invoiceData?.RedirectUrl ||
      invoiceData?.DirectUrl ||
      '';

    const ipaymuTxId =
      invoiceData?.TransactionId ||
      invoiceData?.TransactionID ||
      invoiceData?.transactionId ||
      invoiceData?.SessionId ||
      invoiceData?.SessionID ||
      invoiceData?.sessionId ||
      null;

    await depositRef.set(
      {
        updatedAt: Date.now(),
        lastSyncAt: Date.now(),
        ipaymuTxId,
        ipaymu: { status: 'CREATED', invoice: invoiceData },
        paymentUrl: paymentUrl || null,
      },
      { merge: true }
    );

    return NextResponse.json({
      success: true,
      depositId,
      referenceId,
      amount: amountNum,
      actualFee,
      chargeAmount,
      ipaymuTxId,
      paymentUrl: paymentUrl || null,
      invoice: invoiceData,
    });
  } catch (error: any) {
    console.error('Create invoice error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
