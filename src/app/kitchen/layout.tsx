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
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between px-6 bg-[#201B16] border-b border-white/10">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center bg-primary text-primary-foreground rounded-lg">
          <ChefHat className="h-5 w-5" />
        </div>
        <div>
          <div className="font-display font-bold text-base tracking-tight text-background flex items-center gap-2">
            GPREC Kitchen KDS <span className="text-[10px] bg-white/10 text-primary border border-primary/30 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Terminal</span>
          </div>
          <div className="text-[11px] text-background/60">Campus Food Court Hot Line</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <div className="hidden sm:flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
            <span className="text-xs font-semibold text-background/90">{profile?.first_name || 'Chef'}</span>
            <Badge variant="outline" className="text-[9px] bg-primary/15 text-primary border-primary/30">
              {role}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => logout()}
              title="Sign Out"
              className="h-6 w-6 text-background/60 hover:text-chutney p-0 ml-1"
            >
              <LogOut className="h-3 w-3" />
            </Button>
          </div>
        )}
        <Link href="/admin/orders">
          <Button variant="ghost" size="sm" className="text-xs text-background/70 hover:text-background hover:bg-white/10 rounded-lg">
            <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Admin Orders
          </Button>
        </Link>
        <Link href="/menu">
          <Button variant="outline" size="sm" className="bg-white/5 text-background/80 hover:bg-white/10 hover:text-background border-white/10 rounded-lg text-xs">
            <Utensils className="h-3.5 w-3.5 mr-1" /> Student Menu
          </Button>
        </Link>
      </div>
    </header>
  );
}

export default function KitchenLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-ink text-background font-sans antialiased">
      <KitchenHeader />
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <RoleGuard allowedRoles={['KITCHEN_STAFF', 'ADMIN', 'SUPER_ADMIN']} portalName="GPREC Kitchen Terminal">
          {children}
        </RoleGuard>
      </main>
    </div>
  );
}
