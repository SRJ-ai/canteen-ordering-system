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
      <DialogContent className="sm:max-w-md p-6 bg-white max-h-[90vh] flex flex-col justify-between overflow-hidden">
        <DialogHeader className="text-left pb-3 border-b">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="veg-indicator"><span className="veg-indicator-dot"></span></span>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  {item.categories?.name || 'Canteen Special'}
                </span>
              </div>
              <DialogTitle className="text-xl font-bold text-slate-900">{item.name}</DialogTitle>
            </div>
            <div className="text-xl font-extrabold text-slate-900">₹{item.base_price}</div>
          </div>
          {item.description && (
            <DialogDescription className="text-xs text-muted-foreground pt-1 line-clamp-2">
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
                  <h4 className="font-bold text-sm text-slate-800">{addonGroup.name}</h4>
                  <span className="text-[11px] text-muted-foreground">Optional</span>
                </div>
                <div className="space-y-2">
                  {addonGroup.menu_item_addon_options?.map((option) => {
                    const isSelected = selectedAddons.some((a) => a.id === option.id);
                    return (
                      <div
                        key={option.id}
                        onClick={() => handleAddonToggle(option)}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-orange-50/80 border-primary shadow-sm text-slate-900'
                            : 'bg-slate-50/50 hover:bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                              isSelected ? 'bg-primary border-primary text-white' : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                          </div>
                          <span className="text-sm font-medium">{option.name}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-800">
                          +₹{Number(option.price_adjustment).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-xs text-muted-foreground bg-slate-50 p-3 rounded-lg border text-center">
              No extra add-ons available for this item. You can add cooking instructions below.
            </div>
          )}

          {/* Cooking Instructions Note */}
          <div className="space-y-2">
            <Label htmlFor="custom-notes" className="text-xs font-bold text-slate-800">
              Special Instructions for Kitchen
            </Label>
            <Input
              id="custom-notes"
              placeholder="e.g. Less spicy, extra crispy, no onion..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="text-xs rounded-xl"
            />
          </div>
        </div>

        {/* Footer with Quantity & Add Button */}
        <DialogFooter className="border-t pt-4 flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1.5 border">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="font-bold text-sm min-w-[24px] text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <Button
            onClick={handleConfirm}
            className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold h-11 rounded-xl shadow-md flex items-center justify-between px-4"
          >
            <span>Add Item</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
