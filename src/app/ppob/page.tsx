'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Zap, ArrowRight } from 'lucide-react';
import { fetchPrepaidServices, VipService } from '@/lib/api/vipWorker';
import { toast } from 'sonner';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export default function PpobPage() {
  const [services, setServices] = useState<VipService[]>([]);
  const [filteredServices, setFilteredServices] = useState<VipService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [searchQuery, selectedCategory, services]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await fetchPrepaidServices();
      setServices(data);
      setFilteredServices(data);
    } catch (error: any) {
      console.error('Error fetching services:', error);
      toast.error('Gagal memuat layanan PPOB. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = services;

    if (searchQuery) {
      filtered = filtered.filter(
        (service) =>
          service.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((service) =>
        service.brand?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        service.category?.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  };

  // Get unique categories
  const categories = Array.from(
    new Set(services.map((s) => s.brand || s.category).filter(Boolean))
  ).slice(0, 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">PPOB</h1>
              <p className="text-slate-600">Pulsa, paket data, dan tagihan online</p>
            </div>
          </div>
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Cari pulsa, paket data, atau tagihan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl shadow-sm"
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                  : 'bg-white text-slate-600 hover:bg-amber-50 border border-slate-200'
              }`}
            >
              Semua
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                    : 'bg-white text-slate-600 hover:bg-amber-50 border border-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Services Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-48 bg-white rounded-xl" />
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Tidak ada layanan ditemukan
            </h3>
            <p className="text-slate-600">
              Coba kata kunci lain atau pilih kategori berbeda
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filteredServices.map((service) => (
              <motion.div key={service.code} variants={itemVariants}>
                <Link href={`/ppob/${encodeURIComponent(service.code)}`}>
                  <Card className="group relative overflow-hidden bg-white border-slate-200 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 cursor-pointer h-full">
                    <CardContent className="p-0">
                      <div className="relative aspect-video bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                        <Zap className="w-16 h-16 text-amber-400" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs border-0">
                            {service.brand || service.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-slate-900 font-semibold mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
                          {service.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <p className="text-amber-600 font-bold">
                            Rp {service.priceTotal?.toLocaleString('id-ID')}
                          </p>
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/30">
                            <ArrowRight className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
