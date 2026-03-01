import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TopUp Game - Jual Diamond, UC, dan Voucher Game Murah",
  description: "TopUp Game terpercaya dengan harga termurah. Tersedia Mobile Legends, Free Fire, PUBG, dan banyak game lainnya. Proses cepat dan aman.",
  keywords: "topup game, diamond ml, uc pubg, voucher game, topup murah",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-50 min-h-screen`}
      >
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="pt-16">
              {children}
            </main>
            <Footer />
            <Toaster position="top-center" richColors />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
