'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { ChefHat, LogOut, ShieldCheck, Utensils, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function KitchenHeader() {
  const { user, profile, role, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between px-6 bg-slate-900 border-b border-slate-800 shadow-md">
      <div className="flex items-center gap-3">
        <div className="bg-amber-500 text-slate-950 p-2 rounded-xl font-bold shadow-md">
          <ChefHat className="h-5 w-5" />
        </div>
        <div>
          <div className="font-extrabold text-base tracking-tight text-white flex items-center gap-2">
            GPREC Kitchen KDS <span className="text-[10px] bg-slate-800 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">TERMINAL</span>
          </div>
          <div className="text-[11px] text-slate-400">Campus Food Court Hot Line</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <div className="hidden sm:flex items-center gap-2 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700">
            <span className="text-xs font-semibold text-slate-200">{profile?.first_name || 'Chef'}</span>
            <Badge variant="outline" className="text-[9px] bg-amber-500/10 text-amber-400 border-amber-500/30">
              {role}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => logout()}
              title="Sign Out"
              className="h-6 w-6 text-slate-400 hover:text-rose-400 p-0 ml-1"
            >
              <LogOut className="h-3 w-3" />
            </Button>
          </div>
        )}
        <Link href="/admin/orders">
          <Button variant="ghost" size="sm" className="text-xs text-slate-400 hover:text-white rounded-xl">
            <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Admin Orders
          </Button>
        </Link>
        <Link href="/menu">
          <Button variant="outline" size="sm" className="bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700 rounded-xl text-xs">
            <Utensils className="h-3.5 w-3.5 mr-1" /> Student Menu
          </Button>
        </Link>
      </div>
    </header>
  );
}

export default function KitchenLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      <KitchenHeader />
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <RoleGuard allowedRoles={['KITCHEN_STAFF', 'ADMIN', 'SUPER_ADMIN']} portalName="GPREC Kitchen Terminal">
          {children}
        </RoleGuard>
      </main>
    </div>
  );
}
