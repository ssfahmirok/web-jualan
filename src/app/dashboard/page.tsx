'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { fetchMyOrders, MyOrder } from '@/lib/api/vipWorker';
import { fetchSmmOrders, SmmOrder } from '@/lib/api/smmRealtime';
import {
  Wallet,
  TrendingUp,
  ShoppingBag,
  Zap,
  ArrowRight,
  History,
  Crown,
  Star,
  Target,
  Gamepad2,
  Share2,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

interface CombinedOrder {
  id: string;
  orderId: string;
  productName: string;
  productType: 'game' | 'ppob' | 'sosmed';
  target?: string;
  quantity?: number;
  total: number;
  status: string;
  createdAt: number;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [recentOrders, setRecentOrders] = useState<CombinedOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalSpent: 0,
    totalSavings: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchRecentOrders();
    }
  }, [user, loading, router]);

  const fetchRecentOrders = async () => {
    if (!user?.uid) return;
    
    setOrdersLoading(true);
    try {
      // Fetch VIP orders (Game & PPOB)
      const vipResponse = await fetchMyOrders({ limit: 50 });
      let vipOrders: CombinedOrder[] = [];
      
      if (vipResponse.result && vipResponse.data) {
        vipOrders = vipResponse.data.map((order: MyOrder): CombinedOrder => ({
          id: order.trxid,
          orderId: order.trxid,
          productName: order.serviceName || order.service,
          productType: order.kind === 'prepaid' ? 'ppob' : 'game',
          target: order.data_no,
          total: order.total,
          status: order.status,
          createdAt: order.createdAt,
        }));
      }

      // Fetch SMM orders (Sosmed)
      let smmOrders: CombinedOrder[] = [];
      try {
        const smmData = await fetchSmmOrders(user.uid);
        smmOrders = smmData.map((order: SmmOrder): CombinedOrder => ({
          id: order.orderId,
          orderId: order.orderId,
          productName: order.serviceName,
          productType: 'sosmed',
          target: order.target,
          quantity: order.quantity,
          total: order.totalPrice,
          status: order.status,
          createdAt: order.createdAt,
        }));
      } catch (smmError) {
        console.log('SMM orders not available:', smmError);
      }

      // Combine and sort by date
      const allOrders = [...vipOrders, ...smmOrders].sort(
        (a, b) => b.createdAt - a.createdAt
      );

      // Get only recent 5 orders
      setRecentOrders(allOrders.slice(0, 5));

      // Calculate stats
      const totalTransactions = allOrders.length;
      const totalSpent = allOrders.reduce((sum, order) => sum + order.total, 0);
      const totalSavings = totalTransactions * 1000; // Rp 1000 discount per item

      setStats({
        totalTransactions,
        totalSpent,
        totalSavings,
      });
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast.error('Gagal memuat riwayat transaksi: ' + error.message);
    } finally {
      setOrdersLoading(false);
    }
  };

  const getLevelInfo = (balance: number) => {
    if (balance >= 1000000) return { level: 'VIP', color: 'text-amber-500', progress: 100, bgColor: 'bg-amber-500' };
    if (balance >= 500000) return { level: 'PRO', color: 'text-violet-500', progress: 75, bgColor: 'bg-violet-500' };
    if (balance >= 200000) return { level: 'RESELLER', color: 'text-blue-500', progress: 50, bgColor: 'bg-blue-500' };
    return { level: 'MEMBER', color: 'text-slate-500', progress: 25, bgColor: 'bg-slate-500' };
  };

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    const styles: Record<string, string> = {
      success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      waiting: 'bg-amber-100 text-amber-700 border-amber-200',
      processing: 'bg-blue-100 text-blue-700 border-blue-200',
      in_progress: 'bg-blue-100 text-blue-700 border-blue-200',
      failed: 'bg-red-100 text-red-700 border-red-200',
      error: 'bg-red-100 text-red-700 border-red-200',
      cancelled: 'bg-slate-100 text-slate-700 border-slate-200',
    };
    return styles[normalizedStatus] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const getProductTypeIcon = (type: string) => {
    switch (type) {
      case 'game':
        return <Gamepad2 className="w-4 h-4" />;
      case 'ppob':
        return <Zap className="w-4 h-4" />;
      case 'sosmed':
        return <Share2 className="w-4 h-4" />;
      default:
        return <ShoppingBag className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const levelInfo = getLevelInfo(user.balance || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Selamat Datang,{' '}
                <span className="gradient-text">{user.displayName || 'Member'}</span>!
              </h1>
              <p className="text-slate-600">
                Kelola akun dan saldomu dengan mudah di Ardina Store
              </p>
            </div>
            <Button
              variant="outline"
              onClick={fetchRecentOrders}
              disabled={ordersLoading}
              className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${ordersLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {/* Balance Card */}
          <Card className="bg-gradient-to-br from-indigo-600 to-purple-600 border-0 shadow-lg shadow-indigo-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                  <Crown className="w-3 h-3 mr-1" />
                  {levelInfo.level}
                </Badge>
              </div>
              <p className="text-indigo-100 text-sm mb-1">Saldo Tersedia</p>
              <p className="text-3xl font-bold text-white">
                Rp {(user.balance || 0).toLocaleString('id-ID')}
              </p>
              <Link href="/deposit">
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-4 w-full bg-white/20 text-white hover:bg-white/30 border-0 backdrop-blur-sm"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Top Up Saldo
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Level Card */}
          <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center`}>
                  <Star className={`w-6 h-6 ${levelInfo.color}`} />
                </div>
              </div>
              <p className="text-slate-500 text-sm mb-1">Level Member</p>
              <p className={`text-2xl font-bold ${levelInfo.color}`}>
                {levelInfo.level}
              </p>
              <div className="mt-4">
                <Progress value={levelInfo.progress} className="h-2" />
                <p className="text-xs text-slate-500 mt-2">
                  {levelInfo.level === 'VIP'
                    ? 'Level tertinggi! 🎉'
                    : 'Tingkatkan saldo untuk naik level'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Total Orders */}
          <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <p className="text-slate-500 text-sm mb-1">Total Transaksi</p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.totalTransactions}
              </p>
              <Link href="/orders">
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                >
                  Lihat Riwayat
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Savings */}
          <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-rose-600" />
                </div>
              </div>
              <p className="text-slate-500 text-sm mb-1">Total Hemat</p>
              <p className="text-2xl font-bold text-slate-900">
                Rp {stats.totalSavings.toLocaleString('id-ID')}
              </p>
              <p className="text-xs text-slate-500 mt-4">
                Dari diskon member Rp 1.000/item
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Aksi Cepat
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Top Up Game', href: '/games', icon: Gamepad2, color: 'bg-indigo-100 text-indigo-600', borderColor: 'hover:border-indigo-300' },
              { label: 'PPOB', href: '/ppob', icon: Zap, color: 'bg-amber-100 text-amber-600', borderColor: 'hover:border-amber-300' },
              { label: 'Streaming', href: '/streaming', icon: Target, color: 'bg-rose-100 text-rose-600', borderColor: 'hover:border-rose-300' },
              { label: 'Sosmed', href: '/sosmed', icon: Share2, color: 'bg-emerald-100 text-emerald-600', borderColor: 'hover:border-emerald-300' },
            ].map((action) => (
              <Link key={action.href} href={action.href}>
                <Card className={`bg-white border-slate-200 ${action.borderColor} hover:shadow-md transition-all cursor-pointer`}>
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mx-auto mb-3`}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <p className="text-slate-900 font-medium text-sm">{action.label}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Transaksi Terakhir
            </h2>
            <Link href="/orders">
              <Button variant="ghost" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                Lihat Semua
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-6">
              {ordersLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-slate-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
                    <History className="w-8 h-8 text-indigo-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Belum ada transaksi
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">
                    Mulai berbelanja untuk melihat riwayat transaksi
                  </p>
                  <Link href="/games">
                    <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700">
                      <Gamepad2 className="w-4 h-4 mr-2" />
                      Mulai Belanja
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-indigo-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                          {getProductTypeIcon(order.productType)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-slate-900 font-medium">{order.productName}</p>
                            <Badge variant="outline" className="text-xs">
                              {getProductTypeIcon(order.productType)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <span className="font-mono">{order.orderId.slice(-8)}</span>
                            <span>•</span>
                            <span>
                              {new Date(order.createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          {order.target && (
                            <p className="text-slate-500 text-sm">
                              Target: {order.target}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-indigo-600 font-bold">
                          Rp {order.total.toLocaleString('id-ID')}
                        </p>
                        <Badge
                          variant="outline"
                          className={`${getStatusBadge(order.status)} text-xs`}
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
