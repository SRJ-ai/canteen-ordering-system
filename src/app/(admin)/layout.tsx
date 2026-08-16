'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { RoleGuard } from '@/components/auth/RoleGuard';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  QrCode,
  ChefHat,
  LogOut,
  ShieldCheck,
  ArrowUpRight,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function AdminSidebar() {
  const pathname = usePathname();
  const { user, profile, role, logout } = useAuth();

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-primary' },
    { href: '/admin/orders', label: 'Live Orders & Cancel', icon: ShoppingBag, color: 'text-orange-400' },
    { href: '/admin/menu', label: 'Menu Management', icon: UtensilsCrossed, color: 'text-emerald-400' },
    { href: '/admin/tables', label: 'Table QR Generator', icon: QrCode, color: 'text-blue-400' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between hidden md:flex border-r border-slate-800 shadow-xl">
      <div className="p-6 space-y-6">
        {/* Admin Header */}
        <div className="flex items-center gap-3">
          <div className="bg-primary text-white p-2 rounded-xl shadow-md">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              GPREC Admin
            </div>
            <div className="text-[11px] text-slate-400">Campus Canteen Operations</div>
          </div>
        </div>

        {/* User Identity Chip */}
        {user && (
          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                {profile?.first_name?.[0] || 'A'}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-slate-200 truncate">
                  {profile?.first_name || 'Administrator'}
                </div>
                <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-primary/10 text-primary border-primary/30">
                  {role || 'ADMIN'}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => logout()}
              title="Sign Out"
              className="h-7 w-7 text-slate-400 hover:text-rose-400 hover:bg-slate-700/50 rounded-lg"
            >
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="space-y-1.5 pt-2 text-sm font-medium">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition ${
                  isActive
                    ? 'bg-primary text-white font-bold shadow-md shadow-primary/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : item.color}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

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
            Open Student App <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-100/60 font-sans antialiased text-slate-900">
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="font-bold text-sm flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" /> GPREC Admin
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Link href="/admin/dashboard" className="bg-slate-800 px-2.5 py-1.5 rounded-lg">Stats</Link>
            <Link href="/admin/orders" className="bg-slate-800 px-2.5 py-1.5 rounded-lg">Orders</Link>
            <Link href="/admin/tables" className="bg-slate-800 px-2.5 py-1.5 rounded-lg">Tables</Link>
            <Link href="/menu" className="bg-primary text-white px-2.5 py-1.5 rounded-lg">Menu</Link>
          </div>
        </div>

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          <RoleGuard allowedRoles={['ADMIN', 'SUPER_ADMIN']} portalName="GPREC Admin Portal">
            {children}
          </RoleGuard>
        </main>
      </div>
    </div>
  );
}
