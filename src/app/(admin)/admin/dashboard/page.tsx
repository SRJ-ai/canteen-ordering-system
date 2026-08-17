'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Canteen Operations Dashboard
          </h1>
          <p className="text-sm text-slate-700 font-semibold mt-1">
            Real-time sales, order throughput, kitchen load, and table metrics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/kitchen">
            <Button variant="outline" className="rounded-2xl text-xs font-bold bg-white">
              <ChefHat className="h-4 w-4 mr-1.5 text-amber-500" /> Kitchen KDS
            </Button>
          </Link>
          <Link href="/admin/orders">
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-2xl text-xs font-bold shadow-md">
              <ShoppingBag className="h-4 w-4 mr-1.5" /> Manage Live Orders
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <Card className="rounded-3xl border border-slate-200/80 shadow-xs bg-white p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Revenue
            </span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
              <IndianRupee className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            ₹{totalRevenue.toFixed(2)}
          </div>
          <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" /> From {completedOrders.length} fulfilled orders
          </div>
        </Card>

        {/* Active Orders */}
        <Card className="rounded-3xl border border-slate-200/80 shadow-xs bg-white p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Active Orders
            </span>
            <div className="p-2.5 rounded-2xl bg-orange-50 text-primary">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {activeOrders.length}
          </div>
          <div className="text-xs text-orange-700 font-semibold flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            Currently in prep or ready
          </div>
        </Card>

        {/* Completed Orders */}
        <Card className="rounded-3xl border border-slate-200/80 shadow-xs bg-white p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Completed
            </span>
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {completedOrders.length}
          </div>
          <div className="text-xs text-muted-foreground font-medium">
            Fulfilled today
          </div>
        </Card>

        {/* Avg Order Value */}
        <Card className="rounded-3xl border border-slate-200/80 shadow-xs bg-white p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Avg Order Value
            </span>
            <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600">
              <IndianRupee className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            ₹{avgOrderValue.toFixed(0)}
          </div>
          <div className="text-xs text-muted-foreground font-medium">
            Per customer transaction
          </div>
        </Card>
      </div>

      {/* Live Recent Orders Feed */}
      <Card className="rounded-3xl border border-slate-200/80 shadow-xs bg-white overflow-hidden">
        <CardHeader className="p-6 pb-4 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">Live Order Stream</CardTitle>
            <CardDescription className="text-xs">Real-time incoming customer transactions</CardDescription>
          </div>
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm" className="text-xs text-primary font-bold hover:underline">
              View All Orders &rarr;
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground">
              No orders placed yet today.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {orders.slice(0, 8).map((order) => {
                const tableNum = (order.table_sessions as any)?.tables?.table_number || 'Takeaway';
                return (
                  <div key={order.id} className="p-4 px-6 flex items-center justify-between hover:bg-slate-50/70 transition">
                    <div className="flex items-center gap-4">
                      <div className="font-mono text-xs font-bold bg-slate-100 px-2.5 py-1 rounded-lg text-slate-800">
                        {order.order_number || `CAN-${order.id.slice(0, 4)}`}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{tableNum}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-extrabold text-sm text-slate-900">₹{order.total_amount}</span>
                      <Badge
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          order.status === 'READY'
                            ? 'bg-emerald-500 text-white animate-pulse'
                            : order.status === 'CANCELLED'
                            ? 'bg-rose-100 text-rose-700'
                            : order.status === 'COMPLETED'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-amber-100 text-amber-800'
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
        </CardContent>
      </Card>
    </div>
  );
}
