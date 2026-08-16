'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItemAddon {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string; // unique item cart identifier (includes addon hash)
  menuItemId: string;
  name: string;
  description?: string;
  basePrice: number;
  quantity: number;
  addons: CartItemAddon[];
  notes?: string;
  itemTotalPrice: number; // (basePrice + addons) * quantity
}

export interface TableInfo {
  id?: string;
  tableNumber?: string;
  canteenName?: string;
  sessionId?: string;
}

interface CartContextType {
  items: CartItem[];
  tableInfo: TableInfo | null;
  setTableInfo: (info: TableInfo | null) => void;
  addItem: (item: {
    menuItemId: string;
    name: string;
    description?: string;
    basePrice: number;
    addons?: CartItemAddon[];
    notes?: string;
    quantity?: number;
  }) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [tableInfo, setTableInfo] = useState<TableInfo | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('canteen_cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      const savedTable = localStorage.getItem('canteen_table_info');
      if (savedTable) {
        setTableInfo(JSON.parse(savedTable));
      }
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('canteen_cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  useEffect(() => {
    if (isLoaded && tableInfo) {
      localStorage.setItem('canteen_table_info', JSON.stringify(tableInfo));
    }
  }, [tableInfo, isLoaded]);

  const addItem = ({
    menuItemId,
    name,
    description,
    basePrice,
    addons = [],
    notes = '',
    quantity = 1,
  }: {
    menuItemId: string;
    name: string;
    description?: string;
    basePrice: number;
    addons?: CartItemAddon[];
    notes?: string;
    quantity?: number;
  }) => {
    const addonPrice = addons.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = basePrice + addonPrice;
    
    // Create deterministic ID based on menuItemId + sorted addons
    const addonKey = addons.map(a => a.id).sort().join('-');
    const cartItemId = `${menuItemId}_${addonKey}_${notes.trim()}`;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((i) => i.id === cartItemId);
      if (existingIndex > -1) {
        const newItems = [...prevItems];
        const newQty = newItems[existingIndex].quantity + quantity;
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newQty,
          itemTotalPrice: unitPrice * newQty,
        };
        return newItems;
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          menuItemId,
          name,
          description,
          basePrice,
          quantity,
          addons,
          notes,
          itemTotalPrice: unitPrice * quantity,
        };
        return [...prevItems, newItem];
      }
    });
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(cartItemId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === cartItemId) {
          const addonPrice = item.addons.reduce((sum, a) => sum + a.price, 0);
          const unitPrice = item.basePrice + addonPrice;
          return {
            ...item,
            quantity: newQuantity,
            itemTotalPrice: unitPrice * newQuantity,
          };
        }
        return item;
      })
    );
  };

  const removeItem = (cartItemId: string) => {
    setItems((prevItems) => prevItems.filter((i) => i.id !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('canteen_cart');
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.itemTotalPrice, 0);
  const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% GST
  const total = Math.round((subtotal + tax) * 100) / 100;

  return (
    <CartContext.Provider
      value={{
        items,
        tableInfo,
        setTableInfo,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        itemCount,
        subtotal,
        tax,
        total,
        isCartOpen,
        setIsCartOpen,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
