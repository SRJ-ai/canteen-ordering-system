'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { getOrderDetailsAction, cancelCustomerOrderAction } from '@/features/orders/order.actions';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  Clock,
  ChefHat,
  BellRing,
  Utensils,
  AlertTriangle,
  ArrowLeft,
  RotateCw,
  MapPin,
  Receipt,
  Sparkles,
  Share2,
  Printer,
  Star,
  Lock,
  Check,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const ORDER_STEPS = [
  { status: 'PENDING', label: 'Order placed', icon: Clock, desc: 'Sent to kitchen terminal' },
  { status: 'ACCEPTED', label: 'Accepted', icon: CheckCircle2, desc: 'Kitchen acknowledged ticket' },
  { status: 'PREPARING', label: 'Cooking', icon: ChefHat, desc: 'Chef is preparing your food' },
  { status: 'READY', label: 'Ready for pickup', icon: BellRing, desc: 'Collect at the canteen counter' },
  { status: 'COMPLETED', label: 'Completed', icon: Utensils, desc: 'Enjoy your meal' },
];

export function OrderTrackerClient({ initialOrderId }: { initialOrderId?: string }) {
  const params = useParams();
  const searchParams = useSearchParams();
  const { user, role } = useAuth();

  let resolvedId = (params?.id as string) || searchParams?.get('id') || searchParams?.get('order_id') || initialOrderId;
  if ((!resolvedId || resolvedId === 'sample-order') && typeof window !== 'undefined') {
    const pathMatch = window.location.pathname.match(/orders\/([a-zA-Z0-9-]+)/);
    if (pathMatch && pathMatch[1] && pathMatch[1] !== 'sample-order') {
      resolvedId = pathMatch[1];
    }
  }

  const orderId = resolvedId;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasSpokenReady, setHasSpokenReady] = useState(false);

  const [rating, setRating] = useState<number>(5);
  const [feedbackTags, setFeedbackTags] = useState<string[]>([]);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const fetchOrder = React.useCallback(async () => {
    if (!orderId || orderId === 'sample-order') {
      setLoading(false);
      return;
    }
    const res = await getOrderDetailsAction(orderId);
    if (res.success && res.order) {
      setOrder(res.order);

      if (res.order.status === 'READY' && !hasSpokenReady) {
        setHasSpokenReady(true);
        if (typeof navigator !== 'undefined' && (navigator as any).vibrate) {
          try {
            (navigator as any).vibrate([150, 80, 150, 80, 300]);
          } catch (e) {}
        }
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          try {
            const speech = new SpeechSynthesisUtterance(
              `Attention! Order ${res.order.order_number || 'your meal'} is ready for pickup at the counter!`
            );
            speech.rate = 0.95;
            speech.pitch = 1.05;
            window.speechSynthesis.speak(speech);
          } catch (e) {}
        }
      }
    }
    setLoading(false);
  }, [orderId, hasSpokenReady]);

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 4000);
    return () => clearInterval(interval);
  }, [fetchOrder]);

  const handleCancel = async () => {
    if (!orderId || !confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    setErrorMsg(null);
    const res = await cancelCustomerOrderAction(orderId);
    setCancelling(false);
    if (res.success) {
      fetchOrder();
    } else {
      setErrorMsg(res.error || 'Cannot cancel order once accepted by kitchen.');
    }
  };

  const handleWhatsAppShare = () => {
    if (!order) return;
    const tableNum = order.table_sessions?.tables?.table_number || 'Canteen Table';
    const itemsSummary = order.order_items?.map((i: any) => `• ${i.quantity}x ${i.menu_items?.name}`).join('\n') || '';
    const trackUrl = `${window.location.origin}/canteen-ordering-system/orders/?id=${order.id}`;

    const text = `*GPREC Food Court Order Receipt*\n\n*Order Number:* ${order.order_number}\n*Location:* ${tableNum}\n*Status:* ${order.status}\n\n*Items:*\n${itemsSummary}\n\n*Total Paid:* ₹${order.total_amount}\n\n*Live Order Status:* ${trackUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleTag = (tag: string) => {
    setFeedbackTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-xl space-y-3 py-16 text-center">
        <RotateCw className="mx-auto h-8 w-8 animate-spin text-primary-deep" />
        <p className="text-sm font-semibold text-muted-foreground">Loading your live order status...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-md space-y-4 py-16 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-primary-deep" />
        <h2 className="font-display text-xl font-bold text-ink">Order not found</h2>
        <p className="text-xs text-muted-foreground">
          We couldn&rsquo;t find an active order with reference ID: <span className="numeric">{orderId}</span>
        </p>
        <Link href="/menu">
          <Button className="rounded-lg font-bold">Return to menu</Button>
        </Link>
      </div>
    );
  }

  const isAdminOrStaff =
    role === 'ADMIN' ||
    role === 'SUPER_ADMIN' ||
    role === 'KITCHEN_STAFF' ||
    role === 'CASHIER';

  let isOwner = false;
  if (isAdminOrStaff) {
    isOwner = true;
  } else {
    if (user?.id && order.user_id && order.user_id === user.id) {
      isOwner = true;
    }
    if (typeof window !== 'undefined') {
      try {
        const myOrders: string[] = JSON.parse(localStorage.getItem('canteen_my_orders') || '[]');
        if (myOrders.includes(order.id)) {
          isOwner = true;
        }
      } catch (e) {}

      try {
        const tableInfo = JSON.parse(localStorage.getItem('canteen_table_info') || '{}');
        if (tableInfo.sessionId && order.session_id === tableInfo.sessionId) {
          isOwner = true;
        }
      } catch (e) {}
    }
  }

  if (!isOwner) {
    return (
      <div className="mx-auto max-w-md space-y-4 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-chutney/25 bg-chutney/10 text-chutney">
          <Lock className="h-7 w-7" />
        </div>
        <h2 className="font-display text-xl font-bold text-ink">Order privacy protected</h2>
        <p className="mx-auto max-w-sm text-xs leading-relaxed text-muted-foreground">
          This order belongs to another student or faculty member. Under campus privacy policy, meal details, contact notes and billing records are restricted to the order owner and authorized canteen staff.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
          <Link href="/menu">
            <Button className="rounded-lg px-5 text-xs font-bold">Return to my menu</Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="outline" className="rounded-lg border-ink/15 bg-card text-xs font-semibold text-ink hover:bg-secondary">
              Sign in with account
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isCancelled = order.status === 'CANCELLED';
  const isCompleted = order.status === 'COMPLETED';
  const currentStepIndex = isCancelled
    ? -1
    : ORDER_STEPS.findIndex((s) => s.status === order.status);

  const canCustomerCancel = order.status === 'PENDING' || order.status === 'CONFIRMED';
  const tableNum = order.table_sessions?.tables?.table_number || 'Canteen Counter';

  // Status banner: marigold reads on ink text, everything else on cream text
  const bannerBg = isCancelled
    ? 'bg-chutney text-white'
    : order.status === 'READY'
    ? 'bg-leaf text-white motion-safe:animate-pulse'
    : order.status === 'PREPARING'
    ? 'bg-primary text-primary-foreground'
    : 'bg-ink text-background';

  const bannerTitle = isCancelled
    ? 'Order cancelled'
    : order.status === 'READY'
    ? 'Order ready for pickup'
    : order.status === 'PREPARING'
    ? 'Cooking in the kitchen'
    : order.status === 'ACCEPTED'
    ? 'Kitchen accepted your order'
    : order.status === 'COMPLETED'
    ? 'Order completed'
    : 'Order received';

  const bannerSub = isCancelled
    ? 'This order was cancelled. No charges applied.'
    : order.status === 'READY'
    ? 'Head to the canteen pickup counter with your token number.'
    : order.status === 'PREPARING'
    ? 'Freshly preparing your hot meal. Estimated time ~5-10 mins.'
    : 'Our kitchen team has received your ticket.';

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between print:hidden">
        <Link href="/orders">
          <Button variant="ghost" size="sm" className="rounded-lg text-xs font-semibold text-ink">
            <ArrowLeft className="mr-1 h-3.5 w-3.5" /> All orders
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleWhatsAppShare}
            className="rounded-lg border-leaf/30 bg-leaf/10 text-xs font-bold text-leaf hover:bg-leaf/20"
          >
            <Share2 className="mr-1.5 h-3.5 w-3.5" /> Share bill
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint} className="rounded-lg border-ink/15 bg-card text-xs font-semibold text-ink hover:bg-secondary">
            <Printer className="mr-1 h-3.5 w-3.5" /> Print
          </Button>
          <Button variant="outline" size="sm" onClick={fetchOrder} className="rounded-lg border-ink/15 bg-card text-xs text-ink hover:bg-secondary">
            <RotateCw className="mr-1 h-3 w-3" /> Refresh
          </Button>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-lg border border-chutney/30 bg-chutney/10 p-4 text-xs font-semibold text-chutney">
          {errorMsg}
        </div>
      )}

      {/* Status card */}
      <Card className="tray-card overflow-hidden print:border-none print:shadow-none">
        <div className={`space-y-2 p-6 text-center ${bannerBg}`}>
          <Badge className="border-0 bg-white/20 text-[10px] font-bold uppercase tracking-wider text-current numeric">
            {order.order_number || `CAN-2026-${order.id.slice(0, 4)}`}
          </Badge>
          <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            {bannerTitle}
          </h2>
          <p className="mx-auto max-w-sm text-xs font-medium opacity-90">
            {bannerSub}
          </p>
        </div>

        {/* Progress bar */}
        {!isCancelled && (
          <div className="border-b border-border bg-secondary/50 p-6 print:hidden">
            <div className="relative mx-auto flex max-w-md items-center justify-between">
              <div className="absolute left-0 right-0 top-1/2 z-0 h-1 -translate-y-1/2 bg-border">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{
                    width: `${Math.max(0, (currentStepIndex / (ORDER_STEPS.length - 1)) * 100)}%`,
                  }}
                ></div>
              </div>

              {ORDER_STEPS.map((step, idx) => {
                const StepIcon = step.icon;
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step.status} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${
                        isCurrent
                          ? 'scale-110 border-primary bg-primary text-primary-foreground shadow-md ring-4 ring-primary/20'
                          : isPassed
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-card text-steel'
                      }`}
                    >
                      <StepIcon className="h-4 w-4" />
                    </div>
                    <span
                      className={`mt-2 max-w-[64px] text-center text-[10px] font-bold leading-tight ${
                        isCurrent ? 'text-primary-deep' : isPassed ? 'text-ink' : 'text-steel'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Prep gauge */}
        {!isCancelled && !isCompleted && (
          <div className="flex items-center justify-between gap-4 border-b border-border bg-primary/5 p-5">
            <div className="flex items-center gap-3">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
                <svg className="h-12 w-12 -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-border"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={order.status === 'READY' ? 'text-leaf' : 'text-primary'}
                    strokeDasharray={order.status === 'READY' ? '100, 100' : '65, 100'}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="numeric absolute text-[11px] font-bold text-ink">
                  {order.status === 'READY' ? <Check className="h-4 w-4 text-leaf" /> : '~5m'}
                </div>
              </div>

              <div>
                <span className="block text-xs font-bold text-ink">
                  {order.status === 'READY'
                    ? 'Meal ready at counter'
                    : order.status === 'PREPARING'
                    ? 'Chef is cooking your order'
                    : 'Order queued for cooking'}
                </span>
                <span className="text-[11px] font-medium text-muted-foreground">
                  {order.status === 'READY'
                    ? 'Pickup with token number'
                    : 'Target prep window: 5-8 mins'}
                </span>
              </div>
            </div>

            <Badge
              className={`border-0 px-2 py-0.5 text-[10px] font-bold ${
                order.status === 'READY'
                  ? 'bg-leaf text-white motion-safe:animate-pulse'
                  : 'bg-primary text-primary-foreground'
              }`}
            >
              {order.status === 'READY' ? 'READY' : 'IN KITCHEN'}
            </Badge>
          </div>
        )}

        {/* Bill */}
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 font-semibold text-ink">
              <MapPin className="h-4 w-4 text-primary-deep" />
              {tableNum} &middot; GPREC Food Court
            </div>
            <div>Placed: <span className="numeric">{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink">
              <Receipt className="h-3.5 w-3.5 text-steel" /> Itemized bill
            </h4>
            <div className="space-y-2 divide-y divide-border rounded-lg border border-border bg-card p-4">
              {order.order_items?.map((item: any) => (
                <div key={item.id} className="flex items-start justify-between pt-2 first:pt-0">
                  <div>
                    <div className="flex items-center gap-2 font-display text-sm font-bold text-ink">
                      <span className="veg-indicator"><span className="veg-indicator-dot"></span></span>
                      <span>{item.menu_items?.name || 'Food item'}</span>
                      <span className="numeric text-xs font-semibold text-muted-foreground">&times; {item.quantity}</span>
                    </div>
                    {item.order_item_addons?.length > 0 && (
                      <div className="flex flex-wrap gap-1 pl-6 pt-1">
                        {item.order_item_addons.map((a: any) => (
                          <Badge key={a.id} variant="secondary" className="border border-border bg-secondary text-[10px] text-ink">
                            +{a.menu_item_addon_options?.name} (<span className="numeric">+₹{a.price_adjustment}</span>)
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="numeric text-sm font-bold text-ink">₹{item.subtotal}</span>
                </div>
              ))}

              <div className="flex items-center justify-between border-t border-border pt-3 text-base font-extrabold text-ink">
                <span>Total amount paid</span>
                <span className="numeric text-xl font-extrabold text-primary-deep">₹{order.total_amount}</span>
              </div>
            </div>
          </div>

          {/* Rating */}
          {isCompleted && (
            <div className="space-y-3 rounded-lg border border-primary/25 bg-primary/5 p-5 print:hidden">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-ink">
                  <Sparkles className="h-4 w-4 text-primary-deep" /> How was your meal?
                </span>
                {ratingSubmitted && (
                  <Badge variant="secondary" className="bg-leaf/15 text-[10px] font-bold text-leaf">
                    Feedback saved
                  </Badge>
                )}
              </div>

              {!ratingSubmitted ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 transition-transform hover:scale-125"
                        aria-label={`Rate ${star} stars`}
                      >
                        <Star
                          className={`h-7 w-7 ${
                            star <= rating ? 'fill-primary text-primary' : 'text-border'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-xs font-extrabold text-primary-deep">
                      {rating === 5 ? 'Exceptional' : rating === 4 ? 'Great' : 'Good'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {['Super crispy', 'Hot and fresh', 'Fast service', 'Authentic taste', 'Perfect spice'].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition ${
                          feedbackTags.includes(tag)
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-primary/25 bg-card text-ink hover:bg-primary/5'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  <Button
                    size="sm"
                    onClick={() => setRatingSubmitted(true)}
                    className="mt-1 w-full rounded-lg bg-ink text-xs font-bold text-background hover:bg-ink/90"
                  >
                    Submit feedback and rating
                  </Button>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Thank you for rating your dining experience at GPREC Food Court.
                </p>
              )}
            </div>
          )}
        </CardContent>

        {canCustomerCancel && (
          <CardFooter className="flex items-center justify-between border-t border-border bg-secondary/50 p-6 py-4 print:hidden">
            <div className="text-xs text-muted-foreground">
              Need to change your mind?
            </div>
            <Button
              variant="destructive"
              size="sm"
              disabled={cancelling}
              onClick={handleCancel}
              className="rounded-lg text-xs font-bold"
            >
              {cancelling ? 'Cancelling...' : 'Cancel order'}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
