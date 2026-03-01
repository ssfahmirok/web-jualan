'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import {
  History,
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

interface Order {
  id: string;
  orderId: string;
  trxid?: string;
  productName: string;
  productType: string;
  target: string;
  quantity?: number;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: number;
}

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

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
    try {
      // This would fetch from your API
      // const response = await fetch('/api/orders');
      // const data = await response.json();
      // setOrders(data.data || []);
      setOrders([]);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Gagal memuat riwayat transaksi');
    } finally {
      setOrdersLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-400" />;
      case 'processing':
        return <Package className="w-5 h-5 text-blue-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      failed: 'bg-red-500/10 text-red-400 border-red-500/20',
      cancelled: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    };
    return styles[status] || styles.cancelled;
  };

  const filterOrdersByStatus = (status: string) => {
    if (status === 'all') return orders;
    return orders.filter((order) => order.status === status);
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

  return (
    <div className="min-h-screen bg-slate-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="mb-4 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
              <History className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Riwayat Transaksi</h1>
              <p className="text-slate-400">Kelola dan pantau semua transaksimu</p>
            </div>
          </div>
        </motion.div>

        {/* Orders Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-5 bg-slate-900 mb-6">
              <TabsTrigger value="all" className="data-[state=active]:bg-violet-600">
                Semua
              </TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-amber-600">
                Pending
              </TabsTrigger>
              <TabsTrigger value="processing" className="data-[state=active]:bg-blue-600">
                Proses
              </TabsTrigger>
              <TabsTrigger value="success" className="data-[state=active]:bg-emerald-600">
                Sukses
              </TabsTrigger>
              <TabsTrigger value="failed" className="data-[state=active]:bg-red-600">
                Gagal
              </TabsTrigger>
            </TabsList>

            {['all', 'pending', 'processing', 'success', 'failed'].map((status) => (
              <TabsContent key={status} value={status}>
                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="p-6">
                    {ordersLoading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-20 bg-slate-950 rounded-lg animate-pulse" />
                        ))}
                      </div>
                    ) : filterOrdersByStatus(status).length === 0 ? (
                      <div className="text-center py-12">
                        <History className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">
                          Tidak ada transaksi
                        </h3>
                        <p className="text-slate-400 text-sm">
                          {status === 'all'
                            ? 'Belum ada transaksi. Mulai berbelanja sekarang!'
                            : `Tidak ada transaksi dengan status ${status}`}
                        </p>
                        {status === 'all' && (
                          <Button
                            onClick={() => router.push('/games')}
                            className="mt-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white"
                          >
                            Mulai Belanja
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filterOrdersByStatus(status).map((order) => (
                          <div
                            key={order.id}
                            className="flex items-center justify-between p-4 bg-slate-950 rounded-lg hover:bg-slate-900 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              {getStatusIcon(order.status)}
                              <div>
                                <p className="text-white font-medium">
                                  {order.productName}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                  <span>{order.orderId}</span>
                                  <span>•</span>
                                  <span>
                                    {new Date(order.createdAt).toLocaleDateString('id-ID')}
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
                              <p className="text-violet-400 font-bold">
                                Rp {order.total.toLocaleString('id-ID')}
                              </p>
                              <Badge
                                variant="outline"
                                className={getStatusBadge(order.status)}
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
