# GPREC Food Court — Campus Canteen Ordering System

> An enterprise-grade, QR-based table ordering, kitchen display (KDS), and admin order management system built with **Next.js 14 (App Router)**, **TypeScript**, **Supabase PostgreSQL & RLS**, and styled with the **Steel & Marigold design system (`DESIGN.md`)**.

---

## 🌟 Key Features

### 📱 1. Customer QR Table Ordering & Dining Flow
* **Physical Table QR Codes**: Scan cryptographically secure table tokens (`/t/[token]`) to establish an authenticated, HttpOnly `canteen_table_session`.
* **Indian Rupee (₹ INR) Menu**: 22 authentic pre-seeded canteen dishes (South Indian Breakfast, North Indian Meals & Thali, Quick Bites & Snacks, Beverages, and Desserts).
* **Item Customizations & Add-ons**: Multi-select and single-select addons (*Extra Desi Ghee, Grated Amul Cheese, Extra Butter Pav, Sambar*) and custom kitchen instructions.
* **Reactive Slide-over Cart & Sticky Floating Bar**: Real-time subtotals, 5% GST breakdown, and table badge.
* **Frictionless Checkout**: Pay with **Instant UPI QR simulation**, **Cash at Counter**, or **Card / POS Terminal**.
* **Visual 5-Stage Live Order Tracker (`/orders/[id]`)**: Step-by-step progress tracking (`Placed` ➔ `Accepted` ➔ `Cooking` ➔ `Ready for Pickup` ➔ `Completed`) with real-time auto-polling every 5 seconds.
* **Customer Cancellation Rules**: Customers can cancel only before the kitchen accepts the ticket.

---

### 👨‍🍳 2. Kitchen Display System (KDS) (`/kitchen`)
* **High-Contrast Dark Mode Terminal**: Optimized for kitchen monitors and tablets.
* **3-Column Live Kanban Board**:
  * 🟡 **New Incoming Tickets** (with *Accept Ticket* action)
  * 🔵 **Cooking in Progress** (with *Start Cooking* and *Mark Ready* actions)
  * 🟢 **Ready for Pickup** (with *Complete & Hand Over* action)
* **Chef Highlights**: Displays table numbers, item counts, highlighted customization tags, and elapsed preparation timers.
* **Audio Alerts**: Toggleable sound notifications for new incoming tickets.

---

### 🛡️ 3. Admin Control & Operations Portal (`/admin/...`)
* **Real-time KPI Operations Dashboard (`/admin/dashboard`)**: Today's Revenue in ₹ INR, Active Order counts, Completed Orders, and Average Order Value.
* **Live Orders & Authoritative Cancellation (`/admin/orders`)**:
  * Filter by order status (`PENDING`, `ACCEPTED`, `PREPARING`, `READY`, `COMPLETED`, `CANCELLED`).
  * Instant search by Order Number (`CAN-2026-XXXX`) or Table number.
  * **Mandatory Cancellation Modal**: Requires standard operational reason codes (*Item Sold Out, Kitchen Rush, Customer Requested, Duplicate, System Test*) and justification notes with audit logging.
* **Table & QR Code Generator (`/admin/tables`)**: Real SVG QR code generator with printable tent cards and instant direct order links.
* **Menu Management (`/admin/menu`)**: Real-time *In Stock / Sold Out* availability toggles and price editor in ₹ INR.

---

## 🏗️ Architecture & Database Schema

```
auth.users (Supabase Auth)
  │
  ├── profiles (id, full_name, phone, role)
  │     └── user_roles (user_id, role)
  │
  └── tables ── table_sessions ── orders ── order_items ── order_item_addons
                                    │         │
                                    │         └── menu_items ── categories
                                    ├── payments
                                    ├── order_status_history
                                    └── order_notes
```

* **Anti-IDOR Security & Row-Level Security (RLS)**:
  * Strict PostgreSQL RLS policies ensuring customers can only view their own orders and active table sessions.
  * Backend mutations orchestrated through `createAdminClient()` for 100% server authority and price tamper prevention.
  * Explicitly zero inventory / supplier dependencies as per design specification.

---

## 🚀 Getting Started

### 1. Prerequisites
* Node.js 18+
* Supabase CLI (`npx supabase`)

### 2. Environment Setup
Create a `.env.local` file:
```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"

NEXT_PUBLIC_SUPABASE_URL="https://<project-ref>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### 3. Install & Run Dev Server
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## 🌐 Live URLs & Endpoints

| Portal | Route | Description |
|---|---|---|
| **Landing Page** | `/` | Central system navigation hub |
| **Simulate Table 01 Scan** | `/t/qr_tbl_01_8fK29xQm7P7wL9a1` | Table 01 QR scan & session creation |
| **Customer Menu** | `/menu` | Food specials, search & add-to-cart |
| **Cart & Checkout** | `/cart` / `/checkout` | Order review and UPI / Cash payment |
| **Kitchen KDS** | `/kitchen` | Real-time cooking Kanban terminal |
| **Admin Dashboard** | `/admin/dashboard` | Revenue KPIs & active order counters |
| **Admin Live Orders** | `/admin/orders` | Live order control & cancellation modal |
| **Table QR Generator** | `/admin/tables` | Printable SVG QR table cards |
| **Menu Editor** | `/admin/menu` | Instant availability toggle & price editing |

---

## 🎨 Design System

The whole app runs on **Steel & Marigold** — a warm South Indian campus-canteen visual
language: off-white "steel-tray" ground, one marigold accent, chutney red for urgency,
banana-leaf green reserved for veg marks and ready states, Bricolage Grotesque display
type, and JetBrains Mono for every price, token, and timer. The Kitchen KDS is the one
deliberately dark surface, built for glance-from-a-distance legibility on a wall display.

Full token, type, and component reference: [`DESIGN.md`](./DESIGN.md).

---

## 📄 License
MIT License. Built for modern campus and gourmet food courts.
