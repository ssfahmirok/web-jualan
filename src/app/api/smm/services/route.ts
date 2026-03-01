import { NextRequest, NextResponse } from 'next/server';

const SMM_API_KEY = process.env.SMM_API_KEY || '';
const SMM_BASE_URL = 'https://smm.id/api/v2';

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

export async function GET(request: NextRequest) {
  try {
    if (!SMM_API_KEY) {
      return NextResponse.json(
        { success: false, message: 'SMM API key not configured' },
        { status: 500 }
      );
    }

    const result = await smmPost('services');

    if (!Array.isArray(result)) {
      return NextResponse.json(
        { success: false, message: 'Invalid response from SMM provider' },
        { status: 500 }
      );
    }

    // Transform services
    const transformedServices = result.map((service: any) => {
      const baseRate = Number(service.rate || 0);
      const chargedRate = baseRate + calcSmmFee(baseRate);

      return {
        id: String(service.service),
        category: service.category,
        name: service.name,
        note: service.type || '',
        min: parseInt(service.min, 10) || 0,
        max: parseInt(service.max, 10) || 0,
        price: baseRate,
        baseRatePer1000: baseRate,
        chargedRatePer1000: chargedRate,
        type: service.type,
        refill: service.refill ? true : false,
        cancel: service.cancel ? true : false,
      };
    });

    return NextResponse.json({ success: true, data: transformedServices });
  } catch (error: any) {
    console.error('SMM services error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
