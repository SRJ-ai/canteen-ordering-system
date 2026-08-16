import { createClient } from '@/lib/supabase/server';
import { AdminOrdersClient } from '@/components/admin/AdminOrdersClient';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const supabase = createClient();

  const { data: orders } = await supabase
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
        unit_price,
        subtotal,
        menu_items (
          name
        ),
        order_item_addons (
          id,
          price_adjustment,
          menu_item_addon_options (
            name
          )
        )
      ),
      order_notes (
        note
      )
    `)
    .order('created_at', { ascending: false });

  return (
    <AdminOrdersClient initialOrders={(orders as any) || []} />
  );
}
