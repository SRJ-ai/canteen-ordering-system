'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { placeOrderAction } from '@/features/orders/order.actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, QrCode, Banknote, CreditCard, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, subtotal, tax, clearCart, tableInfo, isLoaded } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CASH' | 'CARD'>('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isLoaded) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-xs text-muted-foreground font-medium">Preparing your order summary...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">No items to checkout</h2>
        <p className="text-xs text-muted-foreground">Your cart is currently empty.</p>
        <Link href="/menu">
          <Button className="bg-primary hover:bg-primary/90 text-white rounded-2xl">
            Go to Menu
          </Button>
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    // Format items for server action
    const orderItems = items.map((item) => ({
      menu_item_id: item.menuItemId,
      quantity: item.quantity,
      addons: item.addons.map((a) => ({
        addon_option_id: a.id,
        name: a.name,
        price_adjustment: a.price,
      })),
      notes: item.notes,
    }));

    const res = await placeOrderAction({
      items: orderItems,
      paymentMethod,
      customerName,
      customerPhone,
    });

    setIsSubmitting(false);

    if (res.success && res.orderId) {
      clearCart();
      router.push(`/orders/${res.orderId}`);
    } else {
      setErrorMessage(res.error || 'Failed to place order. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Checkout & Pay
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Complete your order details and choose your preferred payment mode.
          </p>
        </div>
        <Link href="/cart">
          <Button variant="outline" size="sm" className="rounded-xl text-xs">
            <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Edit Cart
          </Button>
        </Link>
      </div>

      {errorMessage && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-2xl text-xs font-semibold border border-destructive/20">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="space-y-6">
        {/* Table & Customer Details */}
        <Card className="rounded-3xl border border-slate-200/80 shadow-xs bg-white p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-bold text-sm text-slate-900">1. Dining & Contact Details</h3>
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold">
              {tableInfo?.tableNumber || 'Table 01 (Auto-Assigned)'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-semibold text-slate-700">
                Your Name <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g. Rahul Sharma"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="rounded-xl text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-xs font-semibold text-slate-700">
                Phone Number <span className="text-muted-foreground font-normal">(for ready alerts)</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="rounded-xl text-sm"
              />
            </div>
          </div>
        </Card>

        {/* Payment Methods */}
        <Card className="rounded-3xl border border-slate-200/80 shadow-xs bg-white p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 border-b pb-3">
            2. Choose Payment Mode
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* UPI */}
            <div
              onClick={() => setPaymentMethod('UPI')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                paymentMethod === 'UPI'
                  ? 'bg-orange-50/80 border-primary shadow-sm text-slate-900 ring-1 ring-primary'
                  : 'bg-slate-50/50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <QrCode className={`h-6 w-6 ${paymentMethod === 'UPI' ? 'text-primary' : 'text-slate-500'}`} />
                <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                  Fastest
                </span>
              </div>
              <div>
                <div className="font-bold text-sm">UPI Instant</div>
                <div className="text-[11px] text-muted-foreground">GPay, PhonePe, Paytm</div>
              </div>
            </div>

            {/* Cash at Counter */}
            <div
              onClick={() => setPaymentMethod('CASH')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                paymentMethod === 'CASH'
                  ? 'bg-orange-50/80 border-primary shadow-sm text-slate-900 ring-1 ring-primary'
                  : 'bg-slate-50/50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <Banknote className={`h-6 w-6 ${paymentMethod === 'CASH' ? 'text-primary' : 'text-slate-500'}`} />
              </div>
              <div>
                <div className="font-bold text-sm">Cash at Counter</div>
                <div className="text-[11px] text-muted-foreground">Pay when picking up</div>
              </div>
            </div>

            {/* Cards */}
            <div
              onClick={() => setPaymentMethod('CARD')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                paymentMethod === 'CARD'
                  ? 'bg-orange-50/80 border-primary shadow-sm text-slate-900 ring-1 ring-primary'
                  : 'bg-slate-50/50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <CreditCard className={`h-6 w-6 ${paymentMethod === 'CARD' ? 'text-primary' : 'text-slate-500'}`} />
              </div>
              <div>
                <div className="font-bold text-sm">Cards / POS</div>
                <div className="text-[11px] text-muted-foreground">Swipe / Tap card</div>
              </div>
            </div>
          </div>

          {/* UPI Dynamic Simulation Box */}
          {paymentMethod === 'UPI' && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50/90 to-amber-50/90 border border-orange-200/80 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left animate-in fade-in-50">
              <div className="bg-white p-3 rounded-xl border shadow-xs flex items-center justify-center">
                <QrCode className="h-16 w-16 text-slate-900" />
              </div>
              <div className="space-y-1">
                <div className="font-bold text-xs text-slate-900 flex items-center justify-center sm:justify-start gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" /> 100% Secure UPI Instant Gateway
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Order amount of <strong className="text-slate-900">₹{total.toFixed(2)}</strong> will be verified automatically.
                </p>
                <div className="text-[10px] text-emerald-700 font-semibold flex items-center justify-center sm:justify-start gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Auto-confirmation enabled
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Order Summary & Submit */}
        <Card className="rounded-3xl border border-slate-200/80 shadow-xs bg-white p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 border-b pb-3">3. Final Summary</h3>
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>{items.reduce((s, i) => s + i.quantity, 0)} Items Total</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST Tax (5%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between items-center text-lg font-bold text-slate-900">
              <span>Grand Total</span>
              <span className="text-2xl font-extrabold text-primary">₹{total.toFixed(2)}</span>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-white font-extrabold h-14 rounded-2xl text-lg shadow-xl flex items-center justify-center gap-2 mt-4"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Placing Order...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" /> Place Order &bull; ₹{total.toFixed(2)}
              </>
            )}
          </Button>
        </Card>
      </form>
    </div>
  );
}
