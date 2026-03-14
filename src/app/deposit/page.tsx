'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import {
  Wallet,
  ArrowLeft,
  Zap,
  AlertCircle,
  CheckCircle,
  Copy,
  ExternalLink,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

interface PaymentChannel {
  code: string;
  name: string;
  paymentMethod: string;
  paymentChannel: string;
  fee: number;
  feePercent: number;
  minAmount: number;
  maxAmount: number;
  image?: string;
}

const quickAmounts = [10000, 20000, 50000, 100000, 200000, 500000];

export default function DepositPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [channels, setChannels] = useState<PaymentChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<PaymentChannel | null>(null);
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [creatingInvoice, setCreatingInvoice] = useState(false);
  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    fetchChannels();
  }, [user, loading, router]);

  const fetchChannels = async () => {
    try {
      const response = await fetch('/api/ipaymu/channels');
      const data = await response.json();

      if (data.success) {
        setChannels(data.data);
        if (data.data.length > 0) {
          setSelectedChannel(data.data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
      toast.error('Gagal memuat metode pembayaran');
    } finally {
      setLoadingChannels(false);
    }
  };

  const handleAmountChange = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, '');
    setAmount(numericValue);
  };

  const calculateTotal = () => {
    const amountNum = Number(amount);
    if (!amountNum || !selectedChannel) return 0;

    const fee = selectedChannel.feePercent > 0
      ? Math.floor(amountNum * (selectedChannel.feePercent / 100))
      : selectedChannel.fee;

    return amountNum + fee + 100; // +100 for unique code
  };

  const handleCreateInvoice = async () => {
    const amountNum = Number(amount);

    if (!amountNum || amountNum < 5000) {
      toast.error('Minimal deposit Rp 5.000');
      return;
    }

    if (!selectedChannel) {
      toast.error('Pilih metode pembayaran');
      return;
    }

    if (!user) {
      toast.error('Silakan login terlebih dahulu');
      return;
    }

    setCreatingInvoice(true);

    try {
      const token = await user.getIdToken?.();
      
      const response = await fetch('/api/ipaymu/create-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: amountNum,
          paymentMethod: selectedChannel.paymentMethod,
          paymentChannel: selectedChannel.paymentChannel,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setInvoice(data);
        toast.success('Invoice berhasil dibuat!');
      } else {
        toast.error(data.message || 'Gagal membuat invoice');
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setCreatingInvoice(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Tersalin ke clipboard!');
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

  if (invoice) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => setInvoice(null)}
            className="mb-6 text-slate-600 hover:text-indigo-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-amber-600" />
                </div>
                <CardTitle className="text-2xl text-slate-900">Menunggu Pembayaran</CardTitle>
                <CardDescription className="text-slate-600">
                  Selesaikan pembayaran untuk mengisi saldo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-slate-50 rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Reference ID</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900 font-mono font-medium">{invoice.referenceId}</span>
                      <button
                        onClick={() => copyToClipboard(invoice.referenceId)}
                        className="text-indigo-600 hover:text-indigo-700"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Jumlah Deposit</span>
                    <span className="text-slate-900 font-bold">
                      Rp {invoice.amount.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Biaya Admin</span>
                    <span className="text-slate-700">
                      Rp {invoice.actualFee.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
                    <span className="text-slate-500">Total Bayar</span>
                    <span className="text-indigo-600 font-bold text-xl">
                      Rp {invoice.chargeAmount.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {invoice.paymentUrl && (
                  <a
                    href={invoice.paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-6">
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Lanjutkan ke Pembayaran
                    </Button>
                  </a>
                )}

                <Alert className="bg-amber-50 border-amber-200">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <AlertDescription className="text-amber-700 text-sm">
                    Saldo akan otomatis masuk setelah pembayaran berhasil.
                    Jangan tutup halaman ini sebelum pembayaran selesai.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-8">
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
            className="mb-4 text-slate-600 hover:text-indigo-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Top Up Saldo</h1>
              <p className="text-slate-600">Isi saldomu dengan berbagai metode pembayaran</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Amount Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-indigo-600" />
                  Nominal Deposit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Masukkan Nominal
                  </label>
                  <Input
                    type="text"
                    placeholder="Minimal Rp 5.000"
                    value={amount ? `Rp ${Number(amount).toLocaleString('id-ID')}` : ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setAmount(value);
                    }}
                    className="bg-white border-slate-200 text-slate-900 text-lg py-6"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Pilih Nominal Cepat
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {quickAmounts.map((quickAmount) => (
                      <button
                        key={quickAmount}
                        onClick={() => setAmount(String(quickAmount))}
                        className={`p-3 rounded-lg text-sm font-medium transition-all ${
                          Number(amount) === quickAmount
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                            : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
                        }`}
                      >
                        Rp {quickAmount.toLocaleString('id-ID')}
                      </button>
                    ))}
                  </div>
                </div>

                {amount && selectedChannel && (
                  <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Nominal</span>
                      <span className="text-slate-900">
                        Rp {Number(amount).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Biaya Admin</span>
                      <span className="text-slate-700">
                        Rp {(selectedChannel.fee || Math.floor(Number(amount) * 0.007)).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="border-t border-slate-200 pt-2 flex justify-between">
                      <span className="text-slate-500">Total</span>
                      <span className="text-indigo-600 font-bold">
                        Rp {calculateTotal().toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Method */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Metode Pembayaran</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingChannels ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {channels.map((channel) => (
                      <button
                        key={channel.code}
                        onClick={() => setSelectedChannel(channel)}
                        className={`w-full p-4 rounded-lg flex items-center justify-between transition-all ${
                          selectedChannel?.code === channel.code
                            ? 'bg-indigo-50 border border-indigo-200'
                            : 'bg-slate-50 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                            <Wallet className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div className="text-left">
                            <p className="text-slate-900 font-medium">{channel.name}</p>
                            <p className="text-slate-500 text-sm">
                              Fee: Rp {channel.fee.toLocaleString('id-ID')}
                            </p>
                          </div>
                        </div>
                        {selectedChannel?.code === channel.code && (
                          <CheckCircle className="w-5 h-5 text-indigo-600" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                <Button
                  onClick={handleCreateInvoice}
                  disabled={!amount || !selectedChannel || creatingInvoice}
                  className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-6"
                >
                  {creatingInvoice ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Memproses...
                    </span>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Buat Invoice
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
