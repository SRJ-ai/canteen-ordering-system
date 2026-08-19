'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  ShoppingBag,
  Soup,
  History,
  MapPin,
  LogIn,
  LogOut,
  ShieldCheck,
  ChefHat,
} from 'lucide-react';

export function CustomerHeader() {
  const { itemCount, total, setIsCartOpen, tableInfo } = useCart();
  const { user, profile, isAdmin, isKitchen, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex h-16 items-center justify-between gap-3">
          {/* Logo & table indicator */}
          <Link href="/menu" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
              <Soup className="h-5 w-5" />
            </span>
            <div className="leading-none">
              <div className="flex items-center gap-1.5 font-display text-[15px] font-extrabold tracking-tight text-ink">
                GPREC Food Court
              </div>
              <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                <MapPin className="h-3 w-3 text-steel" />
                {tableInfo?.tableNumber ? (
                  <span className="flex items-center gap-1 font-semibold text-primary-deep">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary motion-safe:animate-pulse" />
                    {tableInfo.tableNumber}
                  </span>
                ) : (
                  <span>GPREC Main Canteen</span>
                )}
              </div>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {isAdmin && (
              <Link href="/admin/dashboard" className="hidden md:inline-flex">
                <Button variant="outline" size="sm" className="border-ink/15 bg-card text-xs font-bold text-ink hover:bg-secondary">
                  <ShieldCheck className="mr-1 h-3.5 w-3.5 text-primary-deep" /> Admin
                </Button>
              </Link>
            )}

            {isKitchen && (
              <Link href="/kitchen" className="hidden md:inline-flex">
                <Button variant="outline" size="sm" className="border-ink/15 bg-card text-xs font-bold text-ink hover:bg-secondary">
                  <ChefHat className="mr-1 h-3.5 w-3.5 text-primary-deep" /> Kitchen
                </Button>
              </Link>
            )}

            <Link href="/orders">
              <Button variant="ghost" size="sm" className="px-2.5 text-xs font-semibold text-ink">
                <History className="mr-1 h-4 w-4 text-steel" />
                <span className="hidden sm:inline">Orders</span>
              </Button>
            </Link>

            {user ? (
              <div className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary py-1 pl-2.5 pr-1.5">
                <span className="hidden max-w-[90px] truncate text-xs font-bold text-ink sm:inline">
                  {profile?.first_name || 'Member'}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => logout()}
                  title="Sign out"
                  className="h-6 w-6 rounded-md p-0 text-steel hover:text-chutney"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <Link href="/auth/login">
                <Button variant="outline" size="sm" className="border-ink/15 bg-card px-2.5 text-xs font-bold text-ink hover:bg-secondary">
                  <LogIn className="mr-1 h-3.5 w-3.5" />
                  <span>Login</span>
                </Button>
              </Link>
            )}

            {/* Cart */}
            <Button
              onClick={() => setIsCartOpen(true)}
              className="btn-marigold relative flex items-center gap-1.5 px-3 py-2"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="numeric hidden text-xs font-bold xs:inline">₹{total.toFixed(0)}</span>
              {itemCount > 0 && (
                <span className="numeric absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full border-2 border-background bg-ink text-[10px] font-extrabold text-background">
                  {itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
