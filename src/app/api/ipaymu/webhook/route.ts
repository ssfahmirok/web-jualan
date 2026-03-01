import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminDb } from '@/lib/firebase/admin';

const IPAYMU_WEBHOOK_SECRET = process.env.IPAYMU_WEBHOOK_SECRET || '';

function safeStr(v: any, max = 200): string {
  return String(v ?? '').trim().slice(0, max);
}

function isPaidStatus(paidStatus: any, data?: any): boolean {
  if (paidStatus === 1 || paidStatus === '1') return true;

  const s = String(paidStatus || '').toUpperCase();
  if (['PAID', 'SUCCESS', 'COMPLETED', 'SETTLED', 'BERHASIL'].includes(s)) return true;

  const paidStatus2 = String(data?.PaidStatus || data?.paid_status || data?.paidStatus || '')
    .trim()
    .toLowerCase();
  if (paidStatus2 === 'paid') return true;

  const settlement = String(data?.SettlementStatus || data?.settlement_status || '')
    .trim()
    .toUpperCase();
  if (settlement === 'SETTLED') return true;

  const trxStatus = String(data?.StatusDesc || data?.status_desc || '').trim().toUpperCase();
  if (trxStatus === 'BERHASIL') return true;

  return false;
}

async function readRawBody(req: NextRequest): Promise<string> {
  const chunks: Uint8Array[] = [];
  const reader = req.body?.getReader();
  if (!reader) return '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  return Buffer.concat(chunks.map((c) => Buffer.from(c))).toString('utf8');
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await readRawBody(request);

    // Verify signature if configured
    if (IPAYMU_WEBHOOK_SECRET) {
      const gotSig = safeStr(request.headers.get('x-client-signature'), 200).toLowerCase();
      const ts = safeStr(request.headers.get('x-timestamp'), 120);

      if (gotSig && ts) {
        const expected = crypto
          .createHmac('sha256', IPAYMU_WEBHOOK_SECRET)
          .update(`${rawBody}${ts}`)
          .digest('hex');

        if (gotSig !== expected.toLowerCase()) {
          return NextResponse.json({ ok: false, message: 'Invalid signature' }, { status: 401 });
        }
      }
    }

    // Parse payload
    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      const params = new URLSearchParams(rawBody);
      payload = Object.fromEntries(params.entries());
    }

    // Extract reference ID
    const referenceId =
      safeStr(payload?.reference_id, 120) ||
      safeStr(payload?.sid, 120) ||
      safeStr(payload?.referenceId, 120) ||
      safeStr(payload?.ReferenceId, 120);

    if (!referenceId) {
      return NextResponse.json(
        { ok: true, ignored: true, reason: 'MISSING_REFERENCE_ID' },
        { status: 200 }
      );
    }

    // Log webhook
    const eventHash = crypto.createHash('sha256').update(rawBody).digest('hex');
    await adminDb
      .collection('webhook_logs')
      .doc(`${referenceId}_${eventHash.slice(0, 12)}`)
      .set(
        {
          referenceId,
          eventHash,
          receivedAt: Date.now(),
          payload,
        },
        { merge: true }
      );

    // Find deposit
    const deposits = await adminDb
      .collection('deposits')
      .where('gatewayRef', '==', referenceId)
      .limit(1)
      .get();

    if (deposits.empty) {
      return NextResponse.json(
        { ok: true, ignored: true, reason: 'DEPOSIT_NOT_FOUND', referenceId },
        { status: 200 }
      );
    }

    const depositDoc = deposits.docs[0];
    const deposit = depositDoc.data();

    // Already processed
    if (deposit.processedAt) {
      return NextResponse.json(
        { ok: true, referenceId, result: { ok: true, alreadyProcessed: true } },
        { status: 200 }
      );
    }

    // Check payment status
    const paidStatus =
      payload?.status ||
      payload?.Status ||
      payload?.data?.status ||
      payload?.data?.Status;

    const isPaid = isPaidStatus(paidStatus, payload);

    if (isPaid) {
      // Credit user balance
      await adminDb.runTransaction(async (transaction) => {
        const userRef = adminDb.collection('users').doc(deposit.uid);
        const userDoc = await transaction.get(userRef);

        if (!userDoc.exists) {
          transaction.set(userRef, {
            uid: deposit.uid,
            balance: deposit.amount,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });
        } else {
          const currentBalance = userDoc.data()?.balance || 0;
          transaction.update(userRef, {
            balance: currentBalance + deposit.amount,
            updatedAt: Date.now(),
          });
        }

        transaction.update(depositDoc.ref, {
          status: 'PAID',
          paidAt: Date.now(),
          processedAt: Date.now(),
          updatedAt: Date.now(),
        });
      });

      return NextResponse.json(
        { ok: true, referenceId, result: { ok: true, paid: true, credited: true } },
        { status: 200 }
      );
    } else {
      // Update status only
      await depositDoc.ref.set(
        {
          status: String(paidStatus || deposit.status || 'PENDING').toUpperCase(),
          updatedAt: Date.now(),
          lastSyncAt: Date.now(),
        },
        { merge: true }
      );

      return NextResponse.json(
        { ok: true, referenceId, result: { ok: true, paid: false, status: paidStatus } },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { ok: false, message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
