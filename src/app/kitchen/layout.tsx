import { ReactNode } from 'react';
import Link from 'next/link';
import { ChefHat, ArrowLeft, Shield, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function KitchenLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between px-6 bg-slate-900 border-b border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 text-slate-950 p-2 rounded-xl font-bold shadow-md">
            <ChefHat className="h-5 w-5" />
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight text-white flex items-center gap-2">
              Hot Line KDS <span className="text-[10px] bg-slate-800 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full font-bold">TERMINAL</span>
            </div>
            <div className="text-[11px] text-slate-400">Campus Central Food Court</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm" className="text-xs text-slate-400 hover:text-white rounded-xl">
              <Shield className="h-3.5 w-3.5 mr-1" /> Admin Orders
            </Button>
          </Link>
          <Link href="/menu">
            <Button variant="outline" size="sm" className="bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700 rounded-xl text-xs">
              <Utensils className="h-3.5 w-3.5 mr-1" /> Customer View
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
