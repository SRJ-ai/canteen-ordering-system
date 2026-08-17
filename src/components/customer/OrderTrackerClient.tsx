'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { getOrderDetailsAction, cancelCustomerOrderAction } from '@/features/orders/order.actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  Clock,
  ChefHat,
  BellRing,
  Utensils,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  RotateCw,
  MapPin,
  Receipt,
  Sparkles,
  Share2,
  Printer,
  Volume2,
  VolumeX,
  Star,
  MessageSquare,
  ThumbsUp,
} from 'lucide-react';

const ORDER_STEPS = [
  { status: 'PENDING', label: 'Order Placed', icon: Clock, desc: 'Sent to kitchen terminal' },
  { status: 'ACCEPTED', label: 'Accepted', icon: CheckCircle2, desc: 'Kitchen acknowledged ticket' },
  { status: 'PREPARING', label: 'Cooking', icon: ChefHat, desc: 'Chef is preparing your food' },
  { status: 'READY', label: 'Ready for Pickup', icon: BellRing, desc: 'Collect at the canteen counter' },
  { status: 'COMPLETED', label: 'Completed', icon: Utensils, desc: 'Enjoy your meal!' },
];

export function OrderTrackerClient({ initialOrderId }: { initialOrderId?: string }) {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Resolve orderId from params, searchParams (?id=...), or window.location
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
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [hasSpokenReady, setHasSpokenReady] = useState(false);
  
  // Rating states
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

      // Voice synthesis announcement when order is READY
      if (res.order.status === 'READY' && !hasSpokenReady && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        setHasSpokenReady(true);
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

    const text = `*🍛 GPREC Food Court Order Receipt*\n\n*Order Number:* ${order.order_number}\n*Location:* ${tableNum}\n*Status:* ${order.status}\n\n*Items:*\n${itemsSummary}\n\n*Total Paid:* ₹${order.total_amount}\n\n*Live Order Status:* ${trackUrl}`;
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
      <div className="max-w-xl mx-auto py-16 text-center space-y-3">
        <RotateCw className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-sm font-semibold text-slate-600">Loading your live order status...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Order Not Found</h2>
        <p className="text-xs text-muted-foreground">
          We couldn&apos;t find an active order with reference ID: {orderId}
        </p>
        <Link href="/menu">
          <Button className="bg-primary hover:bg-primary/90 text-white rounded-2xl">
            Return to Menu
          </Button>
        </Link>
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between print:hidden">
        <Link href="/orders">
          <Button variant="ghost" size="sm" className="rounded-xl text-xs font-semibold">
            <ArrowLeft className="h-3.5 w-3.5 mr-1" /> All Orders
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleWhatsAppShare}
            className="rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
          >
            <Share2 className="h-3.5 w-3.5 mr-1.5" /> Share Bill
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="rounded-xl text-xs font-semibold text-slate-700"
          >
            <Printer className="h-3.5 w-3.5 mr-1" /> Print
          </Button>
          <Button variant="outline" size="sm" onClick={fetchOrder} className="rounded-xl text-xs">
            <RotateCw className="h-3 w-3 mr-1" /> Refresh
          </Button>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-2xl text-xs font-semibold border border-destructive/20">
          {errorMsg}
        </div>
      )}

      {/* Main Order Status Card */}
      <Card className="rounded-3xl border border-slate-200/80 shadow-md bg-white overflow-hidden print:border-none print:shadow-none">
        <div className={`p-6 text-white text-center space-y-2 ${
          isCancelled
            ? 'bg-rose-600'
            : order.status === 'READY'
            ? 'bg-emerald-600 animate-pulse'
            : order.status === 'PREPARING'
            ? 'bg-amber-500'
            : order.status === 'ACCEPTED'
            ? 'bg-blue-600'
            : 'bg-slate-900'
        }`}>
          <Badge className="bg-white/20 text-white border-0 text-[10px] font-bold uppercase tracking-wider">
            {order.order_number || `CAN-2026-${order.id.slice(0, 4)}`}
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {isCancelled
              ? 'Order Cancelled'
              : order.status === 'READY'
              ? '🔔 Order Ready for Pickup!'
              : order.status === 'PREPARING'
              ? '🔥 Cooking in the Kitchen...'
              : order.status === 'ACCEPTED'
              ? '👍 Kitchen Accepted Your Order'
              : order.status === 'COMPLETED'
              ? '✨ Order Completed'
              : '⏳ Order Received'}
          </h2>
          <p className="text-xs opacity-90 font-medium max-w-sm mx-auto">
            {isCancelled
              ? 'This order was cancelled. No charges applied.'
              : order.status === 'READY'
              ? 'Please head to the canteen pickup counter with your token number.'
              : order.status === 'PREPARING'
              ? 'Freshly preparing your hot meal. Estimated time: ~5-10 mins.'
              : 'Our kitchen team has received your ticket.'}
          </p>
        </div>

        {/* Progress Step Bar */}
        {!isCancelled && (
          <div className="p-6 bg-slate-50/60 border-b border-slate-100 print:hidden">
            <div className="relative flex items-center justify-between max-w-md mx-auto">
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 z-0">
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
                      className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                        isCurrent
                          ? 'bg-primary border-primary text-white scale-110 shadow-md ring-4 ring-orange-100'
                          : isPassed
                          ? 'bg-primary border-primary text-white'
                          : 'bg-white border-slate-300 text-slate-400'
                      }`}
                    >
                      <StepIcon className="h-4 w-4" />
                    </div>
                    <span
                      className={`text-[10px] font-bold mt-2 text-center max-w-[64px] leading-tight ${
                        isCurrent ? 'text-primary' : isPassed ? 'text-slate-800' : 'text-slate-400'
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

        {/* Details & Bill */}
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <MapPin className="h-4 w-4 text-primary" />
              {tableNum} &bull; GPREC Food Court
            </div>
            <div>Placed: {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Receipt className="h-3.5 w-3.5 text-slate-500" /> Itemized Bill
            </h4>
            <div className="divide-y divide-slate-100 rounded-2xl border bg-white p-4 space-y-2">
              {order.order_items?.map((item: any) => (
                <div key={item.id} className="pt-2 first:pt-0 flex items-start justify-between">
                  <div>
                    <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <span className="veg-indicator"><span className="veg-indicator-dot"></span></span>
                      <span>{item.menu_items?.name || 'Food Item'}</span>
                      <span className="text-xs text-muted-foreground font-semibold">&times; {item.quantity}</span>
                    </div>
                    {item.order_item_addons?.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1 pl-6">
                        {item.order_item_addons.map((a: any) => (
                          <Badge key={a.id} variant="secondary" className="text-[10px] bg-slate-100">
                            +{a.menu_item_addon_options?.name} (+₹{a.price_adjustment})
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="font-bold text-sm text-slate-900">₹{item.subtotal}</span>
                </div>
              ))}

              <div className="pt-3 border-t flex justify-between items-center text-base font-extrabold text-slate-900">
                <span>Total Amount Paid</span>
                <span className="text-primary text-xl font-black">₹{order.total_amount}</span>
              </div>
            </div>
          </div>

          {/* 5-Star Meal Rating & Review Widget when order is COMPLETED */}
          {isCompleted && (
            <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl space-y-3 print:hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-500" /> How was your meal?
                </span>
                {ratingSubmitted && (
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    ✓ Feedback Saved
                  </Badge>
                )}
              </div>

              {!ratingSubmitted ? (
                <div className="space-y-3">
                  {/* Star Selector */}
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-125 transition-transform"
                      >
                        <Star
                          className={`h-7 w-7 ${
                            star <= rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-extrabold text-amber-900 ml-2">
                      {rating === 5 ? 'Exceptional! 🌟' : rating === 4 ? 'Great 👍' : 'Good 👌'}
                    </span>
                  </div>

                  {/* Feedback Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {['Super Crispy 🔥', 'Hot & Fresh 🍲', 'Fast Counter Service ⚡', 'Authentic Taste 😋', 'Perfect Spice 🌶️'].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`text-xs px-2.5 py-1 rounded-xl font-semibold border transition ${
                          feedbackTags.includes(tag)
                            ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                            : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100/50'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  <Button
                    size="sm"
                    onClick={() => setRatingSubmitted(true)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold mt-1"
                  >
                    Submit Feedback & Ratings
                  </Button>
                </div>
              ) : (
                <p className="text-xs text-slate-600">
                  Thank you for rating your dining experience at GPREC Food Court!
                </p>
              )}
            </div>
          )}
        </CardContent>

        {canCustomerCancel && (
          <CardFooter className="p-6 pt-0 border-t border-slate-100 bg-slate-50/50 py-4 flex items-center justify-between print:hidden">
            <div className="text-xs text-muted-foreground">
              Need to change your mind?
            </div>
            <Button
              variant="destructive"
              size="sm"
              disabled={cancelling}
              onClick={handleCancel}
              className="rounded-xl text-xs font-bold"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
