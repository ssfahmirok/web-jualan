'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import {
  fetchGameServices,
  placeGameOrder,
  VipService,
} from '@/lib/api/vipWorker';
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

interface GameDetailClientProps {
  code: string;
}

export default function GameDetailClient({ code }: GameDetailClientProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [service, setService] = useState<VipService | null>(null);
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
      setLoading(true);
      const services = await fetchGameServices();
      const found = services.find((s: VipService) => s.code === code);
      
      if (found) {
        setService(found);
      } else {
        toast.error('Layanan tidak ditemukan');
        router.push('/games');
      }
    } catch (error: any) {
      console.error('Error fetching service:', error);
      toast.error('Gagal memuat data layanan: ' + error.message);
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
      const result = await placeGameOrder({
        service: service.code,
        data_no: target,
        data_zone: zone || undefined,
      });

      if (result.result) {
        setOrderResult({
          orderId: result.data?.trxid || 'N/A',
          trxid: result.data?.trxid || 'N/A',
          total: service.priceTotal,
          discount: user ? 1000 : 0,
          status: result.data?.status || 'Pending',
        });
        toast.success('Order berhasil dibuat!');
      } else {
        toast.error(result.message || 'Gagal membuat order');
      }
    } catch (error: any) {
      console.error('Error creating order:', error);
      if (error.message?.includes('Saldo tidak cukup') || error.message?.includes('balance')) {
        toast.error('Saldo tidak cukup. Silakan top up saldo terlebih dahulu.');
      } else {
        toast.error(error.message || 'Terjadi kesalahan. Silakan coba lagi.');
      }
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-32 bg-white mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-64 bg-white rounded-xl" />
            <Skeleton className="h-96 bg-white rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
            <Gamepad2 className="w-8 h-8 text-indigo-500" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Layanan tidak ditemukan
          </h2>
          <Button onClick={() => router.push('/games')} variant="outline" className="border-indigo-200 text-indigo-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  if (orderResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              Order Berhasil!
            </h1>
            <p className="text-slate-600 mb-8">
              Pesananmu telah diterima dan sedang diproses.
            </p>

            <Card className="bg-white border-slate-200 shadow-sm mb-6">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Order ID</span>
                    <span className="text-slate-900 font-mono font-medium">{orderResult.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Trx ID</span>
                    <span className="text-slate-900 font-mono font-medium">{orderResult.trxid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total</span>
                    <span className="text-indigo-600 font-bold">
                      Rp {orderResult.total.toLocaleString('id-ID')}
                    </span>
                  </div>
                  {orderResult.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Diskon</span>
                      <span className="text-emerald-600">
                        -Rp {orderResult.discount.toLocaleString('id-ID')}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status</span>
                    <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                      {orderResult.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Button onClick={() => router.push('/orders')} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <Zap className="w-4 h-4 mr-2" />
                  Lihat Riwayat
                </Button>
              ) : (
                <Button onClick={() => router.push('/')} variant="outline" className="border-indigo-200 text-indigo-700">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/games')}
          className="mb-6 text-slate-600 hover:text-indigo-600"
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
            <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
              <div className="relative aspect-video">
                <img
                  src={service.imageUrl || 'https://placehold.co/400x225/indigo/white?text=Game'}
                  alt={service.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/400x225/indigo/white?text=Game';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0">
                    {service.game || service.category}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                  {service.name}
                </h1>
                <p className="text-slate-500 text-sm mb-4">
                  {service.note}
                </p>

                <div className="flex items-end gap-3 mb-4">
                  <div>
                    <p className="text-slate-500 text-sm mb-1">Harga</p>
                    <p className="text-3xl font-bold text-indigo-600">
                      Rp {getDiscountedPrice().toLocaleString('id-ID')}
                    </p>
                  </div>
                  {user && (
                    <div className="mb-1">
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
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
                  <Alert className="mt-4 bg-indigo-50 border-indigo-200">
                    <AlertCircle className="w-4 h-4 text-indigo-600" />
                    <AlertDescription className="text-indigo-700 text-sm">
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
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-600" />
                  Data Pembelian
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      ID / No. HP / User ID
                    </label>
                    <Input
                      placeholder="Masukkan ID atau No. HP"
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                      className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Zone ID (Opsional)
                    </label>
                    <Input
                      placeholder="Masukkan Zone ID jika diperlukan"
                      value={zone}
                      onChange={(e) => setZone(e.target.value)}
                      className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                    />
                  </div>

                  {!user && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-1" />
                        Email
                      </label>
                      <Input
                        type="email"
                        placeholder="Masukkan email untuk tracking order"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Email digunakan untuk melacak status order
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-slate-600">Total Bayar</span>
                      <span className="text-2xl font-bold text-indigo-600">
                        Rp {getDiscountedPrice().toLocaleString('id-ID')}
                      </span>
                    </div>

                    {user ? (
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-6"
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
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-6"
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
