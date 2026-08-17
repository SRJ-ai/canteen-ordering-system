'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Flame,
  BellRing,
  Clock,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Utensils,
  X,
} from 'lucide-react';

interface ActiveOrderSummary {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
}

export function ActiveOrderFloatTracker() {
  const pathname = usePathname();
  const [activeOrder, setActiveOrder] = useState<ActiveOrderSummary | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  // Check Supabase for recent orders created in this browser session
  useEffect(() => {
    async function checkActiveOrders() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('orders')
          .select('id, order_number, status, total_amount, created_at')
          .in('status', ['PENDING', 'CONFIRMED', 'ACCEPTED', 'PREPARING', 'READY'])
          .order('created_at', { ascending: false })
          .limit(1);

        if (!error && data && data.length > 0) {
          // If created within last 2 hours
          const orderAgeHours = (Date.now() - new Date(data[0].created_at).getTime()) / (1000 * 60 * 60);
          if (orderAgeHours < 3) {
            setActiveOrder(data[0]);
          } else {
            setActiveOrder(null);
          }
        } else {
          setActiveOrder(null);
        }
      } catch (e) {}
    }

    checkActiveOrders();
    const interval = setInterval(checkActiveOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  // Hide on order tracker page itself or admin/kitchen pages
  if (
    !activeOrder ||
    isDismissed ||
    pathname.includes('/orders') ||
    pathname.includes('/kitchen') ||
    pathname.includes('/admin')
  ) {
    return null;
  }

  const isReady = activeOrder.status === 'READY';
  const isCooking = activeOrder.status === 'PREPARING';
  const isAccepted = activeOrder.status === 'ACCEPTED';

  return (
    <aside
      aria-label="Active order status"
      className="fixed bottom-18 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-lg font-sans print:hidden animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className={`p-3.5 sm:p-4 rounded-3xl shadow-2xl border backdrop-blur-xl transition-all ${
        isReady
          ? 'bg-emerald-950/95 text-white border-emerald-500/80 ring-2 ring-emerald-400/50 shadow-emerald-900/30 animate-bounce-subtle'
          : isCooking
          ? 'bg-slate-950/95 text-white border-amber-500/60 ring-1 ring-amber-400/30'
          : 'bg-slate-950/95 text-white border-slate-700/80'
      }`}>
        <div className="flex items-center justify-between gap-3">
          {/* Status Icon */}
          <div className="flex items-center gap-3 overflow-hidden">
            <div className={`p-2 rounded-2xl shrink-0 ${
              isReady
                ? 'bg-emerald-500 text-slate-950 animate-pulse'
                : isCooking
                ? 'bg-amber-500 text-slate-950'
                : 'bg-primary text-white'
            }`}>
              {isReady ? (
                <BellRing className="h-5 w-5" />
              ) : isCooking ? (
                <Flame className="h-5 w-5" />
              ) : (
                <Clock className="h-5 w-5" />
              )}
            </div>

            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 bg-white/10 rounded text-slate-300">
                  {activeOrder.order_number || 'CAN-ORDER'}
                </span>
                <Badge className={`text-[9px] font-black border-0 uppercase tracking-wider ${
                  isReady
                    ? 'bg-emerald-400 text-slate-950'
                    : isCooking
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-blue-400 text-slate-950'
                }`}>
                  {isReady ? 'Ready for Pickup!' : isCooking ? 'Cooking Now' : 'In Kitchen Queue'}
                </Badge>
              </div>

              <p className="text-xs font-bold text-slate-100 truncate mt-0.5">
                {isReady
                  ? 'Head to canteen counter with token!'
                  : isCooking
                  ? 'Chef is preparing your meal (~4 mins)'
                  : 'Order acknowledged by kitchen team'}
              </p>
            </div>
          </div>

          {/* Action Link */}
          <div className="flex items-center gap-1 shrink-0">
            <Link href={`/orders/?id=${activeOrder.id}`}>
              <Button
                size="sm"
                className={`rounded-2xl text-xs font-extrabold px-3.5 h-9 shadow-md flex items-center gap-1 transition-transform hover:scale-105 ${
                  isReady
                    ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950'
                    : 'bg-primary hover:bg-primary/90 text-white'
                }`}
              >
                <span>Track</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </Link>

            <button
              onClick={() => setIsDismissed(true)}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10"
              title="Dismiss for now"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Mini progress bar */}
        <div className="w-full bg-white/10 h-1 rounded-full mt-2.5 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              isReady ? 'bg-emerald-400 w-full' : isCooking ? 'bg-amber-400 w-3/4' : 'bg-primary w-1/3'
            }`}
          ></div>
        </div>
      </div>
    </aside>
  );
}
