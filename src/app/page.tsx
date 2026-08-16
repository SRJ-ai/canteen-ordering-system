import Link from 'next/link';
import {
  Utensils,
  QrCode,
  ChefHat,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  IndianRupee,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 max-w-6xl h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-orange-500 text-slate-950 p-2 rounded-xl font-bold shadow-md">
              <Utensils className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white">
              Campus Bites <span className="text-orange-400 font-bold text-xs bg-orange-950/60 border border-orange-500/30 px-2 py-0.5 rounded-md">GOURMET CANTEEN</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm" className="text-xs text-slate-400 hover:text-white rounded-xl">
                <ShieldCheck className="h-4 w-4 mr-1 text-orange-400" /> Admin Portal
              </Button>
            </Link>
            <Link href="/menu">
              <Button className="bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold rounded-xl text-xs px-4">
                Open Menu &rarr;
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 max-w-6xl py-12 md:py-20 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <Badge className="bg-orange-500/10 text-orange-400 border border-orange-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 mr-1" /> Production Canteen Customer Ordering System
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Seamless QR Dining & Kitchen Management
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Order from physical tables with instant QR codes, customize toppings, track tickets live in the kitchen, and manage cancellations with full audit logging.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/t/qr_tbl_01_8fK29xQm7P7wL9a1">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-400 text-slate-950 font-extrabold rounded-2xl px-6 h-14 shadow-xl flex items-center gap-2">
                <QrCode className="h-5 w-5" /> Simulate Table 01 Scan
              </Button>
            </Link>
            <Link href="/kitchen" target="_blank">
              <Button size="lg" variant="outline" className="bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800 rounded-2xl px-6 h-14 font-bold flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-amber-400" /> Open Kitchen KDS
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Feature Portals Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Customer Menu */}
          <Link href="/menu" className="group">
            <Card className="bg-slate-900 border-slate-800 hover:border-orange-500/50 rounded-3xl p-6 h-full flex flex-col justify-between transition-all duration-200 hover:-translate-y-1">
              <div className="space-y-4">
                <div className="bg-orange-500/10 text-orange-400 p-3 rounded-2xl w-fit">
                  <Utensils className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white group-hover:text-orange-400 transition-colors">
                    Customer Menu
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Explore categories, add-ons (Ghee, Amul Cheese), cart drawer, and live INR pricing.
                  </p>
                </div>
              </div>
              <div className="text-xs font-bold text-orange-400 flex items-center gap-1 pt-6">
                Explore Menu <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Card>
          </Link>

          {/* QR Table Ordering */}
          <Link href="/t/qr_tbl_01_8fK29xQm7P7wL9a1" className="group">
            <Card className="bg-slate-900 border-slate-800 hover:border-blue-500/50 rounded-3xl p-6 h-full flex flex-col justify-between transition-all duration-200 hover:-translate-y-1">
              <div className="space-y-4">
                <div className="bg-blue-500/10 text-blue-400 p-3 rounded-2xl w-fit">
                  <QrCode className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">
                    Table 01 Scan & Session
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Simulate scanning Table 01 QR code. Sets HttpOnly table session cookie automatically.
                  </p>
                </div>
              </div>
              <div className="text-xs font-bold text-blue-400 flex items-center gap-1 pt-6">
                Scan Table 01 <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Card>
          </Link>

          {/* Kitchen Display */}
          <Link href="/kitchen" target="_blank" className="group">
            <Card className="bg-slate-900 border-slate-800 hover:border-amber-500/50 rounded-3xl p-6 h-full flex flex-col justify-between transition-all duration-200 hover:-translate-y-1">
              <div className="space-y-4">
                <div className="bg-amber-500/10 text-amber-400 p-3 rounded-2xl w-fit">
                  <ChefHat className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors">
                    Kitchen KDS Board
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Live Kanban: Incoming Tickets, Prep timers, Cooking state transitions, and audio alerts.
                  </p>
                </div>
              </div>
              <div className="text-xs font-bold text-amber-400 flex items-center gap-1 pt-6">
                View Kitchen <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Card>
          </Link>

          {/* Admin Management */}
          <Link href="/admin/orders" className="group">
            <Card className="bg-slate-900 border-slate-800 hover:border-emerald-500/50 rounded-3xl p-6 h-full flex flex-col justify-between transition-all duration-200 hover:-translate-y-1">
              <div className="space-y-4">
                <div className="bg-emerald-500/10 text-emerald-400 p-3 rounded-2xl w-fit">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">
                    Admin & Cancellation
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    KPI metrics, authoritative order cancellation modal with reason codes, and QR generators.
                  </p>
                </div>
              </div>
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1 pt-6">
                Admin Control <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Card>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} Campus Bites Canteen Ordering System &bull; Powered by Next.js 14 & Supabase</p>
      </footer>
    </div>
  );
}
