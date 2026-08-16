'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingBag,
  Utensils,
  History,
  MapPin,
  LogIn,
  LogOut,
  User,
  ShieldCheck,
  ChefHat,
} from 'lucide-react';

export function CustomerHeader() {
  const { itemCount, total, setIsCartOpen, tableInfo } = useCart();
  const { user, profile, role, isAdmin, isKitchen, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex h-16 items-center justify-between gap-3">
          {/* Logo & Table Badge */}
          <div className="flex items-center gap-3">
            <Link href="/menu" className="flex items-center gap-2.5 group">
              <div className="bg-primary text-white p-2 rounded-xl shadow-md group-hover:scale-105 transition-transform">
                <Utensils className="h-5 w-5" />
              </div>
              <div>
                <div className="font-extrabold text-base tracking-tight text-slate-900 flex items-center gap-1.5">
                  GPREC Food Court <span className="text-primary font-bold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-1.5 py-0.5 rounded-md">CAMPUS</span>
                </div>
                <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-slate-400" />
                  {tableInfo?.tableNumber ? (
                    <span className="font-semibold text-emerald-700 flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      {tableInfo.tableNumber}
                    </span>
                  ) : (
                    <span>GPREC Main Canteen</span>
                  )}
                </div>
              </div>
            </Link>
          </div>

          {/* Right Navigation Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {isAdmin && (
              <Link href="/admin/dashboard">
                <Button variant="outline" size="sm" className="hidden md:flex text-xs font-bold rounded-xl border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100">
                  <ShieldCheck className="h-3.5 w-3.5 mr-1 text-emerald-600" /> Admin
                </Button>
              </Link>
            )}

            {isKitchen && (
              <Link href="/kitchen">
                <Button variant="outline" size="sm" className="hidden md:flex text-xs font-bold rounded-xl border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100">
                  <ChefHat className="h-3.5 w-3.5 mr-1 text-amber-600" /> Kitchen
                </Button>
              </Link>
            )}

            <Link href="/orders">
              <Button variant="ghost" size="sm" className="text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl px-2.5">
                <History className="h-4 w-4 mr-1 text-slate-500" />
                <span className="hidden sm:inline">Orders</span>
              </Button>
            </Link>

            {/* Auth Button or User Profile Chip */}
            {user ? (
              <div className="flex items-center gap-1.5 bg-slate-100/90 pl-2.5 pr-1.5 py-1 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-800 max-w-[90px] truncate hidden sm:inline">
                  {profile?.first_name || 'Member'}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => logout()}
                  title="Sign Out"
                  className="h-6 w-6 text-slate-500 hover:text-rose-600 p-0 rounded-lg"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <Link href="/auth/login">
                <Button variant="outline" size="sm" className="text-xs font-bold rounded-xl text-slate-700 hover:text-primary px-2.5">
                  <LogIn className="h-3.5 w-3.5 mr-1" />
                  <span>Login</span>
                </Button>
              </Link>
            )}

            {/* Cart Trigger */}
            <Button
              onClick={() => setIsCartOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white rounded-xl px-3 py-2 font-bold flex items-center gap-1.5 shadow-sm transition-all relative"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="text-xs font-semibold hidden xs:inline">₹{total.toFixed(0)}</span>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white text-[10px] font-extrabold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
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
