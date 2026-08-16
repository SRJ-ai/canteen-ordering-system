'use client';

import { ReactNode } from 'react';
import { CartProvider } from '@/context/CartContext';
import { CustomerHeader } from '@/components/customer/CustomerHeader';
import { CartDrawer } from '@/components/customer/CartDrawer';

export default function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen bg-slate-50/60 font-sans antialiased text-slate-900 pb-24">
        <CustomerHeader />
        <main className="flex-1 container mx-auto px-4 py-5 max-w-5xl">
          {children}
        </main>
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
