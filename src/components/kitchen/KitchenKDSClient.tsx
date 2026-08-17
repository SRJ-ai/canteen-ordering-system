'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
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
  Flame,
  Check,
  Timer,
  GraduationCap,
  Zap,
  Maximize,
  Minimize,
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

export function KitchenKDSClient({ initialOrders = [] }: KitchenKDSClientProps) {
  const [orders, setOrders] = useState<KitchenOrder[]>(initialOrders);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const seenOrderIds = useRef<Set<string>>(new Set(initialOrders.map((o) => o.id)));

  const toggleFullscreen = () => {
    if (typeof document !== 'undefined') {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        setIsFullscreen(true);
      } else {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Helper to check if an order has faculty priority
  const isFacultyOrder = (order: KitchenOrder) => {
    return order.order_notes?.some(
      (n) =>
        n.note?.includes('[FACULTY_PRIORITY]') ||
        n.note?.toLowerCase().includes('faculty') ||
        n.note?.toLowerCase().includes('staff') ||
        n.note?.toLowerCase().includes('prof')
    ) || false;
  };

  const fetchOrders = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
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
            menu_items (
              name
            ),
            order_item_addons (
              id,
              menu_item_addon_options (
                name
              )
            )
          ),
          order_notes (
            note
          )
        `)
        .in('status', ['PENDING', 'CONFIRMED', 'ACCEPTED', 'PREPARING', 'READY'])
        .order('created_at', { ascending: true });

      if (data) {
        // Detect new orders and trigger sound alert
        data.forEach((o: any) => {
          if (!seenOrderIds.current.has(o.id)) {
            seenOrderIds.current.add(o.id);
            if (soundEnabled && typeof window !== 'undefined') {
              playChime();
              if (isFacultyOrder(o) && 'speechSynthesis' in window) {
                try {
                  const speech = new SpeechSynthesisUtterance('VIP Faculty priority order received!');
                  window.speechSynthesis.speak(speech);
                } catch (e) {}
              }
            }
          }
        });

        setOrders(data as any);
      }
    } catch (err) {
      console.error('Error fetching KDS orders:', err);
    }
  }, [soundEnabled]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // Audio tone feedback
  const playChime = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {}
  };

  // Instant optimistic status transition + Supabase sync
  const handleTransition = async (orderId: string, nextStatus: string) => {
    setIsUpdating(orderId);
    playChime();

    // 1. Optimistic UI update immediately
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('orders')
        .update({ status: nextStatus })
        .eq('id', orderId);

      if (error) {
        console.error('Supabase status update error:', error);
      }

      // Record status transition log
      await supabase.from('order_status_history').insert({
        order_id: orderId,
        status: nextStatus,
      });
    } catch (err) {
      console.error('Transition error:', err);
    } finally {
      setIsUpdating(null);
    }
  };

  // Queue sorting: Faculty Priority first, then FCFS (created_at ASC)
  const sortKdsQueue = (a: KitchenOrder, b: KitchenOrder) => {
    const aFac = isFacultyOrder(a);
    const bFac = isFacultyOrder(b);
    if (aFac && !bFac) return -1;
    if (!aFac && bFac) return 1;
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  };

  // Filter into 3 active kitchen columns
  const pendingOrders = orders
    .filter((o) => o.status === 'PENDING' || o.status === 'CONFIRMED')
    .sort(sortKdsQueue);

  const preparingOrders = orders
    .filter((o) => o.status === 'ACCEPTED' || o.status === 'PREPARING')
    .sort(sortKdsQueue);

  const readyOrders = orders
    .filter((o) => o.status === 'READY')
    .sort(sortKdsQueue);

  const getTimeElapsedMinutes = (createdAt: string) => {
    return Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000));
  };

  const getTimeElapsedText = (createdAt: string) => {
    const mins = getTimeElapsedMinutes(createdAt);
    if (mins < 1) return 'Just now';
    if (mins >= 60) return `${Math.floor(mins / 60)}h ${mins % 60}m ago`;
    return `${mins}m ago`;
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500/20 text-amber-400 p-2.5 rounded-2xl border border-amber-500/30">
            <Flame className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg text-white tracking-tight flex items-center gap-2">
              GPREC Kitchen Display (KDS)
              <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                PRIORITY QUEUE LIVE
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {pendingOrders.length + preparingOrders.length + readyOrders.length} Active Orders &bull; Faculty Fast-Track &amp; FCFS Tiering
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`rounded-2xl text-xs font-bold transition-all ${
              soundEnabled
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4 mr-1.5" /> : <VolumeX className="h-4 w-4 mr-1.5" />}
            {soundEnabled ? 'Chime Alerts ON' : 'Muted'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            className="bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700 rounded-2xl text-xs font-bold"
            title="Toggle Fullscreen Kitchen Display"
          >
            {isFullscreen ? (
              <>
                <Minimize className="h-3.5 w-3.5 mr-1" /> Exit
              </>
            ) : (
              <>
                <Maximize className="h-3.5 w-3.5 mr-1" /> Fullscreen
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchOrders()}
            className="bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700 rounded-2xl text-xs font-bold"
          >
            <RotateCw className="h-3.5 w-3.5 mr-1" /> Refresh
          </Button>
        </div>
      </div>

      {/* 3 Columns Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. New Orders Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-amber-500/15 border border-amber-500/30 p-3.5 rounded-2xl">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Clock className="h-4 w-4" /> 1. New Incoming
            </div>
            <Badge className="bg-amber-500 text-slate-900 font-extrabold px-2.5">
              {pendingOrders.length}
            </Badge>
          </div>

          <div className="space-y-4" role="list" aria-label="Incoming Orders">
            {pendingOrders.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-dashed border-slate-800 text-slate-500 text-xs">
                No incoming tickets
              </div>
            ) : (
              pendingOrders.map((order, idx) => (
                <KitchenTicketCard
                  key={order.id}
                  order={order}
                  isFaculty={isFacultyOrder(order)}
                  isFirstInQueue={idx === 0}
                  queuePosition={idx + 1}
                  accentColor="amber"
                  isUpdating={isUpdating === order.id}
                  timeAgo={getTimeElapsedText(order.created_at)}
                  minutesWaiting={getTimeElapsedMinutes(order.created_at)}
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
              <ChefHat className="h-4 w-4" /> 2. Cooking in Progress
            </div>
            <Badge className="bg-blue-500 text-white font-extrabold px-2.5">
              {preparingOrders.length}
            </Badge>
          </div>

          <div className="space-y-4" role="list" aria-label="Cooking Orders">
            {preparingOrders.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-dashed border-slate-800 text-slate-500 text-xs">
                No orders being prepared
              </div>
            ) : (
              preparingOrders.map((order, idx) => (
                <KitchenTicketCard
                  key={order.id}
                  order={order}
                  isFaculty={isFacultyOrder(order)}
                  isFirstInQueue={idx === 0}
                  queuePosition={idx + 1}
                  accentColor="blue"
                  isUpdating={isUpdating === order.id}
                  timeAgo={getTimeElapsedText(order.created_at)}
                  minutesWaiting={getTimeElapsedMinutes(order.created_at)}
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
              <BellRing className="h-4 w-4" /> 3. Ready for Pickup
            </div>
            <Badge className="bg-emerald-500 text-slate-900 font-extrabold px-2.5">
              {readyOrders.length}
            </Badge>
          </div>

          <div className="space-y-4" role="list" aria-label="Ready Orders">
            {readyOrders.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-dashed border-slate-800 text-slate-500 text-xs">
                No tickets waiting for pickup
              </div>
            ) : (
              readyOrders.map((order, idx) => (
                <KitchenTicketCard
                  key={order.id}
                  order={order}
                  isFaculty={isFacultyOrder(order)}
                  isFirstInQueue={idx === 0}
                  queuePosition={idx + 1}
                  accentColor="emerald"
                  isUpdating={isUpdating === order.id}
                  timeAgo={getTimeElapsedText(order.created_at)}
                  minutesWaiting={getTimeElapsedMinutes(order.created_at)}
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
  isFaculty,
  isFirstInQueue,
  queuePosition,
  accentColor,
  timeAgo,
  minutesWaiting,
  primaryActionText,
  onPrimaryAction,
  isUpdating,
}: {
  order: KitchenOrder;
  isFaculty: boolean;
  isFirstInQueue: boolean;
  queuePosition: number;
  accentColor: 'amber' | 'blue' | 'emerald';
  timeAgo: string;
  minutesWaiting: number;
  primaryActionText: string;
  onPrimaryAction: () => void;
  isUpdating: boolean;
}) {
  const tableNum = order.table_sessions?.tables?.table_number || 'Takeaway';
  const isUrgent = minutesWaiting >= 10;

  return (
    <Card
      role="listitem"
      aria-label={`Order ${order.order_number || order.id} for ${tableNum}`}
      className={`bg-slate-900 text-white rounded-3xl shadow-xl overflow-hidden flex flex-col justify-between transition-all border ${
        isFaculty
          ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-amber-500/10'
          : isFirstInQueue
          ? 'border-amber-400 ring-2 ring-amber-400/30'
          : isUrgent
          ? 'border-rose-500/80 ring-1 ring-rose-500/40'
          : 'border-slate-800'
      }`}
    >
      <CardHeader className={`p-4 pb-2 border-b ${
        isFaculty ? 'bg-amber-950/40 border-amber-500/30' : 'border-slate-800 bg-slate-950/60'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge className="bg-slate-800 text-amber-400 border border-amber-500/30 font-mono text-xs px-2 py-0.5 font-bold">
              {order.order_number || `CAN-${order.id.slice(0, 4)}`}
            </Badge>

            {isFaculty && (
              <Badge className="bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <GraduationCap className="h-3 w-3" /> VIP FACULTY
              </Badge>
            )}

            {!isFaculty && isFirstInQueue && (
              <Badge className="bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                #1 Next (FCFS)
              </Badge>
            )}

            {!isFaculty && !isFirstInQueue && (
              <span className="text-[10px] text-slate-500 font-mono">
                #{queuePosition} in line
              </span>
            )}
          </div>

          <span
            className={`text-[11px] font-semibold flex items-center gap-1 ${
              isUrgent ? 'text-rose-400 animate-pulse font-bold' : 'text-slate-400'
            }`}
          >
            <Clock className="h-3 w-3" /> {timeAgo}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1.5">
          <span className="text-base font-extrabold text-white flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-emerald-400" /> {tableNum}
          </span>
          <span className="text-xs font-bold text-slate-300">₹{order.total_amount}</span>
        </div>
      </CardHeader>

      {/* Items List */}
      <CardContent className="p-4 space-y-2.5 flex-1">
        {order.order_items && order.order_items.length > 0 ? (
          order.order_items.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-start justify-between text-sm font-bold text-slate-100">
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center text-xs font-black shrink-0">
                    {item.quantity}
                  </span>
                  <span className="text-white text-sm font-bold">{item.menu_items?.name || 'Chef Specialty Dish'}</span>
                </span>
              </div>

              {/* Customizations / Addons */}
              {item.order_item_addons && item.order_item_addons.length > 0 && (
                <div className="flex flex-wrap gap-1 pl-8">
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
          ))
        ) : (
          <div className="space-y-1">
            <div className="flex items-start justify-between text-sm font-bold text-slate-100">
              <span className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center text-xs font-black shrink-0">
                  1
                </span>
                <span className="text-white text-sm font-bold">
                  {isFaculty ? 'GPREC Faculty Special Thali Meal' : 'Campus Hot Meal Combo'}
                </span>
              </span>
            </div>
            <div className="text-[11px] text-amber-400/90 pl-8 font-medium">
              Standard Hot Meal Preparation
            </div>
          </div>
        )}

        {/* Order Notes */}
        {order.order_notes && order.order_notes.length > 0 && (
          <div className={`mt-2 text-xs p-2.5 rounded-xl font-medium ${
            isFaculty
              ? 'bg-amber-950/70 border border-amber-500/50 text-amber-200'
              : 'bg-slate-800 border border-slate-700 text-slate-300'
          }`}>
            📝 {order.order_notes[0].note}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-3 bg-slate-950/70 border-t border-slate-800">
        <Button
          onClick={onPrimaryAction}
          disabled={isUpdating}
          className={`w-full font-bold text-xs h-11 rounded-2xl shadow-lg transition-all ${
            accentColor === 'amber'
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
              : accentColor === 'blue'
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
          }`}
        >
          {isUpdating ? 'Updating Status...' : primaryActionText}
        </Button>
      </CardFooter>
    </Card>
  );
}
