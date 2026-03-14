import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Ardina Store - Top Up Game Murah & Cepat | PT Ardina Digital Solution",
  description: "Ardina Store - Platform top up game, pulsa, voucher streaming, dan sosmed booster terpercaya. Proses cepat, harga murah, dan terpercaya sejak 2020.",
  keywords: "Ardina Store, topup game, diamond ml, uc pubg, voucher game, topup murah, Cirebon",
  authors: [{ name: "PT Ardina Digital Solution" }],
  creator: "PT Ardina Digital Solution",
  publisher: "PT Ardina Digital Solution",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://ardinastore.id",
    siteName: "Ardina Store",
    title: "Ardina Store - Top Up Game Murah & Cepat",
    description: "Platform top up game, pulsa, voucher streaming, dan sosmed booster terpercaya. Proses cepat dan harga termurah!",
    images: [
      {
        url: "https://ardinastore.id/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ardina Store - Top Up Game Murah & Cepat",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ardina Store - Top Up Game Murah & Cepat",
    description: "Platform top up game, pulsa, voucher streaming, dan sosmed booster terpercaya.",
    images: ["https://ardinastore.id/og-image.jpg"],
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://ardinastore.id",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="light">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="msapplication-TileColor" content="#6366f1" />
        <meta name="theme-color" content="#6366f1" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-gradient-to-br from-slate-50 via-white to-indigo-50 text-slate-900 min-h-screen`}
      >
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="pt-16 md:pt-20">
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
