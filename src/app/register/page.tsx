'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, Mail, Lock, User, Eye, EyeOff, Chrome, ArrowRight, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const { register, loginWithGoogle } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast.error('Semua field wajib diisi');
      return;
    }

    if (password.length < 6) {
      toast.error('Password minimal 6 karakter');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Password tidak cocok');
      return;
    }

    setLoading(true);

    try {
      await register(email, password, name);
      toast.success('Registrasi berhasil! Selamat datang.');
      router.push('/');
    } catch (error: any) {
      console.error('Register error:', error);
      toast.error(error.message || 'Registrasi gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Login berhasil!');
      router.push('/');
    } catch (error: any) {
      console.error('Google login error:', error);
      toast.error(error.message || 'Login dengan Google gagal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold gradient-text">
                  Ardina Store
                </span>
                <span className="text-xs text-slate-500">PT Ardina Digital Solution</span>
              </div>
            </Link>
          </div>

          <Card className="bg-white border-slate-200 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-slate-900">Buat Akun Baru</CardTitle>
              <CardDescription className="text-slate-600">
                Daftar gratis dan dapatkan diskon Rp 1.000 untuk setiap pembelian
              </CardDescription>
              <div className="flex items-center justify-center gap-2 mt-2 p-2 bg-emerald-50 rounded-lg">
                <Zap className="w-4 h-4 text-emerald-600" />
                <span className="text-sm text-emerald-700 font-medium">Hemat Rp 1.000 per transaksi!</span>
              </div>
            </CardHeader>
            <CardContent>
              {/* Google Login */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full mb-4 border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                <Chrome className="w-5 h-5 mr-2" />
                Daftar dengan Google
              </Button>

              <div className="relative my-6">
                <Separator className="bg-slate-200" />
                <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-xs text-slate-500">
                  atau daftar dengan email
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-slate-700">
                    Nama Lengkap
                  </Label>
                  <div className="relative mt-2">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-slate-700">
                    Email
                  </Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password" className="text-slate-700">
                    Password
                  </Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-slate-700">
                    Konfirmasi Password
                  </Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-6"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Memproses...
                    </span>
                  ) : (
                    <>
                      Daftar Sekarang
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-600">
                Sudah punya akun?{' '}
                <Link
                  href="/login"
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Masuk disini
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
