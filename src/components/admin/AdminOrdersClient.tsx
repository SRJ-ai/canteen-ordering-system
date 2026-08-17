'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { updateOrderStatusByStaffAction } from '@/features/orders/order.actions';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Clock,
  ChefHat,
  BellRing,
  RotateCw,
  Eye,
  MapPin,
  Ban,
} from 'lucide-react';

interface AdminOrder {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  table_sessions?: {
    tables?: {
      table_number: string;
    };
  };
  order_items?: {
    id: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    menu_items?: {
      name: string;
    };
    order_item_addons?: {
      id: string;
      price_adjustment: number;
      menu_item_addon_options?: {
        name: string;
      };
    }[];
  }[];
  order_notes?: {
    note: string;
  }[];
}

const CANCELLATION_REASONS = [
  { value: 'OUT_OF_STOCK', label: 'Item Sold Out / Ingredient Depleted' },
  { value: 'KITCHEN_OVERLOAD', label: 'Kitchen Capacity Overload / Peak Rush' },
  { value: 'CUSTOMER_REQUESTED', label: 'Customer Requested Cancellation' },
  { value: 'DUPLICATE_ORDER', label: 'Duplicate / Accidental Order' },
  { value: 'SYSTEM_TEST', label: 'System Testing / Void Transaction' },
  { value: 'OTHER', label: 'Other Operational Issue' },
];

