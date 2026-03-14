'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Share2, ArrowRight, Instagram, Twitter, Facebook, Youtube, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface SmmService {
  id: string;
  category: string;
  name: string;
  note: string;
  min: number;
  max: number;
  price: number;
  baseRatePer1000: number;
  chargedRatePer1000: number;
  type: string;
  refill: boolean;
  cancel: boolean;
}

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

const categoryIcons: Record<string, any> = {
  instagram: Instagram,
  twitter: Twitter,
  facebook: Facebook,
  youtube: Youtube,
  tiktok: TrendingUp,
  default: Share2,
};

const categoryColors: Record<string, string> = {
  instagram: 'from-pink-500 to-rose-500',
  twitter: 'from-blue-500 to-sky-500',
  facebook: 'from-blue-600 to-indigo-600',
  youtube: 'from-red-500 to-rose-500',
  tiktok: 'from-purple-500 to-violet-500',
  default: 'from-emerald-500 to-teal-500',
};

export default function SosmedPage() {
  const [services, setServices] = useState<SmmService[]>([]);
  const [filteredServices, setFilteredServices] = useState<SmmService[]>([]);
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
      const response = await fetch('/api/smm/services');
      const data = await response.json();
      
      if (data.success) {
        setServices(data.data);
        setFilteredServices(data.data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Gagal memuat layanan SMM');
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = services;

    if (searchQuery) {
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((service) =>
        service.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  };

  // Get unique categories
  const categories = Array.from(
    new Set(services.map((s) => s.category.split(' ')[0].toLowerCase()))
  ).slice(0, 8);

  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    for (const [key, icon] of Object.entries(categoryIcons)) {
      if (cat.includes(key)) return icon;
    }
    return categoryIcons.default;
  };

  const getCategoryColor = (category: string) => {
    const cat = category.toLowerCase();
    for (const [key, color] of Object.entries(categoryColors)) {
      if (cat.includes(key)) return color;
    }
    return categoryColors.default;
  };

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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Sosmed Booster</h1>
              <p className="text-slate-600">Tambah followers, likes, dan views sosial media</p>
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
              placeholder="Cari layanan..."
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
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-white text-slate-600 hover:bg-emerald-50 border border-slate-200'
              }`}
            >
              Semua
            </button>
            {categories.map((category) => {
              const Icon = getCategoryIcon(category);
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                      : 'bg-white text-slate-600 hover:bg-emerald-50 border border-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              );
            })}
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
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <Share2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Tidak ada layanan ditemukan
            </h3>
            <p className="text-slate-600">
              Coba kata kunci lain
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filteredServices.slice(0, 20).map((service) => {
              const Icon = getCategoryIcon(service.category);
              const color = getCategoryColor(service.category);
              
              return (
                <motion.div key={service.id} variants={itemVariants}>
                  <Link href={`/sosmed/${service.id}`}>
                    <Card className="group relative overflow-hidden bg-white border-slate-200 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 cursor-pointer h-full">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Badge className="mb-1 bg-slate-100 text-slate-600 text-xs border-slate-200">
                              {service.category}
                            </Badge>
                            <h3 className="text-slate-900 font-semibold text-sm line-clamp-2 group-hover:text-emerald-600 transition-colors">
                              {service.name}
                            </h3>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Min</span>
                            <span className="text-slate-700">{service.min}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Max</span>
                            <span className="text-slate-700">{service.max}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <div>
                            <p className="text-xs text-slate-500">Per 1000</p>
                            <p className="text-emerald-600 font-bold">
                              Rp {service.chargedRatePer1000.toLocaleString('id-ID')}
                            </p>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/30">
                            <ArrowRight className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
