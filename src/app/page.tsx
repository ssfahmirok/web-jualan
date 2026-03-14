'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Gamepad2,
  Zap,
  Tv,
  Share2,
  ArrowRight,
  Sparkles,
  Shield,
  Clock,
  Headphones,
  TrendingUp,
  Star,
  ChevronRight,
} from 'lucide-react';

const categories = [
  {
    id: 'games',
    name: 'Game',
    description: 'Top up diamond, UC, dan currency game favoritmu',
    icon: Gamepad2,
    gradient: 'from-indigo-500 to-purple-600',
    bgGradient: 'from-indigo-50 to-purple-50',
    href: '/games',
  },
  {
    id: 'ppob',
    name: 'PPOB',
    description: 'Pulsa, paket data, dan tagihan online',
    icon: Zap,
    gradient: 'from-amber-500 to-orange-600',
    bgGradient: 'from-amber-50 to-orange-50',
    href: '/ppob',
  },
  {
    id: 'streaming',
    name: 'Streaming',
    description: 'Netflix, Spotify, Disney+, dan lainnya',
    icon: Tv,
    gradient: 'from-rose-500 to-pink-600',
    bgGradient: 'from-rose-50 to-pink-50',
    href: '/streaming',
  },
  {
    id: 'sosmed',
    name: 'Sosmed Booster',
    description: 'Tambah followers, likes, dan views',
    icon: Share2,
    gradient: 'from-emerald-500 to-teal-600',
    bgGradient: 'from-emerald-50 to-teal-50',
    href: '/sosmed',
  },
];

const features = [
  {
    icon: Shield,
    title: 'Aman & Terpercaya',
    description: 'Transaksi aman dengan sistem terenkripsi dan terpercaya sejak 2020',
  },
  {
    icon: Clock,
    title: 'Proses Cepat',
    description: 'Pengisian otomatis dalam hitungan menit',
  },
  {
    icon: Headphones,
    title: 'Support 24/7',
    description: 'Tim support siap membantu kapan saja',
  },
  {
    icon: TrendingUp,
    title: 'Harga Termurah',
    description: 'Harga kompetitif dengan diskon menarik',
  },
];

const popularGames = [
  { name: 'Mobile Legends', image: 'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/mlbb_tile.jpg', discount: '10%' },
  { name: 'Free Fire', image: 'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/freefire_tile.jpg', discount: '15%' },
  { name: 'PUBG Mobile', image: 'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/pubgm_tile.jpg', discount: '10%' },
  { name: 'Genshin Impact', image: 'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/genshin_tile.jpg', discount: '5%' },
  { name: 'Valorant', image: 'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/valorant_tile.jpg', discount: '8%' },
  { name: 'Call of Duty', image: 'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/codmobile_tile.jpg', discount: '12%' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-pink-400/20 to-rose-400/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-28 pb-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <Badge
                variant="secondary"
                className="bg-indigo-100 text-indigo-700 border border-indigo-200 px-4 py-1.5 text-sm font-medium"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Platform Top Up Terpercaya di Cirebon
              </Badge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight"
            >
              Top Up Game{' '}
              <span className="gradient-text neon-text">
                Cepat & Murah
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto"
            >
              Ardina Store - Isi ulang diamond, UC, dan currency game favoritmu dengan harga termurah. 
              Proses otomatis 24/7, aman, dan terpercaya.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/games">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-6 text-lg rounded-xl shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all"
                >
                  <Gamepad2 className="w-5 h-5 mr-2" />
                  Mulai Top Up
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 px-8 py-6 text-lg rounded-xl"
                >
                  <Star className="w-5 h-5 mr-2" />
                  Daftar Sekarang
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="mt-16 grid grid-cols-3 gap-8"
            >
              {[
                { value: '1M+', label: 'Transaksi' },
                { value: '50+', label: 'Game' },
                { value: '99%', label: 'Puas' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold gradient-text">
                    {stat.value}
                  </div>
                  <div className="text-slate-500 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Pilih Layanan
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Berbagai layanan top up untuk kebutuhan digitalmu
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {categories.map((category) => (
              <motion.div key={category.id} variants={itemVariants}>
                <Link href={category.href}>
                  <Card
                    className={`group relative overflow-hidden bg-gradient-to-br ${category.bgGradient} border-0 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 cursor-pointer h-full`}
                  >
                    <CardContent className="p-6">
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                      >
                        <category.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">
                        {category.name}
                      </h3>
                      <p className="text-slate-600 text-sm">
                        {category.description}
                      </p>
                      <div className="mt-4 flex items-center text-sm font-medium text-indigo-600 group-hover:translate-x-2 transition-transform">
                        Lihat Semua
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Popular Games Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Game Populer
              </h2>
              <p className="text-slate-600">
                Top up game favoritmu dengan harga terbaik
              </p>
            </div>
            <Link href="/games">
              <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                Lihat Semua
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {popularGames.map((game, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Link href="/games">
                  <Card className="group relative overflow-hidden bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 cursor-pointer">
                    <div className="relative aspect-square">
                      <img
                        src={game.image}
                        alt={game.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs border-0">
                          -{game.discount}
                        </Badge>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3 className="text-white font-medium text-sm truncate">
                          {game.name}
                        </h3>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Kenapa Pilih Ardina Store?
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Keunggulan yang membuat kami menjadi pilihan terbaik untuk top up game
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="bg-gradient-to-br from-slate-50 to-indigo-50 border-slate-200 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl animated-gradient p-8 sm:p-12 lg:p-16"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
            <div className="relative text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Daftar Sekarang & Dapatkan Diskon!
              </h2>
              <p className="text-indigo-100 mb-8">
                Daftar akun gratis dan dapatkan diskon Rp 1.000 untuk setiap pembelian. 
                Plus akses ke riwayat transaksi dan monitoring pesanan.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-6 text-lg rounded-xl shadow-xl"
                  >
                    Daftar Gratis
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/50 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl"
                  >
                    Sudah Punya Akun?
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
