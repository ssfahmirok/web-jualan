import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const VIP_API_ID = process.env.VIP_API_ID || '';
const VIP_API_KEY = process.env.VIP_API_KEY || '';
const VIP_BASE = 'https://vip-reseller.co.id';

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

// Image mapping for games
const gameImages: Record<string, string> = {
  'Mobile Legends': 'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/mlbb_tile.jpg',
  'Free Fire': 'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/freefire_tile.jpg',
  'PUBG Mobile': 'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/pubgm_tile.jpg',
  'Genshin Impact': 'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/genshin_tile.jpg',
  'Valorant': 'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/valorant_tile.jpg',
  'Call of Duty Mobile': 'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/codmobile_tile.jpg',
  'Arena of Valor': 'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/aov_tile.jpg',
  'League of Legends': 'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/lolwildrift_tile.png',
  'Roblox': 'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/roblox_tile.jpg',
  'Steam': 'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/steam_tile.jpg',
};

function getGameImage(gameName: string): string {
  for (const [key, url] of Object.entries(gameImages)) {
    if (gameName.toLowerCase().includes(key.toLowerCase())) {
      return url;
    }
  }
  return 'https://placehold.co/400x400/1a1a2e/FFF?text=Game';
}

export async function GET(request: NextRequest) {
  try {
    if (!VIP_API_ID || !VIP_API_KEY) {
      return NextResponse.json(
        { success: false, message: 'VIP credentials not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'game';
    const filter_game = searchParams.get('filter_game');
    const filter_status = searchParams.get('filter_status');

    let endpoint = '/api/game-feature';
    let payload: any = { type: 'services' };

    if (type === 'prepaid') {
      endpoint = '/api/prepaid';
      const filter_type = searchParams.get('filter_type');
      const filter_value = searchParams.get('filter_value');
      if (filter_type) payload.filter_type = filter_type;
      if (filter_value) payload.filter_value = filter_value;
    } else {
      if (filter_game) payload.filter_game = filter_game;
      if (filter_status) payload.filter_status = filter_status;
    }

    const result = await vipPost(endpoint, payload);

    if (!result.result && !result.Result) {
      return NextResponse.json(
        { success: false, message: result.message || 'Failed to fetch services' },
        { status: 500 }
      );
    }

    const services = result.data || [];
    
    // Transform and add images
    const transformedServices = services.map((service: any) => ({
      id: service.service || service.code || service.id,
      code: service.service || service.code || service.id,
      name: service.name || service.service_name,
      category: service.category || service.game || service.brand,
      game: service.game,
      brand: service.brand,
      type: type as 'game' | 'ppob',
      price: Number(service.price?.basic || service.price?.premium || service.price?.special || service.harga || service.price || 0),
      priceBase: Number(service.price?.basic || service.price?.premium || service.price?.special || service.harga || service.price || 0),
      fee: 0,
      priceTotal: Number(service.price?.basic || service.price?.premium || service.price?.special || service.harga || service.price || 0),
      min: service.min,
      max: service.max,
      imageUrl: getGameImage(service.game || service.name || ''),
      description: service.note || service.description,
      status: service.status?.toLowerCase() === 'empty' ? 'empty' : 'active',
    }));

    return NextResponse.json({ success: true, data: transformedServices });
  } catch (error: any) {
    console.error('VIP services error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
