'use client';

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  XCircle,
  Clock,
  CreditCard,
  Banknote,
  Loader2,
  Sparkles,
  Check,
  X,
} from 'lucide-react';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  amount: number;
  paymentMethod: 'UPI' | 'CASH' | 'CARD';
  orderId?: string;
  onSuccess: () => void;
  onFailure: (reason: string) => void;
  onCancel: () => void;
}

export function PaymentGatewayModal({
  isOpen,
  amount,
  paymentMethod,
  orderId,
  onSuccess,
  onFailure,
  onCancel,
}: PaymentGatewayModalProps) {
  const [status, setStatus] = useState<'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED'>('PENDING');
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 mins countdown
  const [activeApp, setActiveApp] = useState<'GPAY' | 'PHONEPE' | 'PAYTM'>('GPAY');

  useEffect(() => {
    if (!isOpen) {
      setStatus('PENDING');
      setSecondsLeft(300);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setStatus('FAILED');
          onFailure('Payment session expired after 5 minutes.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onFailure]);

  const handleSimulateSuccess = () => {
    setStatus('PROCESSING');
    setTimeout(() => {
      setStatus('SUCCESS');
      setTimeout(() => {
        onSuccess();
      }, 1000);
    }, 1200);
  };

  const handleSimulateFailure = (reason: string) => {
    setStatus('PROCESSING');
    setTimeout(() => {
      setStatus('FAILED');
      setTimeout(() => {
        onFailure(reason);
      }, 1000);
    }, 1000);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const upiUri = `upi://pay?pa=gprec.canteen@okhdfcbank&pn=GPREC_Food_Court&am=${amount.toFixed(2)}&cu=INR&tn=Order_${orderId || 'NEW'}`;

  const appButtons: { key: typeof activeApp; label: string }[] = [
    { key: 'GPAY', label: 'Google Pay' },
    { key: 'PHONEPE', label: 'PhonePe' },
    { key: 'PAYTM', label: 'Paytm' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onCancel(); }}>
      <DialogContent className="max-w-md overflow-hidden rounded-xl border border-border bg-background p-0">
        {/* Header */}
        <div className="space-y-2 bg-ink p-5 text-background">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="border-primary/40 bg-primary/15 text-[10px] font-bold uppercase text-primary-soft">
              PayCat Sandbox &middot; GPREC Food Court
            </Badge>
            <div className="numeric flex items-center gap-1 text-xs font-bold text-primary-soft">
              <Clock className="h-3.5 w-3.5" /> {formatTimer(secondsLeft)}
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <h3 className="font-display text-xl font-extrabold tracking-tight">
              {paymentMethod === 'UPI' ? 'Scan and pay UPI' : paymentMethod === 'CARD' ? 'Card / POS payment' : 'Pay at counter'}
            </h3>
            <span className="numeric text-2xl font-extrabold text-primary-soft">₹{amount.toFixed(2)}</span>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-5 p-6">
          {status === 'PROCESSING' && (
            <div className="space-y-3 py-12 text-center">
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary-deep" />
              <h4 className="text-base font-bold text-ink">Processing payment verification...</h4>
              <p className="text-xs text-muted-foreground">Communicating with banking node and ledger.</p>
            </div>
          )}

          {status === 'SUCCESS' && (
            <div className="space-y-3 py-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-leaf/15 text-leaf motion-safe:animate-bounce">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h4 className="font-display text-lg font-extrabold text-leaf">Payment authorized</h4>
              <p className="text-xs text-muted-foreground">Redirecting to live kitchen tracker...</p>
            </div>
          )}

          {status === 'FAILED' && (
            <div className="space-y-3 py-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-chutney/15 text-chutney">
                <XCircle className="h-8 w-8" />
              </div>
              <h4 className="font-display text-lg font-extrabold text-chutney">Payment failed</h4>
              <p className="text-xs text-muted-foreground">Transaction was declined or cancelled.</p>
            </div>
          )}

          {status === 'PENDING' && (
            <>
              {paymentMethod === 'UPI' && (
                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border border-border bg-secondary/60 p-4">
                    <div className="rounded-lg border border-border bg-card p-3">
                      <QRCodeSVG value={upiUri} size={150} level="H" />
                    </div>
                    <span className="numeric text-[11px] font-semibold text-muted-foreground">
                      gprec.canteen@okhdfcbank
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {appButtons.map((app) => (
                      <Button
                        key={app.key}
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveApp(app.key)}
                        className={`rounded-lg text-xs font-bold ${
                          activeApp === app.key
                            ? 'border-primary bg-primary/10 text-primary-deep ring-1 ring-primary'
                            : 'border-ink/15 bg-card text-ink hover:bg-secondary'
                        }`}
                      >
                        {app.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {paymentMethod === 'CASH' && (
                <div className="space-y-2 rounded-lg border border-primary/25 bg-primary/10 p-6 text-center">
                  <Banknote className="mx-auto h-10 w-10 text-primary-deep" />
                  <h4 className="font-display text-sm font-bold text-ink">Cash payment at pickup counter</h4>
                  <p className="text-xs text-muted-foreground">
                    Your ticket dispatches to the kitchen immediately. Please have <span className="numeric font-semibold text-ink">₹{amount.toFixed(2)}</span> ready at pickup.
                  </p>
                </div>
              )}

              {paymentMethod === 'CARD' && (
                <div className="space-y-2 rounded-lg border border-border bg-secondary/60 p-6 text-center">
                  <CreditCard className="mx-auto h-10 w-10 text-steel" />
                  <h4 className="font-display text-sm font-bold text-ink">Campus card / RFID swipe</h4>
                  <p className="text-xs text-muted-foreground">
                    Swipe your student ID or banking card on the POS reader at the counter.
                  </p>
                </div>
              )}

              {/* Sandbox controls */}
              <div className="space-y-2.5 rounded-lg bg-ink p-4 text-background">
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary-soft">
                  <Sparkles className="h-3 w-3" /> PayCat testing sandbox controls
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    onClick={handleSimulateSuccess}
                    className="rounded-lg bg-leaf text-xs font-bold text-white hover:bg-leaf/90"
                  >
                    <Check className="mr-1 h-3.5 w-3.5" /> Simulate success
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSimulateFailure('Insufficient funds on test account')}
                    className="rounded-lg border-white/15 bg-white/5 text-xs font-bold text-chutney hover:bg-chutney/10"
                  >
                    <X className="mr-1 h-3.5 w-3.5" /> Simulate decline
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
