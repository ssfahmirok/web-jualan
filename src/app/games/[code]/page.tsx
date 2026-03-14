import { fetchGameServices } from '@/lib/api/vipWorker';
import GameDetailClient from './GameDetailClient';

// Common game codes for static generation
const commonGameCodes = [
  'mlbb',
  'freefire',
  'pubgm',
  'genshin',
  'valorant',
  'codm',
  'aov',
  'lolwr',
  'mobilelegends',
  'ff',
  'pubg',
];

// Generate static params for common games
export async function generateStaticParams() {
  try {
    // Try to fetch services, fallback to common codes if it fails
    const services = await fetchGameServices().catch(() => []);
    const codes = services.length > 0 
      ? services.map((service) => ({ code: encodeURIComponent(service.code) }))
      : commonGameCodes.map((code) => ({ code: encodeURIComponent(code) }));
    return codes;
  } catch (error) {
    console.error('Error generating static params:', error);
    // Return common codes as fallback
    return commonGameCodes.map((code) => ({ code: encodeURIComponent(code) }));
  }
}

// Force static generation
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function GameDetailPage({ params }: PageProps) {
  const { code } = await params;
  return <GameDetailClient code={decodeURIComponent(code)} />;
}
