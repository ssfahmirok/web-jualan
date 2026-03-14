'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { fetchMyOrders, MyOrder } from '@/lib/api/vipWorker';
import { fetchSmmOrders, SmmOrder } from '@/lib/api/smmRealtime';
import {
  History,
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Gamepad2,
  Zap,
  Share2,
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
  trxid?: string;
  raw?: any;
}

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [vipOrders, setVipOrders] = useState<MyOrder[]>([]);
  const [smmOrders, setSmmOrders] = useState<SmmOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchOrders();
    }
  }, [user, loading, router]);

  const fetchOrders = async () => {
    if (!user?.uid) return;
    
    setOrdersLoading(true);
    try {
      // Fetch VIP orders (Game & PPOB)
      const vipResponse = await fetchMyOrders({ limit: 50 });
      if (vipResponse.result) {
        setVipOrders(vipResponse.data);
      }

      // Fetch SMM orders (Sosmed)
      try {
        const smmData = await fetchSmmOrders(user.uid);
        setSmmOrders(smmData);
      } catch (smmError) {
        console.log('SMM orders not available:', smmError);
      }
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast.error('Gagal memuat riwayat transaksi: ' + error.message);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
    toast.success('Data berhasil diperbarui');
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'pending':
      case 'waiting':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'processing':
      case 'in_progress':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'failed':
      case 'error':
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-slate-400" />;
    }
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
      case 'prepaid':
        return <Zap className="w-4 h-4" />;
      case 'sosmed':
        return <Share2 className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const allOrders: CombinedOrder[] = [
    ...vipOrders.map((order): CombinedOrder => ({
      id: order.trxid,
      orderId: order.trxid,
      trxid: order.trxid,
      productName: order.serviceName || order.service,
      productType: order.kind === 'prepaid' ? 'ppob' : 'game',
      target: order.data_no,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
      raw: order,
    })),
    ...smmOrders.map((order): CombinedOrder => ({
      id: order.orderId,
      orderId: order.orderId,
      productName: order.serviceName,
      productType: 'sosmed',
      target: order.target,
      quantity: order.quantity,
      total: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt,
      raw: order,
    })),
  ].sort((a, b) => b.createdAt - a.createdAt);

  const filterOrdersByType = (type: string) => {
    if (type === 'all') return allOrders;
    if (type === 'game') return allOrders.filter((o) => o.productType === 'game');
    if (type === 'ppob') return allOrders.filter((o) => o.productType === 'ppob');
    if (type === 'sosmed') return allOrders.filter((o) => o.productType === 'sosmed');
    return allOrders.filter((o) => o.status.toLowerCase() === type.toLowerCase());
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="mb-4 text-slate-600 hover:text-indigo-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <History className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Riwayat Transaksi</h1>
                <p className="text-slate-600">Kelola dan pantau semua transaksimu</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Orders Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-6 bg-white mb-6 p-1 rounded-xl shadow-sm">
              <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
                Semua
              </TabsTrigger>
              <TabsTrigger value="game" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
                Game
              </TabsTrigger>
              <TabsTrigger value="ppob" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">
                PPOB
              </TabsTrigger>
              <TabsTrigger value="sosmed" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">
                Sosmed
              </TabsTrigger>
              <TabsTrigger value="pending" className="rounded-lg data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                Pending
              </TabsTrigger>
              <TabsTrigger value="success" className="rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                Sukses
              </TabsTrigger>
            </TabsList>

            {['all', 'game', 'ppob', 'sosmed', 'pending', 'success'].map((tabValue) => (
              <TabsContent key={tabValue} value={tabValue}>
                <Card className="bg-white border-slate-200 shadow-sm">
                  <CardContent className="p-6">
                    {ordersLoading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-20 bg-slate-100 rounded-lg animate-pulse" />
                        ))}
                      </div>
                    ) : filterOrdersByType(tabValue).length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
                          <History className="w-8 h-8 text-indigo-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                          Tidak ada transaksi
                        </h3>
                        <p className="text-slate-600 text-sm">
                          {tabValue === 'all'
                            ? 'Belum ada transaksi. Mulai berbelanja sekarang!'
                            : `Tidak ada transaksi dengan filter ini`}
                        </p>
                        {tabValue === 'all' && (
                          <Button
                            onClick={() => router.push('/games')}
                            className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                          >
                            <Gamepad2 className="w-4 h-4 mr-2" />
                            Mulai Belanja
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filterOrdersByType(tabValue).map((order) => (
                          <div
                            key={order.id}
                            className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-indigo-50 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                {getStatusIcon(order.status)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-slate-900 font-medium">
                                    {order.productName}
                                  </p>
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
                                {order.quantity && (
                                  <p className="text-slate-500 text-sm">
                                    Qty: {order.quantity.toLocaleString('id-ID')}
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
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
