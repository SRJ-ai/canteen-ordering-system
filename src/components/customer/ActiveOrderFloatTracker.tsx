'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Flame,
  BellRing,
  Clock,
  ChevronRight,
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
  const { user } = useAuth();
  const [activeOrder, setActiveOrder] = useState<ActiveOrderSummary | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    async function checkMyActiveOrders() {
      try {
        const supabase = createClient();

        let myOrderIds: string[] = [];
        try {
          const stored = localStorage.getItem('canteen_my_orders');
          if (stored) {
            myOrderIds = JSON.parse(stored);
          }
        } catch (e) {}

        if (!user?.id && myOrderIds.length === 0) {
          setActiveOrder(null);
          return;
        }

        let query = supabase
          .from('orders')
          .select('id, order_number, status, total_amount, created_at, user_id')
          .in('status', ['PENDING', 'CONFIRMED', 'ACCEPTED', 'PREPARING', 'READY'])
          .order('created_at', { ascending: false });

        if (user?.id && myOrderIds.length > 0) {
          query = query.or(`user_id.eq.${user.id},id.in.(${myOrderIds.join(',')})`);
        } else if (user?.id) {
          query = query.eq('user_id', user.id);
        } else if (myOrderIds.length > 0) {
          query = query.in('id', myOrderIds);
        }

        const { data, error } = await query.limit(1);

        if (!error && data && data.length > 0) {
          const orderAgeHours = (Date.now() - new Date(data[0].created_at).getTime()) / (1000 * 60 * 60);
          if (orderAgeHours < 3) {
            setActiveOrder(data[0]);
          } else {
            setActiveOrder(null);
          }
        } else {
          setActiveOrder(null);
        }
      } catch (e) {
        setActiveOrder(null);
      }
    }

    checkMyActiveOrders();
    const interval = setInterval(checkMyActiveOrders, 5000);
    return () => clearInterval(interval);
  }, [user]);

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

  return (
    <aside
      aria-label="Your active order status"
      className="fixed bottom-20 left-1/2 z-40 w-[92%] max-w-lg -translate-x-1/2 print:hidden animate-in slide-in-from-bottom-5 duration-300 sm:bottom-6"
    >
      <div className={`rounded-xl border bg-ink p-3.5 text-background shadow-2xl transition-all sm:p-4 ${
        isReady
          ? 'border-leaf/70 ring-2 ring-leaf/40'
          : isCooking
          ? 'border-primary/60 ring-1 ring-primary/30'
          : 'border-white/10'
      }`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className={`shrink-0 rounded-lg p-2 ${
              isReady
                ? 'bg-leaf text-white motion-safe:animate-pulse'
                : isCooking
                ? 'bg-primary text-primary-foreground'
                : 'bg-primary text-primary-foreground'
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
                <span className="numeric rounded bg-white/10 px-1.5 text-[10px] font-bold text-background/80">
                  {activeOrder.order_number || 'CAN-ORDER'}
                </span>
                <Badge className={`border-0 text-[9px] font-bold uppercase tracking-wider ${
                  isReady
                    ? 'bg-leaf text-white'
                    : isCooking
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-steel text-background'
                }`}>
                  {isReady ? 'Ready for pickup' : isCooking ? 'Cooking now' : 'In kitchen queue'}
                </Badge>
              </div>

              <p className="mt-0.5 truncate text-xs font-bold text-background">
                {isReady
                  ? 'Head to the canteen counter with your token'
                  : isCooking
                  ? 'Chef is preparing your meal, ~4 mins'
                  : 'Order acknowledged by the kitchen team'}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <Link href={`/orders/?id=${activeOrder.id}`}>
              <Button
                size="sm"
                className={`flex h-9 items-center gap-1 rounded-lg px-3.5 text-xs font-extrabold shadow-md ${
                  isReady
                    ? 'bg-leaf text-white hover:bg-leaf/90'
                    : 'bg-primary text-primary-foreground hover:bg-primary-deep'
                }`}
              >
                <span>Track</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </Link>

            <button
              onClick={() => setIsDismissed(true)}
              className="rounded-lg p-1.5 text-background/60 hover:bg-white/10 hover:text-background"
              title="Dismiss for now"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Mini progress */}
        <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full transition-all duration-500 ${
              isReady ? 'w-full bg-leaf' : isCooking ? 'w-3/4 bg-primary' : 'w-1/3 bg-primary'
            }`}
          ></div>
        </div>
      </div>
    </aside>
  );
}
