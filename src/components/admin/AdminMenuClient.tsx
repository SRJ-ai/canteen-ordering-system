'use client';

import React, { useState } from 'react';
import { toggleMenuItemAvailabilityAction, updateMenuItemPriceAction } from '@/server/actions/menu.actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  UtensilsCrossed,
  Search,
  CheckCircle2,
  XCircle,
  IndianRupee,
  Edit2,
  Check,
  RotateCw,
} from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  base_price: number;
  is_available: boolean;
  category_id?: string;
  categories?: {
    name: string;
  };
}

export function AdminMenuClient({
  initialMenuItems,
  categories,
}: {
  initialMenuItems: MenuItem[];
  categories: { id: string; name: string }[];
}) {
  const [items, setItems] = useState<MenuItem[]>(initialMenuItems);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === 'ALL' || item.category_id === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleToggleAvailability = async (item: MenuItem) => {
    setIsUpdating(item.id);
    const newStatus = !item.is_available;
    const res = await toggleMenuItemAvailabilityAction(item.id, newStatus);
    setIsUpdating(null);

    if (res.success) {
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, is_available: newStatus } : i))
      );
    }
  };

  const handleSavePrice = async (itemId: string) => {
    const numPrice = parseFloat(tempPrice);
    if (isNaN(numPrice) || numPrice <= 0) return;

    setIsUpdating(itemId);
    const res = await updateMenuItemPriceAction(itemId, numPrice);
    setIsUpdating(null);

    if (res.success) {
      setItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, base_price: numPrice } : i))
      );
      setEditingPriceId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Menu & Pricing Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Toggle real-time item availability (In Stock / Sold Out) and update prices in Indian Rupees (₹).
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
          className="bg-white rounded-2xl text-xs font-semibold"
        >
          <RotateCw className="h-3.5 w-3.5 mr-1" /> Refresh
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            All Items ({items.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === c.id
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search dish name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs rounded-xl h-9 bg-slate-50"
          />
        </div>
      </div>

      {/* Menu Items Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const isEditing = editingPriceId === item.id;

          return (
            <Card
              key={item.id}
              className={`rounded-3xl border shadow-xs bg-white flex flex-col justify-between overflow-hidden transition-all ${
                item.is_available ? 'border-slate-200/80' : 'border-rose-200 bg-rose-50/20 opacity-80'
              }`}
            >
              <CardHeader className="p-5 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                      {item.categories?.name || 'Canteen Special'}
                    </span>
                    <CardTitle className="text-base font-bold text-slate-900">
                      {item.name}
                    </CardTitle>
                  </div>
                  <Badge
                    variant={item.is_available ? 'secondary' : 'destructive'}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  >
                    {item.is_available ? 'In Stock' : 'Sold Out'}
                  </Badge>
                </div>
                {item.description && (
                  <CardDescription className="text-xs text-muted-foreground line-clamp-2 pt-1">
                    {item.description}
                  </CardDescription>
                )}
              </CardHeader>

              {/* Price Row */}
              <CardContent className="p-5 pt-0 pb-3">
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border">
                  <span className="text-xs font-semibold text-slate-600">Base Price (INR)</span>
                  {isEditing ? (
                    <div className="flex items-center gap-1.5">
                      <Input
                        type="number"
                        value={tempPrice}
                        onChange={(e) => setTempPrice(e.target.value)}
                        className="w-20 h-8 text-xs font-bold rounded-lg"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleSavePrice(item.id)}
                        className="h-8 w-8 p-0 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-extrabold text-slate-900">₹{item.base_price}</span>
                      <button
                        onClick={() => {
                          setEditingPriceId(item.id);
                          setTempPrice(String(item.base_price));
                        }}
                        className="text-slate-400 hover:text-slate-700 p-1"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </CardContent>

              {/* Footer Toggle Availability */}
              <CardFooter className="p-4 pt-0 border-t border-slate-100 bg-slate-50/40">
                <Button
                  onClick={() => handleToggleAvailability(item)}
                  disabled={isUpdating === item.id}
                  variant={item.is_available ? 'outline' : 'default'}
                  className={`w-full text-xs font-bold rounded-xl h-9 transition-all ${
                    item.is_available
                      ? 'border-slate-300 hover:bg-rose-50 hover:text-destructive hover:border-rose-200'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {isUpdating === item.id ? (
                    'Updating...'
                  ) : item.is_available ? (
                    <>
                      <XCircle className="h-3.5 w-3.5 mr-1.5 text-rose-500" /> Mark as Sold Out
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-white" /> Mark as Available
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
