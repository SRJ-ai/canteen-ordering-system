'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Compass,
  QrCode,
  Utensils,
  ChefHat,
  LayoutDashboard,
  ShoppingBag,
  ShieldCheck,
  UserCheck,
  X,
  Sparkles,
  ChevronUp,
} from 'lucide-react';

export function DemoSwitcherDock() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, role, quickLogin, logout } = useAuth();

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans print:hidden">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-slate-900/95 hover:bg-slate-900 text-white px-3.5 py-2.5 rounded-full shadow-2xl border border-slate-700/80 backdrop-blur-md transition-all hover:scale-105 group"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
          <Compass className="h-4 w-4 text-orange-400 group-hover:rotate-45 transition-transform" />
          <span className="text-xs font-extrabold tracking-tight">GPREC Portals</span>
          <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
        </button>
      ) : (
        <div className="bg-slate-950 text-white p-5 rounded-3xl border border-slate-800 shadow-2xl max-w-sm w-[340px] space-y-4 backdrop-blur-xl animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="bg-primary/20 text-primary p-1.5 rounded-xl">
                <Compass className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-white">GPREC Quick Portal Switcher</h4>
                <p className="text-[10px] text-slate-400">Jump between roles & live terminals</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Active Identity */}
          <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="overflow-hidden">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Current User</span>
              <div className="text-xs font-bold text-slate-200 truncate">
                {user ? `${profile?.first_name || 'Member'} (${role})` : 'Guest / Unauthenticated'}
              </div>
            </div>
            {user ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()}
                className="text-[10px] h-6 px-2 text-rose-400 hover:bg-rose-950/40"
              >
                Sign Out
              </Button>
            ) : (
              <Link href="/auth/login">
                <Button size="sm" className="text-[10px] h-6 px-2 bg-primary text-white">
                  Log In
                </Button>
              </Link>
            )}
          </div>

          {/* Portal Navigation Links */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
              Live System Portals:
            </span>

            <div className="grid grid-cols-2 gap-1.5">
              <Link
                href="/t/qr_tbl_01_8fK29xQm7P7wL9a1"
                onClick={() => setIsOpen(false)}
                className="p-2.5 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800/80 flex items-center gap-2 transition text-xs font-bold text-slate-200 hover:text-orange-400"
              >
                <QrCode className="h-4 w-4 text-orange-400 shrink-0" />
                <span className="truncate">Table 01 Scan</span>
              </Link>

              <Link
                href="/menu"
                onClick={() => setIsOpen(false)}
                className="p-2.5 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800/80 flex items-center gap-2 transition text-xs font-bold text-slate-200 hover:text-emerald-400"
              >
                <Utensils className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="truncate">Student Menu</span>
              </Link>

              <Link
                href="/kitchen"
                onClick={() => setIsOpen(false)}
                className="p-2.5 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800/80 flex items-center gap-2 transition text-xs font-bold text-slate-200 hover:text-amber-400"
              >
                <ChefHat className="h-4 w-4 text-amber-400 shrink-0" />
                <span className="truncate">Kitchen KDS</span>
              </Link>

              <Link
                href="/admin/dashboard"
                onClick={() => setIsOpen(false)}
                className="p-2.5 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800/80 flex items-center gap-2 transition text-xs font-bold text-slate-200 hover:text-blue-400"
              >
                <LayoutDashboard className="h-4 w-4 text-blue-400 shrink-0" />
                <span className="truncate">Admin Stats</span>
              </Link>

              <Link
                href="/admin/orders"
                onClick={() => setIsOpen(false)}
                className="p-2.5 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800/80 flex items-center gap-2 transition text-xs font-bold text-slate-200 hover:text-rose-400"
              >
                <ShoppingBag className="h-4 w-4 text-rose-400 shrink-0" />
                <span className="truncate">Live Orders</span>
              </Link>

              <Link
                href="/admin/tables"
                onClick={() => setIsOpen(false)}
                className="p-2.5 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800/80 flex items-center gap-2 transition text-xs font-bold text-slate-200 hover:text-cyan-400"
              >
                <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0" />
                <span className="truncate">QR Manager</span>
              </Link>
            </div>
          </div>

          {/* Quick Demo Logins */}
          <div className="pt-2 border-t border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 px-1 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> One-Click Role Switch:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => { quickLogin('ADMIN'); setIsOpen(false); }}
                className="p-1.5 bg-slate-900 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-500/40 rounded-xl text-center text-[10px] font-bold text-emerald-300"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => { quickLogin('KITCHEN'); setIsOpen(false); }}
                className="p-1.5 bg-slate-900 hover:bg-amber-950/60 border border-slate-800 hover:border-amber-500/40 rounded-xl text-center text-[10px] font-bold text-amber-300"
              >
                Chef
              </button>
              <button
                type="button"
                onClick={() => { quickLogin('STUDENT'); setIsOpen(false); }}
                className="p-1.5 bg-slate-900 hover:bg-blue-950/60 border border-slate-800 hover:border-blue-500/40 rounded-xl text-center text-[10px] font-bold text-blue-300"
              >
                Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
