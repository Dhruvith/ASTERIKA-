# 🚀 Asterika - Premium Trading Journal & Analytics Platform

<div align="center">
  <img src="public/logo.svg" alt="Asterika Logo" width="120">
  
  **The intelligent trading journal that transforms your data into actionable insights.**
  
  [![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
  [![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange)](https://firebase.google.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)
</div>

---

## ✨ Features

### Core Functionality
- 📊 **Real-time Analytics Dashboard** - Watch metrics update instantly as you log trades
- 📈 **Interactive Charts** - Equity curve, win/loss distribution, daily P&L, and more
- 🏷️ **Multi-Strategy Tracking** - Segment performance by trading strategy
- 😊 **Emotional Pattern Detection** - Track correlation between mindset and outcomes
- 📅 **Trade Calendar** - Visualize your trading activity over time
- 🖼️ **Screenshot Management** - Upload and organize trade charts

### Analytics
- 💰 Total P&L tracking with live updates
- 📉 Win rate, profit factor, Sharpe ratio
- 🎯 Average win/loss, largest trades
- 📊 Expectancy calculation
- 📈 Max drawdown visualization
- ⏱️ Trade duration analysis
- 🔥 Consecutive win/loss streaks

### Premium Design
- 🎨 Nordic-inspired color palette
- 🌙 Dark mode support
- ✨ Smooth animations with Framer Motion
- 📱 Desktop-optimized interface
- 🏔️ Glass morphism effects
- 🎯 Premium typography (Inter + JetBrains Mono)

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **Database** | Firebase Firestore |
| **Authentication** | Firebase Auth (Email + Google OAuth) |
| **Storage** | Firebase Storage |
| **State Management** | Zustand |
| **Server State** | TanStack Query |
| **Charts** | Recharts |
| **Forms** | React Hook Form + Zod |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **UI Primitives** | Radix UI |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase account

### 1. Clone & Install

```bash
cd asterika-app
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable the following services:
   - **Authentication** → Enable Email/Password and Google providers
   - **Firestore Database** → Create in production mode
   - **Storage** → Set up with default rules

4. Get your config:
   - Project Settings → Your apps → Web app → Config

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4. Deploy Firestore Rules

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (select Firestore, Storage)
firebase init

# Deploy rules
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
firebase deploy --only firestore:indexes
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
asterika-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/          # Dashboard page
│   │   ├── login/              # Login page
│   │   ├── signup/             # Signup page
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Landing page
│   │
│   ├── components/
│   │   ├── ui/                 # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Dialog.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   └── Badge.tsx
│   │   │
│   │   ├── charts/             # Chart components
│   │   │   ├── EquityCurve.tsx
│   │   │   ├── WinLossChart.tsx
│   │   │   └── PnLByDay.tsx
│   │   │
│   │   ├── dashboard/          # Dashboard-specific components
│   │   │   ├── StatsCards.tsx
│   │   │   ├── TradeTable.tsx
│   │   │   └── AddTradeModal.tsx
│   │   │
│   │   ├── layout/             # Layout components
│   │   │   ├── Navbar.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── AuthGuard.tsx
│   │   │
│   │   └── providers/          # Context providers
│   │       ├── ThemeProvider.tsx
│   │       └── Providers.tsx
│   │
│   ├── hooks/                  # Custom hooks
│   │   ├── useAuth.ts          # Firebase auth hook
│   │   └── useTrades.ts        # Trades CRUD hook
│   │
│   ├── lib/                    # Utilities
│   │   ├── firebase.ts         # Firebase config
│   │   └── utils.ts            # Helper functions
│   │
│   ├── store/                  # Zustand stores
│   │   ├── useAuthStore.ts
│   │   ├── useTradeStore.ts
│   │   └── useUIStore.ts
│   │
│   └── types/                  # TypeScript types
│       ├── trade.ts
│       └── user.ts
│
├── public/                     # Static assets
├── firestore.rules             # Firestore security rules
├── storage.rules               # Storage security rules
├── firestore.indexes.json      # Firestore indexes
└── firebase.json               # Firebase config
```

---

## 🎨 Design System

### Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| **Charcoal** | `#2B2D31` | Primary dark color |
| **Cream** | `#F8F7F4` | Background light |
| **Sage** | `#8B9D83` | Success, profit |
| **Terracotta** | `#C87259` | Danger, loss |
| **Steel** | `#5B7C99` | Neutral, info |

### Typography

| Font | Usage |
|------|-------|
| **Inter** | Body text, UI |
| **JetBrains Mono** | Numbers, data |

---

## 📊 Firestore Data Model

### Users Collection
```
/users/{userId}
├── uid: string
├── email: string
├── displayName: string
├── photoURL: string
├── createdAt: timestamp
├── preferences: {
│   ├── theme: 'light' | 'dark'
│   ├── defaultCurrency: string
│   └── timezone: string
│   }
└── stats: {
    ├── totalTrades: number
    ├── winRate: number
    └── totalPnL: number
    }
```

### Trades Subcollection
```
/users/{userId}/trades/{tradeId}
├── symbol: string
├── side: 'long' | 'short'
├── entryPrice: number
├── exitPrice: number
├── quantity: number
├── entryDate: timestamp
├── exitDate: timestamp
├── pnl: number
├── pnlPercent: number
├── commission: number
├── strategy: string
├── tags: string[]
├── emotion: string
├── notes: string
├── screenshots: string[]
├── riskReward: number
├── positionSize: number
├── stopLoss: number
├── takeProfit: number
├── marketCondition: string
├── createdAt: timestamp
└── updatedAt: timestamp
```

---

## 🔒 Security

- Row-level security with Firestore rules
- Users can only access their own data
- File uploads limited to 5MB
- Image-only uploads allowed
- Rate limiting on Firebase level

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm run build
vercel
```

### Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

---

## 📈 Roadmap

### Phase 2 (Coming Soon)
- [ ] Trade calendar heatmap
- [ ] Advanced analytics page
- [ ] Strategy comparison
- [ ] CSV/Excel export
- [ ] More chart types

### Phase 3 (Future)
- [ ] AI-powered insights
- [ ] Pattern detection
- [ ] Public profile sharing
- [ ] Broker API integration
- [ ] Mobile app

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

---

## 📄 License

MIT License - see LICENSE file for details.

---

<div align="center">
  <p>Built with ❤️ for traders who measure what matters.</p>
  <p>🇸🇪 Nordic Design Philosophy</p>
</div>
