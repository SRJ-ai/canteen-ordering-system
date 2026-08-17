'use client';

import React, { useState, useMemo, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Search,
  Plus,
  Minus,
  Sparkles,
  SlidersHorizontal,
  Check,
  Star,
  Flame,
  Clock,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { ItemCustomizationModal, MenuItemWithAddons } from './ItemCustomizationModal';

interface MenuClientProps {
  initialCategories: { id: string; name: string }[];
  initialMenuItems: MenuItemWithAddons[];
}

export function MenuClient({ initialCategories, initialMenuItems }: MenuClientProps) {
  const { items: cartItems, addItem, updateQuantity } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCustomizingItem, setActiveCustomizingItem] = useState<MenuItemWithAddons | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Filter items based on Category & Search Query
  const filteredItems = useMemo(() => {
    return initialMenuItems.filter((item) => {
      const matchesCategory =
        selectedCategory === 'ALL' || item.category_id === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [initialMenuItems, selectedCategory, searchQuery]);

  // Featured Campus Best Sellers
  const bestSellers = useMemo(() => {
    return initialMenuItems.slice(0, 4);
  }, [initialMenuItems]);

  // Play subtle tactile pop audio when adding items
  const playPopSound = () => {
    try {
      if (typeof window !== 'undefined') {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      }
    } catch (e) {}
  };

  const showToast = (message: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(message);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  // Check if an item is already in cart and get its total quantity
  const getItemCartQuantity = (menuItemId: string) => {
    return cartItems
      .filter((i) => i.menuItemId === menuItemId)
      .reduce((sum, i) => sum + i.quantity, 0);
  };

  const handleAddClick = (item: MenuItemWithAddons) => {
    playPopSound();
    if (item.menu_item_addons && item.menu_item_addons.length > 0) {
      setActiveCustomizingItem(item);
    } else {
      addItem({
        menuItemId: item.id,
        name: item.name,
        description: item.description,
        basePrice: Number(item.base_price),
        addons: [],
        quantity: 1,
      });
      showToast(`Added 1x ${item.name} to your tray!`);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Micro-Toast Notification */}
      {toastMessage && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-950/95 text-white px-4 py-2 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-md flex items-center gap-2 text-xs font-bold animate-in fade-in-50 slide-in-from-top-4"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </aside>
      )}

      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-amber-600 p-6 md:p-8 text-white shadow-lg overflow-hidden">
        <div className="relative z-10 max-w-lg space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="h-3.5 w-3.5" /> GPREC Campus Food Court
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Craving something hot &amp; delicious?
          </h1>
          <p className="text-xs sm:text-sm text-orange-100 font-medium">
            Browse our freshly prepared canteen specialties, customize toppings, and order straight from your table!
          </p>
        </div>

        {/* Search Bar Inside Hero */}
        <div className="relative z-10 mt-5 max-w-md">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by dish name, e.g. Dosa, Thali, Chai..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white text-slate-900 pl-10 pr-4 h-11 rounded-2xl shadow-md border-0 focus-visible:ring-2 focus-visible:ring-orange-300 text-sm font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Decorative Background Blob */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* Live Kitchen Status Banner */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold text-slate-800">
            GPREC Kitchen: <span className="text-emerald-700 font-extrabold">Open &amp; Fast-Track Active</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <span className="bg-amber-50 text-amber-800 border border-amber-200/60 px-2 py-0.5 rounded-lg font-bold text-[11px] flex items-center gap-1">
            <Clock className="h-3 w-3" /> Average Prep: ~5-8 mins
          </span>
          <span>&bull; Made to Order</span>
        </div>
      </div>

      {/* Campus Best Sellers / Quick Adds */}
      {searchQuery === '' && selectedCategory === 'ALL' && bestSellers.length > 0 && (
        <section aria-label="Campus Best Sellers" className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-orange-500" /> Campus Best Sellers
            </h2>
            <span className="text-[11px] font-bold text-primary">Top Rated by Students</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {bestSellers.map((item) => (
              <div
                key={item.id}
                className="bg-gradient-to-b from-amber-50/60 to-white p-3.5 rounded-2xl border border-amber-200/60 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-amber-700 font-bold mb-1">
                    <span className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /> 4.9</span>
                    <span className="text-slate-400 font-medium">~6m</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                    {item.name}
                  </h4>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-amber-100">
                  <span className="font-extrabold text-xs text-slate-900">₹{item.base_price}</span>
                  <Button
                    size="sm"
                    onClick={() => handleAddClick(item)}
                    className="h-6 px-2 text-[10px] font-bold bg-primary hover:bg-primary/90 text-white rounded-lg"
                  >
                    + Add
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Category Pills Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-xs ${
            selectedCategory === 'ALL'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          All Items ({initialMenuItems.length})
        </button>
        {initialCategories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = initialMenuItems.filter((i) => i.category_id === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-xs flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <span>{cat.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Menu Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200 space-y-3">
          <div className="bg-orange-50 text-primary w-12 h-12 rounded-full flex items-center justify-center mx-auto">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-800">No dishes found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            We couldn&apos;t find any items matching &ldquo;{searchQuery}&rdquo;. Try another search term or browse by category.
          </p>
          <Button variant="outline" size="sm" onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}>
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredItems.map((item) => {
            const qtyInCart = getItemCartQuantity(item.id);
            const hasAddons = item.menu_item_addons && item.menu_item_addons.length > 0;

            return (
              <Card
                key={item.id}
                className="group bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden food-card-hover"
              >
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="veg-indicator"><span className="veg-indicator-dot"></span></span>
                      <span className="text-[11px] font-semibold text-primary uppercase tracking-wide">
                        {item.categories?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {hasAddons && (
                        <Badge variant="secondary" className="text-[10px] bg-orange-50 text-orange-700 border-orange-200 font-semibold px-2">
                          Customizable
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardTitle className="text-base sm:text-lg font-bold text-slate-900 pt-1 group-hover:text-primary transition-colors">
                    {item.name}
                  </CardTitle>

                  {item.description && (
                    <CardDescription className="text-xs text-muted-foreground line-clamp-2 pt-1 leading-relaxed">
                      {item.description}
                    </CardDescription>
                  )}

                  {/* Micro Tags */}
                  <div className="flex items-center gap-2 pt-2 text-[10px] font-bold text-slate-400">
                    <span className="flex items-center gap-0.5 text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                      <Star className="h-2.5 w-2.5 fill-amber-400" /> 4.8
                    </span>
                    <span>&bull;</span>
                    <span>⏱️ ~5-8 mins</span>
                  </div>
                </CardHeader>

                <CardFooter className="p-5 pt-2 flex items-center justify-between border-t border-slate-100 bg-slate-50/40 mt-3">
                  <div>
                    <span className="text-[11px] text-muted-foreground font-medium block">Price</span>
                    <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                      ₹{item.base_price}
                    </span>
                  </div>

                  <div>
                    {qtyInCart > 0 && !hasAddons ? (
                      <div className="flex items-center gap-1.5 bg-primary text-white rounded-2xl p-1 shadow-md">
                        <button
                          onClick={() => {
                            const cartItem = cartItems.find((i) => i.menuItemId === item.id);
                            if (cartItem) {
                              playPopSound();
                              updateQuantity(cartItem.id, cartItem.quantity - 1);
                            }
                          }}
                          className="w-7 h-7 rounded-xl hover:bg-black/10 flex items-center justify-center transition"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="font-extrabold text-xs px-1 min-w-[16px] text-center">
                          {qtyInCart}
                        </span>
                        <button
                          onClick={() => handleAddClick(item)}
                          className="w-7 h-7 rounded-xl hover:bg-black/10 flex items-center justify-center transition"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleAddClick(item)}
                        className="bg-primary hover:bg-primary/90 text-white font-bold text-xs h-9 px-4 rounded-2xl shadow-sm flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95"
                      >
                        <Plus className="h-4 w-4" />
                        <span>{hasAddons ? 'Customize' : 'Add'}</span>
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Item Customization Modal */}
      <ItemCustomizationModal
        item={activeCustomizingItem}
        isOpen={Boolean(activeCustomizingItem)}
        onClose={() => setActiveCustomizingItem(null)}
        onAddToCart={(configured) => {
          playPopSound();
          addItem(configured);
          showToast(`Added customized ${configured.name} to cart!`);
        }}
      />
    </div>
  );
}
