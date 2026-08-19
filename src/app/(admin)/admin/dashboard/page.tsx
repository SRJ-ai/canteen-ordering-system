'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  IndianRupee,
  ShoppingBag,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChefHat,
  TrendingUp,
  Loader2,
} from 'lucide-react';

export default function DashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const supabase = createClient();
        const { data: allOrders } = await supabase
          .from('orders')
          .select('id, status, total_amount, created_at, order_number, table_sessions(tables(table_number))')
          .order('created_at', { ascending: false });

        if (allOrders) setOrders(allOrders);
      } catch (err) {
        console.error('Error loading dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
    const interval = setInterval(loadDashboard, 6000);
    return () => clearInterval(interval);
  }, []);

  const activeOrders = orders.filter((o) => ['PENDING', 'CONFIRMED', 'ACCEPTED', 'PREPARING', 'READY'].includes(o.status));
  const completedOrders = orders.filter((o) => o.status === 'COMPLETED');
  const cancelledOrders = orders.filter((o) => o.status === 'CANCELLED');

  const totalRevenue = completedOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const avgOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

  if (loading && orders.length === 0) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-xs text-muted-foreground font-semibold">Loading operations telemetry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink tracking-tight">
            Canteen Operations Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Real-time sales, order throughput, kitchen load, and table metrics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/kitchen">
            <Button variant="outline" className="rounded-lg text-xs font-bold bg-card border-ink/20 text-ink hover:bg-secondary">
              <ChefHat className="h-4 w-4 mr-1.5 text-primary-deep" /> Kitchen KDS
            </Button>
          </Link>
          <Link href="/admin/orders">
            <Button className="btn-marigold rounded-lg text-xs font-bold">
              <ShoppingBag className="h-4 w-4 mr-1.5" /> Manage Live Orders
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="tray-card p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Revenue
            </span>
            <div className="p-2.5 rounded-lg bg-primary/15 text-primary-deep">
              <IndianRupee className="h-5 w-5" />
            </div>
          </div>
          <div className="numeric text-3xl font-extrabold text-ink">
            ₹{totalRevenue.toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" /> From {completedOrders.length} fulfilled orders
          </div>
        </div>

        {/* Active Orders */}
        <div className="tray-card p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Active Orders
            </span>
            <div className="p-2.5 rounded-lg bg-primary/15 text-primary-deep">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="numeric text-3xl font-extrabold text-ink">
            {activeOrders.length}
          </div>
          <div className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Currently in prep or ready
          </div>
        </div>

        {/* Completed Orders */}
        <div className="tray-card p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Completed
            </span>
            <div className="p-2.5 rounded-lg bg-leaf/10 text-leaf">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="numeric text-3xl font-extrabold text-ink">
            {completedOrders.length}
          </div>
          <div className="text-xs text-muted-foreground font-medium">
            Fulfilled today
          </div>
        </div>

        {/* Avg Order Value */}
        <div className="tray-card p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Avg Order Value
            </span>
            <div className="p-2.5 rounded-lg bg-secondary text-steel">
              <IndianRupee className="h-5 w-5" />
            </div>
          </div>
          <div className="numeric text-3xl font-extrabold text-ink">
            ₹{avgOrderValue.toFixed(0)}
          </div>
          <div className="text-xs text-muted-foreground font-medium">
            Per customer transaction
          </div>
        </div>
      </div>

      {/* Live Recent Orders Feed */}
      <div className="tray-card overflow-hidden">
        <div className="p-6 pb-4 border-b border-border flex flex-row items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">Live Order Stream</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Real-time incoming customer transactions</p>
          </div>
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm" className="text-xs text-primary-deep font-bold hover:underline">
              View All Orders <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
        <div className="p-0">
          {orders.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground">
              No orders placed yet today.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {orders.slice(0, 8).map((order) => {
                const tableNum = (order.table_sessions as any)?.tables?.table_number || 'Takeaway';
                return (
                  <div key={order.id} className="p-4 px-6 flex items-center justify-between hover:bg-secondary/50 transition">
                    <div className="flex items-center gap-4">
                      <div className="numeric text-xs font-bold bg-secondary px-2.5 py-1 rounded-md text-ink">
                        {order.order_number || `CAN-${order.id.slice(0, 4)}`}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-ink">{tableNum}</div>
                        <div className="numeric text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="numeric font-extrabold text-sm text-ink">₹{order.total_amount}</span>
                      <Badge
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                          order.status === 'READY'
                            ? 'bg-leaf text-white animate-pulse'
                            : order.status === 'CANCELLED'
                            ? 'bg-chutney/10 text-chutney'
                            : order.status === 'COMPLETED'
                            ? 'bg-secondary text-muted-foreground'
                            : 'bg-primary/15 text-primary-deep'
                        }`}
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
