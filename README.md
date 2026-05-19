# 🍽️ Saveur — Restaurant Management System

A fully functional restaurant management system built with **Next.js 14**, **Tailwind CSS**, and **MongoDB**.

---

## 🚀 Quick Start

```bash
# 1. Unzip and install
unzip restaurant-ms.zip && cd restaurant-ms
npm install

# 2. Configure MongoDB
cp .env.local.example .env.local
# Edit .env.local with your MongoDB URI

# 3. Seed the database with sample data
npm run seed

# 4. Start the app
npm run dev
```

Open http://localhost:3000 — you'll land on the login page.

---

## 🔐 Login & Roles

PIN-based login with three role accounts:

| Role    | Name         | PIN  | Access |
|---------|--------------|------|--------|
| Manager | Arjun Sharma | 1234 | Everything |
| Waiter  | Priya Anand  | 2222 | Waiter dashboard + Orders |
| Cook    | Raju Kumar   | 3333 | Kitchen display only |

Each role is redirected to their own dashboard. The sidebar shows only accessible pages. Sign out clears the session.

---

## 📊 Three Role Dashboards

### Manager (/dashboard)
- Live KPI cards: today revenue vs yesterday, active orders, staff, stock alerts
- Live alerts panel from real DB data (low stock, slow orders, expiring items, staff on leave)
- Revenue bars by category calculated from paid orders
- Recent orders table, staff list, inventory snapshot
- Auto-refreshes every 30 seconds

### Waiter (/dashboard/waiter)
- 15-table visual grid with live status
- Active order cards with Mark Served and payment buttons (Cash/Card/UPI)
- All actions update MongoDB instantly

### Cook / KDS (/dashboard/cook)
- Ticket queue sorted oldest-first, colour-coded by urgency
- Per-item checkboxes, Start/Ready buttons
- Low-stock ticker and inventory alerts from real DB

---

## 🌱 Seed the Database

```bash
npm run seed
```

Seeds 20 inventory items, 12 staff members, and 19 orders (active + paid + cancelled).
Some items are intentionally low/expiring to trigger live alerts immediately.

---

## ⚙️ MongoDB Setup

Local:
```
MONGODB_URI=mongodb://localhost:27017/restaurant-ms
```

Atlas (free cloud):
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/restaurant-ms
```

---

## 🗂️ Project Structure

```
restaurant-ms/
├── app/
│   ├── api/             # REST endpoints for orders, staff, inventory
│   ├── dashboard/       # Manager, waiter, cook pages + layout
│   ├── login/           # PIN login page
│   ├── globals.css
│   ├── layout.tsx       # Root layout with AuthProvider
│   └── page.tsx         # Redirects to /login
├── components/
│   ├── AuthGuard.tsx    # Blocks unauth access + role routing
│   └── Sidebar.tsx      # Role-aware nav with sign out
├── lib/
│   ├── auth.tsx         # Auth context + useAuth hook
│   └── mongoose.ts      # Cached DB connection
├── models/              # Mongoose schemas
├── scripts/
│   └── seed.js          # Database seeder
└── .env.local.example
```

---

## 🎨 Customisation

| What | Where |
|------|-------|
| Menu items | app/dashboard/orders/page.tsx → MENU |
| Tax rate | app/api/orders/route.ts → 0.18 |
| PIN codes | app/login/page.tsx → DEMO_ACCOUNTS |
| Role permissions | components/AuthGuard.tsx → ROLE_ALLOWED |
| Number of tables | app/dashboard/waiter/page.tsx → loop 1..15 |
| Refresh interval | app/dashboard/page.tsx → setInterval 30000 |
