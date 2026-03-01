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
} from 'lucide-react';
import { toast } from 'sonner';

interface Order {
  id: string;
  orderId: string;
  productName: string;
  productType: string;
  total: number;
  status: string;
  createdAt: number;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

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
    try {
      // This would fetch from your API
      setRecentOrders([]);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const getLevelInfo = (balance: number) => {
    if (balance >= 1000000) return { level: 'VIP', color: 'text-amber-400', progress: 100 };
    if (balance >= 500000) return { level: 'PRO', color: 'text-violet-400', progress: 75 };
    if (balance >= 200000) return { level: 'RESELLER', color: 'text-blue-400', progress: 50 };
    return { level: 'MEMBER', color: 'text-slate-400', progress: 25 };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const levelInfo = getLevelInfo(user.balance || 0);

  return (
    <div className="min-h-screen bg-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Selamat Datang, {user.displayName}!
          </h1>
          <p className="text-slate-400">
            Kelola akun dan saldomu dengan mudah
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {/* Balance Card */}
          <Card className="bg-gradient-to-br from-violet-600 to-fuchsia-600 border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-white/20 text-white border-0">
                  <Crown className="w-3 h-3 mr-1" />
                  {levelInfo.level}
                </Badge>
              </div>
              <p className="text-violet-100 text-sm mb-1">Saldo Tersedia</p>
              <p className="text-3xl font-bold text-white">
                Rp {(user.balance || 0).toLocaleString('id-ID')}
              </p>
              <Link href="/deposit">
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-4 w-full bg-white/20 text-white hover:bg-white/30 border-0"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Top Up Saldo
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Level Card */}
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Star className="w-6 h-6 text-amber-400" />
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-1">Level Member</p>
              <p className={`text-2xl font-bold ${levelInfo.color}`}>
                {levelInfo.level}
              </p>
              <div className="mt-4">
                <Progress value={levelInfo.progress} className="h-2" />
                <p className="text-xs text-slate-500 mt-2">
                  {levelInfo.level === 'VIP'
                    ? 'Level tertinggi!'
                    : 'Tingkatkan saldo untuk naik level'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Total Orders */}
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-1">Total Transaksi</p>
              <p className="text-2xl font-bold text-white">0</p>
              <Link href="/orders">
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4 text-slate-400 hover:text-white"
                >
                  Lihat Riwayat
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Savings */}
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-rose-400" />
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-1">Total Hemat</p>
              <p className="text-2xl font-bold text-white">Rp 0</p>
              <p className="text-xs text-slate-500 mt-4">
                Dari diskon member
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
          <h2 className="text-xl font-semibold text-white mb-4">
            Aksi Cepat
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Top Up Game', href: '/games', icon: Wallet, color: 'bg-violet-500/10 text-violet-400' },
              { label: 'PPOB', href: '/ppob', icon: Zap, color: 'bg-amber-500/10 text-amber-400' },
              { label: 'Streaming', href: '/streaming', icon: Target, color: 'bg-rose-500/10 text-rose-400' },
              { label: 'Sosmed', href: '/sosmed', icon: TrendingUp, color: 'bg-emerald-500/10 text-emerald-400' },
            ].map((action) => (
              <Link key={action.href} href={action.href}>
                <Card className="bg-slate-900 border-slate-800 hover:border-violet-500/30 transition-all cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mx-auto mb-3`}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <p className="text-white font-medium text-sm">{action.label}</p>
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
            <h2 className="text-xl font-semibold text-white">
              Transaksi Terakhir
            </h2>
            <Link href="/orders">
              <Button variant="ghost" className="text-violet-400 hover:text-violet-300">
                Lihat Semua
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              {recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <History className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">
                    Belum ada transaksi
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Mulai berbelanja untuk melihat riwayat transaksi
                  </p>
                  <Link href="/games">
                    <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white">
                      Mulai Belanja
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-slate-950 rounded-lg"
                    >
                      <div>
                        <p className="text-white font-medium">{order.productName}</p>
                        <p className="text-slate-500 text-sm">
                          {new Date(order.createdAt).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-violet-400 font-medium">
                          Rp {order.total.toLocaleString('id-ID')}
                        </p>
                        <Badge
                          variant="secondary"
                          className={
                            order.status === 'success'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : order.status === 'pending'
                              ? 'bg-amber-500/10 text-amber-400'
                              : 'bg-red-500/10 text-red-400'
                          }
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
