'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Check } from 'lucide-react';
import { CartItemAddon } from '@/context/CartContext';

export interface MenuItemWithAddons {
  id: string;
  name: string;
  description?: string;
  base_price: number;
  category_id?: string;
  categories?: { name: string };
  menu_item_addons?: {
    id: string;
    name: string;
    is_multiple: boolean;
    is_required: boolean;
    menu_item_addon_options?: {
      id: string;
      name: string;
      price_adjustment: number;
    }[];
  }[];
}

interface ItemCustomizationModalProps {
  item: MenuItemWithAddons | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (configuredItem: {
    menuItemId: string;
    name: string;
    description?: string;
    basePrice: number;
    addons: CartItemAddon[];
    notes: string;
    quantity: number;
  }) => void;
}

export function ItemCustomizationModal({ item, isOpen, onClose, onAddToCart }: ItemCustomizationModalProps) {
  const [selectedAddons, setSelectedAddons] = useState<CartItemAddon[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  if (!item) return null;

  const handleAddonToggle = (addonOption: { id: string; name: string; price_adjustment: number }) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((a) => a.id === addonOption.id);
      if (exists) {
        return prev.filter((a) => a.id !== addonOption.id);
      } else {
        return [
          ...prev,
          {
            id: addonOption.id,
            name: addonOption.name,
            price: Number(addonOption.price_adjustment),
          },
        ];
      }
    });
  };

  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = Number(item.base_price) + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const handleConfirm = () => {
    onAddToCart({
      menuItemId: item.id,
      name: item.name,
      description: item.description,
      basePrice: Number(item.base_price),
      addons: selectedAddons,
      notes,
      quantity,
    });
    // Reset state and close
    setSelectedAddons([]);
    setQuantity(1);
    setNotes('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[90vh] flex-col justify-between overflow-hidden bg-background p-6 sm:max-w-md">
        <DialogHeader className="border-b border-border pb-3 text-left">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="veg-indicator"><span className="veg-indicator-dot"></span></span>
                <span className="text-xs font-bold uppercase tracking-wider text-chutney">
                  {item.categories?.name || 'Canteen special'}
                </span>
              </div>
              <DialogTitle className="font-display text-xl font-bold text-ink">{item.name}</DialogTitle>
            </div>
            <div className="numeric text-xl font-extrabold text-ink">₹{item.base_price}</div>
          </div>
          {item.description && (
            <DialogDescription className="line-clamp-2 pt-1 text-xs text-muted-foreground">
              {item.description}
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Scrollable Addons & Notes Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
          {/* Add-on Groups */}
          {item.menu_item_addons && item.menu_item_addons.length > 0 ? (
            item.menu_item_addons.map((addonGroup) => (
              <div key={addonGroup.id} className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-display text-sm font-bold text-ink">{addonGroup.name}</h4>
                  <span className="text-[11px] text-muted-foreground">Optional</span>
                </div>
                <div className="space-y-2">
                  {addonGroup.menu_item_addon_options?.map((option) => {
                    const isSelected = selectedAddons.some((a) => a.id === option.id);
                    return (
                      <div
                        key={option.id}
                        onClick={() => handleAddonToggle(option)}
                        className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/10 text-ink shadow-sm'
                            : 'border-border bg-card text-ink hover:bg-secondary'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded-md border transition-colors ${
                              isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background'
                            }`}
                          >
                            {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                          </div>
                          <span className="text-sm font-medium">{option.name}</span>
                        </div>
                        <span className="numeric text-xs font-bold text-ink">
                          +₹{Number(option.price_adjustment).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-border bg-secondary/60 p-3 text-center text-xs text-muted-foreground">
              No extra add-ons for this item. You can still add cooking instructions below.
            </div>
          )}

          {/* Cooking Instructions Note */}
          <div className="space-y-2">
            <Label htmlFor="custom-notes" className="text-xs font-bold text-ink">
              Special instructions for kitchen
            </Label>
            <Input
              id="custom-notes"
              placeholder="e.g. Less spicy, extra crispy, no onion"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="rounded-lg text-xs"
            />
          </div>
        </div>

        {/* Footer with Quantity & Add Button */}
        <DialogFooter className="flex flex-row items-center justify-between gap-4 border-t border-border pt-4">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary p-1.5">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="rounded-md p-1.5 text-ink transition hover:bg-card"
              aria-label="Remove one"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="numeric min-w-[24px] text-center text-sm font-bold">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="rounded-md p-1.5 text-ink transition hover:bg-card"
              aria-label="Add one"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <Button
            onClick={handleConfirm}
            className="flex h-11 flex-1 items-center justify-between rounded-lg px-4 font-bold shadow-sm"
          >
            <span>Add item</span>
            <span className="numeric">₹{totalPrice.toFixed(2)}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
