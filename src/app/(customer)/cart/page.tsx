'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Plus, Minus, ArrowRight, ArrowLeft, UtensilsCrossed } from 'lucide-react';

export default function CartPage() {
  const { items, itemCount, subtotal, tax, total, updateQuantity, clearCart, tableInfo, isLoaded } = useCart();

  if (!isLoaded) {
    return (
      <div className="mx-auto max-w-md py-24 text-center text-xs font-medium text-muted-foreground">
        Loading your tray...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md space-y-4 px-4 py-12 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 text-primary-deep">
          <UtensilsCrossed className="h-10 w-10" />
        </div>
        <h1 className="font-display text-2xl font-extrabold text-ink">Your tray is empty</h1>
        <p className="text-sm text-muted-foreground">
          You haven&rsquo;t added any dishes yet. Browse the canteen specials to get started.
        </p>
        <Link href="/menu">
          <Button className="mt-2 rounded-lg px-6 font-bold">Browse the menu</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            <ShoppingBag className="h-7 w-7 text-primary-deep" /> Review your order
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            {tableInfo?.tableNumber ? `Dine-in at ${tableInfo.tableNumber}` : 'Quick counter pickup'}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={clearCart} className="text-xs text-muted-foreground hover:text-chutney">
          Clear tray
        </Button>
      </div>

      {/* Items */}
      <Card className="tray-card overflow-hidden">
        <CardHeader className="border-b border-border bg-secondary/60 px-6 py-3.5">
          <CardTitle className="flex items-center justify-between font-display text-sm font-bold text-ink">
            <span>Selected items (<span className="numeric">{itemCount}</span>)</span>
            <Link href="/menu" className="flex items-center gap-1 text-xs font-semibold text-primary-deep hover:underline">
              <Plus className="h-3 w-3" /> Add more
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border p-6">
          {items.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="veg-indicator"><span className="veg-indicator-dot"></span></span>
                  <span className="font-display text-sm font-bold text-ink">{item.name}</span>
                </div>
                <div className="numeric text-xs font-semibold text-primary-deep">
                  ₹{(item.basePrice + item.addons.reduce((s, a) => s + a.price, 0)).toFixed(2)} each
                </div>

                {item.addons.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.addons.map((a) => (
                      <Badge key={a.id} variant="secondary" className="border border-border bg-secondary text-[10px] text-ink">
                        +{a.name} (<span className="numeric">₹{a.price}</span>)
                      </Badge>
                    ))}
                  </div>
                )}

                {item.notes && (
                  <p className="rounded-lg border border-dashed border-border bg-secondary/60 p-2 text-xs italic text-muted-foreground">
                    &ldquo;{item.notes}&rdquo;
                  </p>
                )}
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="numeric text-sm font-extrabold text-ink">
                  ₹{item.itemTotalPrice.toFixed(2)}
                </span>
                <div className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary p-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="rounded-md p-1 text-ink transition hover:bg-card"
                    aria-label="Remove one"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="numeric min-w-[20px] text-center text-xs font-bold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="rounded-md p-1 text-ink transition hover:bg-card"
                    aria-label="Add one"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Bill */}
      <Card className="tray-card space-y-3 p-6">
        <h3 className="font-display text-sm font-bold text-ink">Bill breakdown</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>Item subtotal</span>
            <span className="numeric font-medium text-ink">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>GST (5%)</span>
            <span className="numeric font-medium text-ink">₹{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Packaging</span>
            <span className="font-semibold text-leaf">FREE</span>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3 text-base font-bold text-ink">
            <span>To pay</span>
            <span className="numeric text-2xl font-extrabold text-primary-deep">₹{total.toFixed(2)}</span>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <Link href="/menu" className="w-1/3">
          <Button variant="outline" className="h-12 w-full rounded-lg border-ink/15 bg-card text-sm font-semibold text-ink hover:bg-secondary">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
          </Button>
        </Link>
        <Link href="/checkout" className="w-2/3">
          <Button className="flex h-12 w-full items-center justify-center gap-2 rounded-lg text-base font-bold shadow-sm">
            Proceed to payment <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
