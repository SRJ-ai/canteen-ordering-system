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
  Star,
  Flame,
  Clock,
  Zap,
  CheckCircle2,
  Leaf,
} from 'lucide-react';
import { ItemCustomizationModal, MenuItemWithAddons } from './ItemCustomizationModal';

interface MenuClientProps {
  initialCategories: { id: string; name: string }[];
  initialMenuItems: MenuItemWithAddons[];
}

export function MenuClient({ initialCategories, initialMenuItems }: MenuClientProps) {
  const { items: cartItems, addItem, updateQuantity } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [dietaryFilter, setDietaryFilter] = useState<'ALL' | 'VEG' | 'FAST' | 'TOP_RATED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCustomizingItem, setActiveCustomizingItem] = useState<MenuItemWithAddons | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Filter items based on Category, Search Query, and Dietary Filter
  const filteredItems = useMemo(() => {
    return initialMenuItems.filter((item) => {
      const matchesCategory =
        selectedCategory === 'ALL' || item.category_id === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchesDiet = true;
      if (dietaryFilter === 'VEG') {
        matchesDiet = !item.name.toLowerCase().includes('chicken') && !item.name.toLowerCase().includes('egg');
      } else if (dietaryFilter === 'FAST') {
        matchesDiet = Number(item.base_price) <= 60 || item.name.toLowerCase().includes('chai') || item.name.toLowerCase().includes('coffee') || item.name.toLowerCase().includes('samosa');
      } else if (dietaryFilter === 'TOP_RATED') {
        matchesDiet = item.name.toLowerCase().includes('dosa') || item.name.toLowerCase().includes('thali') || item.name.toLowerCase().includes('paneer') || item.name.toLowerCase().includes('biryani');
      }

      return matchesCategory && matchesSearch && matchesDiet;
    });
  }, [initialMenuItems, selectedCategory, searchQuery, dietaryFilter]);

  // Featured Campus Best Sellers
  const bestSellers = useMemo(() => {
    return initialMenuItems.slice(0, 4);
  }, [initialMenuItems]);

  // Calculate live campus crowd rush status
  const currentHour = new Date().getHours();
  const isLunchRush = currentHour >= 12 && currentHour <= 14;

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
      showToast(`Added 1x ${item.name} to your tray`);
    }
  };

  const dietTabs: { key: typeof dietaryFilter; label: string; icon?: React.ReactNode; active: string; idle: string }[] = [
    { key: 'ALL', label: 'All items', active: 'bg-ink text-background', idle: 'bg-card text-ink border border-border hover:bg-secondary' },
    { key: 'VEG', label: 'Pure veg', icon: <Leaf className="h-3 w-3" />, active: 'bg-leaf text-white', idle: 'bg-card text-leaf border border-leaf/30 hover:bg-leaf/5' },
    { key: 'FAST', label: 'Quick bites (≤ ₹60)', icon: <Zap className="h-3 w-3" />, active: 'bg-primary text-primary-foreground', idle: 'bg-card text-primary-deep border border-primary/30 hover:bg-primary/5' },
    { key: 'TOP_RATED', label: "Chef's specials", icon: <Star className="h-3 w-3 fill-current" />, active: 'bg-chutney text-white', idle: 'bg-card text-chutney border border-chutney/30 hover:bg-chutney/5' },
  ];

  return (
    <div className="space-y-6">
      {/* Micro-Toast */}
      {toastMessage && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed left-1/2 top-20 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg border border-ink/20 bg-ink px-4 py-2 text-xs font-bold text-background shadow-xl animate-in fade-in-50 slide-in-from-top-4"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-primary-soft" />
          <span>{toastMessage}</span>
        </aside>
      )}

      {/* Menu board header */}
      <div className="overflow-hidden rounded-xl bg-ink px-6 py-7 text-background md:px-8">
        <div className="max-w-lg space-y-2">
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-primary-soft">
            GPREC Campus Food Court
          </p>
          <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            Craving something hot and fresh?
          </h1>
          <p className="text-sm text-background/70">
            Browse today&rsquo;s canteen specials, customize your toppings, and order straight from your table.
          </p>
        </div>

        <div className="mt-5 max-w-md">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 h-4 w-4 text-steel" />
            <Input
              type="text"
              placeholder="Search dishes, e.g. Dosa, Thali, Chai"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 rounded-lg border-0 bg-card pl-10 pr-4 text-sm font-medium text-ink shadow-sm focus-visible:ring-2 focus-visible:ring-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-xs font-semibold text-steel hover:text-ink"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Live status banner */}
      <div className="tray-card flex flex-col justify-between gap-3 p-3.5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 motion-safe:animate-ping ${isLunchRush ? 'bg-primary' : 'bg-leaf'}`}></span>
            <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${isLunchRush ? 'bg-primary' : 'bg-leaf'}`}></span>
          </span>
          <div className="text-xs font-bold text-ink">
            Food court status:{' '}
            <span className={`font-extrabold ${isLunchRush ? 'text-primary-deep' : 'text-leaf'}`}>
              {isLunchRush ? 'Peak lunch hours, moderate queue' : 'Fast-track seating open'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <span className="flex items-center gap-1 rounded-md border border-primary/25 bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary-deep">
            <Clock className="h-3 w-3" /> Avg prep <span className="numeric">~5-8</span> mins
          </span>
          <span className="text-steel">Strict FCFS queue</span>
        </div>
      </div>

      {/* Best sellers */}
      {searchQuery === '' && selectedCategory === 'ALL' && bestSellers.length > 0 && (
        <section aria-label="Campus best sellers" className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="flex items-center gap-1.5 font-display text-sm font-extrabold text-ink">
              <Flame className="h-4 w-4 text-chutney" /> Campus best sellers
            </h2>
            <span className="text-[11px] font-bold text-primary-deep">Top rated by students</span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {bestSellers.map((item) => (
              <div
                key={item.id}
                className="tray-card tray-card-hover group flex flex-col justify-between p-3.5"
              >
                <div>
                  <div className="mb-1 flex items-center justify-between text-[10px] font-bold">
                    <span className="numeric flex items-center gap-0.5 text-primary-deep"><Star className="h-3 w-3 fill-primary text-primary" /> 4.9</span>
                    <span className="numeric text-steel">~6m</span>
                  </div>
                  <h4 className="line-clamp-1 font-display text-xs font-bold text-ink transition-colors group-hover:text-primary-deep">
                    {item.name}
                  </h4>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-border pt-2">
                  <span className="numeric text-xs font-extrabold text-ink">₹{item.base_price}</span>
                  <Button
                    size="sm"
                    onClick={() => handleAddClick(item)}
                    className="h-6 rounded-md px-2 text-[10px] font-bold"
                  >
                    + Add
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Dietary filter tabs */}
      <div className="scrollbar-none flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {dietTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setDietaryFilter(t.key)}
            className={`flex items-center gap-1 whitespace-nowrap rounded-lg px-3 py-1.5 font-bold transition-all ${
              dietaryFilter === t.key ? t.active : t.idle
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Category pills */}
      <div className="scrollbar-none flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-bold transition-all sm:text-sm ${
            selectedCategory === 'ALL'
              ? 'bg-ink text-background'
              : 'border border-border bg-card text-ink hover:bg-secondary'
          }`}
        >
          All categories (<span className="numeric">{initialMenuItems.length}</span>)
        </button>
        {initialCategories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = initialMenuItems.filter((i) => i.category_id === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-4 py-2 text-xs font-bold transition-all sm:text-sm ${
                isSelected
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border bg-card text-ink hover:bg-secondary'
              }`}
            >
              <span>{cat.name}</span>
              <span className={`numeric rounded-full px-1.5 text-[10px] ${isSelected ? 'bg-ink/15 text-primary-foreground' : 'bg-secondary text-steel'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Menu grid */}
      {filteredItems.length === 0 ? (
        <div className="tray-card space-y-3 border-dashed p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary-deep">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="font-display text-lg font-bold text-ink">No dishes found</h3>
          <p className="mx-auto max-w-sm text-xs text-muted-foreground">
            Nothing matches these filters right now. Try resetting the category or dietary preference.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="border-ink/15 bg-card font-semibold text-ink hover:bg-secondary"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
              setDietaryFilter('ALL');
            }}
          >
            Reset all filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {filteredItems.map((item) => {
            const qtyInCart = getItemCartQuantity(item.id);
            const hasAddons = item.menu_item_addons && item.menu_item_addons.length > 0;

            return (
              <Card
                key={item.id}
                className="tray-card tray-card-hover group flex flex-col justify-between overflow-hidden"
              >
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="veg-indicator"><span className="veg-indicator-dot"></span></span>
                      <span className="text-[11px] font-bold uppercase tracking-wide text-chutney">
                        {item.categories?.name}
                      </span>
                    </div>
                    {hasAddons && (
                      <Badge variant="secondary" className="border-primary/25 bg-primary/10 px-2 text-[10px] font-bold text-primary-deep">
                        Customizable
                      </Badge>
                    )}
                  </div>

                  <CardTitle className="pt-1 font-display text-base font-bold text-ink transition-colors group-hover:text-primary-deep sm:text-lg">
                    {item.name}
                  </CardTitle>

                  {item.description && (
                    <CardDescription className="line-clamp-2 pt-1 text-xs leading-relaxed text-muted-foreground">
                      {item.description}
                    </CardDescription>
                  )}

                  <div className="flex items-center gap-2 pt-2 text-[10px] font-bold text-muted-foreground">
                    <span className="numeric flex items-center gap-0.5 rounded bg-primary/10 px-1.5 py-0.5 text-primary-deep">
                      <Star className="h-2.5 w-2.5 fill-primary text-primary" /> 4.8
                    </span>
                    <span className="numeric flex items-center gap-0.5 text-steel">
                      <Clock className="h-3 w-3" /> ~5-8 mins
                    </span>
                  </div>
                </CardHeader>

                <CardFooter className="mt-3 flex items-center justify-between border-t border-border bg-secondary/40 p-5 pt-3">
                  <div>
                    <span className="block text-[11px] font-medium text-muted-foreground">Price</span>
                    <span className="numeric text-xl font-extrabold tracking-tight text-ink">
                      ₹{item.base_price}
                    </span>
                  </div>

                  <div>
                    {qtyInCart > 0 && !hasAddons ? (
                      <div className="flex items-center gap-1.5 rounded-lg bg-primary p-1 text-primary-foreground shadow-sm">
                        <button
                          onClick={() => {
                            const cartItem = cartItems.find((i) => i.menuItemId === item.id);
                            if (cartItem) {
                              playPopSound();
                              updateQuantity(cartItem.id, cartItem.quantity - 1);
                            }
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-md transition hover:bg-ink/10"
                          aria-label="Remove one"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="numeric min-w-[16px] px-1 text-center text-xs font-extrabold">
                          {qtyInCart}
                        </span>
                        <button
                          onClick={() => handleAddClick(item)}
                          className="flex h-7 w-7 items-center justify-center rounded-md transition hover:bg-ink/10"
                          aria-label="Add one"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleAddClick(item)}
                        className="h-9 gap-1.5 px-4 text-xs font-bold"
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
          showToast(`Added customized ${configured.name} to cart`);
        }}
      />
    </div>
  );
}
