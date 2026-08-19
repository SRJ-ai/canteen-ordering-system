'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Lock, ArrowRight, Loader2, UserCheck, Sparkles } from 'lucide-react';
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
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <Loader2 className="mb-3 h-8 w-8 animate-spin text-primary-deep" />
        <p className="text-xs font-semibold text-muted-foreground">Verifying GPREC security credentials...</p>
      </div>
    );
  }

  const hasAccess = user && role && allowedRoles.includes(role as any);

  if (!hasAccess) {
    const isStaffPortal = allowedRoles.includes('ADMIN') || allowedRoles.includes('KITCHEN_STAFF');

    return (
      <div className="tray-card mx-auto my-12 max-w-md space-y-6 p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl border border-chutney/20 bg-chutney/10 text-chutney">
          <Lock className="h-8 w-8" />
        </div>

        <div>
          <Badge variant="outline" className="numeric mb-2 border-chutney/25 text-[10px] uppercase tracking-wider text-chutney">
            GPREC Access Control
          </Badge>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">
            {portalName} Access Required
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            This area requires an authorized GPREC staff account ({allowedRoles.join(' or ')}).
            {user ? ` You are currently signed in as ${user.email} (${role || 'Customer'}).` : ' Please sign in to proceed.'}
          </p>
        </div>

        {/* Quick Demo Sign In Options */}
        {isStaffPortal && (
          <div className="space-y-2.5 rounded-lg border border-border bg-secondary/50 p-4 text-left">
            <span className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-ink">
              <Sparkles className="h-3.5 w-3.5 text-primary-deep" /> One-click GPREC demo logins
            </span>
            <div className="grid grid-cols-1 gap-2.5">
              {allowedRoles.includes('ADMIN') && (
                <button
                  type="button"
                  onClick={() => quickLogin('ADMIN')}
                  className="group flex w-full items-center justify-between rounded-lg border-2 border-ink/20 bg-card p-3 text-left text-ink shadow-xs transition-all hover:bg-secondary"
                >
                  <span className="flex items-center gap-2 text-xs font-extrabold text-ink">
                    <UserCheck className="h-4 w-4 shrink-0 text-ink" /> Log in as GPREC Admin
                  </span>
                  <span className="numeric rounded-md border border-border bg-secondary px-2 py-0.5 text-[10px] font-bold text-ink">
                    admin@gprec.ac.in
                  </span>
                </button>
              )}
              {allowedRoles.includes('KITCHEN_STAFF') && (
                <button
                  type="button"
                  onClick={() => quickLogin('KITCHEN')}
                  className="group flex w-full items-center justify-between rounded-lg border-2 border-primary/40 bg-card p-3 text-left text-ink shadow-xs transition-all hover:bg-primary/5"
                >
                  <span className="flex items-center gap-2 text-xs font-extrabold text-ink">
                    <UserCheck className="h-4 w-4 shrink-0 text-primary-deep" /> Log in as Kitchen Chef
                  </span>
                  <span className="numeric rounded-md border border-primary/25 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary-deep">
                    kitchen@gprec.ac.in
                  </span>
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Link href="/auth/login">
            <Button className="btn-marigold w-full text-xs">
              Sign in with email / password <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
          <Link href="/menu">
            <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
              Return to canteen menu
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
