'use client';

import React from 'react';
import Link from 'next/navigation';
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
      {/* Floating Bottom Cart Bar for Mobile & Desktop when items > 0 */}
      {itemCount > 0 && !isCartOpen && (
        <div className="fixed bottom-4 left-0 right-0 z-40 px-4 max-w-lg mx-auto animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between border border-slate-800 backdrop-blur-md bg-opacity-95">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-white font-bold h-10 w-10 rounded-xl flex items-center justify-center text-sm shadow-md">
                {itemCount}
              </div>
              <div>
                <div className="font-bold text-base">₹{total.toFixed(2)}</div>
                <div className="text-xs text-slate-400">Includes 5% GST</div>
              </div>
            </div>
            <Button
              onClick={() => setIsCartOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl px-5 py-2 flex items-center gap-2 shadow-lg"
            >
              View Cart <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Slide-Over Cart Sheet */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="w-full sm:max-w-md flex flex-col justify-between p-6 bg-white overflow-hidden">
          <SheetHeader className="text-left pb-4 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl font-bold flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" /> Your Cart
              </SheetTitle>
              {items.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearCart} className="text-xs text-muted-foreground hover:text-destructive">
                  Clear
                </Button>
              )}
            </div>
            <SheetDescription className="text-xs flex items-center gap-2 pt-1">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              {tableInfo?.tableNumber ? `Ordering for ${tableInfo.tableNumber}` : 'Dine-In / Quick Order'}
            </SheetDescription>
          </SheetHeader>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                <div className="bg-orange-50 p-4 rounded-full text-primary">
                  <UtensilsCrossed className="h-10 w-10" />
                </div>
                <div className="font-bold text-lg text-slate-800">Your cart is empty</div>
                <p className="text-xs text-muted-foreground max-w-[200px]">
                  Explore delicious canteen specials and add your favorites to get started.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-sm text-slate-900">{item.name}</div>
                      <div className="text-xs font-semibold text-primary">
                        ₹{(item.basePrice + item.addons.reduce((s, a) => s + a.price, 0)).toFixed(2)} each
                      </div>
                    </div>
                    <div className="font-bold text-sm text-slate-900">
                      ₹{item.itemTotalPrice.toFixed(2)}
                    </div>
                  </div>

                  {/* Addons List */}
                  {item.addons.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {item.addons.map((a) => (
                        <Badge key={a.id} variant="secondary" className="text-[10px] bg-white border font-normal">
                          +{a.name} (₹{a.price})
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Cooking Note */}
                  {item.notes && (
                    <div className="text-[11px] text-muted-foreground italic bg-white p-1.5 rounded border border-dashed">
                      Note: &ldquo;{item.notes}&rdquo;
                    </div>
                  )}

                  {/* Quantity Actions */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                    <div className="flex items-center gap-2 bg-white rounded-lg border p-1 shadow-sm">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded hover:bg-slate-100 text-slate-600"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="font-bold text-xs min-w-[20px] text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded hover:bg-slate-100 text-slate-600"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bill Summary & Checkout */}
          {items.length > 0 && (
            <SheetFooter className="border-t pt-4 flex-col space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Item Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>GST (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Service / Packaging</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 pt-1 border-t">
                  <span>Grand Total</span>
                  <span className="text-primary font-extrabold text-lg">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={() => {
                  setIsCartOpen(false);
                  router.push('/checkout');
                }}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl text-base shadow-xl flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </Button>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
