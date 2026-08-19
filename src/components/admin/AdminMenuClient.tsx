'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  UtensilsCrossed,
  Search,
  CheckCircle2,
  XCircle,
  IndianRupee,
  Edit2,
  Check,
  RotateCw,
  PlusCircle,
  FolderPlus,
  Trash2,
  Sparkles,
  Loader2,
  Tag,
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
  categories: initialCategories,
}: {
  initialMenuItems: MenuItem[];
  categories: { id: string; name: string }[];
}) {
  const [items, setItems] = useState<MenuItem[]>(initialMenuItems);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Quick price inline edit
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Add / Edit Item Modal State
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [isSavingItem, setIsSavingItem] = useState(false);

  // Add Category Modal State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [isSavingCat, setIsSavingCat] = useState(false);

  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === 'ALL' || item.category_id === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Toggle in-stock / sold out
  const handleToggleAvailability = async (item: MenuItem) => {
    setIsUpdating(item.id);
    const newStatus = !item.is_available;
    const supabase = createClient();
    const { error } = await supabase
      .from('menu_items')
      .update({ is_available: newStatus })
      .eq('id', item.id);
    setIsUpdating(null);

    if (!error) {
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, is_available: newStatus } : i))
      );
    }
  };

  // Quick price save
  const handleSavePrice = async (itemId: string) => {
    const numPrice = parseFloat(tempPrice);
    if (isNaN(numPrice) || numPrice <= 0) return;

    setIsUpdating(itemId);
    const supabase = createClient();
    const { error } = await supabase
      .from('menu_items')
      .update({ base_price: numPrice })
      .eq('id', itemId);
    setIsUpdating(null);

    if (!error) {
      setItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, base_price: numPrice } : i))
      );
      setEditingPriceId(null);
    }
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormDesc('');
    setFormPrice('');
    setFormCategoryId(categories[0]?.id || '');
    setIsItemModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormDesc(item.description || '');
    setFormPrice(String(item.base_price));
    setFormCategoryId(item.category_id || categories[0]?.id || '');
    setIsItemModalOpen(true);
  };

  // Save Item (Create or Update)
  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(formPrice);
    if (!formName.trim() || isNaN(priceNum) || priceNum <= 0) return;

    setIsSavingItem(true);
    const supabase = createClient();

    if (editingItem) {
      // Update
      const { data, error } = await supabase
        .from('menu_items')
        .update({
          name: formName.trim(),
          description: formDesc.trim(),
          base_price: priceNum,
          category_id: formCategoryId || null,
        })
        .eq('id', editingItem.id)
        .select('*, categories(name)')
        .single();

      if (!error && data) {
        setItems((prev) => prev.map((i) => (i.id === editingItem.id ? (data as any) : i)));
        setIsItemModalOpen(false);
      }
    } else {
      // Create new
      const { data, error } = await supabase
        .from('menu_items')
        .insert({
          name: formName.trim(),
          description: formDesc.trim(),
          base_price: priceNum,
          category_id: formCategoryId || null,
          is_available: true,
        })
        .select('*, categories(name)')
        .single();

      if (!error && data) {
        setItems((prev) => [data as any, ...prev]);
        setIsItemModalOpen(false);
      }
    }
    setIsSavingItem(false);
  };

  // Delete Item
  const handleDeleteItem = async (item: MenuItem) => {
    if (!confirm(`Are you sure you want to delete "${item.name}" from the menu?`)) return;

    setIsUpdating(item.id);
    const supabase = createClient();
    const { error } = await supabase.from('menu_items').delete().eq('id', item.id);
    setIsUpdating(null);

    if (!error) {
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    }
  };

  // Save New Category
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setIsSavingCat(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('categories')
      .insert({ name: newCatName.trim() })
      .select()
      .single();

    setIsSavingCat(false);

    if (!error && data) {
      setCategories((prev) => [...prev, data]);
      setNewCatName('');
      setIsCatModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink tracking-tight flex items-center gap-2">
            <UtensilsCrossed className="h-8 w-8 text-primary-deep" /> Menu & Price Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Add new food items, update dish prices in INR (₹), toggle stock availability, and manage categories.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            onClick={handleOpenAddModal}
            className="btn-marigold rounded-lg text-xs font-bold flex items-center gap-1.5"
          >
            <PlusCircle className="h-4 w-4" /> Add New Dish
          </Button>

          <Button
            variant="outline"
            onClick={() => setIsCatModalOpen(true)}
            className="bg-card border-ink/20 text-ink hover:bg-secondary rounded-lg text-xs font-bold"
          >
            <FolderPlus className="h-4 w-4 mr-1 text-steel" /> New Category
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="bg-card border-ink/20 text-ink hover:bg-secondary rounded-lg text-xs font-semibold"
          >
            <RotateCw className="h-3.5 w-3.5 mr-1" /> Refresh
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="tray-card flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-ink text-background'
                : 'bg-secondary text-muted-foreground hover:bg-muted'
            }`}
          >
            All Items (<span className="numeric">{items.length}</span>)
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === c.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:bg-muted'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search dish name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs rounded-lg h-9 bg-background"
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
              className={`flex flex-col justify-between transition-all ${
                item.is_available ? '' : 'bg-chutney/5 ring-chutney/30 opacity-80'
              }`}
            >
              <CardHeader className="p-5 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-primary-deep uppercase tracking-wider">
                      {item.categories?.name || 'Canteen Special'}
                    </span>
                    <CardTitle className="font-display text-base font-bold text-ink">
                      {item.name}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        item.is_available
                          ? 'bg-leaf/10 text-leaf border-leaf/20'
                          : 'bg-chutney/10 text-chutney border-chutney/20'
                      }`}
                    >
                      {item.is_available ? 'In Stock' : 'Sold Out'}
                    </Badge>
                  </div>
                </div>
                {item.description && (
                  <CardDescription className="text-xs text-muted-foreground line-clamp-2 pt-1">
                    {item.description}
                  </CardDescription>
                )}
              </CardHeader>

              {/* Price Row */}
              <CardContent className="p-5 pt-0 pb-3">
                <div className="flex items-center justify-between bg-secondary/60 p-3 rounded-lg border border-border">
                  <span className="text-xs font-semibold text-muted-foreground">Base Price (INR)</span>
                  {isEditing ? (
                    <div className="flex items-center gap-1.5">
                      <Input
                        type="number"
                        value={tempPrice}
                        onChange={(e) => setTempPrice(e.target.value)}
                        className="w-20 h-8 text-xs font-bold rounded-lg numeric"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleSavePrice(item.id)}
                        className="btn-marigold h-8 w-8 p-0 rounded-lg"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="numeric text-lg font-extrabold text-ink">₹{item.base_price}</span>
                      <button
                        onClick={() => {
                          setEditingPriceId(item.id);
                          setTempPrice(String(item.base_price));
                        }}
                        title="Edit Price"
                        className="text-steel hover:text-ink p-1"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </CardContent>

              {/* Footer Actions */}
              <CardFooter className="p-4 pt-0 border-t border-border bg-secondary/40 grid grid-cols-3 gap-2">
                <Button
                  onClick={() => handleToggleAvailability(item)}
                  disabled={isUpdating === item.id}
                  variant={item.is_available ? 'outline' : 'default'}
                  className={`col-span-2 text-xs font-bold rounded-lg h-9 transition-all ${
                    item.is_available
                      ? 'border-ink/20 text-ink hover:bg-chutney/10 hover:text-chutney hover:border-chutney/30'
                      : 'bg-leaf hover:bg-leaf/90 text-white'
                  }`}
                >
                  {isUpdating === item.id ? (
                    'Updating...'
                  ) : item.is_available ? (
                    <>
                      <XCircle className="h-3.5 w-3.5 mr-1.5 text-chutney" /> Mark Sold Out
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-white" /> In Stock
                    </>
                  )}
                </Button>

                <div className="flex items-center gap-1 justify-end">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleOpenEditModal(item)}
                    title="Edit Item Details"
                    className="h-9 w-9 rounded-lg border-ink/20 hover:bg-secondary text-steel"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteItem(item)}
                    title="Delete Dish"
                    className="h-9 w-9 rounded-lg hover:bg-chutney/10 text-steel hover:text-chutney"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Add / Edit Item Modal */}
      <Dialog open={isItemModalOpen} onOpenChange={setIsItemModalOpen}>
        <DialogContent className="max-w-md p-6 rounded-xl bg-card shadow-lg border border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-extrabold text-ink">
              {editingItem ? 'Edit Dish & Pricing' : 'Add New Dish to Menu'}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {editingItem
                ? 'Update dish name, category, and selling price in rupees.'
                : 'Create a new dish available for students to order immediately.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveItem} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-ink">Dish Name</Label>
              <Input
                placeholder="e.g. Masala Dosa / Veg Biryani"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="rounded-lg text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-ink">Category</Label>
              <select
                value={formCategoryId}
                onChange={(e) => setFormCategoryId(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-ink">Base Price (INR ₹)</Label>
              <Input
                type="number"
                step="0.5"
                placeholder="e.g. 65"
                required
                value={formPrice}
                onChange={(e) => setFormPrice(e.target.value)}
                className="rounded-lg text-sm numeric"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-ink">Description (Optional)</Label>
              <Input
                placeholder="e.g. Served hot with sambar and fresh coconut chutney"
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                className="rounded-lg text-sm"
              />
            </div>

            <DialogFooter className="pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsItemModalOpen(false)}
                className="rounded-lg text-xs border-ink/20 text-ink"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSavingItem}
                className="btn-marigold rounded-lg text-xs font-bold"
              >
                {isSavingItem ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
                  </span>
                ) : editingItem ? (
                  'Update Dish'
                ) : (
                  'Add to Menu'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Category Modal */}
      <Dialog open={isCatModalOpen} onOpenChange={setIsCatModalOpen}>
        <DialogContent className="max-w-sm p-6 rounded-xl bg-card shadow-lg border border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-extrabold text-ink flex items-center gap-2">
              <FolderPlus className="h-5 w-5 text-primary-deep" /> Create Food Category
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Add a new menu section (e.g. &quot;Fresh Juices&quot;, &quot;Ice Creams&quot;, &quot;Combos&quot;).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveCategory} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-ink">Category Name</Label>
              <Input
                placeholder="e.g. Beverages & Shakes"
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="rounded-lg text-sm"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCatModalOpen(false)}
                className="rounded-lg text-xs border-ink/20 text-ink"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSavingCat}
                className="btn-marigold rounded-lg text-xs font-bold"
              >
                {isSavingCat ? 'Creating...' : 'Save Category'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
