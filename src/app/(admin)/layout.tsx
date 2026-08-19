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
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-steel' },
    { href: '/admin/orders', label: 'Live Orders & Cancel', icon: ShoppingBag, color: 'text-steel' },
    { href: '/admin/menu', label: 'Menu Management', icon: UtensilsCrossed, color: 'text-steel' },
    { href: '/admin/tables', label: 'Table QR Generator', icon: QrCode, color: 'text-steel' },
  ];

  return (
    <aside className="w-64 bg-card text-ink flex flex-col justify-between hidden md:flex border-r border-border">
      <div className="p-6 space-y-6">
        {/* Admin Header */}
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div className="leading-none">
            <div className="font-display font-extrabold text-base tracking-tight text-ink">
              GPREC Admin
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">Campus Canteen Operations</div>
          </div>
        </div>

        {/* User Identity Chip */}
        {user && (
          <div className="bg-secondary p-3 rounded-lg border border-border flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary-deep flex items-center justify-center font-bold text-xs shrink-0">
                {profile?.first_name?.[0] || 'A'}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-ink truncate">
                  {profile?.first_name || 'Administrator'}
                </div>
                <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-primary/15 text-primary-deep border-primary/30">
                  {role || 'ADMIN'}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => logout()}
              title="Sign Out"
              className="h-7 w-7 text-steel hover:text-chutney hover:bg-secondary rounded-lg"
            >
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="space-y-1 pt-2 text-sm font-medium">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${
                  isActive
                    ? 'bg-primary text-primary-foreground font-bold'
                    : 'text-ink/70 hover:bg-secondary hover:text-ink'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-primary-foreground' : item.color}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <Link
            href="/kitchen"
            target="_blank"
            className="flex items-center justify-between px-4 py-2.5 rounded-lg hover:bg-secondary text-ink/70 hover:text-ink transition"
          >
            <div className="flex items-center gap-3">
              <ChefHat className="h-4 w-4 text-steel" />
              <span>Kitchen Display (KDS)</span>
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
          </Link>
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border space-y-2">
        <Link href="/menu" target="_blank" className="w-full block">
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-card border-ink/20 text-ink hover:bg-secondary text-xs rounded-lg flex items-center justify-center gap-1.5"
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
    <div className="flex min-h-screen bg-background font-sans antialiased text-ink">
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between p-4 bg-card text-ink border-b border-border">
          <div className="font-display font-bold text-sm flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary-deep" /> GPREC Admin
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Link href="/admin/dashboard" className="bg-secondary text-ink px-2.5 py-1.5 rounded-lg">Stats</Link>
            <Link href="/admin/orders" className="bg-secondary text-ink px-2.5 py-1.5 rounded-lg">Orders</Link>
            <Link href="/admin/tables" className="bg-secondary text-ink px-2.5 py-1.5 rounded-lg">Tables</Link>
            <Link href="/menu" className="bg-primary text-primary-foreground px-2.5 py-1.5 rounded-lg font-bold">Menu</Link>
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
