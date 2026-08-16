import { createClient } from '@/lib/supabase/server';
import { MenuClient } from '@/components/customer/MenuClient';

export const dynamic = 'force-dynamic';

export default async function MenuPage() {
  const supabase = createClient();

  // 1. Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name', { ascending: true });

  // 2. Fetch menu items with addons & options
  const { data: menuItems, error } = await supabase
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

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive p-6 rounded-2xl text-center">
        <h2 className="font-bold text-lg">Unable to load menu</h2>
        <p className="text-xs mt-1">Please try again in a few moments.</p>
      </div>
    );
  }

  return (
    <MenuClient
      initialCategories={categories || []}
      initialMenuItems={(menuItems as any) || []}
    />
  );
}
