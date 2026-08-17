import { OrderService, OrderItemInput } from './order.service';
import { createClient } from '@/lib/supabase/client';
import { OrderStatus, Role } from '@/types';

export async function placeOrderAction(data: {
  items: OrderItemInput[];
  paymentMethod: string;
  customerName?: string;
  customerPhone?: string;
  isFacultyPriority?: boolean;
  department?: string;
  notes?: string;
}) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Check table session from localStorage or cookie if in browser
    let tableSessionId: string | null = null;
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('canteen_table_info');
        if (saved) {
          const parsed = JSON.parse(saved);
          tableSessionId = parsed.sessionId || null;
        }
      } catch (e) {}
    }

    const order = await OrderService.createOrder({
      userId: user?.id || null,
      tableSessionId,
      items: data.items,
      paymentMethod: data.paymentMethod,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      isFacultyPriority: data.isFacultyPriority,
      department: data.department,
      notes: data.notes,
    });

    return { success: true, orderId: order.id, orderNumber: order.order_number };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to place order' };
  }
}

export async function getOrderDetailsAction(orderId: string) {
  try {
    const order = await OrderService.getOrderById(orderId);
    return { success: true, order };
  } catch (error: any) {
    return { success: false, error: error.message || 'Order not found' };
  }
}

export async function cancelCustomerOrderAction(orderId: string) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const order = await OrderService.updateOrderStatus(
      orderId,
      'CANCELLED',
      user?.id,
      'CUSTOMER',
      'Cancelled by customer before acceptance'
    );

    return { success: true, order };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateOrderStatusByStaffAction(
  orderId: string,
  newStatus: OrderStatus,
  cancellationReason?: string
) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const order = await OrderService.updateOrderStatus(
      orderId,
      newStatus,
      user?.id,
      'ADMIN',
      cancellationReason
    );

    return { success: true, order };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
