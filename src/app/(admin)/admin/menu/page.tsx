import { createClient } from '@/lib/supabase/server';
import { AdminMenuClient } from '@/components/admin/AdminMenuClient';

export const dynamic = 'force-dynamic';

export default async function AdminMenuPage() {
  const supabase = createClient();

  const { data: menuItems } = await supabase
    .from('menu_items')
    .select('*, categories(name)')
    .order('created_at', { ascending: true });

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  return (
    <AdminMenuClient
      initialMenuItems={(menuItems as any) || []}
      categories={categories || []}
    />
  );
}
