'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Twitter, 
  Facebook, 
  Youtube,
  Sparkles,
  MessageCircle,
  HelpCircle,
  FileText,
  Shield,
  BookOpen,
  AlertTriangle
} from 'lucide-react';

const footerLinks = {
  informasi: [
    { label: 'Cara Pembelian', href: '/cara-pembelian', icon: BookOpen },
    { label: 'Syarat & Ketentuan', href: '/syarat-ketentuan', icon: FileText },
    { label: 'Kebijakan Privasi', href: '/kebijakan-privasi', icon: Shield },
    { label: 'FAQ', href: '/faq', icon: HelpCircle },
  ],
  support: [
    { label: 'Hubungi Kami', href: '/kontak', icon: MessageCircle },
    { label: 'Report Masalah', href: '/report', icon: AlertTriangle },
  ],
};

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com/ardinastore', label: 'Instagram', color: 'hover:bg-pink-500 hover:text-white' },
  { icon: Twitter, href: 'https://twitter.com/ardinastore', label: 'Twitter', color: 'hover:bg-sky-500 hover:text-white' },
  { icon: Facebook, href: 'https://facebook.com/ardinastore', label: 'Facebook', color: 'hover:bg-blue-600 hover:text-white' },
  { icon: Youtube, href: 'https://youtube.com/ardinastore', label: 'Youtube', color: 'hover:bg-red-600 hover:text-white' },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold gradient-text">
                  Ardina Store
                </span>
                <span className="text-xs text-slate-500">PT Ardina Digital Solution</span>
              </div>
            </Link>
            <p className="text-slate-600 text-sm mb-6 max-w-sm">
              Platform top up game, pulsa, voucher streaming, dan sosmed booster terpercaya. 
              Proses cepat, harga murah, dan terpercaya sejak 2020.
            </p>
            <div className="space-y-3">
              <a 
                href="mailto:ardinastore2511@gmail.com" 
                className="flex items-center gap-3 text-slate-600 text-sm hover:text-indigo-600 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-indigo-600" />
                </div>
                ardinastore2511@gmail.com
              </a>
              <a 
                href="https://wa.me/6283830970562" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-slate-600 text-sm hover:text-green-600 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-green-600" />
                </div>
                0838-3097-0562
              </a>
              <div className="flex items-center gap-3 text-slate-600 text-sm">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-amber-600" />
                </div>
                Cirebon, Indonesia
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-slate-900 font-semibold mb-4">Informasi</h3>
            <ul className="space-y-3">
              {footerLinks.informasi.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-slate-600 text-sm hover:text-indigo-600 transition-colors"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-slate-900 font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-slate-600 text-sm hover:text-indigo-600 transition-colors"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm text-center sm:text-left">
              © {new Date().getFullYear()} Ardina Store. PT Ardina Digital Solution. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 transition-all ${social.color}`}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
