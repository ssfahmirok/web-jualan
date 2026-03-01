'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Tv, ArrowRight, Play, Film, Music } from 'lucide-react';

const streamingServices = [
  {
    id: 'netflix',
    name: 'Netflix Premium',
    description: 'Akun Netflix Premium 1 bulan',
    price: 50000,
    image: 'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/netflix_tile.jpg',
    icon: Film,
    color: 'from-red-600 to-rose-600',
  },
  {
    id: 'spotify',
    name: 'Spotify Premium',
    description: 'Spotify Premium Individual 1 bulan',
    price: 25000,
    image: 'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/spotify_tile.jpg',
    icon: Music,
    color: 'from-green-600 to-emerald-600',
  },
  {
    id: 'disney',
    name: 'Disney+ Hotstar',
    description: 'Disney+ Hotstar 1 bulan',
    price: 35000,
    image: 'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/disney_tile.jpg',
    icon: Play,
    color: 'from-blue-600 to-indigo-600',
  },
  {
    id: 'youtube',
    name: 'YouTube Premium',
    description: 'YouTube Premium 1 bulan',
    price: 20000,
    image: 'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/youtube_tile.jpg',
    icon: Play,
    color: 'from-red-600 to-rose-600',
  },
  {
    id: 'viu',
    name: 'Viu Premium',
    description: 'Viu Premium 1 bulan',
    price: 15000,
    image: 'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/viu_tile.jpg',
    icon: Play,
    color: 'from-yellow-600 to-amber-600',
  },
  {
    id: 'iqiyi',
    name: 'iQIYI Premium',
    description: 'iQIYI VIP 1 bulan',
    price: 18000,
    image: 'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/iqiyi_tile.jpg',
    icon: Play,
    color: 'from-green-600 to-emerald-600',
  },
  {
    id: 'wetv',
    name: 'WeTV Premium',
    description: 'WeTV VIP 1 bulan',
    price: 16000,
    image: 'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/wetv_tile.jpg',
    icon: Play,
    color: 'from-purple-600 to-violet-600',
  },
  {
    id: 'vidio',
    name: 'Vidio Premier',
    description: 'Vidio Premier 1 bulan',
    price: 22000,
    image: 'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/vidio_tile.jpg',
    icon: Play,
    color: 'from-red-600 to-rose-600',
  },
];

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

export default function StreamingPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = streamingServices.filter(
    (service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-600 to-pink-600 flex items-center justify-center">
              <Tv className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Streaming</h1>
              <p className="text-slate-400">Langganan Netflix, Spotify, Disney+, dan lainnya</p>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <Input
              placeholder="Cari layanan streaming..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 rounded-xl"
            />
          </div>
        </motion.div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16">
            <Tv className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Tidak ada layanan ditemukan
            </h3>
            <p className="text-slate-400">
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
            {filteredServices.map((service) => (
              <motion.div key={service.id} variants={itemVariants}>
                <Link href={`/streaming/${service.id}`}>
                  <Card className="group relative overflow-hidden bg-slate-900 border-slate-800 hover:border-rose-500/30 transition-all duration-300 cursor-pointer h-full">
                    <CardContent className="p-0">
                      <div className="relative aspect-video">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/400x225/1a1a2e/FFF?text=Streaming';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                        <div className="absolute top-3 right-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center`}>
                            <service.icon className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-white font-semibold mb-1 group-hover:text-rose-400 transition-colors">
                          {service.name}
                        </h3>
                        <p className="text-slate-500 text-sm mb-3">
                          {service.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-rose-400 font-bold">
                            Rp {service.price.toLocaleString('id-ID')}
                          </p>
                          <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-all">
                            <ArrowRight className="w-5 h-5 text-rose-400 group-hover:text-white" />
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
