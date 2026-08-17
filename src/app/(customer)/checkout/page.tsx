'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { placeOrderAction } from '@/features/orders/order.actions';
import { PaymentGatewayModal } from '@/components/customer/PaymentGatewayModal';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  CheckCircle2,
  QrCode,
  Banknote,
  CreditCard,
  ShieldCheck,
  Sparkles,
  Loader2,
  GraduationCap,
  Star,
  Check,
  Zap,
} from 'lucide-react';

const DEPARTMENTS = [
  'CSE Dept',
  'ECE Dept',
  'EEE Dept',
  'Mechanical',
  'Civil Eng',
  'Admin Block',
  'Library / Staff',
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, subtotal, tax, clearCart, tableInfo, isLoaded } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isFaculty, setIsFaculty] = useState(false);
  const [facultyDept, setFacultyDept] = useState('CSE Dept');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CASH' | 'CARD'>('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  if (!isLoaded) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-3" role="status" aria-live="polite">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" aria-hidden="true" />
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

  const handleOpenPaymentModal = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsPaymentModalOpen(true);
  };

  const handleExecuteOrderPlacement = async () => {
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
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      isFacultyPriority: isFaculty,
      department: isFaculty ? facultyDept : undefined,
      notes: orderNotes.trim(),
    });

    setIsSubmitting(false);
    setIsPaymentModalOpen(false);

    if (res.success && res.orderId) {
      clearCart();
      router.push(`/orders/?id=${res.orderId}`);
    } else {
      setErrorMessage(res.error || 'Failed to place order. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans">
      {/* Accessible Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Checkout & Pay
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Complete order details and choose payment mode.
          </p>
        </div>
        <Link href="/cart">
          <Button variant="outline" size="sm" className="rounded-xl text-xs" aria-label="Return to edit cart">
            <ArrowLeft className="h-3.5 w-3.5 mr-1" aria-hidden="true" /> Edit Cart
          </Button>
        </Link>
      </header>

      {errorMessage && (
        <div
          role="alert"
          className="bg-destructive/15 text-destructive p-4 rounded-2xl text-xs font-semibold border border-destructive/20"
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleOpenPaymentModal} className="space-y-6">
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
                aria-label="Customer name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-xs font-semibold text-slate-700">
                Phone Number <span className="text-muted-foreground font-normal">(for ready SMS/alerts)</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="rounded-xl text-sm"
                aria-label="Phone number"
              />
            </div>
          </div>

          {/* GPREC Faculty / Staff Fast-Track Priority Option */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isFaculty
              ? 'bg-amber-50/90 border-amber-300 ring-2 ring-amber-400/40 shadow-sm'
              : 'bg-slate-50 border-slate-200 hover:border-slate-300'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl mt-0.5 ${
                  isFaculty ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-200 text-slate-600'
                }`}>
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-slate-900">
                      GPREC Faculty & Staff Member
                    </span>
                    {isFaculty && (
                      <Badge className="bg-amber-500 text-white text-[10px] font-black border-0 uppercase tracking-wide flex items-center gap-1">
                        <Zap className="h-3 w-3 fill-white" /> Priority Queue
                      </Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Fast-track kitchen preparation for professors & college staff on tight schedules.
                  </p>
                </div>
              </div>

              <input
                type="checkbox"
                id="faculty-checkbox"
                checked={isFaculty}
                onChange={(e) => setIsFaculty(e.target.checked)}
                className="h-5 w-5 rounded-lg border-slate-300 text-amber-600 focus:ring-amber-500 mt-1 cursor-pointer accent-amber-500"
                aria-label="Toggle GPREC Faculty or Staff priority order"
              />
            </div>

            {isFaculty && (
              <div className="mt-3 pt-3 border-t border-amber-200/80 space-y-2 animate-in fade-in-50">
                <Label className="text-[11px] font-bold text-amber-900 block">
                  Select Faculty / Department:
                </Label>
                <div className="flex flex-wrap gap-1.5">
                  {DEPARTMENTS.map((dept) => (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => setFacultyDept(dept)}
                      className={`text-xs px-3 py-1 rounded-xl font-bold transition-all ${
                        facultyDept === dept
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-amber-200 hover:bg-amber-100/50'
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Payment Methods */}
        <Card className="rounded-3xl border border-slate-200/80 shadow-xs bg-white p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 border-b pb-3">
            2. Choose Payment Mode
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="radiogroup" aria-label="Payment Method">
            {/* UPI */}
            <div
              role="radio"
              aria-checked={paymentMethod === 'UPI'}
              tabIndex={0}
              onClick={() => setPaymentMethod('UPI')}
              onKeyDown={(e) => e.key === 'Enter' && setPaymentMethod('UPI')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 focus-visible:ring-2 focus-visible:ring-primary ${
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
              role="radio"
              aria-checked={paymentMethod === 'CASH'}
              tabIndex={0}
              onClick={() => setPaymentMethod('CASH')}
              onKeyDown={(e) => e.key === 'Enter' && setPaymentMethod('CASH')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 focus-visible:ring-2 focus-visible:ring-primary ${
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
              role="radio"
              aria-checked={paymentMethod === 'CARD'}
              tabIndex={0}
              onClick={() => setPaymentMethod('CARD')}
              onKeyDown={(e) => e.key === 'Enter' && setPaymentMethod('CARD')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 focus-visible:ring-2 focus-visible:ring-primary ${
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

          {/* UPI Preview Simulation Box */}
          {paymentMethod === 'UPI' && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50/90 to-amber-50/90 border border-orange-200/80 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left animate-in fade-in-50">
              <div className="bg-white p-3 rounded-xl border shadow-xs flex items-center justify-center">
                <QrCode className="h-16 w-16 text-slate-900" />
              </div>
              <div className="space-y-1">
                <div className="font-bold text-xs text-slate-900 flex items-center justify-center sm:justify-start gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" /> PayCat / UPI Gateway Sandbox
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Order amount of <strong className="text-slate-900">₹{total.toFixed(2)}</strong> will be verified automatically.
                </p>
                <div className="text-[10px] text-emerald-700 font-semibold flex items-center justify-center sm:justify-start gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Live Sandbox Testing Enabled
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
            {isFaculty && (
              <div className="flex justify-between text-xs font-bold text-amber-700 bg-amber-50 p-2 rounded-xl">
                <span>Priority Service:</span>
                <span>⭐ GPREC Faculty Fast-Track</span>
              </div>
            )}
            <div className="border-t pt-3 flex justify-between items-center text-lg font-bold text-slate-900">
              <span>Grand Total</span>
              <span className="text-2xl font-extrabold text-primary">₹{total.toFixed(2)}</span>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            aria-label={`Proceed to pay ${total.toFixed(2)} rupees`}
            className="w-full bg-primary hover:bg-primary/90 text-white font-extrabold h-14 rounded-2xl text-lg shadow-xl flex items-center justify-center gap-2 mt-4 transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> Authorizing Order...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" aria-hidden="true" /> Proceed to Pay &bull; ₹{total.toFixed(2)}
              </>
            )}
          </Button>
        </Card>
      </form>

      {/* PayCat / UPI Sandbox Modal */}
      <PaymentGatewayModal
        isOpen={isPaymentModalOpen}
        amount={total}
        paymentMethod={paymentMethod}
        onSuccess={handleExecuteOrderPlacement}
        onFailure={(reason) => {
          setIsPaymentModalOpen(false);
          setErrorMessage(`Payment Failed: ${reason}`);
        }}
        onCancel={() => setIsPaymentModalOpen(false)}
      />
    </div>
  );
}
