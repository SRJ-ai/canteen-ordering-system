import { createClient } from '@/lib/supabase/server';
import { KitchenKDSClient } from '@/components/kitchen/KitchenKDSClient';

export const dynamic = 'force-dynamic';

export default async function KitchenPage() {
  const supabase = createClient();

  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      total_amount,
      created_at,
      table_sessions (
        tables (
          table_number
        )
      ),
      order_items (
        id,
        quantity,
        menu_items (
          name
        ),
        order_item_addons (
          id,
          menu_item_addon_options (
            name
          )
        )
      ),
      order_notes (
        note
      )
    `)
    .in('status', ['PENDING', 'CONFIRMED', 'ACCEPTED', 'PREPARING', 'READY'])
    .order('created_at', { ascending: true });

  return (
    <KitchenKDSClient initialOrders={(orders as any) || []} />
  );
}
