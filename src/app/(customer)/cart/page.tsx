'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, ArrowLeft, UtensilsCrossed } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { items, itemCount, subtotal, tax, total, updateQuantity, removeItem, clearCart, tableInfo, isLoaded } = useCart();

  if (!isLoaded) {
    return (
      <div className="max-w-md mx-auto py-24 text-center text-xs text-muted-foreground font-medium">
        Loading cart items...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center space-y-4">
        <div className="bg-orange-50 text-primary w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <UtensilsCrossed className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Your Cart is Empty</h1>
        <p className="text-sm text-muted-foreground">
          You haven&apos;t added any delicious food items to your cart yet.
        </p>
        <Link href="/menu">
          <Button className="mt-2 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl px-6">
            Browse Menu Specials
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="h-7 w-7 text-primary" /> Review Your Order
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {tableInfo?.tableNumber ? `Dine-in at ${tableInfo.tableNumber}` : 'Quick Counter Pickup'}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={clearCart} className="text-xs text-muted-foreground hover:text-destructive">
          Clear Cart
        </Button>
      </div>

      {/* Items list */}
      <Card className="rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-3.5 px-6">
          <CardTitle className="text-sm font-bold text-slate-800 flex items-center justify-between">
            <span>Selected Items ({itemCount})</span>
            <Link href="/menu" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
              <Plus className="h-3 w-3" /> Add more items
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 divide-y divide-slate-100">
          {items.map((item) => (
            <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="veg-indicator"><span className="veg-indicator-dot"></span></span>
                  <span className="font-bold text-sm text-slate-900">{item.name}</span>
                </div>
                <div className="text-xs font-semibold text-primary">
                  ₹{(item.basePrice + item.addons.reduce((s, a) => s + a.price, 0)).toFixed(2)} each
                </div>

                {item.addons.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.addons.map((a) => (
                      <Badge key={a.id} variant="secondary" className="text-[10px] bg-slate-100 text-slate-700">
                        +{a.name} (₹{a.price})
                      </Badge>
                    ))}
                  </div>
                )}

                {item.notes && (
                  <p className="text-xs text-muted-foreground italic bg-slate-50 p-2 rounded-lg border border-dashed border-slate-200">
                    &ldquo;{item.notes}&rdquo;
                  </p>
                )}
              </div>

              {/* Quantity Controls & Subtotal */}
              <div className="flex flex-col items-end gap-2">
                <span className="font-extrabold text-sm text-slate-900">
                  ₹{item.itemTotalPrice.toFixed(2)}
                </span>
                <div className="flex items-center gap-1.5 bg-slate-100 rounded-xl p-1 border">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 rounded-lg hover:bg-white text-slate-600 transition"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="font-bold text-xs min-w-[20px] text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 rounded-lg hover:bg-white text-slate-600 transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Bill Breakdown */}
      <Card className="rounded-3xl border border-slate-200/80 shadow-xs bg-white p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-800">Bill Breakdown</h3>
        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex justify-between">
            <span>Item Subtotal</span>
            <span className="font-medium text-slate-900">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>GST (5%)</span>
            <span className="font-medium text-slate-900">₹{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery / Packaging</span>
            <span className="font-medium text-emerald-600">FREE</span>
          </div>
          <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-base font-bold text-slate-900">
            <span>To Pay</span>
            <span className="text-2xl font-extrabold text-primary">₹{total.toFixed(2)}</span>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <Link href="/menu" className="w-1/3">
          <Button variant="outline" className="w-full rounded-2xl h-12 text-sm font-semibold">
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
          </Button>
        </Link>
        <Link href="/checkout" className="w-2/3">
          <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl h-12 text-base shadow-lg flex items-center justify-center gap-2">
            Proceed to Payment <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
