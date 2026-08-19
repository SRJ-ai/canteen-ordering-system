'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { placeOrderAction } from '@/features/orders/order.actions';
import { PaymentGatewayModal } from '@/components/customer/PaymentGatewayModal';
import { Card } from '@/components/ui/card';
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
      <div className="mx-auto max-w-md space-y-3 py-24 text-center" role="status" aria-live="polite">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary-deep" aria-hidden="true" />
        <p className="text-xs font-medium text-muted-foreground">Preparing your order summary...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md space-y-4 px-4 py-12 text-center">
        <h2 className="font-display text-xl font-bold text-ink">No items to checkout</h2>
        <p className="text-xs text-muted-foreground">Your tray is currently empty.</p>
        <Link href="/menu">
          <Button className="rounded-lg font-bold">Go to menu</Button>
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
      try {
        const existingOrders = JSON.parse(localStorage.getItem('canteen_my_orders') || '[]');
        if (!existingOrders.includes(res.orderId)) {
          existingOrders.unshift(res.orderId);
          localStorage.setItem('canteen_my_orders', JSON.stringify(existingOrders.slice(0, 50)));
        }
      } catch (e) {}

      clearCart();
      router.push(`/orders/?id=${res.orderId}`);
    } else {
      setErrorMessage(res.error || 'Failed to place order. Please try again.');
    }
  };

  const payOptions: { key: typeof paymentMethod; icon: React.ReactNode; title: string; sub: string; tag?: string }[] = [
    { key: 'UPI', icon: <QrCode className="h-6 w-6" />, title: 'UPI instant', sub: 'GPay, PhonePe, Paytm', tag: 'Fastest' },
    { key: 'CASH', icon: <Banknote className="h-6 w-6" />, title: 'Cash at counter', sub: 'Pay when picking up' },
    { key: 'CARD', icon: <CreditCard className="h-6 w-6" />, title: 'Cards / POS', sub: 'Swipe or tap card' },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Checkout and pay
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Complete your details and choose a payment mode.
          </p>
        </div>
        <Link href="/cart">
          <Button variant="outline" size="sm" className="rounded-lg border-ink/15 bg-card text-xs text-ink hover:bg-secondary" aria-label="Return to edit cart">
            <ArrowLeft className="mr-1 h-3.5 w-3.5" aria-hidden="true" /> Edit tray
          </Button>
        </Link>
      </header>

      {errorMessage && (
        <div role="alert" className="rounded-lg border border-chutney/30 bg-chutney/10 p-4 text-xs font-semibold text-chutney">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleOpenPaymentModal} className="space-y-6">
        {/* Details */}
        <Card className="tray-card space-y-4 p-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-display text-sm font-bold text-ink">1. Dining and contact details</h3>
            <Badge variant="secondary" className="border border-border bg-secondary text-xs font-bold text-ink">
              {tableInfo?.tableNumber || 'Table 01 (auto)'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-ink">
                Your name <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g. Rahul Sharma"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="h-11 rounded-lg text-sm"
                aria-label="Customer name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-ink">
                Phone <span className="font-normal text-muted-foreground">(for ready alerts)</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="h-11 rounded-lg text-sm"
                aria-label="Phone number"
              />
            </div>
          </div>

          {/* Faculty fast-track */}
          <div className={`rounded-lg border p-4 transition-all ${
            isFaculty
              ? 'border-primary bg-primary/10 ring-1 ring-primary/40'
              : 'border-border bg-card hover:border-ink/20'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 rounded-lg p-2 ${
                  isFaculty ? 'bg-primary text-primary-foreground' : 'bg-secondary text-steel'
                }`}>
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-xs font-extrabold text-ink">
                      GPREC faculty or staff
                    </span>
                    {isFaculty && (
                      <Badge className="flex items-center gap-1 border-0 bg-primary text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                        <Zap className="h-3 w-3 fill-current" /> Priority queue
                      </Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Fast-track kitchen prep for professors and staff on tight schedules.
                  </p>
                </div>
              </div>

              <input
                type="checkbox"
                id="faculty-checkbox"
                checked={isFaculty}
                onChange={(e) => setIsFaculty(e.target.checked)}
                className="mt-1 h-5 w-5 cursor-pointer rounded-md accent-primary"
                aria-label="Toggle GPREC faculty or staff priority order"
              />
            </div>

            {isFaculty && (
              <div className="mt-3 space-y-2 border-t border-primary/20 pt-3 animate-in fade-in-50">
                <Label className="block text-[11px] font-bold text-primary-deep">
                  Select faculty / department
                </Label>
                <div className="flex flex-wrap gap-1.5">
                  {DEPARTMENTS.map((dept) => (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => setFacultyDept(dept)}
                      className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                        facultyDept === dept
                          ? 'bg-primary text-primary-foreground'
                          : 'border border-primary/25 bg-card text-ink hover:bg-primary/5'
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

        {/* Payment */}
        <Card className="tray-card space-y-4 p-6">
          <h3 className="border-b border-border pb-3 font-display text-sm font-bold text-ink">
            2. Choose payment mode
          </h3>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Payment method">
            {payOptions.map((opt) => {
              const active = paymentMethod === opt.key;
              return (
                <div
                  key={opt.key}
                  role="radio"
                  aria-checked={active}
                  tabIndex={0}
                  onClick={() => setPaymentMethod(opt.key)}
                  onKeyDown={(e) => e.key === 'Enter' && setPaymentMethod(opt.key)}
                  className={`flex cursor-pointer flex-col justify-between space-y-2 rounded-lg border p-4 transition-all focus-visible:ring-2 focus-visible:ring-primary ${
                    active
                      ? 'border-primary bg-primary/10 text-ink ring-1 ring-primary'
                      : 'border-border bg-card text-ink hover:bg-secondary'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={active ? 'text-primary-deep' : 'text-steel'}>{opt.icon}</span>
                    {opt.tag && (
                      <span className="rounded bg-leaf/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-leaf">
                        {opt.tag}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{opt.title}</div>
                    <div className="text-[11px] text-muted-foreground">{opt.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* UPI sandbox preview */}
          {paymentMethod === 'UPI' && (
            <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-secondary/60 p-4 text-center sm:flex-row sm:text-left animate-in fade-in-50">
              <div className="flex items-center justify-center rounded-lg border border-border bg-card p-3">
                <QrCode className="h-16 w-16 text-ink" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1.5 font-display text-xs font-bold text-ink sm:justify-start">
                  <ShieldCheck className="h-4 w-4 text-leaf" /> PayCat / UPI gateway sandbox
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Order amount of <strong className="numeric text-ink">₹{total.toFixed(2)}</strong> will be verified automatically.
                </p>
                <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-leaf sm:justify-start">
                  <CheckCircle2 className="h-3 w-3" /> Live sandbox testing enabled
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Summary + submit */}
        <Card role="region" aria-label="Final order summary" className="tray-card space-y-4 p-6">
          <h3 className="border-b border-border pb-3 font-display text-sm font-bold text-ink">3. Final summary</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span><span className="numeric">{items.reduce((s, i) => s + i.quantity, 0)}</span> items total</span>
              <span className="numeric text-ink">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (5%)</span>
              <span className="numeric text-ink">₹{tax.toFixed(2)}</span>
            </div>
            {isFaculty && (
              <div className="flex items-center justify-between rounded-lg bg-primary/10 p-2 text-xs font-bold text-primary-deep">
                <span>Priority service</span>
                <span className="flex items-center gap-1"><Zap className="h-3 w-3 fill-current" /> Faculty fast-track</span>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-border pt-3 text-lg font-bold text-ink">
              <span>Grand total</span>
              <span className="numeric text-2xl font-extrabold text-primary-deep">₹{total.toFixed(2)}</span>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            aria-label={`Proceed to pay ${total.toFixed(2)} rupees`}
            className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-lg text-lg font-extrabold shadow-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> Authorizing order...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" aria-hidden="true" /> Proceed to pay <span className="numeric">₹{total.toFixed(2)}</span>
              </>
            )}
          </Button>
        </Card>
      </form>

      <PaymentGatewayModal
        isOpen={isPaymentModalOpen}
        amount={total}
        paymentMethod={paymentMethod}
        onSuccess={handleExecuteOrderPlacement}
        onFailure={(reason) => {
          setIsPaymentModalOpen(false);
          setErrorMessage(`Payment failed: ${reason}`);
        }}
        onCancel={() => setIsPaymentModalOpen(false)}
      />
    </div>
  );
}
