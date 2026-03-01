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
} from 'lucide-react';

const categories = [
  {
    id: 'games',
    name: 'Game',
    description: 'Top up diamond, UC, dan currency game favoritmu',
    icon: Gamepad2,
    color: 'from-violet-600 to-purple-600',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/20',
    href: '/games',
  },
  {
    id: 'ppob',
    name: 'PPOB',
    description: 'Pulsa, paket data, dan tagihan online',
    icon: Zap,
    color: 'from-amber-600 to-orange-600',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    href: '/ppob',
  },
  {
    id: 'streaming',
    name: 'Streaming',
    description: 'Netflix, Spotify, Disney+, dan lainnya',
    icon: Tv,
    color: 'from-rose-600 to-pink-600',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/20',
    href: '/streaming',
  },
  {
    id: 'sosmed',
    name: 'Sosmed Booster',
    description: 'Tambah followers, likes, dan views',
    icon: Share2,
    color: 'from-emerald-600 to-teal-600',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    href: '/sosmed',
  },
];

const features = [
  {
    icon: Shield,
    title: 'Aman & Terpercaya',
    description: 'Transaksi aman dengan sistem terenkripsi',
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
        <div className="absolute inset-0 bg-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-900/20 via-slate-950 to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-fuchsia-900/20 via-slate-950 to-slate-950" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <Badge
                variant="secondary"
                className="bg-violet-500/10 text-violet-400 border border-violet-500/20 px-4 py-1.5 text-sm"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Platform Top Up Terpercaya
              </Badge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Top Up Game{' '}
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
                Cepat & Murah
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto"
            >
              Isi ulang diamond, UC, dan currency game favoritmu dengan harga termurah. 
              Proses otomatis 24/7, aman, dan terpercaya.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/games">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-violet-500/25"
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
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white px-8 py-6 text-lg rounded-xl"
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
                  <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
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
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Pilih Layanan
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
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
                    className={`group relative overflow-hidden ${category.bgColor} ${category.borderColor} border-2 hover:border-opacity-50 transition-all duration-300 cursor-pointer h-full`}
                  >
                    <CardContent className="p-6">
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <category.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {category.name}
                      </h3>
                      <p className="text-slate-400 text-sm">
                        {category.description}
                      </p>
                      <div className="mt-4 flex items-center text-sm font-medium text-violet-400 group-hover:translate-x-2 transition-transform">
                        Lihat Semua
                        <ArrowRight className="w-4 h-4 ml-1" />
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
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Game Populer
              </h2>
              <p className="text-slate-400">
                Top up game favoritmu dengan harga terbaik
              </p>
            </div>
            <Link href="/games">
              <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
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
                  <Card className="group relative overflow-hidden bg-slate-900 border-slate-800 hover:border-violet-500/30 transition-all duration-300 cursor-pointer">
                    <div className="relative aspect-square">
                      <img
                        src={game.image}
                        alt={game.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-violet-500 text-white text-xs">
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
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Kenapa Pilih Kami?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
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
                <Card className="bg-slate-900 border-slate-800 hover:border-violet-500/30 transition-all duration-300 h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-xl bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-7 h-7 text-violet-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400 text-sm">
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
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-900 to-fuchsia-900 p-8 sm:p-12 lg:p-16"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            <div className="relative text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Daftar Sekarang & Dapatkan Diskon!
              </h2>
              <p className="text-violet-200 mb-8">
                Daftar akun gratis dan dapatkan diskon Rp 1.000 untuk setiap pembelian. 
                Plus akses ke riwayat transaksi dan monitoring pesanan.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-white text-violet-900 hover:bg-violet-50 px-8 py-6 text-lg rounded-xl"
                  >
                    Daftar Gratis
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-violet-400 text-white hover:bg-violet-800/50 px-8 py-6 text-lg rounded-xl"
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
