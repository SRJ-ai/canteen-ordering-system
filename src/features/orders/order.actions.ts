'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { OrderService, OrderItemInput } from './order.service';
import { createClient } from '@/lib/supabase/server';
import { OrderStatus, Role } from '@/types';

export async function placeOrderAction(data: {
  items: OrderItemInput[];
  paymentMethod: string;
  customerName?: string;
  customerPhone?: string;
}) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Check table session from cookies
    const cookieStore = cookies();
    const tableSessionId = cookieStore.get('canteen_table_session')?.value || null;

    const order = await OrderService.createOrder({
      userId: user?.id || null,
      tableSessionId,
      items: data.items,
      paymentMethod: data.paymentMethod,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
    });

    revalidatePath('/orders');
    revalidatePath('/kitchen');
    revalidatePath('/admin/orders');

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

    revalidatePath(`/orders/${orderId}`);
    revalidatePath('/orders');
    revalidatePath('/kitchen');
    revalidatePath('/admin/orders');

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

    revalidatePath(`/orders/${orderId}`);
    revalidatePath('/orders');
    revalidatePath('/kitchen');
    revalidatePath('/admin/orders');

    return { success: true, order };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
