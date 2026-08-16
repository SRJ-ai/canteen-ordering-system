'use client';

import React, { useState, useEffect } from 'react';
import { updateOrderStatusByStaffAction } from '@/features/orders/order.actions';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  CheckCircle2,
  ChefHat,
  BellRing,
  Utensils,
  AlertCircle,
  RotateCw,
  Volume2,
  VolumeX,
  MapPin,
  Sparkles,
} from 'lucide-react';

interface KitchenOrder {
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
    menu_items?: {
      name: string;
    };
    order_item_addons?: {
      id: string;
      menu_item_addon_options?: {
        name: string;
      };
    }[];
  }[];
  order_notes?: {
    note: string;
  }[];
}

interface KitchenKDSClientProps {
  initialOrders: KitchenOrder[];
}

export function KitchenKDSClient({ initialOrders }: KitchenKDSClientProps) {
  const [orders, setOrders] = useState<KitchenOrder[]>(initialOrders);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Status progression action
  const handleTransition = async (orderId: string, nextStatus: any) => {
    setIsUpdating(orderId);
    const res = await updateOrderStatusByStaffAction(orderId, nextStatus);
    setIsUpdating(null);

    if (res.success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
      );
    }
  };

  // Filter into 3 active kitchen columns
  const pendingOrders = orders.filter((o) => o.status === 'PENDING' || o.status === 'CONFIRMED');
  const preparingOrders = orders.filter((o) => o.status === 'ACCEPTED' || o.status === 'PREPARING');
  const readyOrders = orders.filter((o) => o.status === 'READY');

  const getTimeElapsed = (createdAt: string) => {
    const diff = Math.floor((new Date().getTime() - new Date(createdAt).getTime()) / 60000);
    if (diff < 1) return 'Just now';
    return `${diff}m ago`;
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/20 text-emerald-400 p-2.5 rounded-xl border border-emerald-500/30">
            <ChefHat className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg text-white tracking-tight flex items-center gap-2">
              Kitchen Display System (KDS)
              <span className="bg-emerald-500 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full">
                LIVE
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Active tickets: {pendingOrders.length + preparingOrders.length + readyOrders.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`rounded-xl text-xs font-semibold ${
              soundEnabled ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-700 text-slate-300 border-slate-600'
            }`}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4 mr-1.5" /> : <VolumeX className="h-4 w-4 mr-1.5" />}
            {soundEnabled ? 'Sound Alerts ON' : 'Muted'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="bg-slate-700 text-slate-200 hover:bg-slate-600 border-slate-600 rounded-xl text-xs"
          >
            <RotateCw className="h-3.5 w-3.5 mr-1" /> Refresh Board
          </Button>
        </div>
      </div>

      {/* 3 Columns Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. New Orders Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-amber-500/15 border border-amber-500/30 p-3.5 rounded-2xl">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Clock className="h-4 w-4" /> New Incoming Tickets
            </div>
            <Badge className="bg-amber-500 text-slate-900 font-extrabold px-2.5">
              {pendingOrders.length}
            </Badge>
          </div>

          <div className="space-y-4">
            {pendingOrders.length === 0 ? (
              <div className="p-8 text-center bg-slate-800/50 rounded-2xl border border-dashed border-slate-700 text-slate-500 text-xs">
                No incoming tickets
              </div>
            ) : (
              pendingOrders.map((order) => (
                <KitchenTicketCard
                  key={order.id}
                  order={order}
                  accentColor="amber"
                  isUpdating={isUpdating === order.id}
                  timeAgo={getTimeElapsed(order.created_at)}
                  primaryActionText="Accept Ticket"
                  onPrimaryAction={() => handleTransition(order.id, 'ACCEPTED')}
                />
              ))
            )}
          </div>
        </div>

        {/* 2. In Cooking Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-blue-500/15 border border-blue-500/30 p-3.5 rounded-2xl">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
              <ChefHat className="h-4 w-4" /> Cooking in Progress
            </div>
            <Badge className="bg-blue-500 text-white font-extrabold px-2.5">
              {preparingOrders.length}
            </Badge>
          </div>

          <div className="space-y-4">
            {preparingOrders.length === 0 ? (
              <div className="p-8 text-center bg-slate-800/50 rounded-2xl border border-dashed border-slate-700 text-slate-500 text-xs">
                No orders being prepared
              </div>
            ) : (
              preparingOrders.map((order) => (
                <KitchenTicketCard
                  key={order.id}
                  order={order}
                  accentColor="blue"
                  isUpdating={isUpdating === order.id}
                  timeAgo={getTimeElapsed(order.created_at)}
                  primaryActionText={order.status === 'ACCEPTED' ? 'Start Cooking' : 'Mark as Ready'}
                  onPrimaryAction={() =>
                    handleTransition(order.id, order.status === 'ACCEPTED' ? 'PREPARING' : 'READY')
                  }
                />
              ))
            )}
          </div>
        </div>

        {/* 3. Ready for Counter Pickup Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-emerald-500/15 border border-emerald-500/30 p-3.5 rounded-2xl">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <BellRing className="h-4 w-4" /> Ready for Pickup
            </div>
            <Badge className="bg-emerald-500 text-slate-900 font-extrabold px-2.5">
              {readyOrders.length}
            </Badge>
          </div>

          <div className="space-y-4">
            {readyOrders.length === 0 ? (
              <div className="p-8 text-center bg-slate-800/50 rounded-2xl border border-dashed border-slate-700 text-slate-500 text-xs">
                No tickets waiting for pickup
              </div>
            ) : (
              readyOrders.map((order) => (
                <KitchenTicketCard
                  key={order.id}
                  order={order}
                  accentColor="emerald"
                  isUpdating={isUpdating === order.id}
                  timeAgo={getTimeElapsed(order.created_at)}
                  primaryActionText="Complete & Hand Over"
                  onPrimaryAction={() => handleTransition(order.id, 'COMPLETED')}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function KitchenTicketCard({
  order,
  accentColor,
  timeAgo,
  primaryActionText,
  onPrimaryAction,
  isUpdating,
}: {
  order: KitchenOrder;
  accentColor: 'amber' | 'blue' | 'emerald';
  timeAgo: string;
  primaryActionText: string;
  onPrimaryAction: () => void;
  isUpdating: boolean;
}) {
  const tableNum = order.table_sessions?.tables?.table_number || 'Takeaway';

  return (
    <Card className="bg-slate-800 border-slate-700 text-white rounded-2xl shadow-lg overflow-hidden flex flex-col justify-between">
      <CardHeader className="p-4 pb-2 border-b border-slate-700/80 bg-slate-800/90">
        <div className="flex items-center justify-between">
          <Badge className="bg-slate-900 text-orange-400 border border-orange-500/30 font-mono text-xs px-2 py-0.5 font-bold">
            {order.order_number || `CAN-${order.id.slice(0, 4)}`}
          </Badge>
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Clock className="h-3 w-3" /> {timeAgo}
          </span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-base font-extrabold text-white flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-emerald-400" /> {tableNum}
          </span>
          <span className="text-xs font-bold text-slate-400">₹{order.total_amount}</span>
        </div>
      </CardHeader>

      {/* Items List */}
      <CardContent className="p-4 space-y-2.5 flex-1">
        {order.order_items?.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-start justify-between text-sm font-bold text-slate-100">
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-slate-700 text-orange-400 flex items-center justify-center text-xs">
                  {item.quantity}
                </span>
                <span>{item.menu_items?.name || 'Food Item'}</span>
              </span>
            </div>

            {/* Customizations / Addons */}
            {item.order_item_addons && item.order_item_addons.length > 0 && (
              <div className="flex flex-wrap gap-1 pl-7">
                {item.order_item_addons.map((a, aidx) => (
                  <span
                    key={aidx}
                    className="text-[11px] font-bold text-amber-300 bg-amber-950/60 border border-amber-500/40 px-1.5 py-0.5 rounded"
                  >
                    +{a.menu_item_addon_options?.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Order Notes */}
        {order.order_notes && order.order_notes.length > 0 && (
          <div className="mt-2 text-xs bg-amber-950/40 border border-amber-700/50 text-amber-200 p-2 rounded-xl font-medium">
            📝 {order.order_notes[0].note}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-3 bg-slate-900/60 border-t border-slate-700/80">
        <Button
          onClick={onPrimaryAction}
          disabled={isUpdating}
          className={`w-full font-bold text-xs h-10 rounded-xl shadow-md transition-all ${
            accentColor === 'amber'
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              : accentColor === 'blue'
              ? 'bg-blue-600 hover:bg-blue-500 text-white'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          {isUpdating ? 'Updating...' : primaryActionText}
        </Button>
      </CardFooter>
    </Card>
  );
}
