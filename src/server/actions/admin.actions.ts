import { createClient } from '@/lib/supabase/client';
import { OrderStatus } from '@/types';
import { AuthService } from '../services/auth.service';

export async function cancelOrder(orderId: string, reason: string, optionalNote: string = '') {
  const supabase = createClient();
  const user = await AuthService.requireRole(['SUPER_ADMIN', 'ADMIN']);
  
  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  if (!reason) {
    return { success: false, error: 'Cancellation reason is required.' };
  }

  // Fetch the current order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id, status')
    .eq('id', orderId)
    .single();

  if (orderError || !order) {
    return { success: false, error: 'Order not found' };
  }

  if (order.status === 'CANCELLED' || order.status === 'COMPLETED') {
    return { success: false, error: 'Cannot cancel an order in terminal state.' };
  }

  const previousStatus = order.status;

  // Transactionally update the order status and add history
  const { error: updateError } = await supabase
    .from('orders')
    .update({ status: 'CANCELLED' })
    .eq('id', orderId);

  if (updateError) {
    return { success: false, error: 'Failed to update order status' };
  }

  // Create audit log and history record
  await supabase.from('order_status_history').insert({
    order_id: orderId,
    status: 'CANCELLED',
    changed_by: user.id,
  });

  await supabase.from('audit_logs').insert({
    table_name: 'orders',
    record_id: orderId,
    action: 'CANCEL_ORDER',
    old_data: { status: previousStatus },
    new_data: { status: 'CANCELLED', reason, note: optionalNote },
    performed_by: user.id
  });

  return { success: true };
}
