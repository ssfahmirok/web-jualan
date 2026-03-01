'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Gamepad2, ArrowRight } from 'lucide-react';

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

export default function GamesPage() {
  const [services, setServices] = useState<GameService[]>([]);
  const [filteredServices, setFilteredServices] = useState<GameService[]>([]);
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
      const response = await fetch('/api/vip/services?type=game');
      const data = await response.json();
      
      if (data.success) {
        setServices(data.data);
        setFilteredServices(data.data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
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
          service.game?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((service) =>
        service.game?.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  };

  // Get unique games for category filter
  const games = Array.from(
    new Set(services.map((s) => s.game).filter(Boolean))
  ).slice(0, 10);

  return (
    <div className="min-h-screen bg-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Top Up Game</h1>
              <p className="text-slate-400">Pilih game favoritmu dan top up sekarang</p>
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
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <Input
              placeholder="Cari game..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 rounded-xl"
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              Semua
            </button>
            {games.map((game) => (
              <button
                key={game}
                onClick={() => setSelectedCategory(game)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === game
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {game}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Services Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-48 bg-slate-900" />
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-16">
            <Gamepad2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Tidak ada layanan ditemukan
            </h3>
            <p className="text-slate-400">
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
              <motion.div key={service.id} variants={itemVariants}>
                <Link href={`/games/${encodeURIComponent(service.code)}`}>
                  <Card className="group relative overflow-hidden bg-slate-900 border-slate-800 hover:border-violet-500/30 transition-all duration-300 cursor-pointer h-full">
                    <CardContent className="p-0">
                      <div className="relative aspect-video">
                        <img
                          src={service.imageUrl}
                          alt={service.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/400x225/1a1a2e/FFF?text=Game';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-violet-500/80 text-white text-xs backdrop-blur-sm">
                            {service.game || service.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-violet-400 transition-colors">
                          {service.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-violet-400 font-bold">
                              Rp {service.priceTotal.toLocaleString('id-ID')}
                            </p>
                            {service.min && service.max && (
                              <p className="text-slate-500 text-xs">
                                {service.min} - {service.max}
                              </p>
                            )}
                          </div>
                          <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center group-hover:bg-violet-500 group-hover:text-white transition-all">
                            <ArrowRight className="w-5 h-5 text-violet-400 group-hover:text-white" />
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
