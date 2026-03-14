export const dynamic = 'force-static';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const VA = process.env.IPAYMU_VA || '';
const API_KEY = process.env.IPAYMU_API_KEY || '';

export async function GET(request: NextRequest) {
  try {
    if (!VA || !API_KEY) {
      return NextResponse.json(
        { success: false, message: 'iPaymu credentials not configured' },
        { status: 500 }
      );
    }

    const method = 'GET';
    const bodyStr = '{}';
    const bodyHash = crypto.createHash('sha256').update(bodyStr).digest('hex').toLowerCase();
    const stringToSign = `${method}:${VA}:${bodyHash}:${API_KEY}`;
    const signature = crypto.createHmac('sha256', API_KEY).update(stringToSign).digest('hex');
    const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);

    const response = await fetch('https://my.ipaymu.com/api/v2/payment-channels', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        va: VA,
        signature,
        timestamp,
      },
    });

    const data = await response.json();

    if (!data.Success) {
      return NextResponse.json(
        { success: false, message: data.Message || 'Failed to fetch channels' },
        { status: 500 }
      );
    }

    // Transform channels data
    const channels = data.Data?.map((channel: any) => ({
      code: channel.Code || channel.code,
      name: channel.Name || channel.name,
      paymentMethod: channel.PaymentMethod || channel.paymentMethod,
      paymentChannel: channel.PaymentChannel || channel.paymentChannel,
      fee: channel.Fee || channel.fee || 0,
      feePercent: channel.FeePercent || channel.feePercent || 0,
      minAmount: channel.MinAmount || channel.minAmount || 5000,
      maxAmount: channel.MaxAmount || channel.maxAmount || 50000000,
      image: channel.Image || channel.image,
    })) || [];

    return NextResponse.json({ success: true, data: channels });
  } catch (error: any) {
    console.error('iPaymu channels error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
