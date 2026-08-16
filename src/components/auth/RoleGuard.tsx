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
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left space-y-2.5">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              ⚡ One-Click GPREC Demo Logins:
            </span>
            <div className="grid grid-cols-1 gap-2">
              {allowedRoles.includes('ADMIN') && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => quickLogin('ADMIN')}
                  className="w-full justify-between text-xs font-bold rounded-xl bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                >
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="h-3.5 w-3.5 text-emerald-600" /> Log in as GPREC Admin
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">admin@gprec.ac.in</span>
                </Button>
              )}
              {allowedRoles.includes('KITCHEN_STAFF') && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => quickLogin('KITCHEN')}
                  className="w-full justify-between text-xs font-bold rounded-xl bg-white hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200"
                >
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="h-3.5 w-3.5 text-amber-600" /> Log in as Kitchen Chef
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">kitchen@gprec.ac.in</span>
                </Button>
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
