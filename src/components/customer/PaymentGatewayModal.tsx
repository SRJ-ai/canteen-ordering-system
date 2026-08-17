'use client';

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Smartphone,
  CreditCard,
  Banknote,
  Loader2,
  Sparkles,
  AlertTriangle,
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onCancel(); }}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px] uppercase font-mono font-bold">
              PayCat Sandbox &bull; GPREC Food Court
            </Badge>
            <div className="text-xs font-mono text-amber-400 flex items-center gap-1 font-bold">
              <Clock className="h-3.5 w-3.5" /> {formatTimer(secondsLeft)}
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <h3 className="text-xl font-extrabold tracking-tight">
              {paymentMethod === 'UPI' ? 'Scan & Pay UPI' : paymentMethod === 'CARD' ? 'Card / POS Payment' : 'Pay at Counter'}
            </h3>
            <span className="text-2xl font-black text-emerald-400">₹{amount.toFixed(2)}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {status === 'PROCESSING' && (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
              <h4 className="text-base font-bold text-slate-800">Processing Payment Verification...</h4>
              <p className="text-xs text-muted-foreground">Communicating with banking node & Supabase ledger.</p>
            </div>
          )}

          {status === 'SUCCESS' && (
            <div className="py-10 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-extrabold text-emerald-800">Payment Authorized!</h4>
              <p className="text-xs text-muted-foreground">Redirecting to live kitchen tracker...</p>
            </div>
          )}

          {status === 'FAILED' && (
            <div className="py-10 text-center space-y-3">
              <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
                <XCircle className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-extrabold text-rose-800">Payment Failed</h4>
              <p className="text-xs text-muted-foreground">Transaction was declined or cancelled.</p>
            </div>
          )}

          {status === 'PENDING' && (
            <>
              {paymentMethod === 'UPI' && (
                <div className="space-y-4">
                  {/* QR Code Container */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-col items-center justify-center space-y-2">
                    <div className="bg-white p-3 rounded-xl shadow-xs border">
                      <QRCodeSVG value={upiUri} size={150} level="H" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 font-semibold">
                      gprec.canteen@okhdfcbank
                    </span>
                  </div>

                  {/* App Switchers */}
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveApp('GPAY')}
                      className={`text-xs rounded-xl font-bold ${activeApp === 'GPAY' ? 'border-primary bg-orange-50 text-primary ring-1 ring-primary' : ''}`}
                    >
                      Google Pay
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveApp('PHONEPE')}
                      className={`text-xs rounded-xl font-bold ${activeApp === 'PHONEPE' ? 'border-primary bg-orange-50 text-primary ring-1 ring-primary' : ''}`}
                    >
                      PhonePe
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveApp('PAYTM')}
                      className={`text-xs rounded-xl font-bold ${activeApp === 'PAYTM' ? 'border-primary bg-orange-50 text-primary ring-1 ring-primary' : ''}`}
                    >
                      Paytm
                    </Button>
                  </div>
                </div>
              )}

              {paymentMethod === 'CASH' && (
                <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200 text-center space-y-2">
                  <Banknote className="h-10 w-10 text-amber-600 mx-auto" />
                  <h4 className="font-bold text-sm text-amber-900">Cash Payment at Delivery Counter</h4>
                  <p className="text-xs text-amber-700">
                    Your order ticket will be dispatched to the kitchen immediately. Please have ₹{amount.toFixed(2)} ready at pickup.
                  </p>
                </div>
              )}

              {paymentMethod === 'CARD' && (
                <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200 text-center space-y-2">
                  <CreditCard className="h-10 w-10 text-blue-600 mx-auto" />
                  <h4 className="font-bold text-sm text-blue-900">Campus Debit Card / RFID Swipe</h4>
                  <p className="text-xs text-blue-700">
                    Swipe your Student ID or Banking Card on the POS reader at the counter.
                  </p>
                </div>
              )}

              {/* Testing Sandbox Trigger Controls */}
              <div className="p-4 bg-slate-900 rounded-2xl text-white space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> PayCat Testing Sandbox Controls:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    onClick={handleSimulateSuccess}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md"
                  >
                    ⚡ Simulate Success
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSimulateFailure('Insufficient funds on test account')}
                    className="bg-slate-800 hover:bg-rose-950 text-rose-300 border-slate-700 hover:border-rose-500/50 rounded-xl text-xs font-bold"
                  >
                    ❌ Simulate Decline
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
