'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Compass,
  QrCode,
  Utensils,
  ChefHat,
  LayoutDashboard,
  ShoppingBag,
  ShieldCheck,
  X,
  Sparkles,
  ChevronUp,
} from 'lucide-react';

const PORTALS = [
  { href: '/t/qr_tbl_01_8fK29xQm7P7wL9a1', icon: QrCode, label: 'Table 01 scan' },
  { href: '/menu', icon: Utensils, label: 'Student menu' },
  { href: '/kitchen', icon: ChefHat, label: 'Kitchen KDS' },
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Admin stats' },
  { href: '/admin/orders', icon: ShoppingBag, label: 'Live orders' },
  { href: '/admin/tables', icon: ShieldCheck, label: 'QR manager' },
];

export function DemoSwitcherDock() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, role, quickLogin, logout } = useAuth();

  return (
    <div className="fixed bottom-4 right-4 z-50 print:hidden">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 rounded-full border border-white/10 bg-ink px-3.5 py-2.5 text-background shadow-2xl transition-all hover:scale-105"
        >
          <span className="h-2 w-2 rounded-full bg-leaf motion-safe:animate-ping"></span>
          <Compass className="h-4 w-4 text-primary transition-transform group-hover:rotate-45" />
          <span className="font-display text-xs font-extrabold tracking-tight">GPREC Portals</span>
          <ChevronUp className="h-3.5 w-3.5 text-background/50" />
        </button>
      ) : (
        <div className="w-[340px] max-w-sm space-y-4 rounded-xl border border-white/10 bg-ink p-5 text-background shadow-2xl animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/20 p-1.5 text-primary">
                <Compass className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-display text-xs font-extrabold text-background">Quick portal switcher</h4>
                <p className="text-[10px] text-background/60">Jump between roles and live terminals</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-background/60 hover:bg-white/10 hover:text-background"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Active identity */}
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
            <div className="overflow-hidden">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-background/50">Current user</span>
              <div className="truncate text-xs font-bold text-background">
                {user ? `${profile?.first_name || 'Member'} (${role})` : 'Guest / unauthenticated'}
              </div>
            </div>
            {user ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()}
                className="h-6 px-2 text-[10px] text-chutney hover:bg-chutney/15"
              >
                Sign out
              </Button>
            ) : (
              <Link href="/auth/login">
                <Button size="sm" className="h-6 px-2 text-[10px]">
                  Log in
                </Button>
              </Link>
            )}
          </div>

          {/* Portals */}
          <div className="space-y-1.5">
            <span className="px-1 text-[10px] font-bold uppercase tracking-wider text-background/50">
              Live system portals
            </span>

            <div className="grid grid-cols-2 gap-1.5">
              {PORTALS.map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-2.5 text-xs font-bold text-background/90 transition hover:border-primary/40 hover:bg-white/10 hover:text-primary"
                >
                  <Icon className="h-4 w-4 shrink-0 text-primary" />
                  <span className="truncate">{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Role switch */}
          <div className="space-y-1.5 border-t border-white/10 pt-2">
            <span className="flex items-center gap-1 px-1 text-[10px] font-bold uppercase tracking-wider text-primary-soft">
              <Sparkles className="h-3 w-3" /> One-click role switch
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { role: 'ADMIN' as const, label: 'Admin' },
                { role: 'KITCHEN' as const, label: 'Chef' },
                { role: 'STUDENT' as const, label: 'Student' },
              ].map(({ role: r, label }) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => { quickLogin(r); setIsOpen(false); }}
                  className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-center text-[10px] font-bold text-background/90 transition hover:border-primary/50 hover:bg-primary/15 hover:text-primary-soft"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
