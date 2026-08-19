'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { History, ArrowRight, Clock, MapPin, ReceiptText, Loader2 } from 'lucide-react';
import { OrderTrackerClient } from '@/components/customer/OrderTrackerClient';

function OrdersPageContent() {
  const searchParams = useSearchParams();
  const directOrderId = searchParams?.get('id') || searchParams?.get('order_id');

  if (directOrderId) {
    return <OrderTrackerClient initialOrderId={directOrderId} />;
  }

  return <CustomerOrdersList />;
}

export default function CustomerOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md space-y-3 py-24 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary-deep" />
          <p className="text-xs font-semibold text-muted-foreground">Loading orders...</p>
        </div>
      }
    >
      <OrdersPageContent />
    </Suspense>
  );
}

const statusBadge = (status: string) => {
  if (status === 'READY') return 'bg-leaf text-white motion-safe:animate-pulse';
  if (status === 'COMPLETED') return 'bg-secondary text-ink';
  if (status === 'CANCELLED') return 'bg-chutney/15 text-chutney';
  return 'bg-primary/15 text-primary-deep';
};

function CustomerOrdersList() {
  const { user, role } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMyOrders() {
      try {
        const supabase = createClient();

        let myOrderIds: string[] = [];
        try {
          const stored = localStorage.getItem('canteen_my_orders');
          if (stored) {
            myOrderIds = JSON.parse(stored);
          }
        } catch (e) {}

        const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'KITCHEN_STAFF' || role === 'CASHIER';

        if (!isAdmin && !user?.id && myOrderIds.length === 0) {
          setOrders([]);
          setLoading(false);
          return;
        }

        let query = supabase
          .from('orders')
          .select(`
            id,
            order_number,
            status,
            total_amount,
            created_at,
            user_id,
            table_sessions (
              tables (
                table_number
              )
            ),
            order_items (
              quantity,
              menu_items (
                name
              )
            )
          `)
          .order('created_at', { ascending: false })
          .limit(30);

        if (!isAdmin) {
          if (user?.id && myOrderIds.length > 0) {
            query = query.or(`user_id.eq.${user.id},id.in.(${myOrderIds.join(',')})`);
          } else if (user?.id) {
            query = query.eq('user_id', user.id);
          } else if (myOrderIds.length > 0) {
            query = query.in('id', myOrderIds);
          }
        }

        const { data } = await query;
        if (data) setOrders(data);
      } catch (err) {
        console.error('Error loading orders:', err);
      } finally {
        setLoading(false);
      }
    }

    loadMyOrders();
  }, [user, role]);

  if (loading) {
    return (
      <div className="mx-auto max-w-md space-y-3 py-24 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary-deep" />
        <p className="text-xs font-semibold text-muted-foreground">Loading your past canteen orders...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            <History className="h-7 w-7 text-primary-deep" /> My order history
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Track ongoing meals and view your receipts.
          </p>
        </div>
        <Link href="/menu">
          <Button size="sm" className="rounded-lg text-xs font-bold">
            Order food
          </Button>
        </Link>
      </div>

      {orders.length === 0 ? (
        <Card className="tray-card space-y-3 border-dashed p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary-deep">
            <ReceiptText className="h-6 w-6" />
          </div>
          <h3 className="font-display text-lg font-bold text-ink">No previous orders</h3>
          <p className="mx-auto max-w-sm text-xs text-muted-foreground">
            You haven&rsquo;t placed any orders yet on this device. Scan your table QR code or order online now.
          </p>
          <Link href="/menu">
            <Button className="mt-2 rounded-lg font-bold">Explore the menu</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const tableNumber = (order.table_sessions as any)?.tables?.table_number;
            const itemsSummary = order.order_items?.map((i: any) => `${i.quantity}x ${i.menu_items?.name}`).join(', ');

            return (
              <Card key={order.id} className="tray-card tray-card-hover overflow-hidden">
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="numeric text-xs font-bold text-primary-deep">
                        {order.order_number || `CAN-${order.id.slice(0, 4)}`}
                      </span>
                      <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span className="numeric">
                          {new Date(order.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })} at{' '}
                          {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <Badge className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${statusBadge(order.status)}`}>
                      {order.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-2 p-5 pb-3 pt-0">
                  <p className="line-clamp-1 text-xs font-medium text-ink">
                    {itemsSummary || 'Food items'}
                  </p>
                  <div className="flex items-center justify-between border-t border-border pt-1 text-xs">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {tableNumber ? `Table: ${tableNumber}` : 'Pickup'}
                    </span>
                    <span className="numeric text-base font-extrabold text-ink">
                      ₹{order.total_amount}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-end p-5 pb-4 pt-0">
                  <Link href={`/orders/?id=${order.id}`} className="w-full">
                    <Button variant="outline" size="sm" className="flex w-full items-center justify-center gap-1 rounded-lg border-ink/15 bg-card text-xs font-bold text-ink hover:bg-secondary">
                      Track / view details <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
