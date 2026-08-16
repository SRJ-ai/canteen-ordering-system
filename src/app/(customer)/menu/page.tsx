'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MenuClient } from '@/components/customer/MenuClient';
import { Loader2 } from 'lucide-react';

export default function MenuPage() {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMenu() {
      try {
        const supabase = createClient();
        const { data: cats } = await supabase
          .from('categories')
          .select('id, name')
          .order('name', { ascending: true });

        const { data: items } = await supabase
          .from('menu_items')
          .select(`
            id,
            name,
            description,
            base_price,
            category_id,
            is_available,
            categories (
              name
            ),
            menu_item_addons (
              id,
              name,
              is_multiple,
              is_required,
              menu_item_addon_options (
                id,
                name,
                price_adjustment
              )
            )
          `)
          .eq('is_available', true)
          .order('created_at', { ascending: true });

        if (cats) setCategories(cats);
        if (items) setMenuItems(items);
      } catch (err) {
        console.error('Error loading menu:', err);
      } finally {
        setLoading(false);
      }
    }

    loadMenu();
  }, []);

  if (loading) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-xs text-muted-foreground font-semibold">Loading freshly prepared canteen specials...</p>
      </div>
    );
  }

  return (
    <MenuClient
      initialCategories={categories}
      initialMenuItems={menuItems}
    />
  );
}
