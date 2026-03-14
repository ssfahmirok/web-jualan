# TopUp Game - Website Top Up Game Lengkap

Website top up game lengkap dengan fitur pembelian tanpa login, sistem saldo internal, dan integrasi dengan berbagai payment gateway serta provider.

## Fitur Utama

### 1. Pembelian Tanpa Login (Guest Checkout)
- User dapat membeli produk tanpa harus login/register
- Setelah pembelian, user diarahkan ke halaman tracking dengan Order ID
- Pembayaran langsung via QRIS/external payment gateway

### 2. Sistem Login & Member
- Login dengan email/password atau Google
- Harga lebih murah Rp 1.000 untuk setiap item saat login
- Sistem saldo internal (top up saldo terlebih dahulu)
- Riwayat transaksi dan monitoring pembelian

### 3. Layanan
- **Game**: Mobile Legends, Free Fire, PUBG, Genshin Impact, dll
- **PPOB**: Pulsa, paket data, tagihan
- **Streaming**: Netflix, Spotify, Disney+, YouTube Premium, dll
- **Sosmed Booster**: Followers, likes, views

### 4. Payment Integration
- **iPaymu**: Deposit saldo dengan berbagai metode pembayaran (QRIS, VA, dll)
- **VIP Reseller**: Provider untuk game dan PPOB
- **SMM.id**: Provider untuk sosmed booster

### 5. Sistem Saldo
- Top up saldo via iPaymu
- Saldo otomatis bertambah setelah pembayaran confirmed (webhook)
- Pembelian menggunakan saldo internal untuk user yang login

## Tech Stack

- **Framework**: Next.js 15 dengan App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animation**: Framer Motion
- **Auth**: Firebase Authentication
- **Database**: Firebase Firestore
- **Deployment**: Vercel

## Struktur Project

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── ipaymu/       # iPaymu integration (deposit)
│   │   ├── vip/          # VIP Reseller integration (game/PPOB)
│   │   └── smm/          # SMM.id integration (sosmed)
│   ├── (auth)/           # Auth pages (login, register)
│   ├── games/            # Game catalog & purchase
│   ├── ppob/             # PPOB catalog & purchase
│   ├── streaming/        # Streaming services
│   ├── sosmed/           # Sosmed booster
│   ├── dashboard/        # User dashboard
│   ├── deposit/          # Deposit saldo
│   └── orders/           # Order history
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   ├── layout/          # Layout components (Navbar, Footer)
│   └── ...
├── context/             # React Context
│   ├── AuthContext.tsx  # Authentication context
│   └── CartContext.tsx  # Shopping cart context
├── lib/                 # Utilities
│   ├── firebase/        # Firebase config & admin
│   └── utils.ts         # Helper functions
├── types/               # TypeScript types
└── hooks/               # Custom React hooks
```

## Environment Variables

Copy `.env.example` ke `.env.local` dan isi dengan konfigurasi Anda:

```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
FIREBASE_SERVICE_ACCOUNT_JSON=

# iPaymu
IPAYMU_VA=
IPAYMU_API_KEY=
IPAYMU_WEBHOOK_SECRET=

# VIP Reseller
VIP_API_ID=
VIP_API_KEY=

# SMM
SMM_API_KEY=
```

## Cara Menjalankan

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Output akan ada di folder 'dist'
```

### Deployment ke Vercel

1. Push code ke GitHub
2. Connect repository ke Vercel
3. Tambahkan environment variables di Vercel Dashboard
4. Deploy!

## API Endpoints

### iPaymu (Deposit)
- `GET /api/ipaymu/channels` - Get payment channels
- `POST /api/ipaymu/create-invoice` - Create deposit invoice
- `POST /api/ipaymu/webhook` - Webhook for payment notification

### VIP Reseller (Game & PPOB)
- `GET /api/vip/services?type=game|prepaid` - Get services
- `POST /api/vip/order` - Place order

### SMM (Sosmed Booster)
- `GET /api/smm/services` - Get services
- `POST /api/smm/order` - Place order

## Fitur Keamanan

- Firebase Authentication untuk user management
- JWT token verification untuk API endpoints
- Webhook signature verification
- Input validation & sanitization
- Idempotency untuk mencegah double order

## Lisensi

MIT License - Bebas digunakan untuk personal atau komersial.

## Support

Untuk bantuan atau pertanyaan, silakan hubungi:
- Email: support@topupgame.id
- WhatsApp: 0812-3456-7890
