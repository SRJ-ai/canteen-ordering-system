'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, UtensilsCrossed } from 'lucide-react';

export function CartDrawer() {
  const router = useRouter();
  const { items, itemCount, subtotal, tax, total, updateQuantity, removeItem, clearCart, isCartOpen, setIsCartOpen, tableInfo } = useCart();

  return (
    <>
      {/* Floating cart bar */}
      {itemCount > 0 && !isCartOpen && (
        <div className="fixed bottom-4 left-0 right-0 z-40 mx-auto max-w-lg px-4 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center justify-between rounded-xl border border-ink/20 bg-ink p-4 text-background shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="numeric flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-sm">
                {itemCount}
              </div>
              <div>
                <div className="numeric text-base font-bold">₹{total.toFixed(2)}</div>
                <div className="text-xs text-background/60">Includes 5% GST</div>
              </div>
            </div>
            <Button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-5 py-2 font-semibold"
            >
              View cart <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Slide-over cart */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="flex w-full flex-col justify-between overflow-hidden bg-background p-6 sm:max-w-md">
          <SheetHeader className="border-b border-border pb-4 text-left">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2 font-display text-xl font-bold text-ink">
                <ShoppingBag className="h-5 w-5 text-primary-deep" /> Your tray
              </SheetTitle>
              {items.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearCart} className="text-xs text-muted-foreground hover:text-chutney">
                  Clear
                </Button>
              )}
            </div>
            <SheetDescription className="flex items-center gap-2 pt-1 text-xs">
              <span className="inline-block h-2 w-2 rounded-full bg-primary motion-safe:animate-pulse"></span>
              {tableInfo?.tableNumber ? `Ordering for ${tableInfo.tableNumber}` : 'Dine-in / quick order'}
            </SheetDescription>
          </SheetHeader>

          {/* Items */}
          <div className="flex-1 space-y-4 overflow-y-auto py-4 pr-1">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center space-y-3 p-8 text-center">
                <div className="rounded-full bg-primary/15 p-4 text-primary-deep">
                  <UtensilsCrossed className="h-10 w-10" />
                </div>
                <div className="font-display text-lg font-bold text-ink">Your tray is empty</div>
                <p className="max-w-[200px] text-xs text-muted-foreground">
                  Explore the canteen specials and add your favourites to get started.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="space-y-2 rounded-lg border border-border bg-card p-3.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-display text-sm font-bold text-ink">{item.name}</div>
                      <div className="numeric text-xs font-semibold text-primary-deep">
                        ₹{(item.basePrice + item.addons.reduce((s, a) => s + a.price, 0)).toFixed(2)} each
                      </div>
                    </div>
                    <div className="numeric text-sm font-bold text-ink">
                      ₹{item.itemTotalPrice.toFixed(2)}
                    </div>
                  </div>

                  {item.addons.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {item.addons.map((a) => (
                        <Badge key={a.id} variant="secondary" className="border border-border bg-secondary text-[10px] font-normal text-ink">
                          +{a.name} (<span className="numeric">₹{a.price}</span>)
                        </Badge>
                      ))}
                    </div>
                  )}

                  {item.notes && (
                    <div className="rounded border border-dashed border-border bg-secondary/60 p-1.5 text-[11px] italic text-muted-foreground">
                      Note: &ldquo;{item.notes}&rdquo;
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-chutney"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                    <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-1 shadow-sm">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="rounded p-1 text-ink hover:bg-secondary"
                        aria-label="Remove one"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="numeric min-w-[20px] text-center text-xs font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="rounded p-1 text-ink hover:bg-secondary"
                        aria-label="Add one"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bill */}
          {items.length > 0 && (
            <SheetFooter className="flex-col space-y-3 border-t border-border pt-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Item subtotal</span>
                  <span className="numeric">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>GST (5%)</span>
                  <span className="numeric">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Service / packaging</span>
                  <span className="font-semibold text-leaf">FREE</span>
                </div>
                <div className="flex justify-between border-t border-border pt-1 text-base font-bold text-ink">
                  <span>Grand total</span>
                  <span className="numeric text-lg font-extrabold text-primary-deep">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={() => {
                  setIsCartOpen(false);
                  router.push('/checkout');
                }}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg text-base font-bold shadow-sm"
              >
                Proceed to checkout <ArrowRight className="h-4 w-4" />
              </Button>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
