'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Utensils, History, MapPin, Search } from 'lucide-react';

export function CustomerHeader() {
  const { itemCount, total, setIsCartOpen, tableInfo } = useCart();

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
                  Campus Bites <span className="text-primary font-bold text-xs bg-orange-100/80 px-1.5 py-0.5 rounded-md">CANTEEN</span>
                </div>
                <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-slate-400" />
                  {tableInfo?.tableNumber ? (
                    <span className="font-semibold text-emerald-700 flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      {tableInfo.tableNumber}
                    </span>
                  ) : (
                    <span>Central Food Court</span>
                  )}
                </div>
              </div>
            </Link>
          </div>

          {/* Right Navigation Actions */}
          <div className="flex items-center gap-2">
            <Link href="/orders">
              <Button variant="ghost" size="sm" className="text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl">
                <History className="h-4 w-4 mr-1 text-slate-500" />
                <span className="hidden sm:inline">My Orders</span>
              </Button>
            </Link>

            <Button
              onClick={() => setIsCartOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white rounded-xl px-3.5 py-2 font-bold flex items-center gap-2 shadow-sm transition-all relative"
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
