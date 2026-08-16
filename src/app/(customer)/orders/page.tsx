import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { History, ArrowRight, Clock, Utensils, MapPin, ReceiptText } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CustomerOrdersPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let query = supabase
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      total_amount,
      created_at,
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
    .limit(20);

  if (user) {
    query = query.eq('user_id', user.id);
  }

  const { data: orders, error } = await query;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <History className="h-7 w-7 text-primary" /> Order History
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Track your ongoing meals and view past receipts.
          </p>
        </div>
        <Link href="/menu">
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold">
            Order Food
          </Button>
        </Link>
      </div>

      {(!orders || orders.length === 0) ? (
        <Card className="rounded-3xl p-12 text-center border-dashed border-slate-200 bg-white space-y-3">
          <div className="bg-orange-50 text-primary w-12 h-12 rounded-full flex items-center justify-center mx-auto">
            <ReceiptText className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-800">No previous orders found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            You haven&apos;t placed any orders yet. Scan your table QR code or order online now!
          </p>
          <Link href="/menu">
            <Button className="mt-2 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold">
              Explore Canteen Menu
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const tableNumber = (order.table_sessions as any)?.tables?.table_number;
            const itemsSummary = order.order_items?.map((i: any) => `${i.quantity}x ${i.menu_items?.name}`).join(', ');

            return (
              <Card key={order.id} className="rounded-3xl border border-slate-200/80 shadow-xs bg-white hover:shadow-md transition-all overflow-hidden">
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-primary">
                        {order.order_number || `CAN-${order.id.slice(0, 4)}`}
                      </span>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" />
                        {new Date(order.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })} at{' '}
                        {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <Badge
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        order.status === 'READY'
                          ? 'bg-emerald-500 text-white animate-pulse'
                          : order.status === 'COMPLETED'
                          ? 'bg-slate-100 text-slate-700'
                          : order.status === 'CANCELLED'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-5 pt-0 pb-3 space-y-2">
                  <p className="text-xs text-slate-700 font-medium line-clamp-1">
                    {itemsSummary || 'Food Items'}
                  </p>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {tableNumber ? `Table: ${tableNumber}` : 'Pickup'}
                    </span>
                    <span className="font-extrabold text-base text-slate-900">
                      ₹{order.total_amount}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="p-5 pt-0 pb-4 flex justify-end">
                  <Link href={`/orders/${order.id}`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full rounded-xl text-xs font-bold flex items-center justify-center gap-1">
                      Track / View Details <ArrowRight className="h-3.5 w-3.5" />
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
