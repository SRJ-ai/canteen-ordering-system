'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AdminMenuClient } from '@/components/admin/AdminMenuClient';
import { Loader2 } from 'lucide-react';

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMenu() {
      try {
        const supabase = createClient();
        const { data: items } = await supabase
          .from('menu_items')
          .select('*, categories(name)')
          .order('created_at', { ascending: true });

        const { data: cats } = await supabase
          .from('categories')
          .select('*')
          .order('name', { ascending: true });

        if (items) setMenuItems(items);
        if (cats) setCategories(cats);
      } catch (err) {
        console.error('Error loading admin menu:', err);
      } finally {
        setLoading(false);
      }
    }

    loadMenu();
  }, []);

  if (loading && menuItems.length === 0) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-xs text-muted-foreground font-semibold">Loading menu items & inventory pricing...</p>
      </div>
    );
  }

  return (
    <AdminMenuClient
      initialMenuItems={menuItems}
      categories={categories}
    />
  );
}
