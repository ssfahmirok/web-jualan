'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Gamepad2,
  Zap,
  Tv,
  Share2,
  User,
  ShoppingCart,
  Menu,
  Wallet,
  History,
  LogOut,
  ChevronDown,
  Home,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/games', label: 'Game', icon: Gamepad2 },
  { href: '/ppob', label: 'PPOB', icon: Zap },
  { href: '/streaming', label: 'Streaming', icon: Tv },
  { href: '/sosmed', label: 'Sosmed', icon: Share2 },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => pathname === href;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-indigo-500/10 border-b border-indigo-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-xl animated-gradient flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse-glow" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold gradient-text">
                Ardina Store
              </span>
              <span className="text-[10px] text-slate-500 hidden sm:block">PT Ardina Digital Solution</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'text-indigo-600'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50'
                }`}
              >
                {item.label}
                {isActive(item.href) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-indigo-100 rounded-lg border border-indigo-200"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden sm:block max-w-[100px] truncate text-sm font-medium">
                      {user.displayName}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-white border-slate-200 shadow-xl"
                >
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold text-slate-900">
                      {user.displayName}
                    </p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-slate-100" />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 cursor-pointer text-slate-700 focus:text-indigo-600 focus:bg-indigo-50"
                    >
                      <Wallet className="w-4 h-4" />
                      Saldo: Rp {user.balance?.toLocaleString('id-ID')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/deposit"
                      className="flex items-center gap-2 cursor-pointer text-slate-700 focus:text-indigo-600 focus:bg-indigo-50"
                    >
                      <Zap className="w-4 h-4" />
                      Top Up Saldo
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/orders"
                      className="flex items-center gap-2 cursor-pointer text-slate-700 focus:text-indigo-600 focus:bg-indigo-50"
                    >
                      <History className="w-4 h-4" />
                      Riwayat Transaksi
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-100" />
                  <DropdownMenuItem
                    onClick={logout}
                    className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="text-slate-700 hover:text-indigo-600 hover:bg-indigo-50"
                  >
                    Masuk
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/30">
                    Daftar
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-slate-700 hover:text-indigo-600 hover:bg-indigo-50"
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full sm:w-80 bg-white border-slate-200"
              >
                <SheetHeader>
                  <SheetTitle className="text-slate-900 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    Ardina Store
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive(item.href)
                          ? 'bg-indigo-100 text-indigo-600 border border-indigo-200'
                          : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  ))}
                  {!user && (
                    <>
                      <div className="border-t border-slate-100 my-4" />
                      <Link
                        href="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
                      >
                        <User className="w-5 h-5" />
                        Masuk
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                          Daftar
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