export function AdminOrdersClient({ initialOrders = [] }: { initialOrders?: AdminOrder[] }) {
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrders = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
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
            id,
            quantity,
            unit_price,
            subtotal,
            menu_items (
              name
            ),
            order_item_addons (
              id,
              price_adjustment,
              menu_item_addon_options (
                name
              )
            )
          ),
          order_notes (
            note
          )
        `)
        .order('created_at', { ascending: false });

      if (data) setOrders(data as any);
    } catch (err) {}
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 4000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // Selected Order for Cancellation Modal
  const [cancellingOrder, setCancellingOrder] = useState<AdminOrder | null>(null);
  const [cancellationReason, setCancellationReason] = useState(CANCELLATION_REASONS[0].value);
  const [customNote, setCustomNote] = useState('');
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  // Selected Order for Viewing Details Modal
  const [viewingOrder, setViewingOrder] = useState<AdminOrder | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    const orderNum = o.order_number || '';
    const tableNum = o.table_sessions?.tables?.table_number || 'Takeaway';
    const matchesSearch =
      orderNum.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tableNum.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleConfirmCancel = async () => {
    if (!cancellingOrder) return;
    setIsSubmittingCancel(true);
    setCancelError(null);

    const fullReason = `${cancellationReason}${customNote ? `: ${customNote}` : ''}`;
    const res = await updateOrderStatusByStaffAction(cancellingOrder.id, 'CANCELLED', fullReason);

    setIsSubmittingCancel(false);
    if (res.success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === cancellingOrder.id ? { ...o, status: 'CANCELLED' } : o))
      );
      setCancellingOrder(null);
      setCustomNote('');
    } else {
      setCancelError(res.error || 'Failed to cancel order.');
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: any) => {
    const res = await updateOrderStatusByStaffAction(orderId, newStatus);
    if (res.success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Live Order Management
          </h1>
          <p className="text-sm text-slate-700 font-semibold mt-1">
            Monitor real-time tickets, adjust statuses, and execute authoritative order cancellations.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
          className="bg-white rounded-2xl text-xs font-semibold"
        >
          <RotateCw className="h-3.5 w-3.5 mr-1" /> Refresh
        </Button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['ALL', 'PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === s
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search order # or table..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs rounded-xl h-9 bg-slate-50"
          />
        </div>
      </div>

      {/* Orders Table Card */}
      <Card className="rounded-3xl border border-slate-200/80 shadow-xs bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="p-4 pl-6">Order ID</th>
                <th className="p-4">Table / Area</th>
                <th className="p-4">Ordered Items</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Current Status</th>
                <th className="p-4">Placed At</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-xs text-muted-foreground">
                    No orders matching the current filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const tableNum = order.table_sessions?.tables?.table_number || 'Takeaway';
                  const isCancelled = order.status === 'CANCELLED';
                  const isCompleted = order.status === 'COMPLETED';

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/60 transition">
                      <td className="p-4 pl-6 font-mono text-xs font-bold text-slate-900">
                        {order.order_number || `CAN-${order.id.slice(0, 4)}`}
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-primary" /> {tableNum}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-700 max-w-xs">
                        <div className="line-clamp-1 font-medium">
                          {order.order_items?.map((i) => `${i.quantity}x ${i.menu_items?.name}`).join(', ')}
                        </div>
                      </td>
                      <td className="p-4 font-extrabold text-sm text-slate-900">
                        ₹{order.total_amount}
                      </td>
                      <td className="p-4">
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
                      </td>
                      <td className="p-4 text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-4 pr-6 text-right space-x-1.5 whitespace-nowrap">
                        {/* View Details Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewingOrder(order)}
                          className="h-8 w-8 p-0 rounded-lg text-slate-500 hover:text-slate-900"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {/* Status Transition Shortcut */}
                        {!isCancelled && !isCompleted && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const nextStatus =
                                order.status === 'PENDING'
                                  ? 'ACCEPTED'
                                  : order.status === 'ACCEPTED'
                                  ? 'PREPARING'
                                  : order.status === 'PREPARING'
                                  ? 'READY'
                                  : 'COMPLETED';
                              handleStatusChange(order.id, nextStatus);
                            }}
                            className="text-xs h-8 rounded-xl font-bold border-slate-200"
                          >
                            Advance &rarr;
                          </Button>
                        )}

                        {/* Admin Cancel Order Action */}
                        {!isCancelled && !isCompleted && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCancellingOrder(order)}
                            className="h-8 text-xs rounded-xl font-bold text-destructive hover:bg-destructive/10"
                          >
                            <Ban className="h-3.5 w-3.5 mr-1" /> Cancel
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Authoritative Cancel Order Modal */}
      <Dialog open={Boolean(cancellingOrder)} onOpenChange={() => setCancellingOrder(null)}>
        <DialogContent className="sm:max-w-md bg-white p-6 rounded-3xl">
          <DialogHeader className="text-left pb-3 border-b">
            <div className="flex items-center gap-2 text-destructive font-bold">
              <AlertTriangle className="h-5 w-5" />
              <DialogTitle className="text-lg">Authoritative Order Cancellation</DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              Cancelling ticket <strong className="text-slate-900">{cancellingOrder?.order_number}</strong> ({cancellingOrder?.table_sessions?.tables?.table_number || 'Takeaway'}). This action is audited and logged.
            </DialogDescription>
          </DialogHeader>

          {cancelError && (
            <div className="bg-destructive/15 text-destructive p-3 rounded-xl text-xs font-semibold">
              {cancelError}
            </div>
          )}

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-800">
                Reason Code <span className="text-destructive">*</span>
              </Label>
              <select
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="w-full h-10 rounded-lg border border-input bg-white px-3 text-xs shadow-xs focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {CANCELLATION_REASONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-800">
                Internal Audit Note / Justification
              </Label>
              <Input
                placeholder="e.g. Masala Dosa batter finished at 8:30pm..."
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                className="text-xs rounded-xl"
              />
            </div>
          </div>

          <DialogFooter className="border-t pt-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCancellingOrder(null)}
              className="rounded-xl text-xs"
            >
              Back
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={isSubmittingCancel}
              onClick={handleConfirmCancel}
              className="rounded-xl text-xs font-bold"
            >
              {isSubmittingCancel ? 'Cancelling...' : 'Confirm Cancellation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Order Details Modal */}
      <Dialog open={Boolean(viewingOrder)} onOpenChange={() => setViewingOrder(null)}>
        <DialogContent className="sm:max-w-md bg-white p-6 rounded-3xl">
          <DialogHeader className="text-left pb-3 border-b">
            <DialogTitle className="text-lg font-bold flex items-center justify-between">
              <span>{viewingOrder?.order_number}</span>
              <span className="text-sm font-semibold text-primary">₹{viewingOrder?.total_amount}</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              {viewingOrder?.table_sessions?.tables?.table_number || 'Takeaway'} &bull; Status: {viewingOrder?.status}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-3 divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
            {viewingOrder?.order_items?.map((item) => (
              <div key={item.id} className="pt-2 first:pt-0 flex items-start justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">
                    {item.quantity}x {item.menu_items?.name}
                  </div>
                  {item.order_item_addons && item.order_item_addons.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.order_item_addons.map((a) => (
                        <span key={a.id} className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                          +{a.menu_item_addon_options?.name} (+₹{a.price_adjustment})
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="font-bold text-slate-800">₹{item.subtotal}</span>
              </div>
            ))}
          </div>

          <DialogFooter className="border-t pt-3">
            <Button variant="outline" size="sm" onClick={() => setViewingOrder(null)} className="w-full rounded-xl text-xs">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
