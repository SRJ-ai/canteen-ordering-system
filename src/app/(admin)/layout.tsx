import { ReactNode } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  QrCode,
  ChefHat,
  LogOut,
  ShieldAlert,
  ArrowUpRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-100/60 font-sans antialiased text-slate-900">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between hidden md:flex border-r border-slate-800 shadow-xl">
        <div className="p-6 space-y-6">
          {/* Admin Header */}
          <div className="flex items-center gap-3">
            <div className="bg-primary text-white p-2 rounded-xl shadow-md">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-white">
                Canteen Admin
              </div>
              <div className="text-[11px] text-slate-400">Campus Food Court</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 pt-4 text-sm font-medium">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-800 text-slate-300 hover:text-white transition"
            >
              <LayoutDashboard className="h-4 w-4 text-primary" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-800 text-slate-300 hover:text-white transition"
            >
              <ShoppingBag className="h-4 w-4 text-orange-400" />
              <span>Live Orders & Cancel</span>
            </Link>

            <Link
              href="/admin/menu"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-800 text-slate-300 hover:text-white transition"
            >
              <UtensilsCrossed className="h-4 w-4 text-emerald-400" />
              <span>Menu Management</span>
            </Link>

            <Link
              href="/admin/tables"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-800 text-slate-300 hover:text-white transition"
            >
              <QrCode className="h-4 w-4 text-blue-400" />
              <span>Table QR Generator</span>
            </Link>

            <Link
              href="/kitchen"
              target="_blank"
              className="flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-slate-800 text-slate-300 hover:text-white transition"
            >
              <div className="flex items-center gap-3">
                <ChefHat className="h-4 w-4 text-amber-400" />
                <span>Kitchen Display (KDS)</span>
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 text-slate-500" />
            </Link>
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <Link href="/menu" target="_blank" className="w-full block">
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-slate-800/70 hover:bg-slate-800 text-slate-200 border-slate-700 text-xs rounded-xl flex items-center justify-center gap-1.5"
            >
              Open Customer App <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="font-bold text-sm flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-primary" /> Admin Portal
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Link href="/admin/orders" className="bg-slate-800 px-3 py-1.5 rounded-lg">Orders</Link>
            <Link href="/admin/tables" className="bg-slate-800 px-3 py-1.5 rounded-lg">Tables</Link>
            <Link href="/menu" className="bg-primary text-white px-3 py-1.5 rounded-lg">Menu</Link>
          </div>
        </div>

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
