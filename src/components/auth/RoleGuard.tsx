'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ShieldAlert, Lock, ArrowRight, Loader2, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: ('SUPER_ADMIN' | 'ADMIN' | 'KITCHEN_STAFF' | 'CUSTOMER')[];
  portalName?: string;
}

export function RoleGuard({ children, allowedRoles, portalName = 'Restricted Portal' }: RoleGuardProps) {
  const { user, profile, role, loading, quickLogin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
        <p className="text-xs font-semibold text-muted-foreground">Verifying GPREC security credentials...</p>
      </div>
    );
  }

  const hasAccess = user && role && allowedRoles.includes(role as any);

  if (!hasAccess) {
    const isStaffPortal = allowedRoles.includes('ADMIN') || allowedRoles.includes('KITCHEN_STAFF');

    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white border border-slate-200/80 rounded-3xl shadow-lg text-center space-y-6">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-100 shadow-inner">
          <Lock className="h-8 w-8" />
        </div>

        <div>
          <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-wider text-rose-600 border-rose-200 mb-2">
            GPREC Access Control
          </Badge>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {portalName} Access Required
          </h2>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            This area requires an authorized GPREC staff account ({allowedRoles.join(' or ')}).
            {user ? ` You are currently signed in as ${user.email} (${role || 'Customer'}).` : ' Please sign in to proceed.'}
          </p>
        </div>

        {/* Quick Demo Sign In Options */}
        {isStaffPortal && (
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 text-left space-y-2.5">
            <span className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider block">
              ⚡ One-Click GPREC Demo Logins:
            </span>
            <div className="grid grid-cols-1 gap-2.5">
              {allowedRoles.includes('ADMIN') && (
                <button
                  type="button"
                  onClick={() => quickLogin('ADMIN')}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-white hover:bg-emerald-50 border-2 border-emerald-300 text-slate-900 shadow-xs transition-all text-left group"
                >
                  <span className="flex items-center gap-2 text-xs font-extrabold text-emerald-950">
                    <UserCheck className="h-4 w-4 text-emerald-600 shrink-0" /> Log in as GPREC Admin
                  </span>
                  <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-200">
                    admin@gprec.ac.in
                  </span>
                </button>
              )}
              {allowedRoles.includes('KITCHEN_STAFF') && (
                <button
                  type="button"
                  onClick={() => quickLogin('KITCHEN')}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-white hover:bg-amber-50 border-2 border-amber-300 text-slate-900 shadow-xs transition-all text-left group"
                >
                  <span className="flex items-center gap-2 text-xs font-extrabold text-amber-950">
                    <UserCheck className="h-4 w-4 text-amber-600 shrink-0" /> Log in as Kitchen Chef
                  </span>
                  <span className="font-mono text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-200">
                    kitchen@gprec.ac.in
                  </span>
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Link href="/auth/login">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold shadow-md">
              Sign In with Email / Password <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </Link>
          <Link href="/menu">
            <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
              Return to Canteen Menu
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
