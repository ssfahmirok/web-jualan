'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import {
  Gamepad2,
  ArrowLeft,
  Info,
  CheckCircle,
  AlertCircle,
  Zap,
  User,
  Mail,
} from 'lucide-react';
import { toast } from 'sonner';

interface GameService {
  id: string;
  code: string;
  name: string;
  category: string;
  game: string;
  type: string;
  price: number;
  priceBase: number;
  fee: number;
  priceTotal: number;
  min?: number;
  max?: number;
  imageUrl: string;
  description?: string;
  status: string;
}

export default function GameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const code = decodeURIComponent(params.code as string);

  const [service, setService] = useState<GameService | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [target, setTarget] = useState('');
  const [zone, setZone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [orderResult, setOrderResult] = useState<any>(null);

  useEffect(() => {
    fetchService();
  }, [code]);

  const fetchService = async () => {
    try {
      const response = await fetch('/api/vip/services?type=game');
      const data = await response.json();

      if (data.success) {
        const found = data.data.find((s: GameService) => s.code === code);
        if (found) {
          setService(found);
        } else {
          toast.error('Layanan tidak ditemukan');
          router.push('/games');
        }
      }
    } catch (error) {
      console.error('Error fetching service:', error);
      toast.error('Gagal memuat data layanan');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;

    if (!target) {
      toast.error('ID/No. HP wajib diisi');
      return;
    }

    if (!user && !guestEmail) {
      toast.error('Email wajib diisi untuk pembelian tanpa login');
      return;
    }

    setSubmitting(true);

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (user) {
        const token = await user.getIdToken?.();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      const response = await fetch('/api/vip/order', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          type: 'game',
          service: service.code,
          data_no: target,
          data_zone: zone || undefined,
          guest_email: !user ? guestEmail : undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOrderResult(data.data);
        toast.success('Order berhasil dibuat!');
      } else {
        if (data.code === 'INSUFFICIENT_BALANCE') {
          toast.error('Saldo tidak cukup. Silakan top up saldo terlebih dahulu.');
        } else {
          toast.error(data.message || 'Gagal membuat order');
        }
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const getDiscountedPrice = () => {
    if (!service) return 0;
    if (user) {
      return Math.max(0, service.priceTotal - 1000);
    }
    return service.priceTotal;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-32 bg-slate-900 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-64 bg-slate-900" />
            <Skeleton className="h-96 bg-slate-900" />
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-slate-950 py-8 flex items-center justify-center">
        <div className="text-center">
          <Gamepad2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Layanan tidak ditemukan
          </h2>
          <Button onClick={() => router.push('/games')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  if (orderResult) {
    return (
      <div className="min-h-screen bg-slate-950 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Order Berhasil!
            </h1>
            <p className="text-slate-400 mb-8">
              Pesananmu telah diterima dan sedang diproses.
            </p>

            <Card className="bg-slate-900 border-slate-800 mb-6">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Order ID</span>
                    <span className="text-white font-mono">{orderResult.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Trx ID</span>
                    <span className="text-white font-mono">{orderResult.trxid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total</span>
                    <span className="text-violet-400 font-bold">
                      Rp {orderResult.total.toLocaleString('id-ID')}
                    </span>
                  </div>
                  {orderResult.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Diskon</span>
                      <span className="text-emerald-400">
                        -Rp {orderResult.discount.toLocaleString('id-ID')}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status</span>
                    <Badge className="bg-amber-500/20 text-amber-400">
                      {orderResult.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Button onClick={() => router.push('/orders')} variant="outline">
                  <Zap className="w-4 h-4 mr-2" />
                  Lihat Riwayat
                </Button>
              ) : (
                <Button onClick={() => router.push('/')} variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali ke Beranda
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/games')}
          className="mb-6 text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="bg-slate-900 border-slate-800 overflow-hidden">
              <div className="relative aspect-video">
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/400x225/1a1a2e/FFF?text=Game';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-violet-500 text-white">
                    {service.game || service.category}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold text-white mb-2">
                  {service.name}
                </h1>
                <p className="text-slate-400 text-sm mb-4">
                  {service.description}
                </p>

                <div className="flex items-end gap-3 mb-4">
                  <div>
                    <p className="text-slate-500 text-sm mb-1">Harga</p>
                    <p className="text-3xl font-bold text-violet-400">
                      Rp {getDiscountedPrice().toLocaleString('id-ID')}
                    </p>
                  </div>
                  {user && (
                    <div className="mb-1">
                      <Badge className="bg-emerald-500/20 text-emerald-400">
                        <Zap className="w-3 h-3 mr-1" />
                        Hemat Rp 1.000
                      </Badge>
                    </div>
                  )}
                </div>

                {service.min && service.max && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Info className="w-4 h-4" />
                    Minimal {service.min} - Maksimal {service.max}
                  </div>
                )}

                {!user && (
                  <Alert className="mt-4 bg-violet-500/10 border-violet-500/20">
                    <AlertCircle className="w-4 h-4 text-violet-400" />
                    <AlertDescription className="text-violet-300 text-sm">
                      <Link href="/login" className="underline font-medium">
                        Login
                      </Link>{' '}
                      atau{' '}
                      <Link href="/register" className="underline font-medium">
                        daftar
                      </Link>{' '}
                      untuk mendapatkan diskon Rp 1.000!
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-violet-400" />
                  Data Pembelian
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      ID / No. HP / User ID
                    </label>
                    <Input
                      placeholder="Masukkan ID atau No. HP"
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                      className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Zone ID (Opsional)
                    </label>
                    <Input
                      placeholder="Masukkan Zone ID jika diperlukan"
                      value={zone}
                      onChange={(e) => setZone(e.target.value)}
                      className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600"
                    />
                  </div>

                  {!user && (
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        <Mail className="w-4 h-4 inline mr-1" />
                        Email
                      </label>
                      <Input
                        type="email"
                        placeholder="Masukkan email untuk tracking order"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Email digunakan untuk melacak status order
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-800">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-slate-400">Total Bayar</span>
                      <span className="text-2xl font-bold text-violet-400">
                        Rp {getDiscountedPrice().toLocaleString('id-ID')}
                      </span>
                    </div>

                    {user ? (
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white py-6"
                      >
                        {submitting ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Memproses...
                          </span>
                        ) : (
                          <>
                            <Zap className="w-5 h-5 mr-2" />
                            Bayar dengan Saldo
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white py-6"
                      >
                        {submitting ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Memproses...
                          </span>
                        ) : (
                          <>
                            <Zap className="w-5 h-5 mr-2" />
                            Lanjutkan ke Pembayaran
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
